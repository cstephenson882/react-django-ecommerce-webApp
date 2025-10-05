# views.py
# order views

from datetime import timezone
from django.shortcuts import render


# static data for testing purposes
from ..products import products

# django rest framework imports ** function based views **
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from rest_framework.response import Response
#---------------------------------------------------------------

## status codes
from rest_framework import status


# updating to use the models
from base.models import Product, Order, OrderItem, ShippingAddress

# importing serializers
from base.serializers import ProductSerializer, OrderSerializer

# import datetime for timezone
from datetime import datetime, timedelta
# import timezone for timezone
from django.utils import timezone


# from frontend
"""
dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress, // sample data here looks like: {address, city, postalCode, country}
            paymentMethod: cart.paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        }))
"""

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user  = request.user
    data = request.data
    OrderItems = data['orderItems']
    if OrderItems and len(OrderItems) == 0:
        return Response({'message': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # (1) Create Order
        # (2) Create Shipping Address
        # (3) Create OrderItem and set Order to OrderItem relationship
        # (4) Update Stock

        # (1) Create Order
        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice']
            # isPaid=data['isPaid'],
            # paidAt=data['paidAt'],
            # isDelivered=data['isDelivered'],
            # deliveredAt=data['deliveredAt'],
        )

        # (2) Create Shipping Address
        shipping = ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'], 
            postalCode = data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country'],
        )

        # (3) Create OrderItem and set Order to OrderItem relationship
        for i in OrderItems:
            product = Product.objects.get(_id=i['product'])

            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=i['qty'],
                price=i['price'],
                image=product.image.url
                
            )  

            # (4) Update Stock
            product.countInStock -= int(i['qty'])

            product.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    # print('>>> Authenticated user:', user)
    orders = user.order_set.all()
    # print('>>> Orders:', orders)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user
    check_= False
    try:
        order = Order.objects.get(_id=pk)

        
        if order.user == user or user.is_staff:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            Response({'detail': 'Not authorized to view this order'}, status=status.HTTP_400_BAD_REQUEST)

    except:
        return Response({'detail': 'Order does not exist.' + pk}, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(_id=pk)
    order.isPaid = True
    order.paidAt = timezone.now()
    order.save()

    return Response('Order was paid')


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id=pk)
    order.isDelivered = True
    order.deliveredAt = timezone.now()
    order.save()

    return Response('Order was delivered')



