import React from "react";
import InfoStepEach from "./stepEach";

const InfoStepBox = () => {
    return(
        <div className="infoStepBox">
            <InfoStepEach imageSrc="/Image/RecipeImage/InfoImg/step/참치김치찌개_01.jpg" stepNum="1" stepText="묵은지와 두부는 적당한 크기로 썰어주세요. 양파는 채썰고, 대파와 청양고추는 어슷 썰어주세요."/>
            <InfoStepEach imageSrc="/Image/RecipeImage/InfoImg/step/참치김치찌개_02.jpg" stepNum="2" stepText="달군냄비에 들기름과 참치캔 기름을 넣고 묵은지와 양파, 설탕을 넣어 양파가 투명해질 때까지 볶아주세요."/>
            <InfoStepEach imageSrc="/Image/RecipeImage/InfoImg/step/참치김치찌개_03.jpg" stepNum="3" stepText="물, 다진마늘, 김치국물, 고춧가루, 참치캔을 넣어 중불에서 약 5분간 끓여주세요."/>
            <InfoStepEach imageSrc="/Image/RecipeImage/InfoImg/step/참치김치찌개_04.jpg" stepNum="4" stepText="대파와 청양고추, 두부를 넣고 한소끔 더 끓여주세요."/>
            <InfoStepEach imageSrc="/Image/RecipeImage/InfoImg/step/참치김치찌개_05.jpg" stepNum="5" stepText="따뜻할 때 밥과 함께 즐겨주세요."/>
        </div>
    )
}

export default InfoStepBox;