import pytest
import json
from rest_framework.test import APIClient

@pytest.fixture(scope="session")
def api_client():
    return APIClient()