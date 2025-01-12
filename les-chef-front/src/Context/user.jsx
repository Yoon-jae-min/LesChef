import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [ userData, setUserData ] = useState({
        id: "",
        name: "",
        nickName: "",
        tel: ""
    });

    const [isLogin, setIsLogin] = useState(false);

    return(
        <UserContext.Provider value={ { userData, setUserData, isLogin, setIsLogin } }>
            {children}
        </UserContext.Provider>
    );
}

export const useUserContext = () => { return useContext(UserContext)};