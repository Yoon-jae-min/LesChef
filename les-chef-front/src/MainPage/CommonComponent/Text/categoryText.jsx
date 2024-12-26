import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const CategoryText = (props) => {
    const {menuModal} = props;

    useEffect(() => {
        const textPs = document.querySelectorAll('.menuText');

        if(!menuModal){
            textPs.forEach((textP) => {
                textP.classList.add('noneShow');
            })
        }else{
            textPs.forEach((textP) => {
                textP.classList.remove('noneShow');
            })
        }
    }, [menuModal]);

    const handleCategoryClick = (category) => {
        localStorage.setItem("selectedCategory", category); // 카테고리 저장
    };

    return(
        <div className="mainCategoryText">
                <Link to="/recipeMain" state={{category: "korean"}} onClick={() => handleCategoryClick("korean")} className="goToRecipePage"><div><p className="menuText">Korean</p></div></Link>
                <Link to="/recipeMain" state={{category: "western"}} onClick={() => handleCategoryClick("western")} className="goToRecipePage"><div><p className="menuText">Western</p></div></Link>
                <Link to="/recipeMain" state={{category: "japanese"}} onClick={() => handleCategoryClick("japanese")} className="goToRecipePage"><div><p className="menuText">Japanese</p></div></Link>
                <Link to="/recipeMain" state={{category: "chinese"}} onClick={() => handleCategoryClick("chinese")} className="goToRecipePage"><div><p className="menuText">Chinese</p></div></Link>
                <Link to="/recipeMain" state={{category: "share"}} onClick={() => handleCategoryClick("share")} className="goToRecipePage"><div><p className="menuText">Share Recipe</p></div></Link>
                <Link to="/communityMain" className="goToRecipePage"><div><p className="menuText">Community</p></div></Link>
        </div>
    )
}

export default CategoryText;