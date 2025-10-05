// PlaceOrderScreen.js

import React from 'react'
import  { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'

import FormContainer from '../components/FormContainer'
import { useLocation, useNavigate } from 'react-router-dom'

import { saveShippingAddress } from '../actions/CartActions'

import CheckoutSteps from '../components/CheckoutSteps'

import {createOrder} from '../actions/OrderActions'

import { ORDER_CREATE_RESET } from '../constants/orderConstants'


function PlaceOrderScreen() {

    // state variables for the order
    const orderCreate = useSelector(state => state.orderCreate);
    const {loading, success, error, order} = orderCreate;

    

    // state variables for the cart
    const cart = useSelector(state => state.cart);
    const {shippingAddress} = cart;

        
    const itemsPrice = Number(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)).toFixed(2);
    const shippingPrice = (itemsPrice > 100 ? 0 : itemsPrice * 0.01).toFixed(2);
    const taxPrice = (0.15 * itemsPrice).toFixed(2);
    const totalPrice = Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice);


    

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const placeOrderHandler = () => { 
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress, // sample data here looks like: {address, city, postalCode, country}
            paymentMethod: cart.paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        }))
        // console.log('place order')
    }

    useEffect(() => {
           

        if (!cart.paymentMethod) {
            navigate('/payment')
            // refresh the page

            window.location.reload();
        }
        if(success){
            navigate(`/order/${order._id}`)
            dispatch({type: ORDER_CREATE_RESET})
        } 
        
    }, [navigate, success, order, cart.paymentMethod, dispatch])


  return  (
    
    <div>
        
        <CheckoutSteps step1 step2 step3 step4 />
        <div className='row d-flex justify-content-between'>
            <div className='col-md-7'>
                {/* shipping  */}
                <div className='list-group list-group-flush' >
                    <div className='list-group-item'>
                        <h2>Shipping</h2>
                    </div>
                    <div className='list-group-item'>
                        <p>
                            <strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                        </p>
                    </div>
                    {/* Payment Method */}
                    <div className='list-group-item'>
                        <h2>Payment Method</h2>
                        <p>
                            <strong>Method:</strong> {cart.paymentMethod}
                        </p>
                    </div>
                    {/* Order Items */}
                    
                    <div className='list-group-item '>
                        <h2>Order Items</h2>
                        <div className='list-group list-group-flush' >
                            {cart.cartItems.length>0 ? cart.cartItems.map(item => (
                                
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
                                <Message variant='info'>Your cart is empty</Message>
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
                                ${shippingPrice}
                            </div>

                        </div>
                    </div>

                    <div className='list-group-item'>
                        <div className='row'>
                            <div className='col'>
                                Tax:
                            </div>
                            <div className='col'>
                                ${taxPrice}
                            </div>

                        </div>
                    </div>

                    <div className='list-group-item'>
                        <div className='row'>
                            <div className='col'>
                                Total:
                            </div>
                            <div className='col'>
                                ${totalPrice}
                            </div>

                        </div>
                    </div>
                    {/* error placing order */}
                    <div className='list-group-item'>
                        {error && <Message variant='danger'>{error}</Message>}
                    </div>
                    {/* place order dark button */}
                    <div className='list-group-item'>
                        <button 
                            type='button' 
                            className='btn btn-block btn-dark'
                            disabled={cart.cartItems.length === 0}
                            onClick={placeOrderHandler}
                            style={{width: '100%'}}
                        > Place Order
                        </button>
                    </div>
                </div> 

            </div> 
        </div>
                        
    </div>
  )
}

export default PlaceOrderScreen
