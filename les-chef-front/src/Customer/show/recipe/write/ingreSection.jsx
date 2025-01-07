//기타
import React from "react";

//CSS
import styles from "../../../../CSS/customer/show/reicpe/write/ingre.module.css";

//컨텍스트
import { useConfig } from "../../../../Context/configContext";

//컴포넌트
import IngredientEach from "./ingreUnit";

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
        <div className={styles.section}>
            <div className={styles.sectionHead}>
                <input 
                    onChange={(e) => changeSecName(e.target.value)} 
                    value={sectionName} 
                    type="text" 
                    className={styles.secHeadName} 
                    placeholder="재료 section name"/>
                <img 
                    onClick={() => ingreSectionDel(sectionId)} 
                    className={styles.secDelImg} 
                    src={`${serverUrl}/Image/CommonImage/cancel.png`}/>
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
            <div className={styles.unitPlusBox}>
                <img 
                    onClick={() => ingreEachAdd(sectionId)} 
                    className={styles.unitPlusImg} 
                    src={`${serverUrl}/Image/CommonImage/add.png`}/>
            </div>
        </div>
    )
}

export default IngredientSection;