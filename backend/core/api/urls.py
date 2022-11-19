from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('accounts',views.AccountViewSet,basename='accounts')
router.register('deposits',views.DespositViewSet,basename='deposits')
router.register('transaction-charges',views.TransactionChargeViewSet,basename='transaction-charge')
router.register('transaction-types',views.TransactionTypeViewSet,basename='transaction-type'),
router.register('transfer-money',views.TransferViewSet,basename='send-money')

urlpatterns = [
	# path('accounts/',views.AccountList.as_view(),name='account'),
    # path('accounts/<int:id>/',views.AccountDetail.as_view(),name="account-detail"),
    path('change-pin/',views.ChangePinCode.as_view(),name='change-pin'),
    # path('transactions/',views.TransactionList.as_view(),name='transaction'),
    # path('transactions/<int:id>/',views.TransactionDetail.as_view(),name='transaction-detail'),
    # path('my-transactions/',views.MyTransactions.as_view(),name='my-transactions')
]

urlpatterns += router.urls