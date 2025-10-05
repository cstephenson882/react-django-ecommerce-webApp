    // ProductScreen.js
    import React from 'react';
    import { Link, useParams, useNavigate } from 'react-router-dom';
    import {useState, useEffect} from 'react';
    import axios from 'axios'                 // replaced with reducers and actions below v-1.0.5

    import { useDispatch, useSelector} from 'react-redux'
    import { listProductDetails, createProductReview } from '../actions/ProductActions'
    import { PRODUCT_REVIEW_CREATE_RESET } from '../constants/productConstants'
    
    // import ProductQty from '../components/ProductQty'


    import Loader from '../components/Loader'
    import Message from '../components/Message'

    // import products from '../products';         // Replace with your actual product data using an API and axios below v-1.0.0
    import Review from '../components/Review';

    function ProductScreen() {
        // const {id} = useParams();
        // //const product = products.find((p => p._id === id)) // replace with axios and async await below
        

        // //fetch product using axios and async await
        // const [product, setProduct] = useState([]);

        // useEffect(() => {
        //   async function fetchProduct() {
        //     try {
        //       const { data } = await axios.get(`/api/products/${id}`);
        //       setProduct(data);
        //     } catch (error) {
        //       console.error('Error fetching products:', error);
        //     }
        //   }
        //   fetchProduct();
        // }, []);


        // for the qty form  the param 1 means the default value
        const [qty, setQty] = useState(1);
        
        // for a review 
        const [rating, setRating] = useState(0);
        const [comment, setComment] = useState('');

        const {id} = useParams();
        
        const dispatch = useDispatch(); // use to fire actions

        // useSelector is used to access specific parts of the state in the store
        const productDetails = useSelector((state) => state.productDetails);
        const { loading, error, product } = productDetails;

        // user info 
        const userLogin = useSelector((state) => state.userLogin);
        const { userInfo } = userLogin;

        // review create
        const productReviewCreate = useSelector((state) => state.productReviewCreate);
        const {
            loading: loadingProductReview,
            error: errorProductReview,
            success: successProductReview,
        } = productReviewCreate;


        const navigate = useNavigate(); // Initialize navigate for redirection
        
        // console.log("productDetails:", productDetails);
    

        const submitHandle = (e)  => {
            e.preventDefault();
            dispatch(createProductReview(id, { rating, comment }) );
        }

        useEffect(() => {
            if (successProductReview){
                setRating(0);
                setComment('');
                dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
            }
            dispatch(listProductDetails(id));
             
        }, [dispatch, id, successProductReview]);
        

        const addToCartHandler = () => {
            // console.log(`add to cart: ${product.name},  ${id}`);
            navigate(`/cart/${id}?qty=${qty}`);
        }
        
        
        return (
            <section className=''>
            <div className="container px-0">
                <Link to='/' href='/' className='btn btn-light'>Go Back</Link>
                
                {
                    loading ? <Loader /> 
                    : error ? <Message  message = {error}/> 
                    : ( 
                        <div className="row py-md-5 py-3 f-flex justify-content-between g-3">

                            {/* product image */}
                            <div className="col-md-6  px-0  ">
                                <img src={product.image} alt={product.name} className='img-fluid '/>
                            </div>
                            {/* product details */}
                            <div className="col-md-3 ">
                                
                                <ul className="list-group list-group-flush" variant="flush">
                                    <li className="list-group-item"><h3>{product.name}</h3></li>
                                    <li className="list-group-item"><Review value = {product.rating} text = {`from ${product.numReviews} reviews`} color={'#f8e825'} />  </li>
                                    <li className="list-group-item">Description: {product.description}</li>
                                </ul>
                            </div>

                            {/* price, status and qty and add to cart section */}
                            <div className="col-md-3  ">
                                
                                <ul className="list-group">
                                    <li className="list-group-item"> 
                                        <div className='d-flex justify-content-md-between gap-sm-3'>
                                            <span>Price: </span>
                                            <span>${product.price}</span>
                                        </div>
                                    </li>

                                    <li className="list-group-item"> 
                                        <div className='d-flex justify-content-md-between gap-sm-3'>
                                            <span>Status: </span>
                                            <span>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                                        </div>
                                    </li>
                                    {
                                        product.countInStock > 0 ?
                                        (
                                            <li className="list-group-item">
                                                <div className='row d-flex align-items-md-center'>
                                                    <div className='col'>
                                                        <span>Qty: </span>
                                                    </div>
                                                    <div className='col'>
                                                    
                                                    <div className="form-group">
                                                        <label className ="sr-only" for="exampleFormControlSelect1">Select Amount</label>
                                                        <select
                                                            className="form-control"
                                                            value={qty}
                                                            onChange={(e) => setQty(Number(e.target.value))}
                                                            disabled={product.countInStock === 0} // 
                                                        >
                                                        {
                                                            [...Array(product.countInStock).keys()].map((x) => (
                                                                <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                            ))
                                                        }
                                                            
                                                        </select>
                                                    </div>
                                                        
                                                    </div>

                                                </div>
                                            </li> 
                                        ): null
                                    }
                                    
                                    
                                    <li className="list-group-item"> 
                                        <button 
                                            className="btn btn-secondary w-100" 
                                            type="button" 
                                            disabled = {product.countInStock === 0} 
                                            onClick= {addToCartHandler}
                                            >
                                            Add to Cart
                                        </button>
                                    </li>
                                </ul> 

                                
                            </div>
                        
                        {/* review section */}
                        <div className="row my-5">
                            <div className="col-md-6">
                                <h2>Reviews</h2>
                                {product.reviews.length === 0 && <Message variant='info' message={'No Reviews'}/>}
                                <ul className="list-group list-group-flush">
                                    {product.reviews.map((review) => (
                                        <li key={review._id} className="list-group-item">
                                            <strong>{review.name}</strong>
                                            <Review value = {review.rating} text = {''} color={'#f8e825'} />
                                            <p>{review.createdAt.substring(0,10)} </p>
                                            <p>{review.comment}</p>
                                        </li>
                                    ))}
                                    
                                    {/* write a review */}
                                    <li className="list-group-item">
                                        <h2>Write a Customer Review</h2>
                                        {loadingProductReview && <Loader />} 
                                        {successProductReview && (
                                            <Message variant='success' message = {'Review submitted successfully'}/>
                                        )}
                                        {errorProductReview && (
                                            <Message variant='danger' message = {errorProductReview}/>
                                        )}
                                        
                                        {userInfo  ? (
                                                <form
                                                    onSubmit={submitHandle}
                                                >
                                                    <div className="form-group my-3">
                                                        <label htmlFor="rating" className="form-label" >Rating</label>
                                                        <select 
                                                            id="rating"
                                                            value={rating}
                                                            onChange={(e) => setRating(e.target.value)}
                                                            className="form-control"
                                                            
                                                            
                                                            >
                                                            <option value="">Select...</option>
                                                            <option value="1">1- Poor</option>
                                                            <option value="2">2- Fair</option>
                                                            <option value="3">3- Good</option>
                                                            <option value="4">4- Very Good</option>
                                                            <option value="5">5- Excellent</option>
                                                        </select>
                                                
                                                    </div>
                                                    <div className="form-group my-3 ">
                                                        <label htmlFor="comment" className="form-label" >Comment</label>
                                                        <textarea
                                                            id="comment"
                                                            value={comment}
                                                            onChange={(e) => setComment(e.target.value)}
                                                            className="form-control"
                                                            rows="3"
                                                        ></textarea>
                                                    </div>
                                                    <div className="form-group my-3 col-md-6">
                                                        <button type="submit" className="btn btn-primary" disabled={loadingProductReview}> 
                                                            Submit
                                                        </button>
                                                    </div>

                                                </form>
                                            ): (
                                                <Message variant='info' message = {'Please '} >
                                                    <Link to = '/login'>sign in</Link> to write a review {' '}
                                                </Message>
                                            )
                                        }
                                        
                                    </li>

                                </ul> 
                                
                            </div>
                        </div>

                        </div>  /* overall row end*/
                        )
                }
                
                
                
                        
            
            </div>
            </section>
            
        ) 
        
    }

    export default ProductScreen
