//기타
import React from "react";

//컨텍스트
import { useConfig } from "../../../../../Context/configContext";

const StepBoxUnit = (props) => {
    const { index, 
            stepDelete, 
            updateStep, 
            saveStepImgFile, 
            saveStepContent } = props;
    const {serverUrl} = useConfig();

    const preStepImgFile = (e) => {
        const file = e.target.files[0];
        if (!file) {
            updateStep(index, {stepImgFile: ""});
        }else{
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const result = reader.result;
                updateStep(index, {stepImgFile: result});
            };
        }
    };


    return(
        <div className={`cusReciWrStepUnit-${index} cusReciWrStepUnit`}>
            <div className="cusStepUnitContent">
                <div className="cusStUniContLeft">
                    <input className="cusStUniContInput" type="file" onChange={(e) => preStepImgFile(e)}/>
                    <img className="cusStUniContImg" src={saveStepImgFile || `${serverUrl}/Image/CommonImage/preImg.png`}/>
                    <div className="cusStepUnitDelete">
                        <img src="/Image/CommonImage/delete.png" onClick={() => stepDelete(index)}/>
                    </div>
                </div>
                <div className="cusStUniContRight">
                    <div className="cusStepUniOrder">{`Step.${index}`}</div>
                    <textarea 
                        className="cusStepUniDes" 
                        value={saveStepContent || ""} 
                        onChange={(e) => updateStep(index, {content: e.target.value})}></textarea>
                </div>
            </div>
            
        </div>
    )
}

export default StepBoxUnit;