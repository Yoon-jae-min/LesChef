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

    return(
        <div className="mainCategoryText">
                <Link to="/recipeMain" className="goToRecipePage"><div><p className="menuText">Korean</p></div></Link>
                <Link to="/recipeMain" className="goToRecipePage"><div><p className="menuText">Western</p></div></Link>
                <Link to="/recipeMain" className="goToRecipePage"><div><p className="menuText">Japanese</p></div></Link>
                <Link to="/recipeMain" className="goToRecipePage"><div><p className="menuText">Chinese</p></div></Link>
                <Link to="/recipeMain" className="goToRecipePage"><div><p className="menuText">Share Recipe</p></div></Link>
                <Link to="/recipeMain" className="goToRecipePage"><div><p className="menuText">Community</p></div></Link>
        </div>
    )
}

export default CategoryText;