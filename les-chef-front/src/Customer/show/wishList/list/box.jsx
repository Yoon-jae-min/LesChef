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
import Unit from "./unit";

const ListBox = (props) => {
    const {setListPage} = props;
    const {serverUrl} = useConfig();
    const {authCheck} = useUserContext();
    const {recipeList, setRecipeList} = useRecipeContext();
    const navigate = useNavigate();

    useEffect(() => {
        const userCheck = async() => {
            return await authCheck();
        }

        if(!userCheck()){
            alert('다시 로그인해 주세요');
            navigate('/');
        }else{
            fetch(`${serverUrl}/recipe/wishList`,{
                credentials: "include"
            }).then(response => response.json()).then(data => {
                if(data.wishList.length === 0){
                    setRecipeList([]);
                }else{
                    setRecipeList(data.wishList);
                }
            }).catch(err => console.log(err));
        }

        return () => {
            setRecipeList([]);
        }
    }, []);

    return(
        <React.Fragment>
            {((recipeList ? recipeList : []).length !== 0) ? (recipeList?.map((recipe, index) => {
                return <Unit 
                            key={index}
                            recipe={recipe}
                            setListPage={setListPage}/>
            })) : <div className={styles.empty}>레시피가 없습니다</div>}
        </React.Fragment>
    )
}

export default ListBox;