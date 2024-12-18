import React from "react";

const RecipeHeadSolt = (props) => {
    const { infoPage, listPage } = props;

    return(
        <div className="customerRecipeSolt">
            { listPage && <>
                <span className="headSoltUnit active">전체</span>
                <span className="headSoltUnit">한식</span>
                <span className="headSoltUnit">일식</span>
                <span className="headSoltUnit">중식</span>
                <span className="headSoltUnit">양식</span>
            </> }
            { infoPage && <span className="recipeInfoTitle">새우 오일 파스타</span> }
        </div>
    )
}

export default RecipeHeadSolt;