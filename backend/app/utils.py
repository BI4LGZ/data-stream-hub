import uuid


def generate_api_key():
    return str(uuid.uuid4())
