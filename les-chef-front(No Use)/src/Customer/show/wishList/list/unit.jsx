//기타
import React from "react";
import { useNavigate } from "react-router-dom";

//CSS
import styles from "../../../../CSS/customer/show/reicpe/list/list.module.css";

//컨텍스트
import { useConfig } from "../../../../Context/config";
import { useUserContext } from "../../../../Context/user";
import { useRecipeContext } from "../../../../Context/recipe";

const Unit = (props) => {
    const {recipe, setListPage} = props;
    const navigate = useNavigate();
    const {serverUrl} = useConfig();
    const {authCheck} = useUserContext();
    const { setRecipeIngres, 
            setRecipeSteps, 
            setSelectedRecipe,
            setRecipeWish } = useRecipeContext();

    const clickUnit = async() => {
        if(await authCheck()){
            fetch(`${serverUrl}/recipe/info?recipeName=${recipe.recipeName}`,{
                credentials: "include"
            })
            .then(response => response.json())
            .then((data) => {
                setRecipeIngres(data.recipeIngres);
                setRecipeSteps(data.recipeSteps);
                setSelectedRecipe(data.selectedRecipe);
                setListPage(false);
                setRecipeWish(data.recipeWish);
            }).catch(err => console.log(err));
        }else{
            alert('다시 로그인 해주세요');
            navigate('/');
        }
    }

    return(
        <div className={styles.unit} onClick={clickUnit}>
            <img className={styles.img} src={`${serverUrl}${recipe.recipeImg}`}/>
            <p className={styles.recipeName}>{recipe.recipeName}</p>
            <div className={styles.infoBox}>
                <div className={styles.nickName}>{recipe.userNickName}</div>
                <div className={styles.watchBox}>
                    <img className={styles.watchImg} src={`${serverUrl}/Image/CommonImage/watch.png`}/>
                    <div className={styles.watchCount}>{recipe.viewCount}</div>
                </div>
            </div>
        </div>
    )
}

export default Unit;