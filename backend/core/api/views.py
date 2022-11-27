
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import (AccountSerializer,AccountListSerializer, TransactionChargeSerializer,
                          TransactionTypeSerializer, TransferSerializer, TransferListSerializer, ChangePinSerializer)
from core.models import Account, TransactionCharge, TransactionType, Transfer
from rest_framework.permissions import IsAuthenticated
from rest_framework.mixins import (
    CreateModelMixin, UpdateModelMixin, DestroyModelMixin, ListModelMixin, RetrieveModelMixin)
from rest_framework.viewsets import (GenericViewSet)
from rest_framework.generics import (CreateAPIView)

from django.db.models import Q
from django.db import transaction


from core.api.utils import converCurrency


class UserAccountViewSet(GenericViewSet,ListModelMixin):

    serializer_class = AccountListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)

    def list(self,request,*args,**kwargs):

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset,many=True)
        return Response(serializer.data[0])

    

class AccountViewSet(RetrieveModelMixin, GenericViewSet, ListModelMixin, UpdateModelMixin):

    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user == request.user:
            return super().partial_update(request, *args, **kwargs)


class TransactionChargeViewSet(RetrieveModelMixin, CreateModelMixin, ListModelMixin, GenericViewSet, UpdateModelMixin, DestroyModelMixin):

    def get_queryset(self):
        return TransactionCharge.objects.all()

    serializer_class = TransactionChargeSerializer
    permission_classes = [IsAuthenticated]

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

class TransferMoneyViewSet(CreateModelMixin, GenericViewSet):

    serializer_class = TransferSerializer
    permission_classes = [IsAuthenticated]

    
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

class MyTransactionTransferViewSet(ListModelMixin,GenericViewSet):

    serializer_class = TransferListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transfer.objects.filter(Q(sender__user=self.request.user) | Q(reciever__user=self.request.user)).order_by('-created_at')



class ChangePinCodeViewSet(GenericViewSet, CreateAPIView):
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
