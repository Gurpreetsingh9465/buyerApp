from django.db import models
import uuid
from django.conf import settings
import os
import bcrypt
from django.utils import timezone


class User(models.Model):
    id = models.CharField(max_length=100, blank=True, unique=True, default=uuid.uuid4, primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=70, unique=True)
    profilePic = models.CharField(max_length=200,default = os.environ.get('API_HOST')+'/build/defaultPic.png')
    password = models.CharField(max_length=200, null=True)
    isVerified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name
    def encrypt(self,password):
        password = password.encode("utf-8")
        return bcrypt.hashpw(password, bcrypt.gensalt())
    def compare(self,password):
        password = password.encode('UTF-8')
        try:
            return bcrypt.checkpw(password, self.password.encode("utf-8"))
        except:
            return False

class Product(models.Model):
    id = models.CharField(max_length=100, blank=True, unique=True, default=uuid.uuid4, primary_key=True)
    name = models.CharField(max_length=100,null=False)
    is_available = models.BooleanField(default=True)
    original_price = models.DecimalField(max_digits=10,decimal_places=2,null=True)
    discounted_price = models.DecimalField(max_digits=10,decimal_places=2,null=True)
    description = models.CharField(max_length=255,default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name

#one to Many relation
class Product_image(models.Model):
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE,  null=False)
    image_url = models.ImageField(upload_to = 'build/uploads/', default = '')
    class Meta:
        unique_together = (("product_id", "image_url"),)
    def __str__(self):
        return str(self.image_url)

#one to many relation
class Product_feature(models.Model):
    product_id = models.ForeignKey(Product, on_delete=models.CASCADE, null=False)
    feature = models.CharField(max_length=200)
    class Meta:
        unique_together = (("product_id", "feature"),)
    def __str__(self):
        return str(self.product_id)

# Order = cart info one to many

class Order(models.Model):
    order_id = models.CharField(max_length=100, blank=True, unique=True, default=uuid.uuid4, primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=False)
    status = models.CharField(max_length=10,choices=(("pending","Pending"),("delivered","Delivered"),("return","Return")),null=False)
    total_price = models.DecimalField(max_digits=20,decimal_places=2,null=False,default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        unique_together = (("order_id", "user_id"),)
    def __str__(self):
        return self.order_id

class Ordered_product(models.Model):
    order_id = models.ForeignKey(Order, on_delete=models.DO_NOTHING, null=False)
    product_id = models.ForeignKey(Product, on_delete=models.DO_NOTHING, null=False)
    price = models.DecimalField(max_digits=10,decimal_places=2,null=False,default=0.00)
    quantity = models.IntegerField(default=1,null=False)
    class Meta:
        unique_together = (("product_id", "order_id"),)
    def __str__(self):
        return "orderid = "+str(self.order_id)+" productid = "+str(self.product_id)
