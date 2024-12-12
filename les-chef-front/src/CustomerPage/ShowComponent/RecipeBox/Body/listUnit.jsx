import React from "react";

const RecipeListUnit = () => {
    return(
        <div className="recipeListUnit">
            <img className="customerListImg" src="/Image/CustomerImage/Recipe/ListImg/shrimp_oil_pasta.jpg"/>
            <div className="customerListInfo">
                <p className="customerListText">새우 오일 파스타</p>
                <div className="customerListStars"></div>
                <div className="customerListWatchs"></div>
            </div>
        </div>
    )
}

export default RecipeListUnit;