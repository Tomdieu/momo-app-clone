from django.urls import path,include
# from .models import TransactionType,TransactionCharge

# urlpatterns = [
# 	path('momo/',include('core.api.urls')),
# ]

# This part down here is use to create the different transactiontype 

# T = TransactionType().TRANSACTION_TYPE

# for i in T:
# 	e = TransactionType.objects.filter(name=i[1])
# 	if not e.exists():
# 		t = TransactionType.objects.create(name=i[0],description=f"Descritption of {i[1]}")
# 		TransactionCharge.objects.create(type=t)