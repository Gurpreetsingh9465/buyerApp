from django.urls import path
from . import views
urlpatterns = [
    path('', views.index, name='index'),
    path('products/', views.products, name='homePage'),
    path('add', views.addToCart, name='add-to-cart'),
    path('order', views.placeOrder, name='placeOrder'),
    path('productinfo', views.productInfo, name='product'),
    path('user', views.dashboard, name='index'),
    path('user/auth/google', views.google, name='goog-auth'),
    path('user/signup', views.signup, name='user-signup'),
    path('user/signin', views.signin, name='user-signin'),
    path('user/logout', views.logout, name='user-logout'),
    path('verify', views.verify, name='verify_account'),
]
