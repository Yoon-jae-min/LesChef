import React, { useEffect, useState } from "react";
import RecipeListUnit from "./listUnit";
import { useConfig } from "../../../../../Context/configContext";
import { useRecipeContext } from "../../../../../Context/recipeContext";

const ListBox = (props) => {
    const { setInfoPage, setListPage } = props;
    const {serverUrl} = useConfig();
    const {recipeList, setRecipeList} = useRecipeContext();

    useEffect(() => {
        fetch(`${serverUrl}/recipe/myList`,{
            method: "GET",
            headers:{
                "Content-Type" : "application/json"
            },
            credentials: "include"
        }).then((response) => response.json()).then((data) => {
            setRecipeList(data);
        }).catch(err => console.log(err));
    }, [])

    return(
        <>
            {recipeList.map((recipe, index) => {
                return(
                    <RecipeListUnit
                        key={index}
                        setInfoPage={setInfoPage} 
                        setListPage={setListPage}
                        recipeName={recipe.recipeName}
                        recipeImgUrl={recipe.recipeImg}
                    />
                )
            })}
        </>
    )
}

export default ListBox;