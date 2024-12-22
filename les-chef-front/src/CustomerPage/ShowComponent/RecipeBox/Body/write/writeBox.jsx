import React, { useRef, useState } from "react";
import StepBoxUnit from "./stepBoxUnit";
import IngredientSection from "./ingredientSection";

const WriteBox = () => {
    const [imgFile, setImgFile] = useState("");
    const [steps, setSteps] = useState([]);
    const [ingreSections, setIngreSections] = useState([]);
    const [ingreEachs, setIngreEachs] = useState([]);
    const imgRef = useRef();

    const preImgFile = () => {
        const file = imgRef.current.files[0];

        if (!imgRef.current || !imgRef.current.files || imgRef.current.files.length === 0 || !file) {
            setImgFile("");
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImgFile(reader.result);
        };
    };

    //step 메소드
    const stepAdd = () => {
        setSteps((prevSteps) => [
            ...prevSteps,
            { id: prevSteps.length + 1, stepImgFile: "", content: ""},
        ]);
    }

    const updateStep = (id, updatedData) => {
        setSteps((prevSteps) =>
            prevSteps.map((step) =>
                step.id === id ? { ...step, ...updatedData } : step
            )
        );
    };

    const stepDelete = (id) => {
        setSteps((prevSteps) =>
            prevSteps.filter((step) => step.id !== id).map((step, index) => ({
                ...step,
                id: index + 1,
                stepImgFile: step.stepImgFile,
                content: step.content
            }))
        );
    }

    //ingredientSection 메소드
    const ingreSectionAdd = () => {
        setIngreSections((preSections) => [
            ...preSections, {id: preSections.length + 1, ingreEachs: ""}
        ]);
    }

    //ingredientEach 메소드
    const ingreEachAdd = (sectionId) => {
        setIngreEachs((preEachs) => [
            ...preEachs, {id: preEachs.length + 1, ingreName: "", ingreVolume: "", ingreUnit: "", sectionId: sectionId} 
        ]);

        setIngreSections((preSections) => 
            preSections.map((section) => 
                section.id === sectionId ? [...section, { ingreEachs: ingreEachs }] : section
            )
        )
    }

    return(
        <>
            <div className="cusRecipeWriteLeft">
                <input className="recipeInputImg" accept="image/*" type="file" onChange={preImgFile} ref={imgRef}/>
                <img className="reciMainImgBox" src={imgFile ? imgFile : "/Image/CommonImage/preImg.png"}/>
                <div className="cusRecipeWrStepBox">
                    {steps.map((step) => (
                        <StepBoxUnit
                            key={step.id}
                            index={step.id}
                            saveStepImgFile={step.stepImgFile}
                            saveStepContent={step.content}
                            stepDelete={stepDelete}
                            updateStep={updateStep}
                        />
                    ))}
                    <div className="cusRecipeStepPlus">
                        <img onClick={stepAdd} className="cusStepPlusBtn" src="/Image/CommonImage/add.png"/>
                    </div>
                </div>
            </div>
            <div className="cusRecipeWriteRight">
                    {ingreSections.map((ingreSection) => (
                        <IngredientSection
                            key={ingreSection.id}
                            index={ingreSection.id}
                            ingreEachs={ingreEachs}
                        />
                    ))}
                    <div className="cusWrIngrePlus">
                        <img onClick={ingreSectionAdd} className="cusWrIngreBtn" src="/Image/CommonImage/add.png"/>
                    </div>
            </div>
        </>
    )
}

export default WriteBox;