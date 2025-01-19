//기타
import React from "react";

//CSS
import styles from "../../../CSS/customer/show/foods/unit.module.css";

//컨텍스트
import { useConfig } from "../../../Context/config";

const Unit = () => {
    const {serverUrl} = useConfig();

    return(
        <div className={styles.box}>
            <div className={styles.nameBox}>
                <p className={styles.name}>당근</p>
                <img className={styles.menuBtn} src={`${serverUrl}/Image/CommonImage/more.png`}/>
            </div>
            <div className={styles.amountBox}>
                <div className={styles.amountLabel}>수량</div>
                <div className={styles.amount}>
                    <span className={styles.volume}>2</span>
                    <span className={styles.unit}>개</span>
                </div>
            </div>

            <div className={styles.dateBox}>
                <p className={styles.dateLabel}>유통기한</p>
                <p className={styles.date}>2025-11-01</p>
            </div>

            { false && <div className={styles.menu}></div>}
        </div>
    )
}

export default Unit;