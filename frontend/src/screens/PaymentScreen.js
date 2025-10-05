// PaymentScreen.js

import React from 'react'
import  { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'

import FormContainer from '../components/FormContainer'
import { useLocation, useNavigate } from 'react-router-dom'

import CheckoutSteps from '../components/CheckoutSteps'

import { savePaymentMethod } from '../actions/CartActions'




function PaymentScreen() {

    // initialize navigate and location
    const navigate = useNavigate();
    const location = useLocation();

    // state variables
    const cart = useSelector(state => state.cart);
    const {shippingAddress} = cart;

    // set payment method
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    // dispatch
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        // cart.paymentMethod = paymentMethod;
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    }


    // redirect to shipping if no shipping address
    if(!shippingAddress.address) {
        navigate('/shipping');
    }

    return (
        // steps
        <div>
            <CheckoutSteps step1 step2 step3 />
        
        <FormContainer>
            
            <h1>Payment Method</h1>
            {/* form, formGroup, label */}
            <form onSubmit={submitHandler}>
                <div class="form-check"> 
                    <input class="form-check-input" type="radio" name="paymentMethod" id="payPal" checked />
                    <label class="form-check-label" for="payPal">
                    <i class="fa-brands fa-paypal"> </i> Paypal /  <i class="fa-solid fa-credit-card"></i> Credit Card
                    </label>

                </div>
                <div class="form-check" >
                    <input class="form-check-input" type="radio" name="paymentMethod" id="stripe"  disabled/>
                    <label class="form-check-label" for="stripe">
                        Stripe
                    </label>
                </div>
               
                

                <button type='submit' className='btn btn-primary mt-3'>Continue</button>
            </form>
        </FormContainer>
        </div>
    )
}

export default PaymentScreen
