//기타
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

//컨텍스트
import { useConfig } from "../../../../../Context/configContext";
import { useRecipeContext } from "../../../../../Context/recipeContext";

//컴포넌트
import RecipeListUnit from "./listUnit";

const ListBox = (props) => {
    const { setInfoPage, setListPage } = props;
    const navigate = useNavigate();
    const {serverUrl} = useConfig();
    const {recipeList, setRecipeList} = useRecipeContext();

    useEffect(() => {
        fetch(`${serverUrl}/customer/auth`, {
            credentials: 'include'
        }).then(response => response.json()).then((data) => {
            if(data.loggedIn){
                fetch(`${serverUrl}/recipe/myList`,{
                    method: "GET",
                    headers:{
                        "Content-Type" : "application/json"
                    },
                    credentials: "include"
                }).then((response) => {if(response) return response.json()}).then((data) => {
                    setRecipeList(data);
                }).catch(err => console.log(err));
            }else{
                alert('다시 로그인 해주세요!!');
                navigate('/');
            }
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
                        recipeNickName={recipe.userNickName}
                        recipeWatch={recipe.viewCount}
                        recipeImgUrl={recipe.recipeImg}
                    />
                )
            })}
        </>
    )
}

export default ListBox;