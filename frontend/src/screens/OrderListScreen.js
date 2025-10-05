import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'

import FormContainer from '../components/FormContainer'
import { useLocation, useNavigate } from 'react-router-dom'

import { listOrders } from '../actions/OrderActions'


function OrderListScreen() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const location = useLocation()

    const orderList = useSelector(state => state.orderList)
    const { loading, error, orders } = orderList

    // const safeUsers = Array.isArray(users) ? users : []

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin


    useEffect(() => {
        // dispatch the list of users
        if (userInfo && userInfo.isAdmin) {
            dispatch(listOrders())
        } else {
            navigate('/login')
        }

        
    }, [dispatch, navigate, userInfo ])
 
    

  return loading  ? <Loader /> 
    :error ? <Message variant='danger'>{error}</Message> 
    :  (
    <div>
    
        <h1>Orders</h1>
        <table className='table border table-hover'>
            <thead className='table-dark'>
                <tr>
                    <th>ID</th>
                    <th>USER</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAYED</th>
                    <th>DELIVERED</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                
                { Array.isArray(orders)  && orders.map(order => (
                    <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.user && order.user.name}</td>
                        <td>{order.createdAt.substring(0, 10)}</td>
                        <td>${order.totalPrice}</td>
                        <td>{order.isPaid ? 
                            order.paidAt.substring(0, 10) 
                            : <i className='fas fa-check' style={{ color: 'red' }}></i> }
                        </td>
                        
                       

                        <td>{order.isDelivered ? 
                            order.deliveredAt.substring(0, 10) 
                            : <i className='fas fa-check' style={{ color: 'red' }}></i> }
                        </td>

                         <td>  <Link to={`/admin/orders/${order._id}`} className='btn btn-light btn-sm'>Details</Link> </td>  
                       
                    </tr>
                )
            
            ) }
            </tbody>

        </table>
    </div>
  )
}

export default OrderListScreen
