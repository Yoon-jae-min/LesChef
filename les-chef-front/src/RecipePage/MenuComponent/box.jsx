//기타
import React from "react";
import { Link } from "react-router-dom";

//컨텍스트
import { useConfig } from "../../Context/configContext";

//컴포넌트
import RecipeMenuText from "./text";


const RecipeMenuBox = (props) => {
    const {setCategory, setInfoGoto} = props;
    const { serverUrl } = useConfig();

    const categoryStateReset = () => {
        localStorage.setItem("selectedCategory", "");
    }
    
    return(
        <div className="recipeMenuBox">
            <RecipeMenuText 
                setCategory={setCategory} 
                setInfoGoto={setInfoGoto}/>
            <Link 
                to="/" 
                onClick={categoryStateReset}>
                    <img 
                        className="recipeLogo" 
                        src={`${serverUrl}/Image/CommonImage/LogoWhite.png`}/></Link>
        </div>
    )
}

export default RecipeMenuBox