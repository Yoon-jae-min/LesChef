//기타
import React, { useState } from "react";

//CSS
import styles from "../../../CSS/community/show/common/show.module.css";

//컨텍스트
import { WatchProvider } from "../../../Context/watchContext";
import { useAuthContext } from "../../../Context/authContext";
import { useConfig } from "../../../Context/configContext";

//컴포넌트
import CommunityHeader from "./header";
import CommunityBody from "../list/body";
import CommunityFooter from "../list/footer";
import CommunityWriteBox from "../write/box";
import CommunityWatchBox from "../watch/common/box";

const CommunityBox = () => {
    const [ writeBoxVisible, setWriteBoxVisible ] = useState(false);
    const [ watchBoxVisible, setWatchBoxVisible ] = useState(false);

    const {setIsLogin} = useAuthContext();
    const {serverUrl} = useConfig();

    const goToWrite = () => {
        fetch(`${serverUrl}/customer/auth`, {
            credentials: "include"
        }).then(response => response.json()).then((data) => {
            if(!data.loggedIn){
                setIsLogin(false);
                sessionStorage.removeItem('userData');
                alert('로그인이 필요합니다');
            }else{
                if(!writeBoxVisible){
                    setWriteBoxVisible(true);
                }else{
                    setWatchBoxVisible(false);
                }
            }
        })
    }

    const goToWatch = () => {
        if(!watchBoxVisible){
            setWatchBoxVisible(true);
        }
        if(writeBoxVisible){
            setWriteBoxVisible(false);
        }
    }

    const goToList = () => {
        if(writeBoxVisible){
            setWriteBoxVisible(false);
        }
        if(watchBoxVisible){
            setWatchBoxVisible(false);
        }
    }

    return(
        <WatchProvider>
            <div className={styles.box}>
                <CommunityHeader/>
                { !writeBoxVisible && 
                    !watchBoxVisible && 
                        <CommunityBody  goToWatch={goToWatch}/>}
                { !writeBoxVisible && 
                    !watchBoxVisible && 
                        <CommunityFooter goToWrite={goToWrite}/>}
                { (writeBoxVisible && !watchBoxVisible) && 
                        <CommunityWriteBox goToList={goToList}/>}
                { watchBoxVisible && 
                    !writeBoxVisible && 
                        <CommunityWatchBox goToList={goToList}/>}
            </div>
        </WatchProvider>
    )
}

export default CommunityBox;