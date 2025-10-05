import React from 'react';
import {Spinner} from 'react-bootstrap';

function Loader() {
  return (
    <Spinner
        animation="border"
        style={{
            display: 'block',
            margin: 'auto',

            width: '100px',
            height: '100px',
            borderWidth: '5px',
        }}
        className='text-secondary fff'
    >  

        <span className='sr-only '> Loading...</span>

    </Spinner>


  );
}

export default Loader;