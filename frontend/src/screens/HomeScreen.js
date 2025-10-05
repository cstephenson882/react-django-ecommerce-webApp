// HomeScreen.js

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';


// useSelector and useDispatch are hooks: useSelector is used to access specific parts of the state in the store, useDispatch is used to dispatch actions
import { useDispatch, useSelector} from 'react-redux'
import { listProducts } from '../actions/ProductActions'

import ProductCard from '../components/ProductCard';

import Loader from '../components/Loader'
import Message from '../components/Message'

import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';

// import products from '../products';         // Replace with your actual product data using an API and axios below . the products array here was a .json file file saved as .js
// import axios from 'axios';                 // replaced with reducers and actions below v-1.0.5





function HomeScreen() {
  // const [products, setProducts] = useState([]); // replaced with reducers and actions below v-1.0.5

  // useEffect(() => {
  //   async function fetchProducts() {
  //     try {
  //       const { data } = await axios.get('/api/products/');
  //       setProducts(data);
  //     } catch (error) {
  //       console.error('Error fetching products:', error);
  //     }  
  //   }
  //   fetchProducts();
  //   dispatch(listProducts())
    
  // }, []);
  
  const dispatch = useDispatch(); // use to fire actions

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;
  
  // filter products based on search keyword from URL
  const location = useLocation();
  // const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const pageNumber = searchParams.get('page') || 1;
  // let keyword = location.search ? location.search.split('=')[1] : ''; 
  console.log("keyword:", keyword)

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
    
  }, [dispatch, keyword, pageNumber]);

  
  if (loading) {
    return <Loader />;
  } 
  if (error) {
    return <Message  message = {error}/>;
  }
  else {
    return (
      <section className=''>
        <div className="container">
          {!keyword && <ProductCarousel />}
          <h1  >Latest Products</h1>
          {/* {loading? true: <div><h2>Loading...</h2></div>} */}
          <div className="row d-flex justify-left">
          
            {products.map((product) => (
              
              <ProductCard product={product} key={product._id} />
              
            ))}
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
        </div>
      </section>
    );
  }
}

export default HomeScreen;