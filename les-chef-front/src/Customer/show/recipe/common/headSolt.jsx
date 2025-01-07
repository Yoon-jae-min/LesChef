//기타
import React, { useState } from "react";

//CSS
import recipe from "../../../../CSS/customer/show/reicpe/common/recipe.module.css";
import info from "../../../../CSS/customer/show/reicpe/info/info.module.css";
import write from "../../../../CSS/customer/show/reicpe/write/write.module.css";

//컨텍스트
import { useRecipeContext } from "../../../../Context/recipeContext";

const RecipeHeadSolt = (props) => {
    const { infoPage, listPage, writePage } = props;
    const { setWrRecipeInfo, selectedRecipe } = useRecipeContext();
    const [options, setOptions] = useState([]);

    const categories = ["한식", "일식", "중식", "양식", "기타"];
    const subcategories = {
        한식: ["국/찌개", "밥/면", "반찬", "기타"],
        일식: ["국/전골", "밥", "면", "기타"],
        중식: ["튀김/찜", "밥", "면", "기타"],
        양식: ["스프/스튜", "면", "빵", "기타"],
        기타: ["면", "밥", "국", "기타"]
    };

    const changeRecipeName = (recipeName) => {
        setWrRecipeInfo((preInfo) => ({...preInfo, recipeName: recipeName}));
    }

    const changeMajorCategory = (majorCategory) => {
        setOptions(subcategories[majorCategory]);
        setWrRecipeInfo((preInfo) => (
            {...preInfo, majorCategory: majorCategory}
        ));
    }

    const changeSubCategory = (subCategory) => {
        setWrRecipeInfo((preInfo) => (
            {...preInfo, subCategory: subCategory}
        ))
    }

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
            { infoPage && 
                <span className={info.recipeName}>{selectedRecipe.recipeName}</span> }
            { writePage &&
                <React.Fragment>
                    <input onChange={(e) => changeRecipeName(e.target.value)} type="text" className={write.recipeName} placeholder="레시피 이름"/>
                    <select className={write.category} onChange={(e) => changeMajorCategory(e.target.value)}>
                        <option value="">-- 선택하세요 --</option>
                        {categories && categories.map((category) => (
                            <option key={category} value={category}>
                            {category}
                            </option>
                        ))}
                    </select>
                    <select className={write.category} onChange={(e) => changeSubCategory(e.target.value)}>
                        <option value="">-- 선택하세요 --</option>
                        {options && options.map((subCategory) => (
                            <option key={subCategory} value={subCategory}>
                                {subCategory}
                            </option>
                        ))}
                    </select>
                </React.Fragment> }
        </div>
    )
}

export default RecipeHeadSolt;