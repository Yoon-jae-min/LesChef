//기타
import React, { useState } from "react";

//CSS
import styles from "../../../CSS/community/show/common/show.module.css";

//컨텍스트
import { useUserContext } from "../../../Context/user";

//컴포넌트
import CommunityHeader from "./header";
import CommunityBody from "../list/body";
import CommunityFooter from "../list/footer";
import CommunityWriteBox from "../write/box";
import CommunityWatchBox from "../watch/common/box";

const CommunityBox = () => {
    const [ writeBoxVisible, setWriteBoxVisible ] = useState(false);
    const [ watchBoxVisible, setWatchBoxVisible ] = useState(false);
    const {authCheck} = useUserContext();

    const goToWrite = async() => {
        if(await authCheck()){
            if(!writeBoxVisible){
                setWriteBoxVisible(true);
            }else{
                setWatchBoxVisible(false);
            }
        }else{
            alert('로그인이 필요합니다');
        }
    }

    const goToWatch = async() => {
        await authCheck();

        if(!watchBoxVisible){
            setWatchBoxVisible(true);
        }
        if(writeBoxVisible){
            setWriteBoxVisible(false);
        }
    }

    const goToList = async() => {
        await authCheck();

        if(writeBoxVisible){
            setWriteBoxVisible(false);
        }
        if(watchBoxVisible){
            setWatchBoxVisible(false);
        }
    }

    return(
        <div className={styles.box}>
            <CommunityHeader/>
            { !writeBoxVisible && 
                !watchBoxVisible && 
                    <CommunityBody  goToWatch={goToWatch}/>}
            { !writeBoxVisible && 
                !watchBoxVisible && 
                    <CommunityFooter goToWrite={goToWrite}/>}
            { (writeBoxVisible && !watchBoxVisible) && 
                    <CommunityWriteBox goToList={goToList} setWriteBoxVisible={setWriteBoxVisible} setWatchBoxVisible={setWatchBoxVisible}/>}
            { watchBoxVisible && 
                !writeBoxVisible && 
                    <CommunityWatchBox goToList={goToList}/>}
        </div>
    )
}

export default CommunityBox;