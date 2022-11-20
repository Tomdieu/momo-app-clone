
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import (AccountSerializer,DepositSerializer,TransactionChargeSerializer,TransactionTypeSerializer,TransferSerializer)
from core.models import Account,Deposit,TransactionCharge,TransactionType,Transfer
from rest_framework.permissions import IsAuthenticated
from rest_framework.mixins import (CreateModelMixin,UpdateModelMixin,DestroyModelMixin,ListModelMixin,RetrieveModelMixin)
from rest_framework.viewsets import (GenericViewSet)
from django.db.models import Q
from django.db import transaction


from core.api.utils import converCurrency

class AccountViewSet(RetrieveModelMixin,GenericViewSet,ListModelMixin,UpdateModelMixin):

    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)
    
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user == request.user:
            return super().partial_update(request, *args, **kwargs)

class DespositViewSet(RetrieveModelMixin,CreateModelMixin,ListModelMixin,GenericViewSet):

    
    serializer_class = DepositSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Deposit.objects.filter(Q(deposit_from__user=self.request.user) | Q(deposit_to__user=self.request.user))

class TransactionChargeViewSet(RetrieveModelMixin,CreateModelMixin,ListModelMixin,GenericViewSet,UpdateModelMixin,DestroyModelMixin):

    def get_queryset(self):
        return TransactionCharge.objects.all()

    serializer_class = TransactionChargeSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        if request.user.is_superuser:
            return super().update(request, *args, **kwargs)
        else:
            return Response({'detail':'Not allowed'},status=status.HTTP_401_UNAUTHORIZED)

class TransactionTypeViewSet(ListModelMixin,CreateModelMixin,GenericViewSet):

    def get_queryset(self):
        return TransactionType.objects.all()

    serializer_class = TransactionTypeSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if request.user.is_superuser:
            return super().create(request, *args, **kwargs)
        else:
            return Response({'detail':'Not allowed'},status=status.HTTP_401_UNAUTHORIZED)

class TransferViewSet(ListModelMixin,CreateModelMixin,GenericViewSet):

    serializer_class = TransferSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transfer.objects.filter(Q(sender__user=self.request.user)|Q(reciever__user=self.request.user)).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        
        data = {}

        if(request.data.get('amount')) is None:
            return Response({'detail':'Amount needed'})
        else:
            data['amount'] = request.data.get('amount')

        if request.data.get('sender') is None:
            return Response({'detail':'sender id is require!'},status=status.HTTP_400_BAD_REQUEST)
        else:
            data['sender'] = Account.objects.select_for_update().get(user=request.user)
        
        if request.data.get('reciever') is None:
            return Response({'detail':'reciever id is require!'},status=status.HTTP_400_BAD_REQUEST)
        else:
            # data['reciever'] = get_object_or_404(Account,id=request.data.get('reciever'))
            data['reciever'] = Account.objects.select_for_update().get(user_id=request.data.get('reciever'))
        
        data['charge'] = TransactionCharge.objects.filter(type_name__iequals='transfer')

        if data['sender'] == data['reciever']:
            return Response({'detail':'You can not send money to your self!'},status=status.HTTP_400)

        if data['amount'] >= data['sender'].balance:
            from_currency = data['sender'].currency
            to_currency = data['reciever'].currency

            amount_to_increase = converCurrency(from_currency,to_currency,data['amount'])

            with transaction.atomic():
                data['sender'].amount -= float(data['amount'])
                data['sender'].save()
                
                data['sender'].amount -= float(amount_to_increase)
                data['sender'].save()

                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                instance = serializer.save()
                return Response(TransferSerializer(instance).data,status=status.HTTP_201_CREATED)

        else:
            return Response({'detail':'Your account balance is insufficent!'},status=status.HTTP_400_BAD_REQUEST)

# class AccountList(APIView):
#     permission_classes = (IsAuthenticated,)
#     serializer_class = AccountSerializer


#     def get(self,request,*args,**kwargs):

#         accounts = Account.objects.all()

#         serializer = AccountSerializer(accounts,many=True)

#         return Response({'accounts':serializer.data},status=status.HTTP_200_OK)

 
# class AccountDetail(APIView):

#     permission_classes = (IsAuthenticated,)
#     serializer_class = AccountSerializer

#     def get_object(self,id):

#         return get_object_or_404(Account,pk=id)

#     def get(self,request,id,*args,**kwargs):
#         account = self.get_object(id)
#         serializer = AccountSerializer(account)
#         return Response({'account':serializer.data},status=status.HTTP_200_OK)

#     def put(self,request,id,*args,**kwargs):

#         account = self.get_object(id)

#         serializer = AccountSerializer(account,data=request.data)

#         if serializer.is_valid(raise_exception=True):

#             serializer.save()

#             return Response({'account':serializer.data},status=status.HTTP_201_CREATED)

class ChangePinCode(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self,request,*args,**kwargs):
        account = Account.objects.get(user=request.user)
        serializer = AccountSerializer(account,data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'account':serializer.data},status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def sendMoney(request):        

#     if request.method == 'POST':
#         from_account = Account.objects.select_for_update().get(user=request.user)
#         to_account = Account.objects.select_for_update().get(user_id=request.data.get('to_account_id'))
        
#         ammount = request.data.get('ammount')

#         if to_account is None:
#             return Response({'detail':'The account you are willing to send money doesn\'t exists!'},status=status.HTTP_400_BAD_REQUEST)
        
#         if ammount is None:
#             return Response({'detail':'The ammount must be provided!'},status=status.HTTP_400_BAD_REQUEST)

#         if int(ammount > from_account.ammount):
#             return Response({'detail':'Your account balance is insufficient!'},status=status.HTTP_400_BAD_REQUEST)

#         with transaction.atomic():
#             from_account.ammount -= int(ammount)
#             from_account.save()
            
#             to_account.ammount += int(ammount)
#             to_account.save()

#             t = Transaction.objects.create(
#                 transaction_type=Transaction.TRANSACTION_TYPE[0][1],
#                 from_account=from_account,
#                 to_account=to_account,
#                 ammount=ammount
#             )

#             serializer = TransactionSerializer(t)

#             return Response({'transaction':serializer.data},status=status.HTTP_201_CREATED)

#     pass
