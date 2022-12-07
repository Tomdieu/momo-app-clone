# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.8-alpine

# EXPOSE 8000

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1


RUN apk update && apk add gcc python3-dev musl-dev python3-virtualenv

# ENV VIRTUAL_ENV=/opt/venv

#RUN python -m virtualenv --python=/usr/bin/python3 $VIRTUAL_ENV
#ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

WORKDIR /django_backend
ADD . /django_backend

RUN python -m pip install --upgrade pip

# Install pip requirements
COPY requirements.txt requirements.txt
RUN python -m pip install -r requirements.txt   



# Creates a non-root user with an explicit UID and adds permission to access the /django_backend folder
# For more info, please refer to https://aka.ms/vscode-docker-python-configure-containers
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /django_backend
USER appuser

# During debugging, this entry point will be overridden. For more information, please refer to https://aka.ms/vscode-docker-python-debug

CMD ["python","manage.py","runserver","0.0.0.0:8000"]

# CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi"]
