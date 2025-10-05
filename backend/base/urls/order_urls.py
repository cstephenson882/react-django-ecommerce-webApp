# urls.py
# order urls

from django.urls import path
from base.views import order_views as views

# / multi line comment

""" 
// no longer needed be this import is now in views.py

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)
"""

#  backend setting for this url: api/orders/...

urlpatterns = [
    # get all orders - admin only
    path('', views.getOrders, name='orders'),
    # add order
    path('add/', views.addOrderItems, name='orders-add'),
    # get orders
    path('myorders/', views.getMyOrders, name='my-orders'),
    # order delivered - admin only
    path('<str:pk>/deliver/', views.updateOrderToDelivered, name='order-delivered'),
    # order by id
    path('<str:pk>/', views.getOrderById, name='order-by-id'),
    # updateOrderToPaid
    path('<str:pk>/pay/', views.updateOrderToPaid, name='order-update-to-paid'),



]
