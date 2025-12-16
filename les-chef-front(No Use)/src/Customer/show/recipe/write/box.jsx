//기타
import React, { useEffect, useRef, useState } from "react";

//CSS
import write from "../../../../CSS/customer/show/reicpe/write/write.module.css";
import step from "../../../../CSS/customer/show/reicpe/write/step.module.css";
import ingre from "../../../../CSS/customer/show/reicpe/write/ingre.module.css";

//컨텍스트
import { useConfig } from "../../../../Context/config";
import { useRecipeContext } from "../../../../Context/recipe";

//컴포넌트
import StepBoxUnit from "./stepUnit";
import IngredientSection from "./ingreSection";

const WriteBox = (props) => {
    const {isEdit} = props;
    const {serverUrl} = useConfig();
    const { wrRecipeInfo, wrRecipeSteps, wrRecipeIngres, 
            setWrRecipeSteps, setWrStepImgs, setWrRecipeInfo, setWrRecipeImg, setWrRecipeIngres, setDeleteImgs} = useRecipeContext();
    const [imgFile, setImgFile] = useState("");
    const [steps, setSteps] = useState([]);
    const [ingreSections, setIngreSections] = useState([]);
    const imgRef = useRef();

    useEffect(() => {
        if(isEdit){
            setSteps(wrRecipeSteps);
            setIngreSections(wrRecipeIngres.map((section, index) => ({
                    ...section, 
                    id: index + 1,
                    ingredientUnit: section.ingredientUnit.map((unit, index) => ({
                        ...unit,
                        id: index + 1
                    }))
                })
            ));
            setWrStepImgs((prev) => {
                const newArray = [];
                for(let i = 0; i < wrRecipeSteps.length; i++){
                    newArray.push("");
                }
                return [...prev, ...newArray];
            });
        }
    }, [])

    const preImgFile = () => {
        const file = imgRef.current.files[0];

        if (!imgRef.current || !imgRef.current.files || imgRef.current.files.length === 0 || !file) {
            setImgFile("");
            setWrRecipeInfo((preInfo) => (
                {...preInfo, recipeImg: ""}
            ))
            setWrRecipeImg(null);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImgFile(reader.result);
        };

        if(wrRecipeInfo.recipeImg !== "" && wrRecipeInfo.recipeImg !== "/Image/CommonImage/preImg.png"){
            setDeleteImgs((prev) => [...prev, wrRecipeInfo.recipeImg]);
        }

        setWrRecipeInfo((preInfo) => (
            {...preInfo, recipeImg: ""}
        ))
        setWrRecipeImg(file);
    };

    //step 메소드
    const stepAdd = () => {
        setSteps((prevSteps) => [
            ...prevSteps,
            { stepNum: prevSteps.length + 1, stepImgFile: "", stepWay: ""},
        ]);

        setWrRecipeSteps((preSteps) => [
            ...preSteps, { stepNum: preSteps.length + 1, stepWay: "", stepImg: "" }
        ]);

        setWrStepImgs((preStepImgs) => [
            ...preStepImgs, ""
        ])
    }

    const updateStep = (id, updatedData, select) => {
        if(select === "image"){
            setSteps((prevSteps) =>
                prevSteps.map((step) =>
                    step.stepNum === id ? { ...step, stepImgFile: updatedData.stepImgFile } : step
                )
            );
            setWrRecipeSteps((steps) => {
                const newDeleteImgs = [];
                const updatedSteps = steps.map((step) => {
                    if(step.stepNum === id) {
                        if(step.stepImg !== "" && step.stepImg !== "/Image/CommonImage/preImg.png"){
                            newDeleteImgs.push(step.stepImg);
                        }
                        return {...step, stepImg: ""}
                    }else{
                        return step;
                    }
                });
                if(newDeleteImgs.length > 0){
                    setDeleteImgs((prev) => [...prev, ...newDeleteImgs]);
                }
                return updatedSteps;
            });
            setWrStepImgs((stepImgs) =>
                stepImgs.map((stepImg, index) => 
                    index + 1 === id ? (stepImg = updatedData.sendStepImgFile) : stepImg
                )
            );
        }else if(select === "content"){
            setSteps((prevSteps) =>
                prevSteps.map((step) =>
                    step.stepNum === id ? { ...step, ...updatedData } : step
                )
            );
            setWrRecipeSteps((preSteps) => 
                preSteps.map((step, index) => 
                    index + 1 === id ? {...step, ...updatedData} : step
                )
            );
        }
        
    };

    const stepDelete = (id) => {
        setSteps((prevSteps) =>
            prevSteps.filter((step) => step.stepNum !== id).map((step, index) => ({
                ...step,
                stepNum: index + 1,
                stepImgFile: step.stepImgFile,
                stepWay: step.stepWay
            }))
        );

        setWrRecipeSteps((preSteps) => {
            const newDeleteImgs = [];

            const updatedSteps = preSteps.reduce((acc, step) => {
                if(step.stepNum === id){
                    if(step.stepImg !== "" && step.stepImg !== "/Image/CommonImage/preImg.png"){
                        newDeleteImgs.push(step.stepImg);
                    }
                }else{
                    acc.push({
                        ...step,
                        stepNum: acc.length + 1,
                        stepWay: step.stepWay,
                        stepImg: step.stepImg
                    });
                }
                return acc;
            },[]);
            if (newDeleteImgs.length > 0) {
                setDeleteImgs((preImgs) => [...preImgs, ...newDeleteImgs]);
            }
            return updatedSteps;
            // preSteps.filter((step) => step.stepNum !== id).map((step, index) => ({
            //     ...step,
            //     stepNum: index + 1,
            //     stepWay: step.stepWay,
            //     stepImg: step.stepImg
            // }))
        });

        setWrStepImgs((preStepImgs) => {
            const newStepImgs = [...preStepImgs];
            if (id > 0 && id <= preStepImgs.length) {
                newStepImgs.splice(id - 1, 1);
            }
            return newStepImgs;
        });
    }

    //ingredientSection 메소드
    const ingreSectionAdd = () => {
        setIngreSections((preSections) => [
            ...preSections, {id: preSections.length + 1, sortType: "", ingredientUnit: []}
        ]);

        setWrRecipeIngres((preIngres) => [
            ...preIngres, {sortType: "", ingredientUnit: []}
        ])
    }

    const ingreSectionUpD = (sectionId, updateData) => {
        setIngreSections((preSections) => 
            preSections.map((section) => 
                section.id === sectionId ? { ...section, ...updateData} : section
            )
        );

        setWrRecipeIngres((ingres) => 
            ingres.map((ingre, index) => 
                index + 1 === sectionId ? {...ingre, ...updateData} : ingre
            )
        );
    }

    const ingreSectionDel = (sectionId) => {
        setIngreSections((preSections) => 
            preSections.filter((section) => section.id !== sectionId).map((section, index) => ({
                ...section,
                id: index + 1,
                sortType: section.sortType,
                ingredientUnit: section.ingredientUnit
            }))
        );

        setWrRecipeIngres((preIngres) => {
            const newIngres = [...preIngres];
            if(sectionId > 0 && sectionId <= preIngres.length){
                newIngres.splice(sectionId - 1, 1);
            }
            return newIngres;
        })
    }

    //ingredientEach 메소드
    const ingreEachAdd = (sectionId) => {
        setIngreSections((preSections) => 
            preSections.map((section) => 
                section.id === sectionId ? {
                    ...section,
                    ingredientUnit: [
                        ...section.ingredientUnit,
                        {
                            id: section.ingredientUnit.length + 1,
                            ingredientName: "",
                            volume: "",
                            unit: ""
                        }
                    ]
                } : section
            )
        );

        setWrRecipeIngres((preIngres) => 
            preIngres.map((ingre, index) => 
                index + 1 === sectionId ? {
                    ...ingre,
                    ingredientUnit:[
                        ...ingre.ingredientUnit,
                        {
                            ingredientName: "",
                            volume: "",
                            unit: ""
                        }
                    ]
                } : ingre
            )
        );
    }

    const ingreEachUpD = (sectionId, eachId, updateData) => {
        setIngreSections((preSections) => 
            preSections.map((section) => 
                section.id === sectionId ? {
                    ...section,
                    ingredientUnit: section.ingredientUnit.map((each) =>
                        each.id === eachId ? {
                            ...each,
                            ...updateData
                        } : each
                    )
                } : section
            )
        );

        setWrRecipeIngres((ingres) => 
            ingres.map((ingre, index) => 
                index + 1 === sectionId ? {
                    ...ingre,
                    ingredientUnit: ingre.ingredientUnit.map((ingreEach, index) =>
                        index + 1 === eachId ? {
                            ...ingreEach,
                            ...updateData
                        } : ingreEach
                    )
                } : ingre
            )
        );
    }

    const ingreEachDel = (sectionId, eachId) => {
        setIngreSections((prevSections) =>
            prevSections.map((section) =>
                section.id === sectionId ? {
                    ...section,
                    ingredientUnit: section.ingredientUnit
                        .filter((each) => each.id !== eachId)
                        .map((each, index) => ({
                            ...each,
                            id: index + 1,
                            ingredientName: each.ingredientName,
                            volume: each.volume,
                            unit: each.unit
                        })),
                } : section
            )
        );

        setWrRecipeIngres((preIngres) => 
            preIngres.map((ingre, index) => {
                if(index + 1 === sectionId){
                    return (
                        {
                            ...ingre, 
                            ingredientUnit: [
                                ...ingre.ingredientUnit.slice(0, eachId - 1),
                                ...ingre.ingredientUnit.slice(eachId)
                            ]
                        }
                    );
                }
                return ingre;
            })
        );
    }

    //레시피 등록 정보 업데이트
    const changeCookTime = (cookTime) => {
        setWrRecipeInfo((preInfo) => (
            {...preInfo, cookTime: cookTime}
        ))
    }

    const changePortion = (portion) => {
        setWrRecipeInfo((preInfo) => (
            {...preInfo, portion: portion}
        ))
    }

    const changePortionUnit = (portionUnit) => {
        setWrRecipeInfo((preInfo) => (
            {...preInfo, portionUnit: portionUnit}
        ))
    }

    const changeCookLevel = (cookLevel) => {
        setWrRecipeInfo((preInfo) => (
            {...preInfo, cookLevel: cookLevel}
        ))
    }

    const mainImgBtnClick = () => {
        const mainImgInput = document.getElementById("mainImgInput");
        mainImgInput.click();
    }

    return(
        <>
            <div className={write.left}>
                <input id="mainImgInput" name="recipeImgFile" className={write.mainImgInput} accept="image/*" type="file" onChange={preImgFile} ref={imgRef}/>
                <img onClick={mainImgBtnClick} className={write.mainImgBtn} src={`${serverUrl}/Image/CommonImage/add.png`}/>
                <img className={write.mainImg} src={imgFile ? imgFile : wrRecipeInfo?.recipeImg ? `${serverUrl}${wrRecipeInfo?.recipeImg}` : `${serverUrl}/Image/CommonImage/preImg.png`}/>
                <div className={step.box}>
                    {steps.map((step, index) => (
                        <StepBoxUnit
                            key={index}
                            index={step.stepNum}
                            step={step}
                            saveStepImgFile={step.stepImg}
                            saveStepContent={step.stepWay}
                            stepDelete={stepDelete}
                            updateStep={updateStep}
                        />
                    ))}
                    <div className={write.stPlusBox}>
                        <img onClick={stepAdd} className={write.stPlusBtn} src={`${serverUrl}/Image/CommonImage/add.png`}/>
                    </div>
                </div>
            </div>
            <div className={write.right}>
                <div className={ingre.box}>
                    {ingreSections.map((ingreSection, index) => (
                        <IngredientSection
                            key={index}
                            sectionId={ingreSection.id}
                            ingreSection={ingreSection}
                            ingreSectionDel={ingreSectionDel}
                            ingreSectionUpD={ingreSectionUpD}
                            ingreEachAdd={ingreEachAdd}
                            ingreEachDel={ingreEachDel}
                            ingreEachUpD={ingreEachUpD}
                        />
                    ))}
                    <div className={write.ingrePlusBox}>
                        <img onClick={ingreSectionAdd} className={write.ingrePlusBtn} src={`${serverUrl}/Image/CommonImage/add.png`}/>
                    </div>
                </div>
                <div className={write.extraBox}>
                    <input value={wrRecipeInfo?.cookTime} onChange={(e) => changeCookTime(e.target.value)} type="number" step={1} className={`${write.time} ${write.extraInput} ${write.extraNum}`} placeholder="조리시간(분)"/>
                    <div className={write.volumeBox}>
                        <input value={wrRecipeInfo?.portion} onChange={(e) => changePortion(e.target.value)} type="number" step={0.5} className={`${write.volume} ${write.extraInput} ${write.extraNum}`} placeholder="수량"/>
                        <input value={wrRecipeInfo?.portionUnit} onChange={(e) => changePortionUnit(e.target.value)} type="text" className={`${write.volume} ${write.extraInput}`} placeholder="단위"/>
                    </div>
                    <select onChange={(e) => changeCookLevel(e.target.value)} className={write.level} value={wrRecipeInfo?.cookLevel}>
                        <option value="">선택하세요</option>
                        <option value="쉬움">쉬움</option>
                        <option value="중간">중간</option>
                        <option value="어려움">어려움</option>
                    </select>
                </div>
            </div>
            
        </>
    )
}

export default WriteBox;