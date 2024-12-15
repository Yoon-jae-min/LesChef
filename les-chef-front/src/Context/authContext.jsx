import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isLogin, setIsLogin] = useState(false);

    return(
        <AuthContext.Provider value={{user, setUser, isLogin, setIsLogin}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext);