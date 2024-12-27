//기타
import React from "react";

//컴포넌트
import CustomerInfoBox from "./InfoBox/infoBox";
import CustomerRecipeBox from "./RecipeBox/recipeBox";
import CustomerFoodsBox from "./FoodsBox/foodsBox";
import CustomerWishListBox from "./WishListBox/wishListBox";

const CustomerShowBody = (props) => {
    const { category } = props;

    return(
        <div className="customerShowBody">
            { (category === "My Info") && 
                <CustomerInfoBox/> }
            { (category === "My Recipe") && 
                <CustomerRecipeBox/> }
            { (category === "My Foods") && 
                <CustomerFoodsBox/> }
            { (category === "Wish List") && 
                <CustomerWishListBox/> }

        </div>
    )
}

export default CustomerShowBody;