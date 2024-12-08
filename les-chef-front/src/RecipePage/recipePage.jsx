import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./recipePage.css";
import RecipeShowBox from "./ShowComponent/box";
import RecipeMenuBox from "./MenuComponent/box";
import IconBox from "./iconBox";

const RecipePage = () => {
    const location = useLocation();
    const [category, setCategory] = useState('korean');
    const [infoGoto, setInfoGoto] = useState(false);

    useEffect(() => {
        setCategory(location.state.category);
    }, []);

    return(
        <div className="recipeBody">
            <img src="/Image/RecipeImage/Background/recipeBackground.jpg" className="recipeBgImg"/>
            <IconBox/>
            <RecipeMenuBox setCategory={setCategory} setInfoGoto={setInfoGoto}/>
            <RecipeShowBox category={category} infoGoto={infoGoto} setInfoGoto={setInfoGoto}/>
        </div>
    )
}

export default RecipePage;