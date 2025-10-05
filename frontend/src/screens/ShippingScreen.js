// ShippingScreen.js

import React from 'react'
import  { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'

import FormContainer from '../components/FormContainer'
import { useLocation, useNavigate } from 'react-router-dom'

import { saveShippingAddress } from '../actions/CartActions'

import CheckoutSteps from '../components/CheckoutSteps'


function ShippingScreen() {

    // initialize navigate and location
    const navigate = useNavigate();
    const location = useLocation();

    // state variables
    const cart = useSelector(state => state.cart);
    const {shippingAddress} = cart;
    

    // state variables
    // const [address, setAddress] = useState(shippingAddress.address? shippingAddress.address : '');
    // const [city, setCity] = useState(shippingAddress.city? shippingAddress.city : '');
    // const [postalCode, setPostalCode] = useState(shippingAddress.postalCode? shippingAddress.postalCode : '');
    // const [country, setCountry] = useState(shippingAddress.country? shippingAddress.country : '');

    // state variables
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');    
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    
    // check if the shipping address is in the local storage
    useEffect(() => {
        if (shippingAddress) {    
            setAddress(shippingAddress.address);
            setCity(shippingAddress.city);
            setPostalCode(shippingAddress.postalCode);
            setCountry(shippingAddress.country);
        }
    }, [shippingAddress])    



   // action dispatch
   const dispatch = useDispatch();

   // get the shipping address from the state if it exists in local storage
   


    

    const submitHandler = (e) => {
        e.preventDefault();
        // console.log('checkout...');
        dispatch(saveShippingAddress({address, city, postalCode, country}));
        navigate('/payment');
    }

  return (
    <div>
        <CheckoutSteps step1={true} step2={true} />
    
    <FormContainer>
        
        
        <h1>Shipping</h1>
        <form onSubmit={submitHandler}>
            {/* address */}
            <div className="form-group" >
                <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input type="text" className="form-control" id="address" 
                        placeholder="Enter address" 
                        required
                        value={address? address : ''} 
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
            </div>
            
            {/* city */}
            <div className="form-group" >
                <div className="mb-3">
                    <label htmlFor="city" className="form-label">City</label>
                    <input type="text" className="form-control" id="city" 
                        placeholder="Enter city" 
                        required
                        value={city? city : ''} 
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>
            </div>
            
            {/* postal code */}
            <div className="form-group" >
                <div className="mb-3">
                    <label htmlFor="postalCode" className="form-label">Postal Code</label>
                    <input type="text" className="form-control" id="postalCode" 
                        placeholder="Enter postal code" 
                        required
                        value={postalCode? postalCode : ''} 
                        onChange={(e) => setPostalCode(e.target.value)}
                    />
                </div>
            </div>
            
            {/* country */}
            <div className="form-group" >
                <div className="mb-3">
                    <label htmlFor="country" className="form-label">Country</label>
                    <input type="text" className="form-control" id="country" 
                        placeholder="Enter country" 
                        required
                        value={country? country : ''} 
                        onChange={(e) => setCountry(e.target.value)}
                    />
                </div>
            </div>

            <button type="submit" className="btn btn-primary">Continue</button>
        </form>
    </FormContainer>
    </div>
  )
}

export default ShippingScreen
