import React from "react";

const InfoIconBoxEach = (props) => {
    const { infoIconImg, infoIconText } = props;
    
    return(
        <div className="infoIconBoxEach">
            <img className="infoIconImg" src={infoIconImg}/>
            <p className="infoIconText">{infoIconText}</p>
        </div>
    )
}

export default InfoIconBoxEach;