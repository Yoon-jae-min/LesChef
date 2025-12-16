//기타
import React from "react";

//CSS
import recipe from "../../../../CSS/customer/show/reicpe/common/recipe.module.css";
import info from "../../../../CSS/customer/show/reicpe/info/info.module.css";

//컨텍스트
import { useRecipeContext } from "../../../../Context/recipe";

const HeadLeft = (props) => {
    const {listPage} = props;
    const {selectedRecipe} = useRecipeContext();

    return(
        <div className={recipe.soltBox}>
            { listPage && 
                <React.Fragment>
                    <span className={`${recipe.soltUnit} ${recipe.active}`}>전체</span>
                    <span className={recipe.soltUnit}>한식</span>
                    <span className={recipe.soltUnit}>일식</span>
                    <span className={recipe.soltUnit}>중식</span>
                    <span className={recipe.soltUnit}>양식</span>
                </React.Fragment> }
            { !listPage && 
                <span className={info.recipeName}>{selectedRecipe.recipeName}</span> }
        </div>
    )
}

export default HeadLeft;