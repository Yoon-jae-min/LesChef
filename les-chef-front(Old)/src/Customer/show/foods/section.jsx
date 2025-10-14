//기타
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//CSS
import styles from "../../../CSS/customer/show/foods/section.module.css";

//컨텍스트
import { useConfig } from "../../../Context/config";
import { useUserContext } from "../../../Context/user";
import { useFoods } from "../../../Context/foods";

//컴포넌트
import Unit from "./unit";

const Section = (props) => {
    const {placeName, foodList} = props;
    const {serverUrl} = useConfig();
    const {authCheck} = useUserContext();
    const {sectionList, setSectionList} = useFoods();
    const [nameChange, setNameChange] = useState(false);
    const [unitAdd, setUnitAdd] = useState(false);
    const navigate = useNavigate();

    const checkAuth = async() => {
        if(!await authCheck()){
            alert("다시 로그인해 주세요");
            navigate("/");
            return false;
        }else{
            return true;
        }
    }

    const changeSwitch = () => {
        if(checkAuth()){
            setNameChange((prev) => (!prev));
        }
    }

    const addSwitch = () => {
        if(checkAuth()){
            setUnitAdd((prev) => (!prev));
        }
    }

    const confirmResult = (text) => {
        if(text === "delete"){
            return window.confirm("정말 삭제하시겠습니까?");
        }else if(text === "update"){
            return window.confirm("정말 수정하시겠습니까?");
        }
    }

    const updateSection = () => {
        const changeName = document.querySelector('.foodChangeName').value;

        if(changeName === placeName){
            alert('현재와 동일한 이름입니다');
            return;
        }else if(sectionList.some(place => place.name === changeName)){
            alert('이미 존재하는 장소 입니다');
            return;
        }else if(!confirmResult("update")){
            changeSwitch();
            return;
        }

        if(checkAuth()){
            fetch(`${serverUrl}/foods/place`,{
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    placeName: placeName,
                    changeName: changeName
                }),
                credentials: "include"
            }).then(response => {
                if(!response.ok){
                    throw new Error(`서버오류: ${response.status}`);
                }
                return response.json();
            }).then(data => {
                if(data.same){
                    alert('현재와 동일한 이름입니다');
                    return;
                }
                if(data.exist){
                    alert('이미 존재하는 장소입니다');
                    return;
                }
                setSectionList(data.sectionList);
                changeSwitch();
            }).catch(err => {
                alert("수정을 실패했습니다. 잠시후 다시 시도해주세요");
                window.location.reload();
                console.log(err)
            });
        }
    }

    const deleteSection = () => {
        if(!confirmResult("delete")){
            return;
        }

        if(checkAuth()){
            fetch(`${serverUrl}/foods/place`,{
                method: "DELETE",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    placeName: placeName
                }),
                credentials: "include"
            }).then(response => {
                if(!response.ok){
                    throw new Error(`서버오류: ${response.status}`);
                }
                return response.json();
            }).then(data => {
                setSectionList(data.sectionList);
            }).catch(err => {
                alert("삭제를 실패했습니다. 잠시후 다시 시도해주세요");
                window.location.reload();
                console.log(err)
            });
        }
    }

    const addUnit = () => {
        const unitName = document.querySelector('.foodUnitName').value;
        const unitVol = document.querySelector('.foodUnitVol').value;
        const unitUnit = document.querySelector('.foodUnitUnit').value;
        const unitDate = document.querySelector('.foodUnitDate').value;

        if(!unitName){
            alert('재료명을 입력해주세요');
            return;
        }

        if(checkAuth()){
            fetch(`${serverUrl}/foods/content`,{
                method: "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    placeName: placeName,
                    unitName: unitName,
                    unitVol: unitVol,
                    unitUnit: unitUnit,
                    unitDate: unitDate
                }),
                credentials: "include"
            }).then(response => response.json()).then(data => {
                setSectionList(data.sectionList);
                addSwitch();
            }).catch(err => console.log(err));
        }
    }

    return(
        <div className={styles.box}>
            <div className={styles.head}>
                <p className={styles.nameBox}>{placeName}</p>
                <div className={styles.btnBox}>
                    <img onClick={changeSwitch} className={styles.editBtn} src={`${serverUrl}/Image/CommonImage/edit.png`}/>
                    <img onClick={deleteSection} className={styles.deleteBtn} src={`${serverUrl}/Image/CommonImage/cancel.png`}/>
                </div>
            </div>

            <div className={styles.body}>
                {(foodList ? foodList : []).map((food, index) => 
                    <Unit
                        key={index}
                        placeName={placeName}
                        food={food}/>
                )}
                <div className={styles.plusBox}>
                    {!unitAdd && <img onClick={addSwitch} className={styles.plusBtn} src={`${serverUrl}/Image/CommonImage/add.png`}/>}
                    {unitAdd && 
                        <div className={styles.addBox}>
                            <div className={styles.addHead}>
                                <input type="text" className={`${styles.addName} foodUnitName`} placeholder="재료명을 입력해주세요"/>
                                <div className={styles.addBtnBox}>
                                    <img onClick={addUnit} className={styles.addBtn} src={`${serverUrl}/Image/CommonImage/ok.png`}/>
                                    <img onClick={addSwitch} className={styles.addCancel} src={`${serverUrl}/Image/CommonImage/cancelRed.png`}/>    
                                </div>  
                            </div>
                            <div className={styles.amountBox}>
                                <input type="number" step={0.25} className={`${styles.addVolume} foodUnitVol`}/>
                                <input type="text" className={`${styles.addUnit} foodUnitUnit`} placeholder="단위"/>
                            </div>
                            <input type="date" className={`${styles.addDate} foodUnitDate`}/>  
                        </div>}
                </div>
            </div>

            { nameChange && 
                <div className={styles.changeBox}>
                    <div className={styles.changeInput}>
                        <input className={`${styles.nameInput} foodChangeName`} type="text" placeholder="보관 장소를 입력해주세요"/>
                        <div className={styles.changeBtnBox}>
                            <img onClick={updateSection} className={styles.okBtn} src={`${serverUrl}/Image/CommonImage/ok.png`}/>
                            <img onClick={changeSwitch} className={styles.chgCancel} src={`${serverUrl}/Image/CommonImage/cancelRed.png`}/>    
                        </div>    
                    </div>    
                </div>}
        </div>
    )
}

export default Section;