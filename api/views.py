from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_protect,ensure_csrf_cookie
from django.conf import settings
from django.core import serializers
import jwt, json, re
import os
from .utils.sendMail import sendMail
from .utils.cart import Cart
from .utils.isLogin import is_login
from . import models


@ensure_csrf_cookie
def addToCart(request):
    if request.method == 'POST':
        try:
            pid = request.POST.get('pid')
            quant = request.POST.get('quant')
            if not pid or not quant:
                return JsonResponse({"message":"Unauthorize Access"},status=401)
            cart = Cart(request)
            if not cart.verifyCart():
                return JsonResponse({"message":"Unauthorize Access"},status=401)
            if not cart.addProduct(pid,quant):
                return JsonResponse({"message":"Unauthorize Access"},status=401)
            if settings.DEBUG:
                print(cart.cart)
            response = JsonResponse({},status=200)
            response.set_cookie('cart',cart.cart)
            return response
        except Exception as e:
            if settings.DEBUG:
                print(e)
            return JsonResponse({"message":"Unauthorize Access"},status=401)

@ensure_csrf_cookie
@is_login
def placeOrder(request,userid):
    if(request.method == 'GET'):
        return JsonResponse({"messages":"csrf"})
    if request.method == 'POST':
        if userid == None:
            return JsonResponse(status=401,data={"messages":{"info": "you need to sign in"}})
        cart = Cart(request)
        if not cart.verifyCart():
            return JsonResponse(status=401,data={"messages":{"info": "Unauthorized Access"}})
        if cart.isEmpty():
            return JsonResponse(status=200,data={"messages":{"info": "Cart Cannot Be Empty"}})
        order_id = cart.placeOrder(userid)
        if order_id == None:
            return JsonResponse(status=401,data={"messages":{"danger": "Something Went Wrong"}})
        response = JsonResponse(status=200,data={"messages":{"success": "order Placed id = "+str(order_id)}})
        cart.emptyCart()
        response.set_cookie('cart',cart.cart)
        return response


def products(request):
    products = {}
    for e in models.Product.objects.all()[:9]:
        image = ''
        features = []
        try:
            for im in e.product_image_set.all()[:1]:
                image = im
            for feature in e.product_feature_set.all()[:4]:
                features.append(feature.feature)
        except:
            pass
        products[e.id] = {
            "name": e.name,
            "description": e.description,
            "discounted_price":str(e.discounted_price),
            "original_price": str(e.original_price),
            "is_available": e.is_available,
            "image": "/"+str(image),
            "features":features
        }
    if settings.DEBUG:
        print(products)
    return JsonResponse({"products":products},status=200)

def productInfo(request):
    pid = ''
    try:
        pid = request.GET.get('pid')
        e = models.Product.objects.get(id = pid)
        product = {}
        images = []
        features = []
        try:
            for im in e.product_image_set.all():
                images.append("/"+str(im))
            for feature in e.product_feature_set.all():
                features.append(feature.feature)
        except:
            pass
        product[e.id] = {
            "name": e.name,
            "description": e.description,
            "discounted_price":str(e.discounted_price),
            "original_price": str(e.original_price),
            "images": images,
            "is_available": e.is_available,
            "features":features
        }
        if settings.DEBUG:
            print(product)
        return JsonResponse({"products":product},status=200)
    except:
        return JsonResponse(status=401,data={"messages":{"info": "something Went Wrong"}})


@is_login
def index(request, userid):
    if userid == None:
        return JsonResponse(status=200,data={"isLogin": False,"user": None})
    user = models.User.objects.values('name').filter(id=userid)[0]
    return JsonResponse(status=200,data={"isLogin": True,"user": user})

@is_login
def dashboard(request,userid):
    if userid == None:
        return JsonResponse(status=400,data={"messages":{"danger": "No Tokken Provided"}})
    user = models.User.objects.values('name','email','profilePic').filter(id=userid)[0]
    return JsonResponse({"user":user},status=200)

