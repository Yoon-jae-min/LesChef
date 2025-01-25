//기타
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//CSS
import recipe from "../../../../CSS/customer/show/reicpe/common/recipe.module.css";
import info from "../../../../CSS/customer/show/reicpe/info/info.module.css";
import write from "../../../../CSS/customer/show/reicpe/write/write.module.css";

//컨텍스트
import { useRecipeContext } from "../../../../Context/recipe";
import { useUserContext } from "../../../../Context/user";

const RecipeHeadSolt = (props) => {
    const { infoPage, listPage, writePage } = props;
    const { setWrRecipeInfo, selectedRecipe, setSoltText } = useRecipeContext();
    const [options, setOptions] = useState([]);
    const {authCheck} = useUserContext();
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);

    const categories = ["한식", "일식", "중식", "양식", "기타"];
    const subcategories = {
        한식: ["국/찌개", "밥/면", "반찬", "기타"],
        일식: ["국/전골", "밥", "면", "기타"],
        중식: ["튀김/찜", "밥", "면", "기타"],
        양식: ["스프/스튜", "면", "빵", "기타"],
        기타: ["면", "밥", "국", "기타"]
    };

    const userCheck = async() => {
        return await authCheck();
    }

    const loginMessage = () => {
        alert('다시 로그인 해주세요');
        navigate('/');
    }

    const changeRecipeName = (recipeName) => {
        if(userCheck()){
            setWrRecipeInfo((preInfo) => ({...preInfo, recipeName: recipeName}));
        }else{
            loginMessage();
        }
    }

    const changeMajorCategory = (majorCategory) => {
        if(userCheck()){
            setOptions(subcategories[majorCategory]);
            setWrRecipeInfo((preInfo) => (
                {...preInfo, majorCategory: majorCategory}
            ));
        }else{
            loginMessage();
        }
    }

    const changeSubCategory = (subCategory) => {
        if(userCheck()){
            setWrRecipeInfo((preInfo) => (
                {...preInfo, subCategory: subCategory}
            ))
        }else{
            loginMessage();
        }
    }

    const soltClick = (text, index) => {
        setSoltText(text);
        setActiveIndex(index);
    }

    return(
        <div className={recipe.soltBox}>
            { listPage && 
                <React.Fragment>
                    <span 
                        onClick={(e) => soltClick(e.target.innerHTML, 0)} 
                        className={`${recipe.soltUnit} ${activeIndex === 0 ? recipe.active : ""}`}>전체</span>
                    <span 
                        onClick={(e) => soltClick(e.target.innerHTML, 1)} 
                        className={`${recipe.soltUnit} ${activeIndex === 1 ? recipe.active : ""}`}>한식</span>
                    <span 
                        onClick={(e) => soltClick(e.target.innerHTML, 2)} 
                        className={`${recipe.soltUnit} ${activeIndex === 2 ? recipe.active : ""}`}>일식</span>
                    <span 
                        onClick={(e) => soltClick(e.target.innerHTML, 3)} 
                        className={`${recipe.soltUnit} ${activeIndex === 3 ? recipe.active : ""}`}>중식</span>
                    <span 
                        onClick={(e) => soltClick(e.target.innerHTML, 4)} 
                        className={`${recipe.soltUnit} ${activeIndex === 4 ? recipe.active : ""}`}>양식</span>
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