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
    - <p>Or</p>
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