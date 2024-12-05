import React, { createContext, useContext, useState } from "react";

const WatchContext = createContext();

export const WatchProvider = ({ children }) => {
    const [watchValue, setWatchValue] = useState({
        title: "",
        userName: "",
        writeDate: "",
        watchNum: "",
        content: "",
    });

    const [ commentValue, setcommentValue ] = useState({
        username: "honggildong",
        dateTime: "",
        content: ""
    });

    return (
        <WatchContext.Provider value={{ watchValue, setWatchValue, commentValue, setcommentValue }}>
            {children}
        </WatchContext.Provider>
    );
};

export const useWatchContext = () => useContext(WatchContext);
