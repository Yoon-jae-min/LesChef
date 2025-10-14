//기타
import React from "react";

//CSS
import styles from "../../../../CSS/customer/show/reicpe/write/ingre.module.css";

//컨텍스트
import { useConfig } from "../../../../Context/config";

const IngredientEach = (props) => {
    const { eachId, 
            sectionId, 
            ingreEachDel, 
            ingreEachUpD, 
            ingreName, 
            ingreVolume, 
            ingreUnit } = props
    const {serverUrl} = useConfig();

    return(
        <div className={styles.unit}>
            <input 
                type="text" 
                placeholder="재료명" 
                className={`cusIngreEachInput ${styles.unitName}`} 
                value={ingreName ? ingreName : ""}
                onChange={(e) => ingreEachUpD(sectionId, eachId, {ingredientName: e.target.value})}/>
            <input 
                type="number" 
                placeholder="수량" 
                step={0.25}
                className={`cusIngreEachInput ${styles.unitVolume}`}
                value={ingreVolume ? ingreVolume : ""}
                onChange={(e) => ingreEachUpD(sectionId, eachId, {volume: e.target.value})}/>
            <input 
                type="text" 
                placeholder="단위" 
                className={`cusIngreEachInput ${styles.unitPortion}`}
                value={ingreUnit ? ingreUnit : ""}
                onChange={(e) => ingreEachUpD(sectionId, eachId, {unit: e.target.value})}/>
            <img 
                onClick={() => ingreEachDel(sectionId, eachId)} 
                className={styles.unitDelImg} 
                src={`${serverUrl}/Image/CommonImage/cancel.png`}/>
        </div>
    )
}

export default IngredientEach;