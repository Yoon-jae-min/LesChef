//기타
import React, { useEffect, useRef, useState } from "react";

//컨텍스트
import { useConfig } from "../../../../../Context/configContext";
import { useRecipeContext } from "../../../../../Context/recipeContext";

//컴포넌트
import StepBoxUnit from "./stepBoxUnit";
import IngredientSection from "./ingredientSection";

const WriteBox = () => {
    const {serverUrl} = useConfig();
    const {setWrRecipeInfo, setWrRecipeImg, setWrRecipeSteps, setWrStepImgs, setWrRecipeIngres} = useRecipeContext();
    const [imgFile, setImgFile] = useState("");
    const [steps, setSteps] = useState([]);
    const [ingreSections, setIngreSections] = useState([]);
    const imgRef = useRef();

    useEffect(() => {
        setWrRecipeInfo({});
        setWrRecipeIngres([]);
        setWrRecipeSteps([]);
        setWrRecipeImg(null);
        setWrStepImgs([]);
    }, [])

    const categoryTrans = (category) => {
        switch (category) {
            case '한식':
                return 'korean';
            case '일식':
                return 'japanese';
            case '중식':
                return 'chinese';
            case '양식':
                return 'western';
            case '기타':
                return 'other';
            default:
                return '';
        }
    }

    const preImgFile = () => {
        const file = imgRef.current.files[0];
        const category = categoryTrans(document.querySelector('.cusWrCategorySelect').value);

        if(category){
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
    
            setWrRecipeInfo((preInfo) => (
                {...preInfo, recipeImg: `/Image/RecipeImage/ListImg/${category}/${file.name}`}
            ))
            setWrRecipeImg(file)
        }else{
            setImgFile("");
            setWrRecipeInfo((preInfo) => (
                {...preInfo, recipeImg: ""}
            ))
            setWrRecipeImg(null);
            document.querySelector('.recipeInputImg').value = "";
            alert("카테고리를 선택 후 첨부해주세요");
        }

        
    };

    //step 메소드
    const stepAdd = () => {
        setSteps((prevSteps) => [
            ...prevSteps,
            { id: prevSteps.length + 1, stepImgFile: "", content: ""},
        ]);

        setWrRecipeSteps((preSteps) => [
            ...preSteps, { stepNum: preSteps.length + 1, stepWay: "", stepImg: "" }
        ]);

        setWrStepImgs((preStepImgs) => [
            ...preStepImgs, ""
        ])
    }

    const updateStep = (id, updatedData, select) => {
        console.log(updatedData);
        if(select === "image"){
            setSteps((prevSteps) =>
                prevSteps.map((step) =>
                    step.id === id ? { ...step, stepImgFile: updatedData.stepImgFile } : step
                )
            );
    
            setWrRecipeSteps((preSteps) => 
                preSteps.map((step, index) => 
                    index + 1 === id ? {...step, stepImg: updatedData.stepImgUrl} : step
                )
            );
    
            setWrStepImgs((stepImgs) =>
                stepImgs.map((stepImg, index) => 
                    index + 1 === id ? (stepImg = updatedData.sendStepImgFile) : stepImg
                )
            );
        }else if(select === "content"){
            setSteps((prevSteps) =>
                prevSteps.map((step) =>
                    step.id === id ? { ...step, ...updatedData } : step
                )
            );

            setWrRecipeSteps((preSteps) => 
                preSteps.map((step, index) => 
                    index + 1 === id ? {...step, stepWay: updatedData.content} : step
                )
            );
        }
        
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

        setWrRecipeSteps((preSteps) => 
            preSteps.filter((step) => step.stepNum !== id).map((step, index) => ({
                ...step,
                stepNum: index + 1,
                stepWay: step.stepWay,
                stepImg: step.stepImg
            }))
        );

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
            ...preSections, {id: preSections.length + 1, sectionName: "", ingreEachs: []}
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
                index + 1 === sectionId ? {...ingre, sortType: updateData.sectionName} : ingre
            )
        );
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

        setWrRecipeIngres((preIngres) => {
            const newIngres = [...preIngres];
            if(sectionId > 0 && sectionId <= preIngres.length){
                newIngres.slice(sectionId - 1, 1);
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

    const ingreEachUpD = (sectionId, eachId, updateData, sendData) => {
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

        setWrRecipeIngres((ingres) => 
            ingres.map((ingre, index) => 
                index + 1 === sectionId ? {
                    ...ingre,
                    ingredientUnit: ingre.ingredientUnit.map((ingreEach, index) =>
                        index + 1 === eachId ? {
                            ...ingreEach,
                            ...sendData
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
                            categoryTrans={categoryTrans}
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
                <div className="cusWrIngreBox">
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
                <div className="cusWrExtraInfoBox">
                    <input onChange={(e) => changeCookTime(e.target.value)} type="text" className="cusWrExtraTime cusWrExtraInfoInput" placeholder="조리시간(분)"/>
                    <div className="cusWrExtraVolumeBox">
                        <input onChange={(e) => changePortion(e.target.value)} type="text" className="cusWrExtraVolume cusWrExtraInfoInput" placeholder="수량"/>
                        <input onChange={(e) => changePortionUnit(e.target.value)} type="text" className="cusWrExtraVolume cusWrExtraInfoInput" placeholder="단위"/>
                    </div>
                    <select onChange={(e) => changeCookLevel(e.target.value)} className="cusWrExtraLevel">
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