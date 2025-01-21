//기타
import React from "react";

//CSS
import styles from "../../../CSS/customer/show/foods/unit.module.css";

//컨텍스트
import { useConfig } from "../../../Context/config";

const Unit = (props) => {
    const {food} = props;
    const {serverUrl} = useConfig();

    return(
        <div className={styles.box}>
            <div className={styles.nameBox}>
                <p className={styles.name}>{food.name}</p>
                <img className={styles.menuBtn} src={`${serverUrl}/Image/CommonImage/more.png`}/>
            </div>
            <div className={styles.amountBox}>
                <div className={styles.amountLabel}>수량</div>
                <div className={styles.amount}>
                    <span className={styles.volume}>{food.volume}</span>
                    <span className={styles.unit}>{food.unit}</span>
                </div>
            </div>

            <div className={styles.dateBox}>
                <p className={styles.dateLabel}>유통기한</p>
                <p className={styles.date}>{food.expirate.toISOString().split("T")[0]}</p>
            </div>

            { false && <div className={styles.menu}></div>}
        </div>
    )
}

export default Unit;