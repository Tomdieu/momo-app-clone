
import datetime

from rest_framework.response import Response
from rest_framework import status
from .serializers import (AccountSerializer, AccountListSerializer, TransactionChargeSerializer,
                          TransactionTypeSerializer, TransactionListChargeSerializer,
                          TransferSerializer, TransferCreateSerializer, TransferListSerializer, ChangePinSerializer,
                          WithdrawSerializer, WithdrawCreateSerializer, WithdrawListSerializer, ConvertCurrencySerializer,
                          DepositSerializer, CreateDepositSerializer, DepositListSerializer)
from core.models import Account, TransactionCharge, TransactionType, Transfer, Withdraw, Deposit
from rest_framework.permissions import IsAuthenticated
from rest_framework.mixins import (
    CreateModelMixin, UpdateModelMixin, DestroyModelMixin, ListModelMixin, RetrieveModelMixin)
from rest_framework.viewsets import (GenericViewSet)
from rest_framework.generics import (CreateAPIView, ListAPIView)

from django.db.models import Q, F

from django.conf import settings
from core.api.utils.permisions import IsAgent
from core.api.utils import converCurrency

from accounts.models import Profile


class GetAccountViewSet(GenericViewSet, ListModelMixin):

    serializer_class = AccountListSerializer

    def get_queryset(self):
        print(self.request.query_params)
        account_number = self.request.query_params.get('account_number')
        if account_number:

            return Account.objects.filter(account_number=account_number)

        phone_number = self.request.query_params.get(
            'phone_number', '').replace(' ', '')
        if phone_number:
            return Account.objects.filter(user__profile__phone_number__icontains=phone_number)

        else:

            return Account.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        print(self.get_queryset())
        if self.get_queryset():
            serializer = AccountListSerializer(self.get_queryset())
            queryset = self.get_queryset()
            return Response({'success': True, 'data': AccountListSerializer(queryset, many=True).data[0], 'message': 'Account Find'})
        else:
            return Response({'success': False, 'data': [], 'message': 'Not found'})


class AccountViewSet(RetrieveModelMixin, GenericViewSet, ListModelMixin, UpdateModelMixin):

    def get_serializer_class(self):

        if self.request.method.upper() in ['GET']:

            return AccountListSerializer
        return AccountSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user == request.user:
            return super().partial_update(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):

        pk = kwargs.get('pk')

        queryset = self.get_queryset().filter(user_id=pk)

        if queryset.exists():
            instance = queryset.first()
            serializer = self.get_serializer_class()
            return Response({'success': True, 'data': serializer(instance).data, 'message': 'Your account informations'})
        return Response({'success': False, 'data': [], 'message': 'Not Found'})

    def list(self, request, *args, **kwargs):

        queryset = self.get_queryset()

        if queryset:

            return Response({'success': True, 'data': AccountListSerializer(queryset, many=True).data[0], 'message': 'Your account informations'})
        return Response({'success': True, 'data': {}, 'message': 'No Account Found'})


class TransactionChargeViewSet(RetrieveModelMixin, CreateModelMixin, ListModelMixin, GenericViewSet, UpdateModelMixin, DestroyModelMixin):

    def get_queryset(self):
        return TransactionCharge.objects.select_related('type').all()

    def get_serializer_class(self):
        if self.request.method.upper() in ['GET']:
            return TransactionListChargeSerializer
        return TransactionChargeSerializer

    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer_class()
        return Response({'success': True, 'data': serializer(self.get_queryset(), many=True).data})

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer_class(instance)
        return Response({'success': True, 'data': serializer.data})

    def update(self, request, *args, **kwargs):
        if request.user.is_superuser:
            return super().update(request, *args, **kwargs)
        else:
            return Response({'detail': 'You are not allowed'}, status=status.HTTP_401_UNAUTHORIZED)


class TransactionTypeViewSet(ListModelMixin, CreateModelMixin, GenericViewSet):

    def get_queryset(self):
        return TransactionType.objects.all()

    serializer_class = TransactionTypeSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer_class()
        return Response({'success': True, 'data': serializer(self.get_queryset(), many=True).data})

    def create(self, request, *args, **kwargs):
        if request.user.is_superuser:
            return super().create(request, *args, **kwargs)
        else:
            return Response({'detail': 'You are not allowed'}, status=status.HTTP_401_UNAUTHORIZED)


class TransferMoneyViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):

    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method.upper() in ['GET']:

            return TransferListSerializer

        elif self.request.method.upper() in ['POST']:

            return TransferCreateSerializer

        else:
            return TransferSerializer

    def get_queryset(self):
        return Transfer.objects.filter(Q(sender__user=self.request.user) | Q(reciever__user=self.request.user)).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer_class()
        return Response({'success': True, 'data': serializer(queryset, many=True).data})

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # This line checks if the user account pin code matches the pin code send in the request
        if not request.user.account.check_pincode(serializer.validated_data['pin_code']):
            return Response({'message': 'Incorrect pin code', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)

        # this line simply checks if the sender id matches the reciever id
        if request.user.account.id == serializer.validated_data['reciever'].id:
            return Response({'message': 'You can not send money to your self!', 'success': False}, status=status.HTTP_400_BAD_REQUEST)

        sender = request.user.account

        # this line checks if the amount to transfer is >= to the account balance of the user account sending the money

        if float(request.data['amount']) <= float(sender.balance):
            # this line checks if the sender account id equals to the user transfering the money
            if serializer.validated_data['reciever'] != request.user.account:
                # request.data.pop('pin_code')
                instance = serializer.save()
                return Response(TransferListSerializer(instance).data, status=status.HTTP_201_CREATED)
            else:
                return Response({'message': 'You are not authorized to make this transfer', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'message': 'Your account balance is insufficent to perform the transaction!', 'success': False}, status=status.HTTP_400_BAD_REQUEST)


class DepositViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):
    permision_classes = [IsAuthenticated, IsAgent]

    def get_serializer_class(self):

        if self.request.method.upper() in ['GET']:
            return DepositListSerializer
        elif self.request.method.upper() in ['POST']:
            return CreateDepositSerializer
        else:
            return DepositSerializer

    def get_queryset(self):
        return Deposit.objects.filter(Q(sender__user=self.request.user) | Q(reciever__user=self.request.user)).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer_class()

        return Response({'success': True, 'data': serializer(queryset, many=True).data})

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # This line checks if the user account pin code matches the pin code send in the request
        if not request.user.account.check_pincode(serializer.validated_data['pin_code']):
            return Response({'success': False, 'message': 'Incorrect pin code'}, status=status.HTTP_401_UNAUTHORIZED)

        # this line simply checks if the sender id matches the reciever id
        if request.user.account.id == serializer.validated_data['reciever'].id:
            return Response({'success': False, 'message': 'You can not send money to your self!'}, status=status.HTTP_400_BAD_REQUEST)

        sender = request.user.account

        # this line checks if the amount to transfer is >= to the account balance of the user account sending the money

        if float(request.data['amount']) <= float(sender.balance):
            # this line checks if the sender account id equals to the user transfering the money
            if serializer.validated_data['reciever'] != request.user.account:
                # request.data.pop('pin_code')
                instance = serializer.save()
                return Response({'success': True, 'message': 'Deposit Successfully', 'data': DepositListSerializer(instance).data}, status=status.HTTP_201_CREATED)
            else:
                return Response({'success': False, 'message': 'You are not authorized to make this deposit'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'success': False, 'message': 'Your account balance is insufficent to perform the transaction!'}, status=status.HTTP_400_BAD_REQUEST)


class WithdrawMoneyViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):

    permision_classes = [IsAuthenticated]

    def get_serializer_class(self):

        if self.request.method.upper() in ['GET']:
            return WithdrawListSerializer
        elif self.request.method.upper() in ['POST']:
            return WithdrawCreateSerializer
        else:
            return WithdrawSerializer

    def get_queryset(self):
        # this line gets all the withdrawals of an account of user
        return Withdraw.objects.filter(Q(withdraw_from__user=self.request.user) | Q(agent__user=self.request.user)).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer_class()

        return Response({'success': True, 'data': serializer(queryset, many=True)})

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # this line verify if the user accoun id matches the id to the account send in the request
        if not request.user.account.check_pincode(serializer.validated_data['pin_code']):
            return Response({'success': False, 'message': 'Incorrect pin code'}, status=status.HTTP_401_UNAUTHORIZED)

            # return Response({'success':False,'message':"Your account balance is insufficent to perform the transaction!"},status=status.HTTP_401_UNAUTHORIZED)

        withdraw_from = Account.objects.select_for_update().get(
            user_id=request.data.get('withdraw_from'))

        agent = request.user.account
        if not agent.is_agent:
            return Response({'success': False, 'message': 'Only agent are allow to make withdrawal'}, status=status.HTTP_401_UNAUTHORIZED)

        if serializer.validated_data['withdraw_from'] == agent:
            return Response({'success': False, 'message': 'You can not withdraw money to you self'}, status=status.HTTP_400_BAD_REQUEST)

        if float(request.data['amount']) <= float(withdraw_from.balance):
            instance = serializer.save()
            return Response({'success': True, 'data': WithdrawListSerializer(instance).data, 'message': 'withdraw created please wait for approval'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'success': False, 'message': f'The account balance of {withdraw_from.user} is insufficent to perform the transaction!'}, status=status.HTTP_400_BAD_REQUEST)


