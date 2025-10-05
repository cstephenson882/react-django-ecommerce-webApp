// import React, { useState, useEffect } from 'react'


// import { Pagination } from 'react-bootstrap';
// import { LinkContainer } from 'react-router-bootstrap';
// // import { Router } from 'react-router-dom';
// import { Link } from 'react-router-dom';


// function Paginate({pages, page, keyword ='', isAdmin = false}) { 
//   return (
//     pages > 1 && (
        
//         <Pagination>
//             {[...Array(pages).keys()].map((x) => (
//                 <Link key={x + 1} to={`/?keyword=${keyword}/page/${x + 1}`}>
//                     <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>

//                 </Link>
                
//             ))}
             
//         </Pagination>
       
//     )
      
//   )
// }

// export default Paginate



import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";

function Paginate({ pages, page, keyword = "", isAdmin = false }) {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => {
          const pageNumber = x + 1;
        //   check first if isAdmin is true
        //   const url =  keyword
        //     ? `/?keyword=${keyword}&page=${pageNumber}`
        //     : `/?keyword=&page=${pageNumber}`;
            let url = '';
            if (isAdmin) {
              url = `/admin/productlist/?keyword=${keyword}&page=${pageNumber}`;
            } else {
              url = `/?keyword=${keyword}&page=${pageNumber}`;
            }

            // const url = keyword ? isAdmin
            //     ? `/admin/productlist/?keyword=${keyword}&page=${pageNumber}`
            //     : `/?keyword=${keyword}&page=${pageNumber}`
            //     : `/productlist/?keyword=&page=${pageNumber}`

          return (
            <Pagination.Item
              key={pageNumber}
              active={pageNumber === page}
              as={Link}   // render as a Link
              to={url}    // navigation
            >
              {pageNumber}
            </Pagination.Item>
          );
        })}
      </Pagination>
    )
  );
}

export default Paginate;

