"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from rest_framework.documentation import include_docs_urls
from rest_framework_swagger.views import get_swagger_view

from drf_yasg import openapi
from drf_yasg.views import get_schema_view as swagger_get_schema_view


swagger_schema_view = swagger_get_schema_view(
    openapi.Info(
        title="Momo Api",
        default_version="1.0.0",
        description="Api documentation of App"
    ),
    public=True
)

schema_view = get_swagger_view(title='Momo API')

admin.site.site_header = 'Momo Admin'
admin.site.site_title = "Momo Admin"
# admin.site.site_url = "https:trix-car-backend.vercel.app"
admin.site.index_title = "Momo Administration"
admin.empty_value_display = "**Empty**"


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include('accounts.urls'),name='auth'),
    path('api/',include('core.urls'),name='accounts'),
    path('api-auth/', include('rest_framework.urls'),name="api-auth"),
    path('api-doc/',include_docs_urls(title='Momo API')),
    path('api/swagger/shema/',swagger_schema_view.with_ui('swagger',cache_timeout=0),name='swagger-schema')
]
