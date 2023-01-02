from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('accounts', views.AccountViewSet, basename='accounts')
router.register('transaction-charges',
                views.TransactionChargeViewSet, basename='transaction-charge')
router.register('transaction-types', views.TransactionTypeViewSet,
                basename='transaction-type')
router.register('transfer-money', views.TransferMoneyViewSet,
                basename='send-money')
router.register('withdraw-money', views.WithdrawMoneyViewSet,
                basename="withdraw-money")

router.register('deposit-money', views.DepositViewSet,
                basename='deposit-money')

router.register('change-pin-code', views.ChangePinCodeViewSet,
                basename='change-pin-code')
router.register('confirm-withdrawal', views.ConfirmWithdraw,
                basename='confirm withdrawal')

router.register('convert-currency', views.ConvertCurrencyViewSet,
                basename='convert-currency')

router.register('get-account',views.GetAccountViewSet,basename='search-account')

router.register('lastest-transaction',views.LatestTransactionViewSet,basename="lastest-transactions")

router.register('get-transaction-charges',views.GetChargesViewSet,basename='get-a-transaction-charge')

router.register('verify-pin-code',views.ValidatePinCodeViewSet,basename="verify-pin-code")

urlpatterns = [
    path('', include(router.urls)),
]
