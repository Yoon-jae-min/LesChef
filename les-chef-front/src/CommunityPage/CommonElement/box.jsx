import React, { useState } from "react";
import CommunityHeader from "./header";
import CommunityBody from "../ListBox/body";
import CommunityFooter from "../ListBox/footer";
import CommunityWriteBox from "../WriteBox/writeBox";
import CommunityWatchBox from "../WatchBox/watchBox";
import { WatchProvider } from "../../Context/watchContext";

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
            <div className="communityBox">
                <CommunityHeader/>
                { !writeBoxVisible && !watchBoxVisible && <CommunityBody  goToWatch={goToWatch}/>}
                { !writeBoxVisible && !watchBoxVisible && <CommunityFooter goToWrite={goToWrite}/>}
                { (writeBoxVisible && !watchBoxVisible) && <CommunityWriteBox goToList={goToList}/>}
                { watchBoxVisible && !writeBoxVisible && <CommunityWatchBox goToList={goToList}/>}
            </div>
        </WatchProvider>
    )
}

export default CommunityBox;