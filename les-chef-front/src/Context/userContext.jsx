import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [ userInfo, setUserInfo ] = useState({
        id: "",
        pwd: "",
        name: "",
        nickName: "",
        tel: ""
    });

    return(
        <UserContext.Provider value={ { userInfo, setUserInfo } }>
            {children}
        </UserContext.Provider>
    );
}

export const useUserContext = () => { return useContext(UserContext)};