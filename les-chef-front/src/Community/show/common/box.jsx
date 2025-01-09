//기타
import React, { useState } from "react";

//CSS
import styles from "../../../CSS/community/show/common/show.module.css";

//컨텍스트
import { WatchProvider } from "../../../Context/watchContext";

//컴포넌트
import CommunityHeader from "./header";
import CommunityBody from "../list/body";
import CommunityFooter from "../list/footer";
import CommunityWriteBox from "../write/box";
import CommunityWatchBox from "../watch/common/box";

const CommunityBox = () => {
    const [ writeBoxVisible, setWriteBoxVisible ] = useState(false);
    const [ watchBoxVisible, setWatchBoxVisible ] = useState(false);

    const goToWrite = () => {
        if(!writeBoxVisible){
            setWriteBoxVisible(true);
        }

        if(watchBoxVisible){
            setWatchBoxVisible(false);
        }
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