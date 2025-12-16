//기타
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//CSS
import styles from "../../../CSS/customer/show/foods/unit.module.css";

//컨텍스트
import { useConfig } from "../../../Context/config";
import { useUserContext } from "../../../Context/user";
import { useFoods } from "../../../Context/foods";

const Unit = (props) => {
    const {food, placeName} = props;
    const {serverUrl} = useConfig();
    const {authCheck} = useUserContext();
    const {setSectionList} = useFoods();
    const [menuShow, setMenuShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [editUnit, setEditUnit] = useState({
        name: food.name,
        vol: food.volume,
        unit: food.unit,
        date: new Date(food.expirate).toISOString().split("T")[0]
    });
    const navigate = useNavigate();

    const confirmCheck = () => {
        return window.confirm("정말 삭제하시겠습니까?");
    }

    const menuSwitch = async() => {
        if(!await authCheck()){
            alert("다시 로그인해 주세요");
            navigate("/");
            return;
        }
        setMenuShow((prev) => (!prev));
    }

    const editSwitch = async() => {
        if(!await authCheck()){
            alert("다시 로그인해 주세요");
            navigate("/");
            return;
        }
        if(!editShow){
            setEditUnit({
                name: food.name,
                vol: food.volume,
                unit: food.unit,
                date: new Date(food.expirate).toISOString().split("T")[0]
            });
        }
        setEditShow((prev) => (!prev));
        if(menuShow){
            setMenuShow(false);
        }
    }

    const editValue = (updateData) => {
        setEditUnit((prev) => ({...prev, ...updateData}))
    }

    const editClick = async() => {
        if(!await authCheck()){
            alert("다시 로그인해 주세요");
            navigate("/");
            return;
        }

        fetch(`${serverUrl}/foods/content`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...editUnit,
                placeName: placeName,
                contentId: food._id
            }),
            credentials: "include"
        }).then(response => {
            if(!response.ok){
                throw new Error("error");
            }
            return response.json();
        }).then(data => {
            if(data.result){
                setSectionList(data.sectionList);
                editSwitch();
            }
        }).catch(err => {
            console.log(err);
            alert("다시 시도해주세요");
            window.location.reload();
        });
    }

    const deleteClick = async() => {
        if(!await authCheck()){
            alert("다시 로그인해 주세요");
            navigate("/");
            return;
        }

        if(confirmCheck()){
            fetch(`${serverUrl}/foods/content`,{
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    place: placeName,
                    food: food.name
                }),
                credentials: "include"
            }).then(response => response.json()).then(data => {
                setSectionList(data.sectionList);
                menuSwitch();
            }).catch(err => {
                alert("잠시후 다시 시도해주세요");
                console.log(err);
                window.location.reload();
            });
        }else{
            menuSwitch();
        }
    }

    return(
        <div className={styles.box}>
            <div className={styles.nameBox}>
                {!editShow && 
                    <React.Fragment>
                        <p className={styles.name}>{food.name}</p>
                        <img onClick={menuSwitch} className={styles.menuBtn} src={`${serverUrl}/Image/CommonImage/more.png`}/>
                    </React.Fragment>}
                {editShow && 
                    <React.Fragment>
                        <input 
                            value={editUnit.name} 
                            type="text"
                            placeholder="재료명을 입력해주세요" 
                            className={styles.editName} 
                            onChange={(e) => editValue({name: e.target.value})}/>
                        <div className={styles.editBtnBox}>
                            <img onClick={editClick} className={styles.editOkBtn} src={`${serverUrl}/Image/CommonImage/ok.png`}/>
                            <img onClick={editSwitch} className={styles.editCancelBtn} src={`${serverUrl}/Image/CommonImage/cancelRed.png`}/>
                        </div>    
                    </React.Fragment>}
            </div>
            <div className={styles.amountBox}>
                {!editShow && 
                    <React.Fragment>
                        <div className={styles.amountLabel}>수량</div>
                        <div className={styles.amount}>
                            <span className={styles.volume}>{food.volume}</span>
                            <span className={styles.unit}>{food.unit}</span>
                        </div>
                    </React.Fragment>}
                {editShow && 
                    <React.Fragment>
                        <input value={editUnit.vol} type="number" className={styles.editVol} onChange={(e) => editValue({vol: e.target.value})}/>
                        <input 
                            value={editUnit.unit} 
                            type="text" 
                            className={styles.editUnit} 
                            placeholder="단위" 
                            onChange={(e) => editValue({unit: e.target.value})}/>
                    </React.Fragment>}
            </div>

            <div className={styles.dateBox}>
                {!editShow && 
                    <React.Fragment>
                        <p className={styles.dateLabel}>유통기한</p>
                        <p className={styles.date}>{new Date(food.expirate).toISOString().split("T")[0]}</p>
                    </React.Fragment>}
                {editShow && 
                    <React.Fragment>
                        <input 
                            value={editUnit.date} 
                            type="date" 
                            className={styles.editDate}
                            onChange={(e) => editValue({date: e.target.value})}/>
                    </React.Fragment>}
            </div>
            { menuShow && 
                <div className={styles.menuBox}>
                    <img onClick={editSwitch} className={styles.editBtn} src={`${serverUrl}/Image/CommonImage/edit.png`}/>
                    <img onClick={deleteClick} className={styles.deleteBtn} src={`${serverUrl}/Image/CommonImage/delete.png`}/>
                </div>}
        </div>
    )
}

export default Unit;