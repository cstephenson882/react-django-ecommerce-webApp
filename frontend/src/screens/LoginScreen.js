import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'

import { login } from '../actions/UserActions'
import FormContainer from '../components/FormContainer'
import { useLocation, useNavigate } from 'react-router-dom'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'


function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    

    const location = useLocation();
    const navigate = useNavigate();

    const redirect = location.search ? location.search.split('=')[1] : '/';

    const userLogin = useSelector(state => state.userLogin);
    const {loading, error, userInfo} = userLogin;

    useEffect(() => {
        
        if(userInfo) {
            navigate(redirect);
        }
    }, [navigate, userInfo, redirect]);
    
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
        // alert("Login")
      };

   
  return (
    <FormContainer>

      <h1>Sign In</h1>

      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}

      <form
        onSubmit={submitHandler}
      >
            
            
        <div className="form-group " >
          <label htmlFor="email">Email address</label>
          <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-describedby="emailHelp" placeholder="Enter email" />
          <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>

        </div>

        <div className="form-group" >
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} aria-describedby="passwordHelp" placeholder="Enter password" />
          

        </div>

        <button type="submit" class="btn btn-dark mt-3 " style={{width:"100%"}} >Sign In</button>

      </form>

      <div className="row py-3">
        <div className="col">
            New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
        </div>
    </div>
        


  

    </FormContainer>
  )
}

export default LoginScreen
