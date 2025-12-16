//기타
import React from "react";

//CSS
import styles from "../../../../CSS/customer/show/reicpe/common/recipe.module.css";

//컨텍스트
import { useConfig } from "../../../../Context/config";
import { useRecipeContext } from "../../../../Context/recipe";

//컴포넌트
import HeadLeft from "./headLeft";

const Head = (props) => {
    const {listPage, setListPage} = props;
    const {serverUrl} = useConfig();
    const {recipeWish, setRecipeWish, selectedRecipe} = useRecipeContext(); 

    const GoToList = () => {
        setListPage(true);
    }

    const clickWish = () => {
        fetch(`${serverUrl}/recipe/clickWish`,{
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                recipeId: selectedRecipe._id
            }),
            credentials: "include"
        }).then(response => response.json()).then(data => {
            console.log(data.recipeWish)
            setRecipeWish(data.recipeWish);
        }).catch(err => console.log(err));
    }

    return(
        <div className={styles.head}>
            <HeadLeft listPage={listPage}></HeadLeft>
            { !listPage && 
                <img onClick={GoToList} className={styles.listBtn} src={`${serverUrl}/Image/CommonImage/goToBack.png`}/> }
            { !listPage && 
                (recipeWish ?
                    <img onClick={clickWish} className={styles.wishBtn} src={`${serverUrl}/Image/RecipeImage/InfoImg/selected.png`}/> :
                    <img onClick={clickWish} className={styles.wishBtn} src={`${serverUrl}/Image/RecipeImage/InfoImg/unSelected.png`}/>) }
        </div>
    )
}

export default Head;