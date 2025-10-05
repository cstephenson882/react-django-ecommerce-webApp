import React from 'react'


function Rating({value, text, color}) {
    let stars = [];
    let remaining = value;
    for (let i=0; i<5; i++) {
        if (remaining >= 1) {
            stars.push(<i key={i} className='fas fa-star' style ={{color: color}}></i>);
            remaining -= 1;
        } else if (remaining === 0.5){
            stars.push(<i key={i} className='fas fa-star-half-alt' style ={{color: color}}></i>);
            remaining -= 0.5;
        } else {
            stars.push(<i key={i} className='far fa-star' style ={{color: color}}></i>);
        }

            
    }

  return (
    <div className='rating py-2'>  
        <span className='stars '>{stars} </span>   
            <span className='text-secondary'> {text && text} </span>
        
    </div>
  )
}

export default Rating
