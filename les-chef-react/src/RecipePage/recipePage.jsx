import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./recipePage.css";
import RecipeBgImg from "../Image/RecipeImage/Background/recipeBackground.jpg";
import RecipeShowBox from "./ShowComponent/recipeShowBox";
import RecipeMenuBox from "./MenuComponent/recipeMenuBox";

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
            <RecipeMenuBox setCategory={setCategory} setInfoGoto={setInfoGoto}/>
            <RecipeShowBox category={category} infoGoto={infoGoto} setInfoGoto={setInfoGoto}/>
        </div>
    )
}

export default RecipePage;