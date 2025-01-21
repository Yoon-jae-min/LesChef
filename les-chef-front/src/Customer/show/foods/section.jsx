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
    const {name, foodList} = props;
    const {serverUrl} = useConfig();
    const {authCheck} = useUserContext();
    const {setSectionList} = useFoods();
    const [nameChange, setNameChange] = useState(false);
    const [unitAdd, setUnitAdd] = useState(false);
    const navigate = useNavigate();

    const changeSwitch = () => {
        setNameChange((prev) => (!prev));
    }

    const addSwitch = () => {
        setUnitAdd((prev) => (!prev));
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

        if(changeName === name){
            alert('현재와 동일한 이름입니다');
            return;
        }else if(!confirmResult("update")){
            changeSwitch();
            return;
        }

        if(authCheck()){
            fetch(`${serverUrl}/foods/place`,{
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    placeName: changeName
                }),
                credentials: "include"
            }).then(response => {
                if(!response.ok){
                    throw new Error(`서버오류: ${response.status}`);
                }
                return response.json();
            }).then(data => {

            }).catch(err => {
                alert("수정을 실패했습니다. 잠시후 다시 시도해주세요");
                window.location.reload();
                console.log(err)
            })
        }else{
            alert("다시 로그인해 주세요");
            navigate("/");
        }
    }

    const deleteSection = () => {
        if(!confirmResult("delete")){
            return;
        }

        if(authCheck()){
            fetch(`${serverUrl}/foods/place`,{
                method: "DELETE",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    placeName: name
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
        }else{
            alert("다시 로그인해 주세요");
            navigate("/");
        }
    }

    return(
        <div className={styles.box}>
            <div className={styles.head}>
                <p className={styles.nameBox}>{name}</p>
                <div className={styles.btnBox}>
                    <img onClick={changeSwitch} className={styles.editBtn} src={`${serverUrl}/Image/CommonImage/edit.png`}/>
                    <img onClick={deleteSection} className={styles.deleteBtn} src={`${serverUrl}/Image/CommonImage/cancel.png`}/>
                </div>
            </div>

            <div className={styles.body}>
                {(foodList ? foodList : []).map((food, index) => 
                    <Unit
                        key={index}
                        food={food}/>
                )}
                <div className={styles.plusBox}>
                    {!unitAdd && <img onClick={addSwitch} className={styles.plusBtn} src={`${serverUrl}/Image/CommonImage/add.png`}/>}
                    {unitAdd && 
                        <div className={styles.addBox}>
                            <div className={styles.addHead}>
                                <input type="text" className={styles.addName} placeholder="재료명을 입력해주세요"/>
                                <div className={styles.addBtnBox}>
                                    <img className={styles.addBtn} src={`${serverUrl}/Image/CommonImage/ok.png`}/>
                                    <img onClick={addSwitch} className={styles.addCancel} src={`${serverUrl}/Image/CommonImage/cancelRed.png`}/>    
                                </div>  
                            </div>
                            <div className={styles.amountBox}>
                                <input type="number" step={0.25} className={styles.addVolume}/>
                                <input type="text" className={styles.addUnit} placeholder="단위"/>
                            </div>
                            <input type="date" className={styles.addDate}/>  
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