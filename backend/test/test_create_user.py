import pytest
from django.contrib.auth.models import User
import json
import asyncio
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_account_creation(api_client:APIClient):

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
        "city": "Garoua",
        "lang": 'EN'
    }

    response = api_client.post('/api/auth/register/',data)


    assert response.status_code == 201
    assert json.loads(response.content)['data']['user']['username'] == 'ivantom1'
    print("User created : ")