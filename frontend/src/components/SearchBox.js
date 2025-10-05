import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { listProducts } from '../actions/ProductActions'


function SearchBox() {

    // const { id: productId } = useParams(); // Get product ID from URL and assign as variable name 'productId'
    const location = useLocation(); // Get query string
    const navigate = useNavigate(); // Replaces history

    const [keyword, setKeyword] = useState('');
    // i need the submit hadler to update the url to push /?keyword=whatever
    // then the HomeScreen will pick it up from the url and filter the products accordingly
    // so the search box is independent of the HomeScreen

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/?keyword=${keyword}`);
        } else {
            navigate(navigate(location.pathname));
        }  
    }

    const handleChange = (e) => {
        setKeyword(e.target.value);
        if (e.target.value === '') {
            navigate(navigate(location.pathname));
        }
        else if (e.target.value.trim().length > 2) {
            navigate(`/?keyword=${e.target.value}&page=1`);
        }
        
    }

    return (
        <div>
            {/* also make for inline */}
            <form className="d-flex"  role="search" onSubmit={(e) => {submitHandler(e)}} display="inline"> 
                <input 
                    className="form-control me-2 mr-sm-2 ml-sm-5" 
                    type="search" placeholder="Search" 
                    aria-label="Search" 
                    onChange={(e) => {handleChange(e)}}
                />
                <button 
                    className="btn btn-outline-success p-2" 
                    type="submit"
                    // variant='outline-success'
                    > Search
                </button>
            </form>
        
        </div>
    )
}

export default SearchBox
