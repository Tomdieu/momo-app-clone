
import datetime

from rest_framework.response import Response
from rest_framework import status
from .serializers import (AccountSerializer, AccountListSerializer, TransactionChargeSerializer,
                          TransactionTypeSerializer, TransactionListChargeSerializer,
                          TransferSerializer, TransferListSerializer, ChangePinSerializer,
                          WithdrawSerializer, WithdrawListSerializer)
from core.models import Account, TransactionCharge, TransactionType, Transfer, Withdraw
from rest_framework.permissions import IsAuthenticated
from rest_framework.mixins import (
    CreateModelMixin, UpdateModelMixin, DestroyModelMixin, ListModelMixin, RetrieveModelMixin)
from rest_framework.viewsets import (GenericViewSet)
from rest_framework.generics import (CreateAPIView)

from django.db.models import Q
from django.db import transaction


from core.api.utils import converCurrency


class AccountViewSet(RetrieveModelMixin, GenericViewSet, ListModelMixin, UpdateModelMixin):

    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):

        queryset = self.get_queryset()
        serializer = AccountListSerializer(queryset, many=True)
        return Response(serializer.data[0])

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user == request.user:
            return super().partial_update(request, *args, **kwargs)


class TransactionChargeViewSet(RetrieveModelMixin, CreateModelMixin, ListModelMixin, GenericViewSet, UpdateModelMixin, DestroyModelMixin):

    def get_queryset(self):
        return TransactionCharge.objects.all()

    serializer_class = TransactionChargeSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):

        queryset = self.get_queryset()
        serializer = TransactionListChargeSerializer(queryset, many=True)

        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        if request.user.is_superuser:
            return super().update(request, *args, **kwargs)
        else:
            return Response({'detail': 'Not allowed'}, status=status.HTTP_401_UNAUTHORIZED)


class TransactionTypeViewSet(ListModelMixin, CreateModelMixin, GenericViewSet):

    def get_queryset(self):
        return TransactionType.objects.all()

    serializer_class = TransactionTypeSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if request.user.is_superuser:
            return super().create(request, *args, **kwargs)
        else:
            return Response({'detail': 'Not allowed'}, status=status.HTTP_401_UNAUTHORIZED)


class TransferMoneyViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):

    serializer_class = TransferSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transfer.objects.filter(Q(sender__user=self.request.user) | Q(reciever__user=self.request.user)).order_by('-created_at')

    def list(self, request, *args, **kwargs):

        queryset = self.get_queryset()
        serializer = TransferListSerializer(queryset, many=True)

        return Response(serializer.data)

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if request.data['sender'] == request.data['reciever']:
            return Response({'detail': 'You can not send money to your self!'}, status=status.HTTP_400_BAD_REQUEST)
        sender = Account.objects.select_for_update().get(
            user_id=request.data.get('sender'))
        if float(request.data['amount']) >= float(sender.balance):

            instance = serializer.save()
            return Response(TransferListSerializer(instance).data, status=status.HTTP_201_CREATED)

        else:
            return Response({'detail': 'Your account balance is insufficent to perform the transaction!'}, status=status.HTTP_400_BAD_REQUEST)


class WithdrawMoneyViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):
    serializer_class = WithdrawSerializer
    permision_classes = [IsAuthenticated]

    def get_queryset(self):
        return Withdraw.objects.filter(Q(withdraw_from__user=self.request.user) | Q(agent__user=self.request.user)).order_by('-created_at')

    def list(self, request, *args, **kwargs):

        queryset = self.get_queryset()
        serializer = WithdrawListSerializer(queryset, many=True)

        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        withdraw_from = Account.objects.select_for_update().get(
            user_id=request.data.get('withdraw_from'))
        if not withdraw_from.is_agent:
            return Response({'detail': 'Only agent are allow to make withdrawal'}, status=status.HTTP_401_UNAUTHORIZED)

        if request.data['withdraw_from'] == request.data['agent']:
            return Response({'detail': 'You can not withdraw money to you self'}, status=status.HTTP_400_BAD_REQUEST)

        if float(request.data['amount']) >= float(withdraw_from.balance):
            instance = serializer.save()
            return Response(WithdrawListSerializer(instance).data, status=status.HTTP_201_CREATED)
        else:
            return Response({'detail': f'The account balance of {withdraw_from.user} is insufficent to perform the transaction!'}, status=status.HTTP_400_BAD_REQUEST)


class ConfirmWithdraw(GenericViewSet,ListModelMixin,UpdateModelMixin):

    def get_serializer_class(self):
        
        return WithdrawSerializer

    def get_queryset(self):
        n = 2  # n represents the amount of minutes for a withdrawal to be accepted or cancel after that it will be rejected
        dt = datetime.datetime  # dt respresents the datetime.datetime function
        td = datetime.timedelta  # td represents the datetime.timedelta function
        now = dt.now()
        return Withdraw.objects.filter(
            Q(withdraw_from__user=self.request.user) &
            Q(state='PENDING') &
            Q(created_at__lte=now) &
            Q(created_at__gte=now-td(minutes=2))
        ).order_by('-created_at')



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

        old_pin = request.data.get('old_pin')
        new_pin = request.data.get('new_pin')
        confirm_pin = request.data.get('confirm_pin')

        if not request.user.account.check_pincode(old_pin):
            return Response({'detail': 'pin code incorrect!'}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_pin) < 5:
            return Response({'detail': 'new pin code must be atleast 5 digits'}, status=status.HTTP_400_BAD_REQUEST)
        if new_pin != confirm_pin:
            return Response({'detail': 'pin code don\'t match'}, status=status.HTTP_400_BAD_REQUEST)

        else:
            account = request.user.account
            account.set_pincode(new_pin)

            return Response({'detail': 'pin code updated successfully'})
