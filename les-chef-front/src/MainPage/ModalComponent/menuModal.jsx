import React, {useEffect} from "react";
import CategoryText from "../CommonComponent/Text/categoryText";

const MenuModal = (props) => {
    const {menuModal} = props;

    return (
        <section id="mainMenuModal" style={{ opacity: menuModal ? '1' : '0' , pointerEvents: menuModal ? 'auto' : 'none'}}>
            <CategoryText menuModal={menuModal}/>
        </section>
    )
}

export default MenuModal;