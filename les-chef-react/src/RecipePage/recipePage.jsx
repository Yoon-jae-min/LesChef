import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./recipePage.css";
import RecipeBgImg from "../Image/RecipeImage/Background/recipeBackground.jpg";
import RecipeShowBox from "./ShowComponent/showBox";
import RecipeMenuBox from "./MenuComponent/menuBox";
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
            <img src={RecipeBgImg} className="recipeBgImg"/>
            <IconBox/>
            <RecipeMenuBox setCategory={setCategory} setInfoGoto={setInfoGoto}/>
            <RecipeShowBox category={category} infoGoto={infoGoto} setInfoGoto={setInfoGoto}/>
        </div>
    )
}

export default RecipePage;