import React, { useRef, useState } from "react";
import StepBoxUnit from "./stepBoxUnit";

const WriteBox = () => {
    const [imgFile, setImgFile] = useState("");
    const [steps, setSteps] = useState([]);
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

    const stepAdd = () => {
        setSteps((prevSteps) => [
            ...prevSteps,
            { id: prevSteps.length + 1 }, // 고유 ID와 내용
        ]);
    }

    // const updateStep = (id, updatedData) => {
    //     setSteps((prevSteps) =>
    //         prevSteps.map((step) =>
    //             step.id === id ? { ...step, ...updatedData } : step
    //         )
    //     );
    // };

    const stepDelete = (id) => {
        setSteps((prevSteps) =>
            prevSteps.filter((step) => step.id !== id).map((step, index) => ({
                ...step,
                id: index + 1, // 삭제 후 ID 재정렬
            }))
        );
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
                            stepDelete={() => stepDelete(step.id)} // 고유 ID로 삭제
                        />
                    ))}
                    <div className="cusRecipeStepPlus">
                        <img onClick={stepAdd} className="cusStepPlusBtn" src="/Image/CommonImage/add.png"/>
                    </div>
                </div>
            </div>
            <div className="cusRecipeWriteRight"></div>
        </>
    )
}

export default WriteBox;