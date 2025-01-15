//기타
import React, { useEffect } from "react";

//CSS
import styles from "../../../CSS/recipe/list/list.module.css";

//컨텍스트
import { useRecipeContext } from "../../../Context/recipe";
import { useConfig } from "../../../Context/config";

//컴포넌트
import Unit from "./unit";

const List = (props) => {
    const {setInfoGoto, category} = props;
    const {recipeList, setRecipeList} = useRecipeContext();
    const {serverUrl} = useConfig();

    useEffect(() => {
        const recipeListUrl = selectRecipeListUrl(category);
        recipeListSearch(recipeListUrl);

        return () => {
            setRecipeList([]);
        }
    }, [category])

    //레시피 리스트 조회
    const recipeListSearch = (recipeListUrl) => {
        fetch(`${serverUrl}/recipe${recipeListUrl}`).then((response) => {
            return response.json();
        }).then((data) => {
            setRecipeList(data);
        }).catch(err => console.log(err));
    }

    //레시피 리스트 카테고리 URL 선택
    const selectRecipeListUrl = (category) => {
        switch (category) {
            case 'korean':
                return '/koreanList';
            case 'japanese':
                return '/japaneseList';
            case 'chinese':
                return '/chineseList';
            case 'western':
                return '/westernList';
            case 'other':
                return '/otherList';
            case 'share':
                return '/shareList';
        }
    }

    return(
        <div className={styles.body}>
            {(recipeList ? recipeList : []).map((recipe, index) => {
                return (<Unit 
                    key={index} 
                    setInfoGoto={setInfoGoto} 
                    recipeImg={recipe.recipeImg}
                    recipeName={recipe.recipeName}
                    recipeNickName={recipe.userNickName}
                    recipeWatch={recipe.viewCount}
                    isShare={recipe.isShare}/>
                );
            })}
        </div>
    )
}

export default List;