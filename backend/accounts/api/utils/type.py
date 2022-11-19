
def getMethod(request):

    return request.method == 'GET'

def postMethod(request):

    return request.method == 'POST'

def putMethod(request):

    return request.method == 'PUT'

def deleteMethod(request):

    return request.method == 'DELETE'

def patchMethod(request):

    return request.method == 'PATCH'