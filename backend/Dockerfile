# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3.8-alpine


EXPOSE 8000

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1


# RUN apk update && apk add gcc python3-dev musl-dev python3-virtualenv

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

WORKDIR /django_backend
COPY . .

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN python -m pip install --upgrade pip

# Install pip requirements
# COPY requirements.txt requirements.txt
RUN python -m pip install "setuptools<58"
RUN python -m pip install -r requirements.txt   
