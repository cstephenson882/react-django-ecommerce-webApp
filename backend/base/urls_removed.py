# urls.py
'''

from django.urls import path
from . import views

# / multi line comment

""" 
// no longer needed be this import is now in views.py

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)
"""


# path for home
# path to get products
# path to get a specific product by id
urlpatterns = [
    path('api/users/login/', views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/users/register/', views.registerUser, name='register'),
    path('api/', views.getRoutes, name='routes'),
    path('api/users/profile', views.getUserProfile, name='user-profile'),
    path('api/users/', views.getUsers, name='users'),
    path('api/products/', views.getProducts, name='products'),
    path('api/products/<pk>/',views.getProduct, name='product'),

]

'''