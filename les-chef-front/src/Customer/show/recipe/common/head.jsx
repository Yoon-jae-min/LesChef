//기타
import React from "react";
import { useNavigate } from "react-router-dom";

//CSS
import styles from "../../../../CSS/customer/show/reicpe/common/recipe.module.css";

//컨텍스트
import { useConfig } from "../../../../Context/config";
import { useRecipeContext } from "../../../../Context/recipe";
import { useUserContext } from "../../../../Context/user";

//컴포넌트
import RecipeHeadSolt from "./headSolt";

const deleteCheck = () => {
    return window.confirm("정말 삭제하시겠습니까?");
}

const RecipeHead = (props) => {
    const { listPage, writePage, infoPage, isEdit,
            setListPage, setWritePage, setInfoPage, setIsEdit } = props;
    const {serverUrl} = useConfig();
    const { wrRecipeInfo, wrRecipeIngres, wrRecipeSteps, wrRecipeImg, wrStepImgs,
            setWrRecipeInfo, setWrRecipeIngres, setWrRecipeSteps, setWrRecipeImg, setWrStepImgs, setSelectedRecipe,
            selectedRecipe, recipeIngres, recipeSteps } = useRecipeContext();
    const navigate = useNavigate();
    const {authCheck} = useUserContext();

    const loginMessage = () => {
        alert('다시 로그인 해주세요');
        navigate('/');
    }
    
    const clickGoList = async() => {
        if(await authCheck()){
            setListPage(true);
            setIsEdit(false);
            setWritePage(false);
            setInfoPage(false);
        }else{
            loginMessage();
        }
    }

    const addRecipe = async() => {
        if(await authCheck()){
            setWrRecipeInfo(null);
            setWrRecipeIngres([]);
            setWrRecipeSteps([]);
            setWrRecipeImg(null);
            setWrStepImgs([]);
            setWritePage(true);
            setListPage(false);
        }else{
            loginMessage();
        }
    }

    //등록 메소드
    const checkEnroll = () => {
        if(!wrRecipeImg && !wrRecipeInfo.recipeImg){
            wrRecipeInfo.recipeImg = "/Image/CommonImage/preImg.png";
        }

        wrStepImgs.map((step, index) => {
            if(!step && !wrRecipeSteps[index].stepImg){
                wrRecipeSteps[index].stepImg = "/Image/CommonImage/preImg.png";
            }
        })

        const checkWrRecipeInfo = (wrRecipeInfo.recipeName && 
                                    wrRecipeInfo.cookTime &&
                                    wrRecipeInfo.portion &&
                                    wrRecipeInfo.portionUnit &&
                                    wrRecipeInfo.cookLevel && 
                                    wrRecipeInfo.majorCategory &&
                                    wrRecipeInfo.subCategory) ? true : false;
        const checkWrRecipeSteps = ((wrRecipeSteps.length === 0) || (wrRecipeSteps.every(step => Boolean(step.stepWay)))) ? true : false;
        const checkWrReciepeIngres = ((wrRecipeIngres.length === 0) || ((wrRecipeIngres.every(ingre => Boolean(ingre.sortType))) &&
                                        (wrRecipeIngres.every(ingre => 
                                            ingre.ingredientUnit.every(unit => Boolean(unit.ingredientName) && Boolean(unit.unit)))))) ? true : false;

        console.log(wrRecipeInfo);
        console.log(wrRecipeImg);
        console.log(wrRecipeIngres);
        console.log(wrRecipeSteps);
        return (checkWrRecipeInfo && 
                checkWrRecipeSteps && 
                checkWrReciepeIngres) ? true : false;
    }

    const enrollRecipe = async() => {
        if(await authCheck()){
            if(checkEnroll()){
                const formData = new FormData();
    
                formData.append("recipeInfo", JSON.stringify(wrRecipeInfo));
                formData.append("recipeIngredients", JSON.stringify(wrRecipeIngres)); 
                formData.append("recipeSteps", JSON.stringify(wrRecipeSteps));
                formData.append("recipeImgFile", wrRecipeImg);
                formData.append("isEdit", isEdit);
                wrStepImgs.forEach((stepImg) => {
                    formData.append("recipeStepImgFiles", stepImg);
                });

                fetch(`${serverUrl}/recipe/write`, {
                    method: "POST",
                    body: formData,
                    credentials: "include"
                }).then(response => {
                    setWrRecipeInfo(null);
                    setWrRecipeIngres([]);
                    setWrRecipeSteps([]);
                    setWrRecipeImg(null);
                    setWrStepImgs([]);
                    setSelectedRecipe(null);
                    setListPage(true);
                    setWritePage(false);
                    setInfoPage(false);
                }).catch(err => console.log(err));
            }else{
                alert("모든 항목을 채워주세요!!!!");
            }
        }else{
            alert("다시 로그인 해주세요!!!");
            navigate('/');
        }
    }

    const goEditRecipe = async() => {
        if(!await authCheck()){
            alert("다시 로그인 해주세요");
            navigate('/');
            return;
        }
        setWrRecipeInfo(selectedRecipe);
        setWrRecipeIngres(recipeIngres);
        setWrRecipeSteps(recipeSteps);
        setWrRecipeImg(null);
        setWrStepImgs([]);
        setIsEdit(true);
        setInfoPage(false);
        setWritePage(true);
    }

    const deleteRecipe = async() => {
        if(!await authCheck()){
            alert("다시 로그인 해주세요");
            navigate('/');
            return;
        }

        if(deleteCheck()){
            fetch(`${serverUrl}/recipe/delete`, {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    recipeId: selectedRecipe._id
                }),
                credentials: "include"
            }).then(response => response.json()).then(data => {
                setInfoPage(false);
                setListPage(true);
            }).catch(err => console.log(err));
        }
    }

    return(
        <div className={styles.head}>
            <RecipeHeadSolt 
                listPage={listPage} 
                infoPage={infoPage} 
                writePage={writePage}
                isEdit={isEdit}/>
            {listPage && 
                <img onClick={addRecipe} className={styles.writeBtn} src={`${serverUrl}/Image/CommonImage/add.png`}/>}
            {(!listPage && (writePage || infoPage)) && 
                <img onClick={clickGoList} className={styles.listBtn} src={`${serverUrl}/Image/CommonImage/goToBack.png`}/>}
            { infoPage && 
                <React.Fragment>
                    <img onClick={deleteRecipe} className={styles.deleteBtn} src={`${serverUrl}/Image/CommonImage/delete.png`}/>
                    <img onClick={goEditRecipe} className={styles.editBtn} src={`${serverUrl}/Image/CommonImage/edit.png`}/>
                </React.Fragment>}
            {writePage &&
                <img onClick={enrollRecipe} className={styles.enrollBtn} src={`${serverUrl}/Image/CommonImage/enroll.png`}/>}
        </div>
    )
}

export default RecipeHead;