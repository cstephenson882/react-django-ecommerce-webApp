import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails, payOrder, deliverOrder } from '../actions/OrderActions';

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

// order Constants
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
  
} from '../constants/orderConstants';

function OrderScreen() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, error, order } = orderDetails;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  console.log("userInfo in OrderScreen:", userInfo);
//

  let itemsPrice = 0;
  if (order && order.orderItems) {
    itemsPrice = Number(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    ).toFixed(2);
  }

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
    // dispatch(getOrderDetails(id));
    if (!order || order._id !== Number(id) || !successPay || successDeliver) {
      dispatch(getOrderDetails(id));
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      // alert(successPay)
    }
  }, [dispatch, order, id, successPay,successDeliver]);

  const successPaymentHandler = (details, data) => {
    dispatch(payOrder(id, { ...details, orderID: data.orderID }));
   
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading || !order.orderItems || !order.user? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) :  (
    <div>
      <h1 className="px-3" style={{ border: '1px solid #ccc', backgroundColor: '#f8f9fa' }}>
        Order: {order._id}
      </h1>

      <div className="row d-flex justify-content-between">
        <div className="col-md-7">
          <div className="list-group list-group-flush">
            <div className="list-group-item">
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>{' '}
                {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
                {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">Delivered on {order.deliveredAt}</Message>
              ) : (
                <Message variant="warning">Not Delivered</Message>
              )}
              {/* <p><strong>Name:</strong> {order.user.name}</p>  */}
              <p> 
                <strong>Name:</strong>{' '}
                  <Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/profile/${order.user._id}`}>
                    {order.user.name}
                  </Link>

              </p>
              <p>
                <strong>Email:</strong>{' '}
                  <Link style={{ textDecoration: 'none', color: 'inherit' }} to={`mailto:${order.user.email}`}>
                    {order.user.email}
                  </Link>
              </p>
            </div>

            <div className="list-group-item">
              <h2>Payment Method</h2>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="warning">Not Paid</Message>
              )}
              <p className="m-0">
                <strong>Method:</strong> {order.paymentMethod}
              </p>
            </div>

            <div className="list-group-item">
              <h2>Order Items</h2>
              <div className="list-group list-group-flush">
                {order.orderItems.length > 0 ? (
                  order.orderItems.map((item) => (
                    <div className="list-group-item" key={item.product}>
                      <div className="row">
                        <div className="col md-1">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded img-thumbnail"
                            style={{ width: '3rem', height: '3rem' }}
                          />
                        </div>
                        <div className="col">
                          <Link to={`/product/${item.product}`}>{item.name}</Link>
                        </div>
                        <div className="col d-flex justify-content-center">
                          <span>
                            {item.qty} x (${item.price})
                          </span>
                        </div>
                        <div className="col">
                          <span>${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <Message variant="info">No Order Items</Message>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="list-group">
            <div className="list-group-item">
              <h2>Order Summary</h2>
            </div>
            <div className="list-group-item">
              <div className="row">
                <div className="col">Items:</div>
                <div className="col">${itemsPrice}</div>
              </div>
            </div>

            <div className="list-group-item">
              <div className="row">
                <div className="col">Shipping:</div>
                <div className="col">{order.shippingPrice}</div>
              </div>
            </div>

            <div className="list-group-item">
              <div className="row">
                <div className="col">Tax:</div>
                <div className="col">{order.taxPrice}</div>
              </div>
            </div>

            <div className="list-group-item">
              <div className="row">
                <div className="col">Total:</div>
                <div className="col">{order.totalPrice}</div>
              </div>
            </div>

            {!order.isPaid && (
              <div className="list-group-item">
                {loadingPay && <Loader />}
                < PayPalScriptProvider 
                    options={{ 'client-id': 'ATCYnow1zkcFNMMlGWIKLYCGlr_2pPsiNdiGd1v3XtPP6uO6U9i6HSDprihxVDT5yosHqY9vgXzc-dgk', 
                               currency: 'USD', 
                               components: 'buttons',
                            'disable-funding': 'card,credit',
                                intent: 'capture'  }}
                               
                  
                >
    
                  <PayPalButtons
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: order.totalPrice,
                            },
                          },  
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      const details = await actions.order.capture();
                      successPaymentHandler(details, data);
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            )}
          </div>
           
          <div className="list-group-item">
            {loadingDeliver && <Loader />}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <button
                type="button"
                className="btn w-100 mt-2 btn-block btn-secondary"
                onClick={deliverHandler}
              >
                Mark As Delivered
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default OrderScreen;
