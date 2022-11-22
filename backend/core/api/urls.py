from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('accounts',views.AccountViewSet,basename='accounts')
router.register('deposits',views.DespositViewSet,basename='deposits')
router.register('transaction-charges',views.TransactionChargeViewSet,basename='transaction-charge')
router.register('transaction-types',views.TransactionTypeViewSet,basename='transaction-type'),
router.register('transfer-money',views.TransferViewSet,basename='send-money')
router.register('change-pin-code',views.ChangePinCodeViewSet,basename='change-pin-code')

urlpatterns = [
]

urlpatterns += router.urls