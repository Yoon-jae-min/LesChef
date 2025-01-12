//기타
import React from "react";

//CSS
import styles from "../../../../CSS/customer/show/reicpe/write/step.module.css";

//컨텍스트
import { useConfig } from "../../../../Context/config";

const StepBoxUnit = (props) => {
    const { index, 
            stepDelete, 
            updateStep, 
            saveStepImgFile, 
            saveStepContent,
            // categoryTrans 
        } = props;
    const {serverUrl} = useConfig();

    const preStepImgFile = (e) => {
        const file = e.target.files[0];
        if (!file) {
            updateStep(index, {stepImgFile: "", stepImgUrl: "", sendStepImgFile: ""}, "image");
        }else{
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const result = reader.result;
                // const category = categoryTrans(document.querySelector('.cusWrCategorySelect').value);
                updateStep(index, 
                    {stepImgFile: result, 
                    // stepImgUrl: `/Image/RecipeImage/InfoImg/step/${category}/${file.name}`, 
                    sendStepImgFile: file}, "image");
            };
        }
    };


    return(
        <div className={`${styles.unit}-${index} ${styles.unit}`}>
            <div className={styles.inner}>
                <div className={styles.innerLeft}>
                    <input name="recipeStepImgFiles" className={styles.fileInput} type="file" onChange={(e) => preStepImgFile(e)}/>
                    <img className={styles.img} src={saveStepImgFile || `${serverUrl}/Image/CommonImage/preImg.png`}/>
                    <div className={styles.delBox}>
                        <img className={styles.delImg} src="/Image/CommonImage/cancel.png" onClick={() => stepDelete(index)}/>
                    </div>
                </div>
                <div className={styles.innerRight}>
                    <div className={styles.order}>{`Step.${index}`}</div>
                    <textarea 
                        className={styles.textArea} 
                        value={saveStepContent || ""} 
                        onChange={(e) => updateStep(index, {content: e.target.value}, "content")}></textarea>
                </div>
            </div>
            
        </div>
    )
}

export default StepBoxUnit;