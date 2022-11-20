from django.urls import path,include

urlpatterns = [
	path('accounts/',include('core.api.urls')),
]