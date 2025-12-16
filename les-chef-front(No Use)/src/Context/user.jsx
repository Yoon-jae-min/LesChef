//기타
import React, { createContext, useContext, useState } from "react";

//컨텍스트

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [ userData, setUserData ] = useState({
        id: "",
        name: "",
        nickName: "",
        tel: ""
    });

    const [isLogin, setIsLogin] = useState(false);

    const authCheck = async () => {
        try{
            const response = await fetch(`${process.env.REACT_APP_Server_IP}/customer/auth`,{
                credentials:"include"
            });
            const data = await response.json();

            if(!data.loggedIn){
                setIsLogin(false);
                sessionStorage.removeItem('userData');
            }else{
                setIsLogin(true);
            }

            return data.loggedIn;
        }catch(err){
            console.log(err);
            setIsLogin(false);
            sessionStorage.removeItem("userData");
            return false; 
        }
        
    }

    return(
        <UserContext.Provider value={ { userData, setUserData, isLogin, setIsLogin, authCheck } }>
            {children}
        </UserContext.Provider>
    );
}

export const useUserContext = () => { return useContext(UserContext)};