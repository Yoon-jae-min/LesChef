import React from "react";

const IngredientEach = (props) => {
    const { eachId, sectionId, ingreEachDel } = props

    return(
        <div className="cusWrIngreEach">
            <input type="text" placeholder="재료명" className="cusIngreEachName cusIngreEachInput"/>
            <input type="text" placeholder="수량" className="cusIngreEachVolume cusIngreEachInput"/>
            <input type="text" placeholder="단위" className="cusIngreEachPortion cusIngreEachInput"/>
            <img onClick={() => ingreEachDel(sectionId, eachId)} className="cusIngreEachDel" src="/Image/CommonImage/delete.png"/>
        </div>
    )
}

export default IngredientEach;