@is_login
def logout(request,userid):
    if userid == None:
        return HttpResponseRedirect(os.environ.get('API_HOST')+'/client')
    response = HttpResponseRedirect(os.environ.get('API_HOST')+'/client')
    response.delete_cookie('jwt')
    return response


def google(request):
    return JsonResponse({"message":"google signin"})

@ensure_csrf_cookie
def signin(request):
    if(request.method == 'GET'):
        return JsonResponse({"messages":"csrf"})
    if(request.method == 'POST'):
        email = request.POST.get('email')
        password = request.POST.get('password')
        if not email or not password:
            return JsonResponse(status=400,data={"messages":{"danger": "Invalid Credentials"}})
        try:
            user = models.User.objects.get(email=email)
            if user.isVerified:
                if user.password != None:
                    if user.compare(password):
                        response = JsonResponse(status=200,data={"messages":{"success": "Signing You.."}})
                        payload = {
                            'id': str(user.id)
                        }
                        value = jwt.encode(payload, settings.SECRET_KEY).decode("utf-8")
                        response.set_cookie('jwt', value)
                        return response
                    else:
                        return JsonResponse(status=401,data={"messages":{"info": "Incorrect Password"}})
                else:
                    return JsonResponse(status=401,data={"messages":{"info": "You Already had an Account with Google+"}})
            return JsonResponse(status=401,data={"messages":{"info": "Your Email is Not Verified"}})
        except models.User.DoesNotExist:
            return JsonResponse(status=404,data={"messages":{"danger": "Not Found"}})
        except:
            return JsonResponse(status=401,data={"messages":{"danger": "Something Went Wrong"}})

def verify(request):
    token = request.GET.get('token')
    if token:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY)
            userid = payload['id']
            user = models.User.objects.get(id = userid)
            user.isVerified = True
            user.save()
        except jwt.ExpiredSignature or jwt.DecodeError or jwt.InvalidTokenError:
            return HttpResponse({'Error': "Token is invalid"}, status="403")
        except models.User.DoesNotExist:
            return HttpResponse({'Error': "Internal server error"}, status="500")
        return HttpResponseRedirect(os.environ.get('API_HOST')+'/client/user/signin')
    else:
        return JsonResponse(status=401,data={"messages":{"danger": "Token Not Provided"}})

@ensure_csrf_cookie
def signup(request):
    if(request.method == 'GET'):
        return JsonResponse({"messages":"csrf"})
    if(request.method == 'POST'):
        email = request.POST.get('email')
        name = request.POST.get('name')
        password = request.POST.get('password')
        if not email or not name or not password:
            return JsonResponse(status=400,data={"messages":{"danger": "Invalid Credentials"}})
        try:
            user = models.User.objects.get(email=email)
            return JsonResponse(status=401,data={"messages":{"danger": "Email Already In Use"}})
        except models.User.DoesNotExist:
            try:
                if not re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$', password):
                    return JsonResponse(status=401,data={"messages":{"info": "Password Must Contain Minimum eight characters, at least one uppercase letter, one lowercase letter and one number"}})
                hash = models.User.encrypt(models.User,password)
                hash = hash.decode('utf-8')
                newUser = models.User(email=email,password=hash,name=name)
                newUser.save()
                payload = {
                    'id': str(newUser.id)
                }
                url = os.environ.get('API_HOST')+'/api/verify?token='+jwt.encode(payload, settings.SECRET_KEY).decode("utf-8")
                try:
                    sendMail(email,'Verify Your Email','verifyEmail.html',{'link':url})
                except:
                    return JsonResponse(status=401,data={"messages":{"danger": "Something Went Wrong"}})
                return JsonResponse(status=200,data={"messages":{"success": "Please check Your Email"}})
            except:
                return JsonResponse(status=404,data={"messages":{"danger": "Something Went Wrong"}})
