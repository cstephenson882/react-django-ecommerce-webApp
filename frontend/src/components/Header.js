import React, { useState, useEffect } from 'react'
import {Link, redirect} from 'react-router-dom'

import {useDispatch, useSelector} from 'react-redux'
import { logout } from '../actions/UserActions'
import { useNavigate } from 'react-router-dom'

import SearchBox from './SearchBox'



function Header() {
  const userLogin = useSelector(state => state.userLogin);
  const {userInfo} = userLogin;
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const logoutHandler = () => {
    console.log("logout")
    dispatch(logout())
    navigate('/login')


  }

  return (
    <section className="bg-dark text-light py-md-3">
      <div className="container">
        <header>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark ">
            <div className="container-fluid">
              <Link className="navbar-brand " to="#">Navbar</Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link " to="/cart">
                        <i className="bi bi-cart"></i> Cart
                    </Link>
                  </li>
                  
                  {/* logout if user is logged in */}
                  <li className="nav-item">
                  
                     {userInfo ? (
                          <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                              {userInfo.name && userInfo.name.toUpperCase()}
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                              <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                              <li><button className="dropdown-item" onClick={logoutHandler}>Logout</button></li>
                            </ul>
                          </div>
                        ) : (
                          <Link className="nav-link " to="/login" >
                            <i className="bi bi-person-circle"></i> Login
                          </Link>
                        )
                      }
                                           
                  </li>
                
                  {/* admin options */}
                  {userInfo && userInfo.isAdmin && (
                        
                        <li className="nav-item dropdown">
                          <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Admin 
                          </Link>
                          <ul className="dropdown-menu">
                            <li><Link className="dropdown-item" to="/admin/userlist">Users</Link></li>
                            <li><Link className="dropdown-item" to="/admin/productlist">Products</Link></li>
                            <li><Link className="dropdown-item" to="/admin/orderlist">Orders</Link></li>
                          </ul> 
                        </li>
                  )}
                

                   
                  {/* <li className="nav-item dropdown d-none">
                    <Link
                      className="nav-link dropdown-toggle "
                      to="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Dropdown
                    </Link>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#">Action</a></li>
                      <li><a className="dropdown-item" href="#">Another action</a></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><a className="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                  </li> */}
                  
                </ul>
                {/* replace with searchbox component 
                  <form className="d-flex" role="search">
                    <input
                      className="form-control me-2"
                      type="search"
                      placeholder="Search"
                      aria-label="Search"
                    />
                    <button className="btn btn-outline-success " type="submit">Search</button>
                  </form> 
                */}
                <SearchBox />
              </div>
            </div>
          </nav>
          
        </header>
      </div>
    </section>
  );
}

export default Header;
