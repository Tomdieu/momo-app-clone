from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse

import json

# Create your tests here.

class AccountTestCase(APITestCase):

    def setUp(self) -> None:
        self.user = json.loads(self.create_account().content)

    def create_account(self):
        # token = 'f52ff4c495dff4c05e6f869ef2f3b8250c45c5e2'
        # self.client.credentials(HTTP_AUTHORIZATION=f"token {token}")

        data = {
            "user": {
                "username": "ivantom1",
                "first_name": "navi",
                "last_name": "gg",
                "email": "ivantomdio@gmail.com",
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
        return response

    def fetch_transaction_charges(self):
        authentication_response = json.loads(self.authenticate().content)
        token = authentication_response['token']

        self.client.credentials(HTTP_AUTHORIZATION=f"token {token}")

        response = self.client.get('/api/momo/transaction-charges/')

        print(json.loads(response.content))




    def test_1(self):
        print(self.user)
        self.assertEqual(self.user['data']['user']['username'],"ivantom1")
        # acc = self.create_account()
        # user = json.loads(acc.content)
        # print(user,acc.status_code)
        # authentication_response = json.loads(self.authenticate().content)

    # def test_2(self):
    #     self.fetch_transaction_charges()

