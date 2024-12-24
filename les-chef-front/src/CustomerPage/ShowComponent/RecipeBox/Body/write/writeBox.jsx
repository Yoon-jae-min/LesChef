import React, { useRef, useState } from "react";
import StepBoxUnit from "./stepBoxUnit";
import IngredientSection from "./ingredientSection";
import { useConfig } from "../../../../../Context/configContext";

const WriteBox = () => {
    const {serverUrl} = useConfig();
    const [imgFile, setImgFile] = useState("");
    const [steps, setSteps] = useState([]);
    const [ingreSections, setIngreSections] = useState([]);
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
            ...preSections, {id: preSections.length + 1, sectionName: "", ingreEachs: []}
        ]);
    }

    const ingreSectionUpD = (sectionId, updateData) => {
        console.log(sectionId, updateData);
        setIngreSections((preSections) => 
            preSections.map((section) => 
                section.id === sectionId ? { ...section, ...updateData} : section
            )
        )
    }

    const ingreSectionDel = (sectionId) => {
        setIngreSections((preSections) => 
            preSections.filter((section) => section.id !== sectionId).map((section, index) => ({
                ...section,
                id: index + 1,
                sectionName: section.sectionName,
                ingreEachs: section.ingreEachs
            }))
        );
    }

    //ingredientEach 메소드
    const ingreEachAdd = (sectionId) => {
        setIngreSections((preSections) => 
            preSections.map((section) => 
                section.id === sectionId ? {
                    ...section,
                    ingreEachs: [
                        ...section.ingreEachs,
                        {
                            id: section.ingreEachs.length + 1,
                            ingreName: "",
                            ingreVolume: "",
                            ingreUnit: ""
                        }
                    ]
                } : section
            )
        )
    }

    const ingreEachUpD = (sectionId, eachId, updateData) => {
        setIngreSections((preSections) => 
            preSections.map((section) => 
                section.id === sectionId ? {
                    ...section,
                    ingreEachs: section.ingreEachs.map((each) =>
                        each.id === eachId ? {
                            ...each,
                            ...updateData
                        } : each
                    )
                } : section
            )
        );
    }

    const ingreEachDel = (sectionId, eachId) => {
        setIngreSections((prevSections) =>
            prevSections.map((section) =>
                section.id === sectionId ? {
                    ...section,
                    ingreEachs: section.ingreEachs
                        .filter((each) => each.id !== eachId)
                        .map((each, index) => ({
                            ...each,
                            id: index + 1,
                            ingreName: each.ingreName,
                            ingreVolume: each.ingreVolume,
                            ingreUnit: each.ingreUnit
                        })),
                } : section
            )
        );
    }

    return(
        <>
            <div className="cusRecipeWriteLeft">
                <input className="recipeInputImg" accept="image/*" type="file" onChange={preImgFile} ref={imgRef}/>
                <img className="reciMainImgBox" src={imgFile ? imgFile : `${serverUrl}/Image/CommonImage/preImg.png`}/>
                <div className="cusRecipeWrStepBox">
                    {steps.map((step, index) => (
                        <StepBoxUnit
                            key={index}
                            index={step.id}
                            saveStepImgFile={step.stepImgFile}
                            saveStepContent={step.content}
                            stepDelete={stepDelete}
                            updateStep={updateStep}
                        />
                    ))}
                    <div className="cusRecipeStepPlus">
                        <img onClick={stepAdd} className="cusStepPlusBtn" src={`${serverUrl}/Image/CommonImage/add.png`}/>
                    </div>
                </div>
            </div>
            <div className="cusRecipeWriteRight">
                    {ingreSections.map((ingreSection, index) => (
                        <IngredientSection
                            key={index}
                            sectionId={ingreSection.id}
                            ingreSection={ingreSection}
                            sectionName={ingreSection.sectionName}
                            ingreSectionDel={ingreSectionDel}
                            ingreSectionUpD={ingreSectionUpD}
                            ingreEachAdd={ingreEachAdd}
                            ingreEachDel={ingreEachDel}
                            ingreEachUpD={ingreEachUpD}
                        />
                    ))}
                    <div className="cusWrIngrePlus">
                        <img onClick={ingreSectionAdd} className="cusWrIngreBtn" src={`${serverUrl}/Image/CommonImage/add.png`}/>
                    </div>
            </div>
        </>
    )
}

export default WriteBox;