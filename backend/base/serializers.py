# serializers.py 


from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, Review, Order, OrderItem, ShippingAddress

# refresh token
from rest_framework_simplejwt.tokens import RefreshToken


# customization for JWT
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from typing import Any, Optional, TypeVar


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):    
    def validate(self, attrs: dict[str, Any]) -> dict[str, str]:
        data = super().validate(attrs)

        # data['username'] = self.user.username
        # data['email'] = self.user.email

        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', '_id', 'isAdmin']

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email
        return name
    
    def get__id(self, obj): 
        return obj.id
    
    def get_isAdmin(self, obj):
        return obj.is_staff
        
# UserSerializerWithToken extends UserSerializer (use for JWT in cases of first time login) 
class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)   
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', '_id', 'isAdmin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Product
        fields = '__all__'

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data

    def get_image(self, obj):  ## recommneded add **
        request = self.context.get('request')
        image = obj.image.url if obj.image else '/images/placeholder.png'
        return request.build_absolute_uri(image) if request else image


# ShippingAddressSerializer
class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'


# OrderItemSerializer
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


# OrderSerializer
class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Order
        fields = '__all__'

    def get_orderItems(self, obj):

        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_shippingAddress(self, obj):
        try:
            
            address = ShippingAddressSerializer(obj.ShippingAddress, many=False)
            # we can use ShippingAddress and not shippingaddress because we have set related_name='ShippingAddress' in the model
            return address.data
        except:
            return False
        
    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data


