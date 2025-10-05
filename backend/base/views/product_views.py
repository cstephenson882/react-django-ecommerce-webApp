# views.py

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
from base.models import Product, Review

# importing serializers
from base.serializers import ProductSerializer

# pagination
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger





 

#-----------------------------------------------getProducts view --------------
# @api_view(['GET'])
# def getProducts(request):
#     return Response(products)

@api_view(['GET'])
def getProducts(request):
    keyword = request.query_params.get('keyword')
    if not keyword:
        products = Product.objects.all()
    else:
        products = Product.objects.filter(name__icontains=keyword.lower())

    # pagination
    page = request.query_params.get('page', 1)   # default to 1
    paginator = Paginator(products, 5)          # 5 products per page

    try:
        products_page = paginator.page(page)
    except PageNotAnInteger:
        products_page = paginator.page(1)
        page = 1
    except EmptyPage:
        products_page = paginator.page(paginator.num_pages)
        page = paginator.num_pages

    serializer = ProductSerializer(products_page, many=True)

    return Response({
        'products': serializer.data,
        'page': int(page),
        'pages': paginator.num_pages
    })

# top products
@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


#------------------------------------------------------------------------------

#-----------------------------------------------getProduct view ---------------
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

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    # we will create a sample product here and then allow the user to update it since we already have a form for that
    user = request.user
    product = Product.objects.create(
        user=user,
        name='Sample Product',
        price=0,
        brand='lorem ipsum',
        countInStock=0,
        category='lorem ipsum',
        description='lorem ipsum' * 10,
        
    )
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(_id=pk)

    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.countInStock = data['countInStock']
    product.category = data['category']
    product.description = data['description']

    product.save()
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response('Product Deleted')

#------------------------------------------------------------------------------
@api_view(['POST'])
# @permission_classes([IsAdminUser])
def uploadImage(request):
    data = request.data
    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)

    product.image = request.FILES.get('image')
    product.save()
    
    return Response('Image was uploaded')



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data  # request.data is a dictionary from the frontend

    # 1 - Review already exists
    alreadyExists = product.review_set.filter(user=user).exists()
    if alreadyExists:
        content = {'detail': 'Product already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 2 - No Rating or 0
    elif data['rating'] == 0:
        content = {'detail': 'Please select a rating'} 
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 3 - Create review
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],
        )

        reviews = product.review_set.all() # select * from review where product_id = pk
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating

        product.rating = total / len(reviews)
        product.save()

        return Response('Review Added')