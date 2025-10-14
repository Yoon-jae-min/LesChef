//기타
import React from "react";

//CSS
import styles from "../../../CSS/customer/show/foods/foods.module.css";

const Head = () => {
    return(
        <div className={styles.head}>
            <div className={styles.orderBox}>
                <button className={styles.orderBtn} type="button">수량순</button>
                <button className={styles.orderBtn} type="button">기한순</button>
            </div>
        </div>
    )
}

export default Head;