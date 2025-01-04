//기타
import React from "react";

//컨텍스트
import { useConfig } from "../../../Context/configContext";
import { useRecipeContext } from "../../../Context/recipeContext";
import { useAuthContext } from "../../../Context/authContext";

const ShowGpBoxRight = (props) => {
    const {infoGoto} = props;
    const {serverUrl} = useConfig();
    const {recipeWish, selectedRecipe, setRecipeWish} = useRecipeContext();
    const {setIsLogin} = useAuthContext();

    const clickWish = () => {
        fetch(`${serverUrl}/customer/auth`,{
            credentials: "include"
        }).then(response => response.json()).then((data) => {
            if(data.loggedIn){
                fetch(`${serverUrl}/recipe/clickWish`, {
                    method: "POST",
                    headers: {
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                        recipeId: selectedRecipe._id
                    }),
                    credentials: "include"
                }).then(response => response.json()).then((data) => {
                    setRecipeWish(data.recipeWish);
                    console.log(data.recipeWish);
                }).catch(err => console.log(err));
            }else{
                alert("로그인이 필요합니다!!!");
                setIsLogin(false);
            }
        }).catch(err => console.log(err));
    }

    return(
        <div className="showGpBoxRight">
            {infoGoto && 
                    <img 
                        onClick={clickWish}
                        className="wishSelectImg" 
                        src={`${recipeWish ? 
                                serverUrl + '/Image/RecipeImage/InfoImg/selected.png' : 
                                serverUrl + '/Image/RecipeImage/InfoImg/unSelected.png'}`}/>
            }
            {!infoGoto && 
                <React.Fragment>
                    <div className="orderButton">최신순</div>
                    <div className="orderButton">조회순</div></React.Fragment>
            }
        </div>
    )
}

export default ShowGpBoxRight;