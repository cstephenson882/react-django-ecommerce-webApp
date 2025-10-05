// cartReducer.js

import { CART_ADD_ITEM, 
         CART_REMOVE_ITEM,
          CART_SAVE_SHIPPING_ADDRESS,
          CART_SAVE_PAYMENT_METHOD,
          CART_CLEAR_ITEMS 
       } from '../constants/cartConstants';

       


export const cartReducer = (state  = {cartItems:[], shippingAddress:{}}, action) => {
    switch (action.type) {
        case CART_ADD_ITEM:
            // set the payload to item
            // check if the item is already in the cart
            // if it does then loop through the cartItems and update the item that matches
            const item = action.payload; 
            // loops though the state object and returns a product object if it matches what was captured in the payload.
            const existItem = state.cartItems.find(x => x.product === item.product);
            if (existItem) {
              return {
                      ...state,
                      cartItems: state.cartItems.map(x =>
                        x.product === existItem.product ? item : x
                      )
                    }             
            } else {
              return {
                      ...state, 
                      cartItems: [...state.cartItems, item]
                    };
            }
        
        case CART_REMOVE_ITEM:
            return {
                ...state, 
                cartItems: state.cartItems.filter(x => x.product !== action.payload)
                // filter out the item that matches the payload

            }
        case CART_SAVE_SHIPPING_ADDRESS:
            return {
                ...state, 
                shippingAddress: action.payload
            }
        case CART_SAVE_PAYMENT_METHOD:
            return {
                ...state, 
                paymentMethod: action.payload
            }
        case CART_CLEAR_ITEMS:
            return {
                ...state, 
                cartItems: []
            }
        default:
            return state

            
    }
}

// shipping reducers

