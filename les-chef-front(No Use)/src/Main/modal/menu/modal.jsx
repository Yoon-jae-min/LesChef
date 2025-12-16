//기타
import React from "react";

//CSS
import styles from "../../../CSS/main/modal/menu.module.css";

//컴포넌트
import CategoryText from "./text";

const MenuModal = (props) => {
    const {menuModal} = props;

    return (
        <section 
            className={styles.body} 
            style={{ opacity: menuModal ? '1' : '0' , pointerEvents: menuModal ? 'auto' : 'none'}}
            >
            <CategoryText menuModal={menuModal}/>
        </section>
    )
}

export default MenuModal;