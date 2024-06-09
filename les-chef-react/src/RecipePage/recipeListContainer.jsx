import React from "react";
import ListContainerHeader from "./ListContainer/recipeListHeader";
import ListContainerBody from "./ListContainer/recipeListBody";

const ListContainer = () => {
    return(
        <div className="listContainer">
            <ListContainerHeader/>
            <ListContainerBody/>
        </div>
    )
}

export default ListContainer;