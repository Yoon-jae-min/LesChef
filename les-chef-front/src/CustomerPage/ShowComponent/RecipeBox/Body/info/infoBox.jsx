import React from "react";
import InfoStepEach from "./infoStepEach";
import IngredientSection from "./ingredientSection";
import IconEach from "./iconEach";

const InfoBox = () => {
    return(
        <>
            <div className="customerRecipeLeft">
                <img className="customerRecipeMainImg" src="/Image/RecipeImage/ListImg/shrimp_oil_pasta.jpg"/>
                <div className="customerRecipeStepBox">
                    <InfoStepEach imageSrc="/Image/RecipeImage/InfoImg/step/shrimp_oil_pasta_01.jpg" stepNum="1" stepText="마늘은 편으로 썰고 페페론치노와 이태리파슬리는 굵게 다져주세요. 새우는 머리를 떼어내고 꼬리만 남겨 껍질을 제거해 주세요."/>
                    <InfoStepEach imageSrc="/Image/RecipeImage/InfoImg/step/shrimp_oil_pasta_02.jpg" stepNum="2" stepText={<>
                                        물 8컵에 소금 1큰술을 넣고 스파게티 면을 6분 정도 삶고 넓은 그릇에 펼친 후 올리브오일을 뿌려주세요.
                                        <br />
                                        <br />
                                        (tip. 면 삶은 물 ⅓컵은 남겨주세요.)
                                        </>}/>
                    <InfoStepEach imageSrc="/Image/RecipeImage/InfoImg/step/shrimp_oil_pasta_03.jpg" stepNum="3" stepText="팬에 올리브오일을 두르고 마늘 편과 페페론치노를 넣어 약간의 소금과 후추로 밑간하여 볶아주세요. 손질한 새우를 넣어 마늘이 노릇해질 때까지 볶아주세요."/>
                    <InfoStepEach imageSrc="/Image/RecipeImage/InfoImg/step/shrimp_oil_pasta_04.jpg" stepNum="4" stepText="삶은 스파게티 면을 넣고 약간의 소금과 후추로 간을 하고 면과 소스가 겉돌지 않게 면수, 치킨스톡을 넣어주면서 볶아주세요. 마지막에 약간의 올리브오일과 이태리파슬리를 뿌리고 불을 꺼주세요."/>
                    <InfoStepEach imageSrc="/Image/RecipeImage/InfoImg/step/shrimp_oil_pasta_05.jpg" stepNum="5" stepText="그릇에 담아 맛있게 즐겨주세요."/>
                </div>
            </div>
            <div className="customerRecipeRight">
                <div className="customerRecipeIngredientBox">
                    <IngredientSection sectionText="기본 재료"/>
                </div>
                <div className="customerRecipeIconBox">
                    <IconEach infoIconImg="/Image/RecipeImage/InfoImg/timer.png" infoIconText="25분"/>
                    <IconEach infoIconImg="/Image/RecipeImage/InfoImg/people.png" infoIconText="2인분"/>
                    <IconEach infoIconImg="/Image/RecipeImage/InfoImg/level.png" infoIconText="30분"/>
                </div>
            </div>
        </>
    )
}

export default InfoBox;