import React from "react";
import IngredientEach from "./ingredientEach";

const IngredientSection = (props) => {
    const { sectionId, ingreSection, sectionName, ingreSectionDel, ingreSectionUpD, ingreEachAdd, ingreEachDel } = props;

    const changeSecName = (sectionName) => {
        ingreSectionUpD(sectionId, { sectionName: sectionName });
    }

    return(
        <div className="cusWrIngreSec">
            <div className="cusWrIngreSecHead">
                <input onChange={(e) => changeSecName(e.target.value)} value={sectionName} type="text" className="cusWrIngreSecHeadName" placeholder="재료 section name"/>
                <img onClick={() => ingreSectionDel(sectionId)} className="cusWrIngreSecHeadImg" src="/Image/CommonImage/delete.png"/>
            </div>
            {Array.isArray(ingreSection.ingreEachs) &&
                ingreSection.ingreEachs.map((each, index) => (
                    <IngredientEach 
                        key={index}
                        eachId={each.id}  
                        sectionId={sectionId}
                        ingreEachDel={ingreEachDel}
                    />
            ))}
            <div className="cusWrIngreEachPlus">
                <img onClick={() => ingreEachAdd(sectionId)} className="cusWrIngreEachAddImg" src="/Image/CommonImage/add.png"/>
            </div>
        </div>
    )
}

export default IngredientSection;