import React, {useEffect} from "react";
import CategoryText from "./MainElement/mainCategoryText";

const MenuModal = (props) => {
    const {menuModal} = props;

    return (
        <section id="mainMenuModal" style={{ opacity: menuModal ? '1' : '0' }}>
            <CategoryText menuModal={menuModal}/>
        </section>
    )
}

export default MenuModal;