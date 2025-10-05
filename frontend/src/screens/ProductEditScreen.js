import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

import Message from '../components/Message'
import Loader from '../components/Loader'

import FormContainer from '../components/FormContainer'


import { listProductDetails, updateProduct } from '../actions/ProductActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

import axios from 'axios'
import { Form, Button } from 'react-bootstrap'



function ProductEditScreen() {

    const navigate = useNavigate();
    // const location = useLocation();
    
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    // for image upload
    const [uploading, setUploading] = useState(false); 
    

  
    // const [password, setPassword] = useState('');
    // const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    // get the id from the url
    const { productID } = useParams();
    
    

        

    // get the product details from the state
    const productDetails = useSelector(state => state.productDetails);
    const {loading, error, product} = productDetails;

    // get the product update state
    const productUpdate = useSelector(state => state.productUpdate);
    const {loading: loadingUpdate, error: errorUpdate, success: successUpdate} = productUpdate;


    const dispatch = useDispatch();

    useEffect(() => {
        
        // dispatch({ type: PRODUCT_UPDATE_RESET });
        if (successUpdate) {
            navigate('/admin/productlist');
        }
        else {
            if (!product || !product.name || product._id !== Number(productID)) {
            
                dispatch(listProductDetails(Number(productID)))
                // alert(`number: ${productID}`)

                // alert(`name: ${product.name}`)
            } else {
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setBrand(product.brand)
                setCategory(product.category)
                setCountInStock(product.countInStock)
                setDescription(product.description)
                
            }
            
        }
        
    }, [dispatch, navigate, productID, product, successUpdate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateProduct(
            {  // product object
                _id: productID,
                name,
                price,
                image,
                brand,
                category,
                description,
                countInStock
            }
        ))
        
    };

    const uploadFileHandler = async (e) => {
        console.log("file is being uploaded...");
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('product_id', productID);
       
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            const { data } = await axios.post('/api/products/upload/', formData, config);

            setImage(data);
            setUploading(false);
        } catch (error) {
            setUploading(false);
        }
    }




    
  return (
    <div> 
        <Link to='/admin/productlist' className='btn btn-light my-3'>Go Back</Link>

        <FormContainer>

        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

       {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
            <form onSubmit={submitHandler} >
                    
                {/*  for the name input make it required */}
                <div className="form-group" >
                    <label htmlFor="name">Name</label>
                    <input type="name"  className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} aria-describedby="nameHelp" placeholder="Enter name" />
                </div>

                {/* input for price */}
                <div className="form-group" >
                    <label htmlFor="price">Price</label>
                    <input type="number"  className="form-control" id="price" value={price} onChange={(e) => setPrice(e.target.value)} aria-describedby="priceHelp" placeholder="Enter price" />
                </div>
                {/* input for image */}
                <div className="form-group" >
                    <label htmlFor="image">Image URL</label>
                    <input type="text"  className="form-control" id="image" value={image} onChange={(e) => setImage(e.target.value)} aria-describedby="imageHelp" placeholder="Enter image URL" />
                    <input 
                        className="form-control"
                        type="file" 
                        id="image-file" 
                        label="Choose File" 
                        custom onChange={uploadFileHandler} 
                    />
                    {uploading && <Loader />}
                    
                    

                </div>
                {/* input for brand */}
                <div className="form-group" >
                    <label htmlFor="brand">Brand</label>
                    <input type="text"  className="form-control" id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} aria-describedby="brandHelp" placeholder="Enter brand" />
                </div>
                {/* input for category */}
                <div className="form-group" >
                    <label htmlFor="category">Category</label>
                    <input type="text"  
                        className="form-control" 
                        id="category" value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        aria-describedby="categoryHelp" 
                        placeholder="Enter category" 
                    />
                </div>
                {/* input for countInStock */}
                <div className="form-group" >
                    <label htmlFor="countInStock">Count In Stock</label>
                    <input type="number"  className="form-control" id="countInStock" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} aria-describedby="countInStockHelp" placeholder="Enter countInStock" />
                </div>
                {/* input for description */}
                <div className="form-group" >
                    <label htmlFor="description">Description</label>
                    <textarea type="text"  className="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)} aria-describedby="descriptionHelp" placeholder="Enter description" />
                </div>
               

                <button type="submit" class="btn btn-dark mt-3 " style={{width:"100%"}} >Update</button>

            </form>
        )}

        </FormContainer>
    
</div>
  )
}

export default ProductEditScreen

