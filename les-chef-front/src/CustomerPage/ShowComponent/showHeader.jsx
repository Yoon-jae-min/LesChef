import React, { useEffect, useState } from "react";

const CustomerShowHead = (props) => {
    const {category} = props;
    const [headImgUrl, setHeadImgUrl] = useState("/Image/CustomerImage/Background/myInfoHeader.jpg");
    const [headText, setHeadText] = useState("My Info");

    useEffect(() => {
        if(category === "My Info"){
            setHeadImgUrl("/Image/CustomerImage/Background/myInfoHeader.jpg");
            setHeadText("My Info");
        }else if(category === "My Recipe"){
            setHeadImgUrl("/Image/CustomerImage/Background/myRecipeHeader.png");
            setHeadText("My Recipe");
        }else if(category === "My Foods"){
            setHeadImgUrl("/Image/CustomerImage/Background/myFoodsHeader.jpg");
            setHeadText("My Foods");
        }else if(category === "Wish List"){
            setHeadImgUrl("/Image/CustomerImage/Background/wishListHeader.jpg");
            setHeadText("Wish List");
        }
    }, [category]);
    
    return(
        <div className="customerShowHead">
            <img className="customerHeadImg" src={headImgUrl}/>
            <p className="customerHeadText">{headText}</p>
        </div>
    )
};

export default CustomerShowHead;