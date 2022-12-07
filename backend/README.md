# TrixWallet Backend

## How to run

 - Navigate to the backend root directory
`cd path-to-backend`

 - create a virtual environment with
    ## 
    - 
        ```
        python -m venv env
        ```
        Or
    - 
        ```
        virtualenv env
        ```
 - activate the virtaul environment
    ## 
    - Windows
        ```
        ./env/Script/activate
        ```
    - Linux or Macos using powershell on windows
        ```
        source ./env/bin/activate
        ```
 - install the dependencies
    ```
    pip install -r requirements.txt
    ```

 - Run the server
    ```
    python manage.py runserver
    ```

# How To Test
- Open a terminal and navigate to the project root directory
- Run the command
    ```
    python manage.py test
    ```


## Commands

 - Make sure you have install `redis`
 - after installing all the dependencies
 - Run Django Server with 
    ```
    python manage.py runserver
    ```
 - Run Redis
    ```
    redis-server
    ```
 - Run Celery
    ```
    celery -A backend worker -l INFO
    ```
 - Run Celery beat
    ```
    celery -A backend beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
    ```
