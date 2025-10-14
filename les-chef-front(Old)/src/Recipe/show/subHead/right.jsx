//기타
import React from "react";

//CSS
import styles from "../../../CSS/recipe/show/subHead.module.css";

//컨텍스트
import { useConfig } from "../../../Context/config";
import { useRecipeContext } from "../../../Context/recipe";
import { useUserContext } from "../../../Context/user";

const Right = (props) => {
    const {infoGoto} = props;
    const {serverUrl} = useConfig();
    const {recipeWish, selectedRecipe, setRecipeWish, recipeList, setRecipeList} = useRecipeContext();
    const {authCheck} = useUserContext();

    const clickWish = async () => {
        if(await authCheck()){
            fetch(`${serverUrl}/recipe/clickWish`, {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    recipeId: selectedRecipe._id
                }),
                credentials: "include"
            }).then(response => response.json()).then((data) => {
                setRecipeWish(data.recipeWish);
            }).catch(err => console.log(err));
        }else{
            alert("로그인이 필요합니다!!!");
        }
    }

    const orderCreate = () => {
        setRecipeList((prev) => 
            [...prev].sort((a, b) => {
                if(new Date(b.createdAt) - new Date(a.createdAt)){
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }
                return a.recipeName.localeCompare(b.recipeName);
            })
        );
    }

    const orderView = () => {
        setRecipeList((prev) => 
            [...prev].sort((a, b) => {
                if (b.viewCount !== a.viewCount) {
                    return b.viewCount - a.viewCount;
                }
                return a.recipeName.localeCompare(b.recipeName);
            })
        );
    }

    return(
        <div className={styles.right}>
            {infoGoto && 
                    <img 
                        onClick={clickWish}
                        className={styles.wishImg}
                        src={`${recipeWish ? 
                                serverUrl + '/Image/RecipeImage/InfoImg/selected.png' : 
                                serverUrl + '/Image/RecipeImage/InfoImg/unSelected.png'}`}/>
            }
            {!infoGoto && 
                <React.Fragment>
                    <div onClick={orderCreate} className={styles.orderBtn}>최신순</div>
                    <div onClick={orderView} className={styles.orderBtn}>조회순</div></React.Fragment>
            }
        </div>
    )
}

export default Right;