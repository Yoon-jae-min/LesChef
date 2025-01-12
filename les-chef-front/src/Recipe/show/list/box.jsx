//기타
import React from "react";

//CSS
import styles from "../../../CSS/recipe/list/list.module.css";

//컨텍스트
import { useRecipeContext } from "../../../Context/recipe";

//컴포넌트
import Unit from "./unit";

const List = (props) => {
    const {setInfoGoto} = props;
    const {recipeList} = useRecipeContext();

    return(
        <div className={styles.body}>
            {recipeList.map((recipe, index) => {
                return (<Unit 
                    key={index} 
                    setInfoGoto={setInfoGoto} 
                    recipeImg={recipe.recipeImg}
                    recipeName={recipe.recipeName}
                    recipeNickName={recipe.userNickName}
                    recipeWatch={recipe.viewCount}
                    isShare={recipe.isShare}/>
                );
            })}
        </div>
    )
}

export default List;