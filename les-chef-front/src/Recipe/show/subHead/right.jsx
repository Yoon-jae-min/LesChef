//기타
import React from "react";

//CSS
import styles from "../../../CSS/recipe/show/subHead.module.css";

//컨텍스트
import { useConfig } from "../../../Context/configContext";
import { useRecipeContext } from "../../../Context/recipeContext";
import { useAuthContext } from "../../../Context/authContext";

const Right = (props) => {
    const {infoGoto} = props;
    const {serverUrl} = useConfig();
    const {recipeWish, selectedRecipe, setRecipeWish} = useRecipeContext();
    const {setIsLogin} = useAuthContext();

    const clickWish = () => {
        fetch(`${serverUrl}/customer/auth`,{
            credentials: "include"
        }).then(response => response.json()).then((data) => {
            if(data.loggedIn){
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
                    console.log(data.recipeWish);
                }).catch(err => console.log(err));
            }else{
                alert("로그인이 필요합니다!!!");
                setIsLogin(false);
            }
        }).catch(err => console.log(err));
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
                    <div className={styles.orderBtn}>최신순</div>
                    <div className={styles.orderBtn}>조회순</div></React.Fragment>
            }
        </div>
    )
}

export default Right;