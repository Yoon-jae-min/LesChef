//기타
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//CSS
import styles from "../../../CSS/customer/show/foods/foods.module.css";

//컨텍스트
import {useConfig} from "../../../Context/config";
import { useUserContext } from "../../../Context/user";
import { useFoods } from "../../../Context/foods";

//컴포넌트
import Section from "./section";

const Body = () => {
    const navigate = useNavigate();
    const {serverUrl} = useConfig();
    const {authCheck} = useUserContext();
    const {sectionList, setSectionList} = useFoods();
    const [placeInput, setPlaceInput] = useState(false);

    const sectionInput = () => {
        setPlaceInput((prev) => (!prev));
    }

    const addSection = () => {
        const name = document.querySelector(".foodsPlaceName").value

        if(!name){
            alert("장소를 입력해주세요");
            return;
        }

        if(authCheck()){
            fetch(`${serverUrl}/foods/place`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    placeName: name
                }),
                credentials: "include"
            }).then(response => response.json()).then(data => {
                if(data.result){
                    alert("중복된 장소입니다.");
                    sectionInput();
                }else{
                    console.log(data.sectionList);
                    setSectionList(data.sectionList);
                    sectionInput();
                }
            }).catch(err => {
                alert("등록에 실패했습니다. 잠시후 다시 시도해주세요");
                window.location.reload();
                console.log(err)
            });
        }else{
            alert("다시 로그인해 주세요");
            navigate("/");
        }
    }

    return(
        <div className={styles.body}>
            {(sectionList ? sectionList : []).map((section, index) => 
                <Section
                    key={index}
                    name={section.name}
                    foodList={section.foodList}/>
            )}
            <div className={styles.plus}>
                {!placeInput && <img onClick={sectionInput} className={styles.plusImg} src={`${serverUrl}/Image/CommonImage/add.png`}/>}
                {placeInput && 
                    <div className={styles.placeBox}>
                        <input className={`${styles.placeInput} foodsPlaceName`} type="text" placeholder="보관 장소를 입력해주세요"/> 
                        <div className={styles.inputBtn}>
                            <img onClick={addSection} className={styles.okBtn} src={`${serverUrl}/Image/CommonImage/ok.png`}/>
                            <img onClick={sectionInput} className={styles.cancelBtn} src={`${serverUrl}/Image/CommonImage/cancelRed.png`}/>   
                        </div>
                    </div>}

            </div>
        </div>
    )
}

export default Body;