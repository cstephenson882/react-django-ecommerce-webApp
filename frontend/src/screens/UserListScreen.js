import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'

import FormContainer from '../components/FormContainer'
import { useLocation, useNavigate } from 'react-router-dom'

import { listUsers, deleteUser } from '../actions/UserActions'


function UserListScreen() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const location = useLocation()

    const userList = useSelector(state => state.userList)
    const { loading, error, users } = userList

    // const safeUsers = Array.isArray(users) ? users : []

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin


    // wher our user is deleted we need to refresh the list of users
    const userDelete = useSelector(state => state.userDelete)
    const {success: successDelete} = userDelete

    const deleteHandler = (id) => {
        console.log('delete user', id)
        if (window.confirm('Are you sure?')) {
            dispatch(deleteUser(id))
            dispatch(listUsers())
            
           
        }

    }

    useEffect(() => {
        // dispatch the list of users
        if (userInfo && userInfo.isAdmin) {
            dispatch(listUsers())
        } else {
            navigate('/login')
        }

        // Reset delete success so listUsers doesn't refetch endlessly
        if (successDelete) {
            dispatch({ type: 'USER_DELETE_RESET' })
        }
        
    }, [dispatch, navigate, userInfo, successDelete])
 
    

  return loading  ? <Loader /> 
    :error ? <Message variant='danger'>{error}</Message> 
    :  (
    <div>
    
        <h1>Users</h1>
        <table className='table border table-hover'>
            <thead className='table-dark'>
                <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>ADMIN</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                
                { Array.isArray(users)  && users.map(user => (
                    <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.isAdmin ? (<i className='fas fa-check' style={{ color: 'green' }}></i>) : (<i className='fas fa-times' style={{ color: 'red' }}></i>)}</td>
                        <td>
                            <Link to={`/admin/user/${user._id}/edit`} className='btn btn-light btn-sm'><i className='fas fa-edit'></i></Link> 
                            <button className='btn btn-danger btn-sm mx-3' onClick={() => deleteHandler(user._id) }> <i className='fas fa-trash' style={{ color: 'white' }}></i></button>
                        </td>
                    </tr>
                )
            
            ) }
            </tbody>

        </table>
    </div>
  )
}

export default UserListScreen
