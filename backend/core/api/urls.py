from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('accounts',views.AccountViewSet,basename='accounts')
router.register('myaccount',views.UserAccountViewSet,basename="my-account")
router.register('transaction-charges',views.TransactionChargeViewSet,basename='transaction-charge')
router.register('transaction-types',views.TransactionTypeViewSet,basename='transaction-type'),
router.register('transfer-money',views.TransferMoneyViewSet,basename='send-money')
router.register('transfers',views.MyTransactionTransferViewSet,basename='Money TransferList')
router.register('change-pin-code',views.ChangePinCodeViewSet,basename='change-pin-code')

urlpatterns = [
]

urlpatterns += router.urls