class ConfirmWithdraw(ListModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet):

    """
        This api view helps to updated a withdrawal information created withing 2 minutes
        you can either approve or cancel the withdrawal
        Note : you can only approve or cancel withdrawal created after 2 minutes

    """

    permission_classes = (IsAuthenticated,)

    def get_serializer_class(self):

        return WithdrawSerializer

    def get_queryset(self):
        # n represents the amount of minutes for a withdrawal to be accepted or cancel after that it will be rejected
        n = settings.WITHDRAW_MONEY_MINUTES
        dt = datetime.datetime  # dt respresents the datetime.datetime function
        td = datetime.timedelta  # td represents the datetime.timedelta function
        now = dt.now()

        # this query fetches all the withdrawal created within 2 minutes
        return Withdraw.objects.filter(
            Q(withdraw_from__user=self.request.user) &
            Q(state='PENDING') &
            Q(created_at__lte=now) &
            Q(created_at__gte=now-td(minutes=n))
        ).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        if self.get_queryset():
            queryset = self.get_queryset()
            return Response({'success': True, 'data': WithdrawSerializer(queryset, many=True).data, 'message': 'Your Pending withdrawals'})
        else:
            return Response({'success': True, 'data': [], 'message': 'No pending withdrawal'})


class ChangePinCodeViewSet(GenericViewSet, CreateAPIView):
    """
        \n
        This api view helps to change a pin code of a user by 
        sending the old one with the new one
        if the old one corresponds to the actual account pin code
        and the new account pin is valid we update the user account pin code
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = ChangePinSerializer

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        old_pin = serializer.validated_data.get('old_pin')
        new_pin = serializer.validated_data.get('new_pin')
        confirm_pin = serializer.validated_data.get('confirm_pin')

        if not request.user.account.check_pincode(old_pin):
            return Response({'success': False, 'message': 'pin code incorrect!'}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_pin) < 5:
            return Response({'success': False, 'message': 'new pin code must be atleast 5 digits'}, status=status.HTTP_400_BAD_REQUEST)
        if new_pin != confirm_pin:
            return Response({'success': False, 'message': 'pin code don\'t match'}, status=status.HTTP_400_BAD_REQUEST)

        else:
            account = request.user.account
            account.set_pincode(new_pin)

            return Response({'success': True, 'message': 'pin code updated successfully'})


# Getting the latest transactions

class LatestTransactionViewSet(GenericViewSet, ListAPIView):

    # serializer_class = None
    permission_classes = (IsAuthenticated,)

    def list(self, request, *args, **kwargs):

        t = Transfer.objects.filter(sender=self.request.user.account)[:5]

        d = Deposit.objects.filter(sender=self.request.user.account)[:5]

        w = Withdraw.objects.filter(agent=self.request.user.account)[:5]

        return Response({
            "success": True,
            "data": {
                "transfer": TransferListSerializer(t, many=True).data,
                "withdraw": WithdrawListSerializer(w, many=True).data,
                "deposit": DepositListSerializer(d, many=True).data
            }
        })


class ConvertCurrencyViewSet(GenericViewSet, CreateAPIView):
    """
    This APi view helps to convert from one currency to another
    example the POST data can be

        {
            "from_currency":"USD",
            "to_currency":"XAF",
            "amount":5000
        }    
    """

    serializer_class = ConvertCurrencySerializer

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        from_currency = serializer.validated_data['from_currency']
        to_currency = serializer.validated_data['to_currency']
        amount = serializer.validated_data['amount']

        result = converCurrency(from_currency, to_currency, amount)

        return Response({'data': f'{to_currency} {result}'})
