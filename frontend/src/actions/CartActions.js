// CartActions.js

// for the api calls
import axios from 'axios'

import { 
    CART_ADD_ITEM, 
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD 
    } from '../constants/cartConstants' 


export const addToCart = (id, qty) => async (dispatch, getState) => {
    try{
        // add code here
        const {data} = await axios.get(`/api/products/${id}`);
        dispatch({
                    type: CART_ADD_ITEM,
                    payload: {
                        product: data._id,
                        name: data.name,
                        image: data.image,
                        price: data.price,
                        countInStock: data.countInStock,
                        qty
                    } 
                })
        
    } catch (error) {
     // handle error   
    }

    // save the cartItems to local storage
    // cart is not a random name, it is the name of the reducer in the store
    const {cart} = getState();
    localStorage.setItem('cartItems', JSON.stringify(cart.cartItems))
}


export const removeFromCart = (id) => async (dispatch, getState) => {
    try{
        dispatch({
            type: CART_REMOVE_ITEM,
            payload: id
        })
    } catch (error) {
        // handle error
    }
    // setting the local storage to reflect the update after removing an item
    const {cart} = getState();
    localStorage.setItem('cartItems', JSON.stringify(cart.cartItems))
}



// shipping actions
export const saveShippingAddress = (data) => async (dispatch) => {
    try{
        dispatch({
            type: CART_SAVE_SHIPPING_ADDRESS,
            payload: data
        })
    } catch (error) {
        // handle error
    }
    // setting the local storage 
    localStorage.setItem('shippingAddress', JSON.stringify(data))
}

// payment actions
export const savePaymentMethod = (data) => async (dispatch) => {
    try{
        dispatch({
            type: CART_SAVE_PAYMENT_METHOD,
            payload: data
        })
    } catch (error) {
        // handle error
    }
    // setting the local storage 
    localStorage.setItem('paymentMethod', JSON.stringify(data))
}
 