
# views.py
"""
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse


# static data for testing purposes
from .products import products

# django rest framework imports ** function based views **
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from rest_framework.response import Response
## status codes
from rest_framework import status
## end of django rest framework imports ##

# updating to use the models
from .models import Product

# importing serializers
from .serializers import ProductSerializer, UserSerializer, UserSerializerWithToken

# for sensative data
from django.contrib.auth.hashers import make_password


# customization for JWT
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from typing import Any, Optional, TypeVar


# used in settings.py
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):    
    def validate(self, attrs: dict[str, Any]) -> dict[str, str]:
        data = super().validate(attrs)

        # data['username'] = self.user.username
        # data['email'] = self.user.email

        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data

@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password= make_password(data['password'])
        )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

# Create your views here.

# we are using funtion based views

@api_view(['GET'])
def getRoutes(request):
    routes = [
        "/api/products/",
        "/api/products/create/",
        "/api/products/upload/",
        "/api/products/<id>/reviews/",
        "/api/products/top/",
        "/api/products/<id>/",
        "/api/products/delete/<id>",
        "/api/products/<update>/<id>",

    ]
    return Response(routes)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True) 
    return Response(serializer.data)
    

#-----------------------------------------------getProducts view --------------
# @api_view(['GET'])
# def getProducts(request):
#     return Response(products)

@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

#------------------------------------------------------------------------------


# @api_view(['GET'])
# def getProduct(request, pk):
#     product = None
#     for i in products:
#         if i['_id'] == pk:
#             product = i
#             break
#     return Response(product)

@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


"""