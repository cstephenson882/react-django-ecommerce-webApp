// CartScreen.js

import React from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import {useEffect} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { addToCart, removeFromCart } from '../actions/CartActions'

function CartScreen() {
  const { id: productId } = useParams(); // Get product ID from URL and assign as variable name 'productId'
  const location = useLocation(); // Get query string
  const navigate = useNavigate(); // Replaces history

 // if an item is added to the cart, the qty is captured in the query string or the default quantity is 1
 // recall location give a format: {pathname: "/cart", search: "?qty=1", hash: "", state: undefined, key: "3v7z5v"}
  const qty = location.search ? 
              location.search.split('=')[1]
              : 1

  // console.log(`qty:${qty}`)

  const dispatch = useDispatch();
  // gernatlly you dispatch an action in the useEffect hook
  // the reducer liked to that action will update the state
  // the component will re-render with the updated state
   useEffect(() => {
            if (productId) { 
              dispatch(addToCart(productId, qty));
            }
                
          }, [dispatch, productId, qty]);
            
    const cart = useSelector(state => state.cart);
    const {cartItems} = cart;
    // console.log("cartItems:", cartItems);

    const removeFromCartHandler = (id) => (dispatch) => {
      console.log(`remove:${id}`);
      dispatch(removeFromCart(id));
    }   

    const checkoutHandler = () => {
      // console.log(`checkout`);
      navigate('/login?redirect=/shipping');
    }

  return (
    <div className="container">
    
      <div className="row ">

        <div className="col-md-8" >
          <h1>Shopping Cart ({cartItems.length} items)</h1>

          {cartItems.length == 0
          ?(
            // <Message variant='info'>Your cart is empty</Message>
            
              <Message variant='info' message = {"Your cart is empty "} >
              <Link to="/" className="">Go Back</Link>
              </Message>
        
            
          )
            
          :
          (
            <div className="list-group list-group-flush">
                {cartItems.map((item) => (
                  <div key={item.product} className="list-group-item">
                    <div className="row">
                      {/* Product Image */}
                      <div className="col-md-3">
                        <img src={item.image} alt={item.name} className="img-fluid rounded" />
                      </div>

                      {/* Product Name */}
                      <div className="col-md-4 ">
                        <Link to={`/product/${item.product}`} className='custom-link'>{item.name}</Link>
                       
                      </div>

                      {/* Price */}
                      <div className="col-md-2">
                        <span>${item.price}</span>
                      </div>

                      {/* Quantity */}
                      <div className="col-md-2">
                        
                        <div className="form-group">
                          <label className ="sr-only" for="exampleFormControlSelect1">Select Amount</label>
                          <select
                              className="form-control"
                              value={item.qty}
                              // dispatching a action as an event handler
                              onChange={(e) => dispatch(addToCart(item.product, e.target.value))}
                              disabled={item.countInStock === 0} // 
                          >
                          {
                              [...Array(item.countInStock).keys()].map((x) => (
                                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                              ))
                          }
                              
                          </select>
                        </div>
                      </div>

                      

                      {/* Remove Button (Optional) */}
                      <div className="col-md-1">
                        <button className="btn btn-sm"
                          onClick={() => dispatch(removeFromCartHandler(item.product))}
                          style={{
                            backgroundColor: "",
                            color: "black",
                            transition: "background-color 0.1s ease-in-out"
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = "#0056b3"}
                          onMouseLeave={(e) => e.target.style.backgroundColor = ""}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )
          }
        </div>  
        <div className="col-md-4" >
          {/* card with no border */}
          <div className="card  border-0">
          <ul class="list-group list-group">
            
            {/* number of items */}
            <li class="list-group-item">
              <h1> SUBTOTAL
                ({cartItems.reduce((acc, item) => acc + Number(item.qty), 0)}) ITEMS
              </h1>
              <span> ${(cartItems.reduce((acc, item) => acc + Number(item.price) * Number(item.qty), 0)).toFixed(2)} </span>
            </li>
            {/* price of items */}
           

            <li class="list-group-item">
              <button type="button" class="btn btn-secondary btn-lg active"
                disabled={cartItems.length === 0}
                // checkout handler
                onClick= {checkoutHandler}
                >
                PROCEED TO CHECKOUT
              </button>
            </li>
            {/* <li class="list-group-item">Porta ac consectetur ac</li>
            <li class="list-group-item">Vestibulum at eros</li> */}
          </ul>
          </div>
        </div>  

      </div>
    </div>
  )
}

export default CartScreen
