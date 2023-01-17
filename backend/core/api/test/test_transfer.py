import pytest
import random
import json
# from django.test import TestCase

from django.contrib.auth import get_user_model

from mixer.backend.django import mixer

from rest_framework.test import APIClient
from hypothesis.extra.django import TestCase


from faker import Faker

User = get_user_model()
pytestmark = pytest.mark.django_db


@pytest.mark.django_db
class TestMomoTransferMoney(TestCase):

    def setUp(self):
        self.client = APIClient()

        print(self.client)
        faker = Faker()

        # User 1 name
        username1: str = faker.name()
        username1 = username1.replace(' ', '')
        self.username1 = username1
        self.password = '1234'

        # User 2 name
        username2: str = faker.name()
        username2 = username2.replace(' ', '')
        self.username2 = username2
        self.password = '1234'
        self.token = None

        self.user1 = self.create_user1()
        self.token1 = self.user1.json()['token']

        self.user2 = self.create_user2()
        self.token2 = self.user2.json()['token']

    def create_user(self, data):

        res = self.client.post('/api/auth/register/', data)

        return res

    def create_user1(self):

        faker = Faker()

        username = self.username1

        data = {
            "user": {
                "username": username,
                "first_name": faker.name(),
                "last_name": faker.name(),
                "email": faker.email(),
                "password": self.password
            },
            "phone_number": faker.phone_number(),
            "dob": faker.date(),
            "city": faker.address(),
            "lang": ["EN", "FR"][faker.random_int(0, 1)]
        }

        return self.create_user(data)

    def create_user2(self):

        faker = Faker()

        username = self.username2

        data = {
            "user": {
                "username": username,
                "first_name": faker.name(),
                "last_name": faker.name(),
                "email": faker.email(),
                "password": self.password
            },
            "phone_number": faker.phone_number(),
            "dob": faker.date(),
            "city": faker.address(),
            "lang": ["EN", "FR"][faker.random_int(0, 1)]
        }

        return self.create_user(data)

    def get_user_account(self, token):

        self.client.credentials(HTTP_AUTHORIZATION=f"token {token}")

        res = self.client.get('/api/momo/accounts/')

        return res

    def fill_user_account_balance(self, token, account_id, amount):
        self.client.credentials(HTTP_AUTHORIZATION=f"token {token}")

        res = self.client.patch(
            f"/api/momo/accounts/{account_id}/", {'balance': amount})

        return res

    @pytest.mark.order(1)
    def test_update_user1_account_balance(self):

        amount = random.randint(30000, 100000)

        res = self.get_user_account(self.token1)

        account_id = res.json()['data']['id']

        assert res.status_code == 200

        res = self.fill_user_account_balance(self.token1, account_id, amount)

        assert res.status_code == 200

        assert res.json()['balance'] == amount

    @pytest.mark.order(2)
    def test_update_user2_account_balance(self):
        amount = random.randint(100000, 1000000)

        res = self.get_user_account(self.token2)

        account_id = res.json()['data']['id']

        assert res.status_code == 200

        res = self.fill_user_account_balance(self.token2, account_id, amount)
        # assert res.status_code == 200

        assert res.json()['balance'] == amount

    @pytest.mark.order(3)
    def test_transfer_from_user1_to_user2(self):

        user1_account_id = self.get_user_account(
            self.token1).json()['data']['id']
        user2_account_id = self.get_user_account(
            self.token2).json()['data']['id']

        self.fill_user_account_balance(
            self.token1, user1_account_id, random.randint(30000, 100000))
        self.fill_user_account_balance(
            self.token2, user2_account_id, random.randint(100000, 1000000))

        user1_account = self.get_user_account(self.token1).json()['data']

        data = {
            "amount": random.randint(10000, 30000),
            "pin_code": "00000",
            "reciever": user2_account_id
        }

        self.client.credentials(HTTP_AUTHORIZATION=f"token {self.token1}")

        res = self.client.post('/api/momo/transfer-money/', data)

        assert res.status_code == 201
        assert res.json()['data']['status'] == 'SUCCESSFULL'
        assert res.json()[
            'data']['sender']['balance'] < user1_account['balance']

    @pytest.mark.order(4)
    def test_transfer_from_user2_to_user1(self):
        user1_account_id = self.get_user_account(
            self.token1).json()['data']['id']
        user2_account_id = self.get_user_account(
            self.token2).json()['data']['id']

        self.fill_user_account_balance(
            self.token1, user1_account_id, random.randint(30000, 100000))
        self.fill_user_account_balance(
            self.token2, user2_account_id, random.randint(100000, 1000000))

        user2_account = self.get_user_account(self.token2).json()['data']

        data = {
            "amount": random.randint(40000, 100000),
            "pin_code": "00000",
            "reciever": user1_account_id
        }

        self.client.credentials(HTTP_AUTHORIZATION=f"token {self.token2}")

        res = self.client.post('/api/momo/transfer-money/', data)

        assert res.status_code == 201
        assert res.json()['data']['status'] == 'SUCCESSFULL'
        assert res.json()[
            'data']['sender']['balance'] < user2_account['balance']
