//기타
import React from "react";

//컨텍스트
import { useConfig } from "../../../../../Context/configContext";

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
        <div className={`cusReciWrStepUnit-${index} cusReciWrStepUnit`}>
            <div className="cusStepUnitContent">
                <div className="cusStUniContLeft">
                    <input name="recipeStepImgFiles" className="cusStUniContInput" type="file" onChange={(e) => preStepImgFile(e)}/>
                    <img className="cusStUniContImg" src={saveStepImgFile || `${serverUrl}/Image/CommonImage/preImg.png`}/>
                    <div className="cusStepUnitDelete">
                        <img className="cusStepUnitDeleteImg" src="/Image/CommonImage/cancel.png" onClick={() => stepDelete(index)}/>
                    </div>
                </div>
                <div className="cusStUniContRight">
                    <div className="cusStepUniOrder">{`Step.${index}`}</div>
                    <textarea 
                        className="cusStepUniDes" 
                        value={saveStepContent || ""} 
                        onChange={(e) => updateStep(index, {content: e.target.value}, "content")}></textarea>
                </div>
            </div>
            
        </div>
    )
}

export default StepBoxUnit;