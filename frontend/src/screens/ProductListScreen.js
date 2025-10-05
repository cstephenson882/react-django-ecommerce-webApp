import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import { useSearchParams } from 'react-router-dom'

import FormContainer from '../components/FormContainer'
import { useLocation, useNavigate } from 'react-router-dom'

import { listProducts, 
        deleteProduct,
        createProduct } from '../actions/ProductActions'

import { PRODUCT_CREATE_RESET } from '../constants/productConstants'


function ProductListScreen() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const location = useLocation()

    const productList = useSelector(state => state.productList)
    const { loading, error, products, page, pages } = productList

    const productDelete = useSelector(state => state.productDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete

    // to create a new product
    const productCreate = useSelector(state => state.productCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate
    
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';
    const pageNumber = searchParams.get('page') || 1;

    // const safeUsers = Array.isArray(users) ? users : []

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const deleteHandler = (id) => {
        // console.log('delete product', id)
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id))
            dispatch(listProducts())
            
           
        }

    }

    const createProductHandler = (product) => {
        dispatch(createProduct())
    }

    useEffect(() => {
        // dispatch the list of users
        if (!userInfo.isAdmin) {
            navigate('/login') 
        }   
        if (successCreate) {
            navigate(`/admin/product/${createdProduct._id}/edit`)
            dispatch({ type: PRODUCT_CREATE_RESET })
        } else {
            dispatch(listProducts(keyword, pageNumber))
        }

        // Reset delete success so listUsers doesn't refetch endlessly
        // if (successDelete) {
        //     dispatch({ type: 'USER_DELETE_RESET' })
        // }
        
    }, [dispatch, navigate, successDelete, successCreate, createdProduct, userInfo, pageNumber])
 
    

    return (
        <div>
          {/* create a row with 'Products' and align items center */}
          <div className='row align-items-center'>
            <div className='col-md-6'>
              <h1>Products</h1>
            </div>
            <div className='col-md-6 text-end'>
              <button
                className='btn btn-primary my-3'
                onClick={() => createProductHandler()}
              >
                <i className='fas fa-plus'></i> Create Product
              </button>
            </div>
          </div>
          {loadingDelete && <Loader />}
          {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

          {loadingCreate && <Loader />}
          {errorCreate && <Message variant='danger' > {errorCreate} </Message>}
      
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>{error}</Message>
          ) : (
            <table className='table border table-hover'>
              <thead className='table-dark'>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>CATEGORY</th>
                  <th>BRAND</th>
                  <th></th> {/* empty header for edit/delete buttons */}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(products) &&
                  products.map((product) => (
                    <tr key={product._id}>
                      <td>{product._id}</td>
                      <td>{product.name}</td>
                      <td>${product.price}</td>
                      <td>{product.category}</td>
                      <td>{product.brand}</td>
                      <td>
                        <Link
                          to={`/admin/product/${product._id}/edit`}
                          className='btn btn-light btn-sm'
                        >
                          <i className='fas fa-edit'></i>
                        </Link>
                        <button
                          className='btn btn-danger btn-sm mx-3'
                          onClick={() => deleteHandler(product._id)}
                        >
                          <i className='fas fa-trash' style={{ color: 'white' }}></i>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
          <Paginate pages={pages} page={page} isAdmin={true} keyword={keyword ? keyword : ''} />
        </div>
      )
    }      

export default ProductListScreen
