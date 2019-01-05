from django.contrib import admin
from .models import Product,Product_image,Product_feature,Order,Ordered_product,User



# Register your models here.
admin.site.register(Product)
admin.site.register(Product_image)
admin.site.register( Product_feature)
admin.site.register(Order)
admin.site.register(Ordered_product)
admin.site.register(User)
