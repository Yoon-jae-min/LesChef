//기타
import React from "react";

//CSS
import styles from "../../../CSS/customer/show/common/show.module.css";

//컴포넌트
import CustomerInfoBox from "../info/box";
import CustomerRecipeBox from "../recipe/common/box";
import CustomerFoodsBox from "../foods/box";
import CustomerWishListBox from "../wishList/box";

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