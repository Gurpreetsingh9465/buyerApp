from .. import models
from django.conf import settings
import json

class Cart:
    def __init__(self,request):
        if 'cart' in request.COOKIES:
            c = request.COOKIES['cart']
            json_c = c.replace("'", "\"")
            cart = json.loads(json_c)
            self.cart = cart
        else:
            self.cart = {
                "products": {},
                "total_price":0.00
            }
    def addProduct(self,id,quant):
        quant = int(quant)
        if quant <= 0:
            return False
        try:
            prod = models.Product.objects.get(id=id)
            if prod.is_available:
                if id in self.cart["products"]:
                    self.cart["products"][id]["quantity"]+=quant
                    self.cart["products"][id]["price"]+=(float(quant*prod.discounted_price))
                    self.cart["total_price"]+=(quant*float(prod.discounted_price))
                else:
                    image = ''
                    for im in prod.product_image_set.all()[:1]:
                        image = str(im)
                    self.cart["products"][id] = {
                        "quantity": quant,
                        "price": (quant*float(prod.discounted_price)),
                        "image": '/'+image,
                        "name": prod.name
                    }
                    self.cart["total_price"]+=(quant*float(prod.discounted_price))
                return True
            return False
        except Exception as e:
            if settings.DEBUG:
                print(e)
            return False
    def verifyCart(self):
        total_price = 0.0
        for id,val in self.cart["products"].items():
            try:
                prod = models.Product.objects.get(id=id)
                if not prod.is_available:
                    return False
                if val["quantity"] <= 0:
                    return False
                quant = val["quantity"]
                if float(prod.discounted_price)*quant != val["price"]:
                    return False
                total_price += val["price"]
            except Exception as e:
                if settings.DEBUG:
                    print(e)
                False
        if self.cart["total_price"] != total_price:
            return False
        return True
    def removeProduct(self,id):
        try:
            prod = models.Product.objects.get(id=id)
            if prod.is_available:
                if id in cart["products"]:
                    self.cart["total_price"]-=self.cart["products"][id]["price"]
                    del self.cart["products"][id]
                else:
                    return False
                return True
            return False
        except:
            return False
    def updateCart(self,id,quant):
        quant = int(quant)
        if quant <= 0:
            return False
        try:
            prod = models.Product.objects.get(id=id)
            if prod.is_available:
                if id in cart["products"]:
                    prevPrice = self.cart["products"][id]["price"]
                    self.cart["products"][id]["quantity"] = quant
                    self.cart["products"][id]["price"] = (quant*float(prod.discounted_price))
                    self.cart["total_price"]-=prevPrice
                    self.cart["total_price"]+=(quant*float(prod.discounted_price))
                else:
                    return False
                return True
            return False
        except:
            return False
    def isEmpty(self):
        return self.cart == {"products": {}, "total_price":0.00}
    def emptyCart(self):
        self.cart = {
            "products": {},
            "total_price":0.00
        }
    def placeOrder(self,userId):
        try:
            user = models.User.objects.get(id = userId) # it is not needed
            if self.verifyCart() and not self.isEmpty():
                order = models.Order(
                    status="pending",
                    user_id_id= user.id,
                    total_price=self.cart["total_price"]
                )
                order.save()
                for id,values in self.cart["products"].items():
                    models.Ordered_product(
                        order_id = order,
                        product_id_id=id,
                        quantity = values["quantity"],
                        price = values["price"]
                    ).save()
                return order.order_id
            return None
        except Exception as e:
            if settings.DEBUG:
                print(e)
            return None
