import React from "react";
import { useConfig } from "../../../../../Context/configContext";

const IngredientEach = (props) => {
    const { eachId, sectionId, ingreEachDel, ingreEachUpD, ingreName, ingreVolume, ingreUnit } = props
    const {serverUrl} = useConfig();

    return(
        <div className="cusWrIngreEach">
            <input 
                type="text" 
                placeholder="재료명" 
                className="cusIngreEachName cusIngreEachInput" 
                value={ingreName}
                onChange={(e) => ingreEachUpD(sectionId, eachId, {ingreName: e.target.value})}/>
            <input 
                type="text" 
                placeholder="수량" 
                className="cusIngreEachVolume cusIngreEachInput"
                value={ingreVolume}
                onChange={(e) => ingreEachUpD(sectionId, eachId, {ingreVolume: e.target.value})}/>
            <input 
                type="text" 
                placeholder="단위" 
                className="cusIngreEachPortion cusIngreEachInput"
                value={ingreUnit}
                onChange={(e) => ingreEachUpD(sectionId, eachId, {ingreUnit: e.target.value})}/>
            <img onClick={() => ingreEachDel(sectionId, eachId)} className="cusIngreEachDel" src={`${serverUrl}/Image/CommonImage/delete.png`}/>
        </div>
    )
}

export default IngredientEach;