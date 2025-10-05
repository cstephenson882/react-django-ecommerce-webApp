// CheckoutSteps.js

// used to display the status bar indicating the steps in the checkout process
import React from 'react'
import { Link } from 'react-router-dom'


function CheckoutSteps({step1 = false, step2 = false, step3 = false, step4 = false}) {
  return (
    
    <nav className='justify-content-center mb-4 list-unstyled d-flex' style={{color:'lightgray'}}>
        {/* step 1: login */}
        <li className='nav-item mx-5'>
            {step1 ? (
                <Link to='/login' className='nav-link' style={{color:'lightblue'}}>Login</Link>
            ) : (
                <Link to='#' className='nav-link disabled'>Login</Link>
            )}
        </li>

        {/* step 2: shipping */}
        <li className='nav-item mx-5'>
            {step2 ? (
                <Link to='/shipping' className='nav-link' style={{color:'lightblue'}}>Shipping</Link>
            ) : (
                <Link to='#' className='nav-link disabled'>Shipping</Link>
            )}
        </li>

        {/* step 3: payment */}
        <li className='nav-item mx-5'>
            {step3 ? (
                <Link to='/payment' className='nav-link' style={{color:'lightblue'}}>Payment</Link>
            ) : (
                <Link to='#' className='nav-link disabled'>Payment</Link>
            )}
        </li>

        {/* step 4: place order */}
        <li className='nav-item mx-5'>
            {step4 ? (
                <Link to='/placeorder' className='nav-link' style={{color:'lightblue'}}>Place Order</Link>
            ) : (
                <Link to='#' className='nav-link disabled'>Place Order</Link>
            )}
        </li>

      
    </nav>
  )
}

export default CheckoutSteps
