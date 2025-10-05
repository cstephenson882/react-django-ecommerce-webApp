import React from 'react'
import Rating from './Review'
import { Link } from 'react-router-dom'
import '../index.css';

function ProductCard({product}) {
  return (
    <div className="card col-md-3  m-3 text-sm-start text-center p-2 bbb" 
      style={{ transition: "box-shadow 0.3s ease-in-out" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                
                <Link to={`/product/${product._id}`}><img src={product.image} className="card-img-top img-fluid" alt={product.name} /></Link>  
                
                <div className="card-body d-flex flex-column justify-content-between">
                  <Link to={`/product/${product._id}`}><h5 className="card-title">{product.name}</h5></Link>
                  
                  <p className="card-text">{product.description}</p>
                  <Rating value={product.rating} text = {`from ${product.numReviews} reviews`} color={'#f8e825'} />
                  <p className="card-text h3">${product.price}</p>
                  

                </div>
                <a href="#" className="btn btn-primary">Go somewhere</a>
              </div>
  )
}

export default ProductCard
