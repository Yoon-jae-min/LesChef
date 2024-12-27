//기타
import React from "react";

//컨텍스트
import { useConfig } from "../../../../../Context/configContext";

//컴포넌트
import IngredientEach from "./ingredientEach";

const IngredientSection = (props) => {
    const { sectionId, 
            ingreSection, 
            sectionName, 
            ingreSectionDel, 
            ingreSectionUpD, 
            ingreEachAdd, 
            ingreEachDel, 
            ingreEachUpD } = props;
    const {serverUrl} = useConfig();

    const changeSecName = (sectionName) => {
        ingreSectionUpD(sectionId, { sectionName: sectionName });
    }

    return(
        <div className="cusWrIngreSec">
            <div className="cusWrIngreSecHead">
                <input 
                    onChange={(e) => changeSecName(e.target.value)} 
                    value={sectionName} 
                    type="text" 
                    className="cusWrIngreSecHeadName" 
                    placeholder="재료 section name"/>
                <img 
                    onClick={() => ingreSectionDel(sectionId)} 
                    className="cusWrIngreSecHeadImg" 
                    src={`${serverUrl}/Image/CommonImage/delete.png`}/>
            </div>
            {Array.isArray(ingreSection.ingreEachs) &&
                ingreSection.ingreEachs.map((each, index) => (
                    <IngredientEach 
                        key={index}
                        eachId={each.id}  
                        sectionId={sectionId}
                        ingreName={each.ingreName}
                        ingreVolume={each.ingreVolume}
                        ingreUnit={each.ingreUnit}
                        ingreEachDel={ingreEachDel}
                        ingreEachUpD={ingreEachUpD}
                    />
            ))}
            <div className="cusWrIngreEachPlus">
                <img 
                    onClick={() => ingreEachAdd(sectionId)} 
                    className="cusWrIngreEachAddImg" 
                    src={`${serverUrl}/Image/CommonImage/add.png`}/>
            </div>
        </div>
    )
}

export default IngredientSection;