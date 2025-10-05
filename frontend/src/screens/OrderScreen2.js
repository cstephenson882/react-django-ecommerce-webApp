// PlaceOrderScreen.js

import React from 'react'
import  { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'

import FormContainer from '../components/FormContainer'

// PAYPAL
import { PayPalButton } from 'react-paypal-button-v2'


// import { saveShippingAddress } from '../actions/CartActions'


import {getOrderDetails, payOrder} from '../actions/OrderActions'

// to use later
// paypal Order API
// ATCYnow1zkcFNMMlGWIKLYCGlr_2pPsiNdiGd1v3XtPP6uO6U9i6HSDprihxVDT5yosHqY9vgXzc-dgk


function OrderScreen2() {
    // get the order id from the url
    const { id } = useParams();
    
    const dispatch = useDispatch();

    // get the order details from the store
    const orderDetails = useSelector(state => state.orderDetails);
    const {loading, order, error} = orderDetails;

    // state variables for the cart
    // const cart = useSelector(state => state.cart);
    // const {shippingAddress} = cart;
    let itemsPrice = 0;
    if (!loading && !error) {
        itemsPrice = Number(order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)).toFixed(2);
    }    
    
    
    

    const navigate = useNavigate();

    
    // Paypal script
    //  <script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>

    const [sdkReady, setSdkReady] = useState(false);

    // get the orderPay from the store
    const orderPay = useSelector(state => state.orderPay);
    const {loading: loadingPay, success: successPay} = orderPay;
    const addPayPalScript = () => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://www.paypal.com/sdk/js?client-id=ATCYnow1zkcFNMMlGWIKLYCGlr_2pPsiNdiGd1v3XtPP6uO6U9i6HSDprihxVDT5yosHqY9vgXzc-dgk';
        script.async = true;
        script.onload = () => {
            setSdkReady(true);
        };
        document.body.appendChild(script);
    }

    useEffect(() => {
        
        // if order is not found, redirect to home page
        if(!order || order._id !== Number(id) || successPay) {
            dispatch(getOrderDetails(id));
        } 
        else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript();
            } else {
                setSdkReady(true);
            }
        } 
        
        // eslint-disable-next-line
    }, [order, id, successPay, dispatch]);

    // paymentResult is the response from paypal
    const successPaymentHandler = (paymentResult) => {
        // console.log(paymentResult);
        dispatch(payOrder(id, paymentResult));
    }

  return loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
    <div>
        {/* underlines and text light grey important */}
        <h1 className='px-3 ' style={{border: '1px solid #ccc' , backgroundColor: '#f8f9fa'}} > Order: {order._id}</h1>
        <div className='row d-flex justify-content-between'>
            <div className='col-md-7'>
                {/* shipping  */}
                <div className='list-group list-group-flush' >
                    <div className='list-group-item'>
                        <h2>Shipping</h2>

                        
                        <p>
                            <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                        {/* isDelivered */}
                        {order.isDelivered ? (<Message variant='success'>Delivered on {order.deliveredAt}</Message>) : (<Message variant='warning'>Not Delivered</Message>)}
                         
                        
                        {/* {user name} */}
                        <p><strong>Name:</strong> {order.user.name}</p>
                        {/* user email */}
                        <p><strong>Email:</strong> <Link style={{textDecoration: 'none', color: 'inherit'}} to={`mailto:${order.user.email}`}>{order.user.email}</Link></p>
                    </div>
                    
                  
                    

                    
                    {/* Payment Method */}
                    <div className='list-group-item'>
                        <h2>Payment Method</h2>
                        {/* isPaid */}
                        {order.isPaid ? (<Message variant='success'>Paid on {order.paidAt}</Message>) : (<Message variant='warning'>Not Paid</Message>)}
                        <p className='m-0'>
                            <strong>Method:</strong> {order.paymentMethod}
                        </p>
                    </div>
                    {/* Order Items */}
                    <div className='list-group-item '>
                        <h2>Order Items</h2>
                        <div className='list-group list-group-flush' >
                            {order.orderItems.length>0 ? order.orderItems.map(item => (
                                
                                <div className='list-group-item' key={item.product}>                          
                                    <div className='row '>
                                        <div className='col md-1'>
                                            <img src={item.image} alt={item.name} className='img-fluid rounded img-thumbnail ' style={{width: '3rem', height: '3rem'}} />
                                        </div>
                                        <div className='col' >
                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                                        </div>
                                        {/* quantity */}
                                        <div className='col d-flex justify-content-center'>
                                            <span>{item.qty} x (${item.price})</span>
                                        </div>
                                        {/* price */}
                                        <div className='col'>
                                            <span>${(item.price * item.qty).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                            )) : (
                                <Message variant='info'>No Order Items</Message>
                            )} 
                            </div>
                        
                    </div>

                </div>
            </div>

            {/* Order Summary */}
            <div className='col-md-4'>
                {/* list group for order summary */}
                <div className='list-group '>
                    <div className='list-group-item'>
                        <h2>Order Summary</h2>
                    </div>
                    <div className='list-group-item'>
                        <div className='row'>
                            <div className='col'>
                                Items:
                            </div>
                            <div className='col'>
                                ${itemsPrice}
                            </div>

                        </div>
                    </div>

                    <div className='list-group-item'>
                        <div className='row'>
                            <div className='col'>
                                Shipping:
                            </div>
                            <div className='col'>
                                {/* ${shippingPrice} */}
                                {order.shippingPrice}
                            </div>

                        </div>
                    </div>

                    <div className='list-group-item'>
                        <div className='row'>
                            <div className='col'>
                                Tax:
                            </div>
                            <div className='col'>
                                {/* ${taxPrice} */}
                                {order.taxPrice}
                            </div>

                        </div>
                    </div>

                    <div className='list-group-item'>
                        <div className='row'>
                            <div className='col'>
                                Total:
                            </div>
                            <div className='col'>
                                {/* ${totalPrice} */}
                                {order.totalPrice}
                            </div>

                        </div>
                    </div>
                    {/* place order */}
                    {!order.isPaid && (
                        <div className='list-group-item'>
                            {!loadingPay && <Loader />}
                            {!sdkReady ? <Loader /> : (
                                <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler} />
                            )}
                        </div>

                    )}
                   
                    {/* place order dark button */}
                    <div className='list-group-item'>
                        
                    </div>
                </div>

            </div>
        </div>
      
    </div>
  )
}

export default OrderScreen2
