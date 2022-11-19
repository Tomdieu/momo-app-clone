# Accounts Api

## Serializers

### Profile Serializer
```
class ProfileSerializer(serializers.ModelSerializer):

    class Meta:

        model = Profile
        fields = ['user','phone_number','dob','city','created_at','updated_at']


```

### User Serializer
```
class UserSerializer(serializers.ModelSerializer):

    profile = ProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['id','username','first_name','last_name','email','password','is_active','is_staff','is_superuser','profile','last_login','date_joined']
        extra_kwargs = {'password':{
            'write_only':True,
            'required':True
        },
        'fist_name':{'required':True},
        'last_name':{'required':True},
        'email':{'required':True}
        }
        
    def create(self,validate_data):
        user = User.objects.create_user(**validate_data)
        user.is_active = True
        user.save()
        Token.objects.create(user=user)
        Account.objects.create(user=user)
        return user
```

## URLS

```
urlpatterns = [
	path('users/',user_list,name='users'),
	path('users',user_create,name="user-create"),
	path('users/<int:id>/',user_detail,name="user-detail"),
	path('profile/',ProfileList.as_view(),name='profile'),
	path('profile/<int:id>/',ProfileDetail.as_view(),name='profile-detail'),
	path('login/',LoginView.as_view(),name='login'),
	path('logout/',LogoutView.as_view(),name='logout')
]
```

## Routes

- GET `api/accounts/users/` returns a list of users
    ### Examples
    ```json
    {
    "success": true,
    "users": [
        {
            "id": 1,
            "username": "ivantom",
            "first_name": "",
            "last_name": "",
            "email": "ivantom@gmail.com",
            "is_active": true,
            "is_staff": true,
            "is_superuser": true,
            "profile": {
                "user": 1,
                "phone_number": "+237666666666",
                "dob": "2021-06-15",
                "city": "Yaounde",
                "created_at": "2022-11-15T22:54:40.207171Z",
                "updated_at": "2022-11-15T22:54:40.207273Z"
            },
            "last_login": "2022-11-16T20:46:26.652780Z",
            "date_joined": "2022-11-07T11:03:52.224549Z"
        },
        {
            "id": 2,
            "username": "navi",
            "first_name": "",
            "last_name": "",
            "email": "test@gmail.com",
            "is_active": true,
            "is_staff": false,
            "is_superuser": false,
            "profile": {
                "user": 2,
                "phone_number": "+237666666666",
                "dob": "2007-03-03",
                "city": "Douala",
                "created_at": "2022-11-16T15:11:27.218382Z",
                "updated_at": "2022-11-16T15:20:02.407288Z"
            },
            "last_login": null,
            "date_joined": "2022-11-16T15:11:24Z"
        },
        {
            "id": 3,
            "username": "navi1",
            "first_name": "",
            "last_name": "",
            "email": "test1@gmail.com",
            "is_active": true,
            "is_staff": false,
            "is_superuser": false,
            "profile": {
                "user": 3,
                "phone_number": "650039773",
                "dob": "2007-03-03",
                "city": "Yaounde",
                "created_at": "2022-11-16T15:23:33.378678Z",
                "updated_at": "2022-11-16T15:23:33.378805Z"
            },
            "last_login": null,
            "date_joined": "2022-11-16T15:23:31Z"
        },
    ]
}
    ```
- POST `api/accounts/users` creates user
    ## Examples
    Post data
    ```json
    {
        "first_name":"trixcorp",
        "last_name":"corp",
        "username":"navicorp3",
        "email":"navicorp@trix.com",
        "dob":"1/1/2000",
        "phone_number":"user's phone number",
        "city":"user's city",
        "password":"1234"
    }
    ```

    Response
    ```json
    {
        "success": true,
        "user": {
            "id": 11,
            "username": "navicorp3",
            "first_name": "trixcorp",
            "last_name": "corp",
            "email": "navicorp@trix.com",
            "is_active": true,
            "is_staff": false,
            "is_superuser": false,
            "profile": {
                "user": 11,
                "phone_number": "+237650039773",
                "dob": "2000-01-01",
                "city": "Ebolowa",
                "created_at": "2022-11-18T01:57:54.350006Z",
                "updated_at": "2022-11-18T01:57:54.350158Z"
            },
            "last_login": null,
            "date_joined": "2022-11-18T01:57:52.186495Z"
        }
    }
    ```