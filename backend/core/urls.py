from django.urls import path,include

urlpatterns = [
	path('momo/',include('core.api.urls')),
]