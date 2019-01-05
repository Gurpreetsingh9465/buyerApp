from django.contrib import admin
from django.urls import include, path
from django.conf.urls.static import static
from django.conf.urls import url
from django.conf import settings
from .views import index, start


urlpatterns = [
    path('api/',include('api.urls')),
    path('admin/', admin.site.urls),
    path('', start),
    url(r'^client/*',index)
] + static(settings.DIST_URL, document_root=settings.DIST_ROOT)
