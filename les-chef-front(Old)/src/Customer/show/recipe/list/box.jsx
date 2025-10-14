//기타
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//CSS
import styles from "../../../../CSS/customer/show/reicpe/list/list.module.css";

//컨텍스트
import { useConfig } from "../../../../Context/config";
import { useUserContext } from "../../../../Context/user";
import { useRecipeContext } from "../../../../Context/recipe";

//컴포넌트
import RecipeListUnit from "./unit";

const ListBox = (props) => {
    const { setInfoPage, setListPage } = props;
    const navigate = useNavigate();
    const {serverUrl} = useConfig();
    const {authCheck} = useUserContext();
    const {recipeList, setRecipeList, soltText} = useRecipeContext();

    useEffect(() => {
        const userCheck = async() => {
            return await authCheck(); 
        }

        if(userCheck()){
            fetch(`${serverUrl}/recipe/myList`,{
                method: "GET",
                headers:{
                    "Content-Type" : "application/json"
                },
                credentials: "include"
            }).then((response) =>  response.json()).then((data) => {
                if(data.list.length === 0){
                    setRecipeList([]);
                }else{
                    setRecipeList(data.list);
                }
            }).catch(err => console.log(err));
        }else{
            alert('다시 로그인 해주세요!!');
            navigate('/');
        }

        return () => {
            setRecipeList([]);
        }
    }, [])

    return(
        <React.Fragment>
            {((recipeList ? recipeList : []).length !== 0) ? (recipeList?.map((recipe, index) => {
                if(soltText === "전체"){
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
                }else{
                    if(soltText === recipe.majorCategory){
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
                    }
                }
            })) : <div className={styles.empty}>레시피가 없습니다</div>}
        </React.Fragment>
    )
}

export default ListBox;