import React from "react";
import RecipeHead from "./Head/customerRecipeHead";
import RecipeBody from "./Body/customerRecipeBody";

const CustomerRecipeBox = () => {
    return(
        <div className="customerRecipeBox">
            <RecipeHead/>
            <RecipeBody/>
        </div>
    )
}

export default CustomerRecipeBox;