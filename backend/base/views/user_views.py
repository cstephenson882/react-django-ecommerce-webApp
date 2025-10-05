# views.py

from django.shortcuts import render


# static data for testing purposes
from ..products import products

# django rest framework imports ** function based views **
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from rest_framework.response import Response
## status codes
from rest_framework import status
## end of django rest framework imports ##



# importing serializers
from base.serializers import ProductSerializer, UserSerializer, UserSerializerWithToken

# for sensative data
from django.contrib.auth.hashers import make_password 


# customization for JWT
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from typing import Any, Optional, TypeVar


# class MyTokenObtainPairSerializer(TokenObtainPairSerializer):    
#     def validate(self, attrs: dict[str, Any]) -> dict[str, str]:
#         data = super().validate(attrs)

#         # data['username'] = self.user.username
#         # data['email'] = self.user.email

#         serializer = UserSerializerWithToken(self.user).data
#         for k, v in serializer.items():
#             data[k] = v

#         return data

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



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user 
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data
    if data['name'] != '':
        user.first_name = data['name']
    
    if data['email'] != '':
        user.username = data['email']
        user.email = data['email']

    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()
    return Response(serializer.data)


# view ot delete a user 
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    user = User.objects.get(id = pk)
    print(user)
    user.delete()
    return Response('User was deleted!')


# admin update user
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request, pk):
    user = User.objects.get(id = pk)
    

    data = request.data
    if data['name'] != '':
        user.first_name = data['name']
    
    if data['email'] != '':
        user.username = data['email']
        user.email = data['email']

    # if data['isAdmin'] != '':
    user.is_staff = data['isAdmin']
    print(user.is_staff)

    # user.is_staff = data['isAdmin']

    user.save()

    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    user = User.objects.get(id = pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)
    


