import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'

import { useLocation, useNavigate } from 'react-router-dom'

import {getUserDetails, updateUserProfile } from '../actions/UserActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'

import { listMyOrders } from '../actions/OrderActions'


function ProfileScreen() {
    // initialize navigate and location
        const navigate = useNavigate();
        // const location = useLocation();
        
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [message, setMessage] = useState('');
    
            
    
        // get the userLogin from the state
        const userDetails = useSelector(state => state.userDetails);
        const {loading, error, user} = userDetails;

        // pull the order from orderListMy
        const orderListMy = useSelector(state => state.orderListMy);
        const {loading: loadingOrders, error: errorOrders, orders} = orderListMy;


        // check if the user is logged in
        const userLogin = useSelector(state => state.userLogin);
        const {userInfo} = userLogin;

        const userUpdateProfile = useSelector(state => state.userUpdateProfile);
        const {success} = userUpdateProfile;
        
    
        const dispatch = useDispatch();
    
        useEffect(() => {
            
            if (!userInfo) {
                navigate('/login');
            } else {
                if( !user || !user.name || success || userInfo._id !== user._id) {
                    dispatch({type: USER_UPDATE_PROFILE_RESET});
                    
                    dispatch(getUserDetails('profile'));
                    dispatch(listMyOrders());
                } else {
                    setName(user.name);
                    setEmail(user.email);
                }
                setMessage('');
            }
        }, [dispatch, navigate, userInfo, user, success]);
    
        const submitHandler = (e) => {
            e.preventDefault();
            if (password !== confirmPassword) {
                setMessage('Passwords do not match');
            } else {
                dispatch(updateUserProfile(
                    {
                        'id': user._id, 
                        'name': name, 
                        'email': email, 
                        'password': password
                    }
                ));

                
                
            }
        };
    
    

  return (
    <div className='container'>

      <div className="row">
        <div className="col-md-4 ">
            <h2>User Profile</h2>
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}

            <form
                onSubmit={submitHandler}
            >
                    
                {/*  for the name input make it required */}
                <div className="form-group" >
                    <label htmlFor="name">Name</label>
                    <input type="name" required className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} aria-describedby="nameHelp" placeholder="Enter name" />
                </div>

                {/*  for the email input */}
                <div className="form-group " >
                <label htmlFor="email">Email address</label>
                <input type="email" required className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-describedby="emailHelp" placeholder="Enter email" />
                {/* <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small> */}

                </div>

                {/*  for the password input */}
                <div className="form-group" >
                <label htmlFor="password">Password</label>
                <input type="password"  className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} aria-describedby="passwordHelp" placeholder="Enter password" />

                </div>
                    
                {/*  for the confirm password input */}
                <div className="form-group" >
                <label htmlFor="confirmPassword">Confirm Password</label> 
                    <input type="password"  className="form-control" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} aria-describedby="confirmPasswordHelp" placeholder="Confirm password" />
                </div>

                <button type="submit" class="btn btn-dark mt-3 " style={{width:"100%"}} >Update</button>

            </form>
        </div> 

        <div className="col-md-8">
            <h2>My Orders</h2>
            {loadingOrders ? <Loader /> : errorOrders ? <Message variant='danger'>{errorOrders}</Message> : (
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>${order.totalPrice}</td>
                                <td>{order.isPaid ? (order.paidAt.substring(0, 10)) : (<i className='fas fa-times' style={{color: 'red'}}></i>)}</td>
                                <td>{order.isDelivered ? (order.deliveredAt.substring(0, 10)) : (<i className='fas fa-times' style={{color: 'red'}}></i>)}</td>
                                <td><Link to={`/order/${order._id}`} className='btn btn-light btn-sm'>Details</Link></td>

                            </tr>
                        ))}
                    </tbody>

                </table>

            )}
        </div> 
    </div>
    </div>
  )
}

export default ProfileScreen
