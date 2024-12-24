import React from "react";
import { useConfig } from "../../../../../Context/configContext";

const RecipeListUnit = (props) => {
    const { setInfoPage, setListPage } = props;
    const {serverUrl} = useConfig();

    const clickUnit = () => {
        setInfoPage(true);
        setListPage(false);
    }

    return(
        <div className="recipeListUnit" onClick={clickUnit}>
            <img className="customerListImg" src={`${serverUrl}/Image/RecipeImage/ListImg/shrimp_oil_pasta.jpg`}/>
            <div className="customerListInfo">
                <p className="customerListText">새우 오일 파스타</p>
                <div className="customerListStars"></div>
                <div className="customerListWatchs"></div>
            </div>
        </div>
    )
}

export default RecipeListUnit;