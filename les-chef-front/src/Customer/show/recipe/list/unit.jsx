//기타
import React from "react";
import {useNavigate} from "react-router-dom";

//CSS
import styles from "../../../../CSS/customer/show/reicpe/list/list.module.css";

//컨텍스트
import { useConfig } from "../../../../Context/config";
import { useRecipeContext } from "../../../../Context/recipe";
import {useUserContext} from "../../../../Context/user";

const RecipeListUnit = (props) => {
    const { setInfoPage, 
            setListPage, 
            recipeImgUrl, 
            recipeName,
            recipeNickName,
            recipeWatch } = props;
    const {serverUrl} = useConfig();
    const { setRecipeIngres, 
            setRecipeSteps, 
            setSelectedRecipe } = useRecipeContext();
    const {authCheck} = useUserContext();
    const navigate = useNavigate();

    const clickUnit = async() => {
        if(await authCheck()){
            fetch(`${serverUrl}/recipe/info?recipeName=${recipeName}`)
            .then(response => response.json())
            .then((data) => {
                setRecipeIngres(data.recipeIngres);
                setRecipeSteps(data.recipeSteps);
                setSelectedRecipe(data.selectedRecipe);
                setInfoPage(true);
                setListPage(false);
            }).catch(err => console.log(err));
        }else{
            alert('다시 로그인 해주세요');
            navigate('/');
        }
    }

    return(
        <div className={styles.unit} onClick={clickUnit}>
            <img className={styles.img} src={`${serverUrl}${recipeImgUrl}`}/>
            <p className={styles.recipeName}>{recipeName}</p>
            <div className={styles.infoBox}>
                <div className={styles.nickName}>{recipeNickName}</div>
                <div className={styles.watchBox}>
                    <img className={styles.watchImg} src={`${serverUrl}/Image/CommonImage/watch.png`}/>
                    <div className={styles.watchCount}>{recipeWatch}</div>
                </div>
                
            </div>
        </div>
    )
}

export default RecipeListUnit;