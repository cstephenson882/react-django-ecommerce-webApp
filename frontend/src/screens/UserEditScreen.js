import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'

import FormContainer from '../components/FormContainer'


import { getUserDetails, updateUserProfile, updateUser, listUsers } from '../actions/UserActions'

// USER_DETAILS_RESET:
import  {USER_DETAILS_RESET}  from '../constants/userConstants'





function UserEditScreen() {
    const navigate = useNavigate();
    // const location = useLocation();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    // get the id from the url
    const { id } = useParams();

        

    // get the userLogin from the state
    const userDetails = useSelector(state => state.userDetails);
    const {loading, error, user} = userDetails;
    
    
    const userUpdate = useSelector(state => state.userUpdate);
    const {loading: loadingUpdate, error: errorUpdate, success: successUpdate} = userUpdate;

    const dispatch = useDispatch();

    useEffect(() => {
        
        // dispatch(listUsers());
        
        if (user && user._id === Number(id)) {
            
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        } else {
            dispatch(getUserDetails(id));

        }
    }, [dispatch, id, user, successUpdate]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (!name || !email) {
            setMessage('All fields are required');
        } else {
            setMessage('');
        }
        dispatch(updateUser({id, name, email, isAdmin})); 
        dispatch({ type: USER_DETAILS_RESET });
        navigate('/admin/userlist');

        
    };


    
  return (
    <div> 
        <Link to='/admin/userlist' className='btn btn-light my-3'>Go Back</Link>

        <FormContainer>

        <h1>Edit User</h1>
        { loadingUpdate && <Loader /> }
        {loading && <Loader /> }
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

       { error ? <Message variant='danger'>{error}</Message> : (
            <form onSubmit={submitHandler} >
                    
                {/*  for the name input make it required */}
                <div className="form-group" >
                    <label htmlFor="name">Name</label>
                    <input type="name"  className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} aria-describedby="nameHelp" placeholder={user.name} />
                </div>

                {/*  for the email input */}
                <div className="form-group " >
                <label htmlFor="email" >Email address</label>
                <input type="email"  className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-describedby="emailHelp" placeholder={user.email} />
                {/* <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small> */}

                </div>

                {/*  for the password admin */}
                <div className="form-group" >
                
                <input type="checkbox"  className="" id="isAdmin" checked={user.isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} aria-describedby="isAdminHelp" placeholder="Enter isAdmin" />
                <label htmlFor="isAdmin" className='mx-2'> is Admin</label>
                </div>

                <button type="submit" class="btn btn-dark mt-3 " style={{width:"100%"}} >Update</button>

            </form>
        )}

        </FormContainer>
    
</div>
  )
}

export default UserEditScreen
