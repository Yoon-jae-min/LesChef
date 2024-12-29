//기타
import React, { useState } from "react";

//컨텍스트
import { useRecipeContext } from "../../../../Context/recipeContext";

const RecipeHeadSolt = (props) => {
    const { infoPage, listPage, writePage } = props;
    const { setWrRecipeInfo } = useRecipeContext();
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
        <div className="customerRecipeSolt">
            { listPage && 
                <React.Fragment>
                    <span className="headSoltUnit active">전체</span>
                    <span className="headSoltUnit">한식</span>
                    <span className="headSoltUnit">일식</span>
                    <span className="headSoltUnit">중식</span>
                    <span className="headSoltUnit">양식</span>
                </React.Fragment> }
            { infoPage && 
                <span className="recipeInfoTitle">새우 오일 파스타</span> }
            { writePage &&
                <React.Fragment>
                    <input onChange={(e) => changeRecipeName(e.target.value)} type="text" className="cusWrRecipeName" placeholder="레시피 이름"/>
                    <select className="cusWrCategorySelect" onChange={(e) => changeMajorCategory(e.target.value)}>
                        <option value="">-- 선택하세요 --</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                            {category}
                            </option>
                        ))}
                    </select>
                    <select className="cusWrCategorySelect" onChange={(e) => changeSubCategory(e.target.value)}>
                        <option value="">-- 선택하세요 --</option>
                        {options.map((subCategory) => (
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