//기타
import React from "react";

//CSS
import styles from "../../../CSS/customer/show/common/show.module.css";

//컴포넌트
import CustomerInfoBox from "../InfoBox/infoBox";
import CustomerRecipeBox from "../RecipeBox/common/recipeBox";
import CustomerFoodsBox from "../FoodsBox/foodsBox";
import CustomerWishListBox from "../WishListBox/wishListBox";

const CustomerShowBody = (props) => {
    const { category } = props;

    return(
        <div className={styles.body}>
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