import React, { useEffect, useState } from "react";
import MyInfoHeadImg from "../../Image/CustomerImage/Background/myInfoHeader.jpg";
import MyRecipeHeadImg from "../../Image/CustomerImage/Background/myRecipeHeader.png";
import MyFoodsHeadImg from "../../Image/CustomerImage/Background/myFoodsHeader.jpg";
import WishListHeadImg from "../../Image/CustomerImage/Background/wishListHeader.jpg";

const CustomerShowHead = (props) => {
    const {category} = props;
    const [headImgUrl, setHeadImgUrl] = useState(MyInfoHeadImg);
    const [headText, setHeadText] = useState("My Info");

    useEffect(() => {
        if(category === "My Info"){
            setHeadImgUrl(MyInfoHeadImg);
            setHeadText("My Info");
        }else if(category === "My Recipe"){
            setHeadImgUrl(MyRecipeHeadImg);
            setHeadText("My Recipe");
        }else if(category === "My Foods"){
            setHeadImgUrl(MyFoodsHeadImg);
            setHeadText("My Foods");
        }else if(category === "Wish List"){
            setHeadImgUrl(WishListHeadImg);
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