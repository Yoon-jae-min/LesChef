//기타
import React, { useEffect, useState } from "react";

//CSS
import styles from "../../../CSS/customer/show/common/show.module.css";

//컨텍스트
import { useConfig } from "../../../Context/config";

const CustomerShowHead = (props) => {
    const {category} = props;
    const {serverUrl} = useConfig();
    const [headImgUrl, setHeadImgUrl] = useState(`${serverUrl}/Image/CustomerImage/Background/myInfoHeader.jpg`);
    const [headText, setHeadText] = useState("My Info");

    useEffect(() => {
        if(category === "My Info"){
            setHeadImgUrl(`${serverUrl}/Image/CustomerImage/Background/myInfoHeader.jpg`);
            setHeadText("My Info");
        }else if(category === "My Recipe"){
            setHeadImgUrl(`${serverUrl}/Image/CustomerImage/Background/myRecipeHeader.png`);
            setHeadText("My Recipe");
        }else if(category === "My Foods"){
            setHeadImgUrl(`${serverUrl}/Image/CustomerImage/Background/myFoodsHeader.jpg`);
            setHeadText("My Foods");
        }else if(category === "Wish List"){
            setHeadImgUrl(`${serverUrl}/Image/CustomerImage/Background/wishListHeader.jpg`);
            setHeadText("Wish List");
        }
    }, [category]);
    
    return(
        <div className={styles.head}>
            <img className={styles.headImg} src={headImgUrl}/>
            <p className={styles.headText}>{headText}</p>
        </div>
    )
};

export default CustomerShowHead;