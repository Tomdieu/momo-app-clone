
def getMethod(request) -> bool:

    return request.method == 'GET'

def postMethod(request) -> bool:

    return request.method == 'POST'

def putMethod(request) -> bool:

    return request.method == 'PUT'

def deleteMethod(request) -> bool:

    return request.method == 'DELETE'

def patchMethod(request) -> bool:

    return request.method == 'PATCH'