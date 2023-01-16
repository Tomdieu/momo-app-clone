# momo-app-clone


[![wakatime](https://wakatime.com/badge/user/7a03d500-b310-4adb-9229-1bb6044d565d/project/255879e0-ef36-4ec4-bb05-2bf27d669b7f.svg)](https://wakatime.com/badge/user/7a03d500-b310-4adb-9229-1bb6044d565d/project/255879e0-ef36-4ec4-bb05-2bf27d669b7f)

[![Docker Image CI](https://github.com/Tomdieu/momo-app-clone/actions/workflows/docker-image.yml/badge.svg)](https://github.com/Tomdieu/momo-app-clone/actions/workflows/docker-image.yml)

[![Django CI](https://github.com/Tomdieu/momo-app-clone/actions/workflows/django.yml/badge.svg)](https://github.com/Tomdieu/momo-app-clone/actions/workflows/django.yml)

## This is a small project on a money transaction app made in python using Django and Django Rest Framework to build api

## Technology used
- **Django**
- **Django Rest Framework(DRF)** for the `api`
- **React Native** (for the android frontend)
- **Rest Framework Swagger** to generate the api documentation


## Django Backend

### How to run
- Clone the repository with
    ```
    git clone https://github.com/Tomdieu/momo-app-clone.git
    ```
- Navigate to the backend directory
    ```
    cd momo-app-clone/backend
    ```
- Create a virtual environment
    On Linux and macos
    ```
    python3 -m venv env
    ```
    On Windows
    ```
    python -m venv env
    ```
    Or with virtualenv
    ```
    virtualenv env
    ```
- Activate the virtual environment
    On linux and macos
    ```
    source ./env/bin/activate
    ```

    On Windows
    ```
    ./env/Scripts/activate
    ```
- Install the requirements
    ```
    pip -r install requirements.txt
    ```
- Create a superuser
    ```
    python manage.py createsuperuser
    ```
- Run the server with 
    ```
    python manage.py runserver
    ```
