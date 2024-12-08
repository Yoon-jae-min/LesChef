import React from "react";
import ShowHead from "./header";
import CustomerShowBody from "./body";

const CustomerShowBox = (props) => {
    const {category} = props;

    return(
        <div className="customerShowBox">
            <ShowHead category={category}/>
            <CustomerShowBody category={category}/>
        </div>
    )
}

export default CustomerShowBox;