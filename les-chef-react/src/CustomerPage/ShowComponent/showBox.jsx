import React from "react";
import ShowHead from "./showHeader";

const CustomerShowBox = (props) => {
    const {category} = props;

    return(
        <div className="customerShowBox">
            <ShowHead category={category}/>
        </div>
    )
}

export default CustomerShowBox;