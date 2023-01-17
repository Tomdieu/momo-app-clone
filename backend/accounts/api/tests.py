import pytest

from django.test import TestCase

from accounts.models import Profile
from django.contrib.auth import get_user_model

from mixer.backend.django import mixer

from rest_framework.test import APIClient

from faker import Faker

User = get_user_model()
pytestmark = pytest.mark.django_db



class TestUserAPIViews(TestCase):

    def setUp(self):
        self.client = APIClient()
        faker = Faker()
        username:str = faker.name()
        username = username.replace(' ','')
        self.username = username
        self.password = '1234'
        self.token = None

        self.res = self.create_user()

    def create_user(self):

        faker = Faker()

        username = self.username

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
            "city":faker.address(),
            "lang": ["EN","FR"][faker.random_int(0,1)]
        }

        res = self.client.post('/api/auth/register/',data)

        return res

    @pytest.mark.order(1)
    def test_user_creation(self):
        
        res = self.res

        assert res.status_code == 201
        assert res.json()["data"]["user"]["username"] == self.username
        

        user:User = User.objects.filter(username=self.username)

        assert user[0].check_password("1234") == True

        assert user.exists() == True
    
    @pytest.mark.order(2)
    def test_user_login(self):
        print(User.objects.all())

        data = {
            "username": self.username,
            "password": self.password
        }
        res = self.client.post('/api/auth/login/',data)

        self.token = res.json()["token"]

        assert res.status_code == 200
        assert self.token != None

    
    @pytest.mark.order(3)
    @pytest.mark.xfail
    def test_user_cannot_login(self):
        faker = Faker()
        data = {
            "username": faker.name().replace(" ",''),
            "password": faker.name().replace(" ",''),
        }
        res = self.client.post('/api/auth/login/',data)

        assert res.status_code == 200

    @pytest.mark.order(4)
    @pytest.mark.xfail
    def test_user_logout(self):
        
        self.client.credentials(HTTP_AUTHORIZATION=f"token {self.token}")

        res = self.client.post('/api/auth/logout/')

        assert res.status_code == 200

    