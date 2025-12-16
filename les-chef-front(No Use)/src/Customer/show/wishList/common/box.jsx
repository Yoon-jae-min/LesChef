//기타
import React, {useEffect, useState} from "react";

//CSS
import styles from "../../../../CSS/customer/show/reicpe/common/recipe.module.css";

//컴포넌트
import Head from "./head";
import Body from "./body";

const CustomerWishListBox = (props) => {
    const {category} = props;
    const [listPage, setListPage] = useState(true);

    return(
        <div className={styles.box}>
            <Head listPage={listPage} setListPage={setListPage}></Head>
            <Body listPage={listPage} setListPage={setListPage} category={category}></Body>
        </div>
    )
}

export default CustomerWishListBox;