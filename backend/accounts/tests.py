# from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse

from django.contrib.auth import get_user_model

import json

import pytest
from hypothesis import given,strategies as st
from hypothesis.extra.django import TestCase

from mixer.backend.django import mixer

# Create your tests here.


User = get_user_model()

pytest.mark.django_db
class TestUserModel(TestCase):

    def setUp(self) -> None:
        self.user = mixer.blend(User)

    def test_user_account_balance(self):

        self.assertEqual(self.user.account.balance,0)

    def test_user_profile(self):
        self.assertEqual(self.user.profile.user.username,self.user.username)

    def test_update_user_account_balance(self):

        account = self.user.account

        account.balance = 100

        account.save()

        self.assertEqual(account.balance, 100)
    
    @given(st.text(min_size=5,alphabet="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMOPQRSTUVWXYZ0123456789"))
    def test_change_username(self,name):
        
        user = self.user
        user.username = name
        user.save()


        assert user.username == name

        


pytest.mark.django_db
class TestUserApi(APITestCase):

    def setUp(self) -> None:
        self.user = json.loads(self.create_account().content)
        self.token = self.authenticate()

    def create_account(self):
        # self.client.credentials(HTTP_AUTHORIZATION=f"token {token}")

        data = {
            "user": {
                "username": "ivantom1",
                "first_name": "navi",
                "last_name": "gg",
                "email": "admin@gmail.com",
                "password": "1234"
            },
            "phone_number": "+222222",
            "dob": '2000-12-01',
            "city": "",
            "lang": 'EN'
        }

        response = self.client.post('/api/auth/register/',data)

        return response

    def authenticate(self):
        data = {
            'username':'ivantom1',
            'password':'1234'
        }
        response = self.client.post('/api/auth/login/',data)
        return json.loads(response.content)['token']


        #     self.client.credentials(HTTP_AUTHORIZATION=f"token {token}")

    def test_get_user_data(self):
        self.assertEqual(self.user['data']['user']['username'],"ivantom1")
        self.assertEqual(self.user['data']['user']['email'],"admin@gmail.com")
        self.assertEqual(self.user['data']['dob'],"2000-12-01")

        # acc = self.create_account()
        # user = json.loads(acc.content)
        # authentication_response = json.loads(self.authenticate().content)

    def test_user_account_balance(self):

        self.client.credentials(HTTP_AUTHORIZATION=f"token {self.token}")
        res = self.client.get('/api/momo/accounts/')
        data = json.loads(res.content)['data']
        self.assertEqual(data['balance'],0)
        self.assertEqual(data['total_amount_transfer'],0)
        self.assertEqual(data['is_agent'],False)
