# urls.py

from django.urls import path
from base.views import user_views as views

# / multi line comment


# no longer needed be this import is now in views.py

# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
# )




urlpatterns = [
    path('login/', views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', views.registerUser, name='register'),

    path('profile/', views.getUserProfile, name='user-profile'),
    path('profile/update/', views.updateUserProfile, name='user-profile-update'),
    path('', views.getUsers, name='users'),

    path('<str:pk>/', views.getUserById, name = 'user'),
    path('delete/<str:pk>/', views.deleteUser, name = 'user-delete'),
    path('update/<str:pk>/', views.updateUser, name = 'user-update'),
 

]
