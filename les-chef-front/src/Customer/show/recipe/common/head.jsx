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

const RecipeHead = (props) => {
    const { listPage, 
            setListPage, 
            writePage, 
            setWritePage, 
            infoPage, 
            setInfoPage } = props;
    const {serverUrl} = useConfig();
    const { wrRecipeInfo, 
            wrRecipeIngres, 
            wrRecipeSteps,
            wrRecipeImg,
            wrStepImgs } = useRecipeContext();
    const navigate = useNavigate();
    const {authCheck} = useUserContext();

    const loginMessage = () => {
        alert('다시 로그인 해주세요');
        navigate('/');
    }
    

    const clickGoList = async() => {
        if(await authCheck()){
            setListPage(true);
            setWritePage(false);
            setInfoPage(false);
        }else{
            loginMessage();
        }
    }

    const addRecipe = async() => {
        if(await authCheck()){
            setWritePage(true);
            setListPage(false);
        }else{
            loginMessage();
        }
    }

    //등록 메소드
    const checkEnroll = () => {
        const checkWrRecipeInfo = (wrRecipeInfo.recipeName && 
                                    wrRecipeInfo.cookTime &&
                                    wrRecipeInfo.portion &&
                                    wrRecipeInfo.portionUnit &&
                                    wrRecipeInfo.cookLevel && 
                                    wrRecipeInfo.majorCategory &&
                                    wrRecipeInfo.subCategory) ? true : false;
        const checkWrRecipeImg = (wrRecipeImg) ? true : false;
        const checkWrStepImgs = ((wrStepImgs.length === 0) || (wrStepImgs.every(stepImg => Boolean(stepImg)))) ? true : false;
        const checkWrRecipeSteps = ((wrRecipeSteps.length === 0) || (wrRecipeSteps.every(step => Boolean(step.stepWay)))) ? true : false;
        const checkWrReciepeIngres = ((wrRecipeIngres.length === 0) || ((wrRecipeIngres.every(ingre => Boolean(ingre.sortType))) &&
                                        (wrRecipeIngres.every(ingre => 
                                            ingre.ingredientUnit.every(unit => Boolean(unit.ingredientName) && Boolean(unit.unit)))))) ? true : false;

        return (checkWrRecipeInfo && 
                checkWrRecipeImg && 
                checkWrStepImgs && 
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
                wrStepImgs.forEach((stepImg) => {
                    formData.append("recipeStepImgFiles", stepImg);
                });
    
                console.log("FormData Contents:");
                formData.forEach((value, key) => {
                    console.log(key, value);
                });

                fetch(`${serverUrl}/recipe/write`, {
                    method: "POST",
                    body: formData,
                    credentials: "include"
                }).then(response => {
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

    return(
        <div className={styles.head}>
            <RecipeHeadSolt 
                listPage={listPage} 
                infoPage={infoPage} 
                writePage={writePage}/>
            {listPage && 
                <img onClick={addRecipe} className={styles.writeBtn} src={`${serverUrl}/Image/CommonImage/add.png`}/>}
            {(!listPage && (writePage || infoPage)) && 
                <img onClick={clickGoList} className={styles.listBtn} src={`${serverUrl}/Image/CommonImage/goToBack.png`}/> }
            {writePage &&
                <img onClick={enrollRecipe} className={styles.enrollBtn} src={`${serverUrl}/Image/CommonImage/enroll.png`}/>}
        </div>
    )
}

export default RecipeHead;