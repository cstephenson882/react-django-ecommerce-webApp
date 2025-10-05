import React, { useState } from "react";
import { Col } from "react-bootstrap"; // Import only if needed

function ProductQty({ countInStock = 0 }) { // 
    const [qty, setQty] = useState(1); //

    return (
        <Col xs="auto" className="my-1">
            <select
                className="form-control"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                disabled={countInStock === 0} // 
            >
                {[...Array(countInStock).keys()].map(i => (
                    <option key={i + 1} value={i + 1}>
                        {i + 1}
                    </option>
                ))}
            </select>
        </Col>
    );
}

export default ProductQty;
