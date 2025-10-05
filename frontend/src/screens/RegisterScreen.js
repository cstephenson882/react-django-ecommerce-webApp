import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'

import FormContainer from '../components/FormContainer'
import { useLocation, useNavigate } from 'react-router-dom'

import { register } from '../actions/UserActions'



function RegisterScreen() {
    // initialize navigate and location
    const navigate = useNavigate();
    const location = useLocation();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

        

    // get the userLogin from the state
    const userRegister = useSelector(state => state.userRegister);
    const {loading, error, userInfo} = userRegister;
    const redirect = location.search ? location.search.split('=')[1] : '/';

    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (!name || !email || !password || !confirmPassword) {
            setMessage('All fields are required');
        } else if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        } else {
            setMessage('');
            dispatch(register(name, email, password));
        }
    };


    
  return (
    <FormContainer>

      <h1>Register</h1>
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
          <input type="password" required className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} aria-describedby="passwordHelp" placeholder="Enter password" />

        </div>
            
        {/*  for the confirm password input */}
        <div className="form-group" >
          <label htmlFor="confirmPassword">Confirm Password</label> 
            <input type="password" required className="form-control" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} aria-describedby="confirmPasswordHelp" placeholder="Confirm password" />
        </div>

        <button type="submit" class="btn btn-dark mt-3 " style={{width:"100%"}} >Register</button>

      </form>

      <div className="row py-3">
        <div className="col">
            Have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
        </div>
    </div>
        


  

    </FormContainer>
  )
}

export default RegisterScreen
