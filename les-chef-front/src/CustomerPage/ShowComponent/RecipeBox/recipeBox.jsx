import React from "react";
import RecipeHead from "./Head/head";
import RecipeBody from "./Body/body";

const CustomerRecipeBox = () => {
    return(
        <div className="customerRecipeBox">
            <RecipeHead/>
            <RecipeBody/>
        </div>
    )
}

export default CustomerRecipeBox;