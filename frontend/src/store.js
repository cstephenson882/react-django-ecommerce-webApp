// store.js

import { configureStore } from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk';

import {  productListReducer, 
          productDetailsReducer, 
          productDeleteReducer,
          productCreateReducer,
          productUpdateReducer,
          productReviewCreateReducer, 
          productTopRatedReducer, 
        } from './reducers/ProductReducers'

import {cartReducer} from './reducers/CartReducers'

import {userLoginReducer, 
        userRegisterReducer, 
        userDetailsReducer, 
        userUpdateProfileReducer, 
        userListReducer, 
        userDeleteReducer,
        userUpdateReducer} from './reducers/UserReducers'

import {orderCreateReducer, 
        orderDetailsReducer, 
        orderPayReducer, 
        orderListMyReducer,
        orderListReducer,
        orderDeliverReducer
      } from './reducers/OrderReducers'

import { combineReducers } from 'redux';



// Define your combined reducers (placeholder for now) * this is important
const reducer = combineReducers({
    productCreate: productCreateReducer,
    productList: productListReducer,
    productDetails: productDetailsReducer,
    productDelete: productDeleteReducer,
    productUpdate: productUpdateReducer,
    productReviewCreate: productReviewCreateReducer,
    productTopRated: productTopRatedReducer,
    
    cart: cartReducer,
    
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,

    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderListMy: orderListMyReducer,
    orderList: orderListReducer,
    orderDeliver: orderDeliverReducer,
});

// checks if the key 'cartItems' exists in local storage and parse it because it was 
// stored as a string. Next we will addd it to local storage
const cartItemsFromStorage = localStorage.getItem('cartItems') ?
  JSON.parse(localStorage.getItem('cartItems')) :
  [];


// checking for the userInfo in local storage
const userInfoFromStorage = localStorage.getItem('userInfo') ?
  JSON.parse(localStorage.getItem('userInfo')): null;


// shipping address
const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ?
  JSON.parse(localStorage.getItem('shippingAddress')): null;



// Optional: Set up initial state if needed
const initialState = {
  cart: {cartItems: cartItemsFromStorage, shippingAddress: shippingAddressFromStorage},
  userLogin: { userInfo: userInfoFromStorage },
};


// Configure the store with reducers, middleware, and initial state
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  preloadedState: initialState, // Equivalent to the old `initialState`
});

export default store;
