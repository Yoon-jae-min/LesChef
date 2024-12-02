import React from "react";
import ShowHead from "./showHeader";
import CustomerShowBody from "./showBody";

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