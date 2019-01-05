import jwt,os
from django.conf import settings

def is_login(function):
    def wrapper(request, *args, **kw):
        try:
            token = request.COOKIES['jwt']
            if token:
                payload = jwt.decode(token, settings.SECRET_KEY)
                userid = payload['id']
                return function(request, userid, *args, **kw)
        except:
            return function(request, None, *args, **kw)
    return wrapper
