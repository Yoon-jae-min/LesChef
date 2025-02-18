import React, { createContext, useContext } from 'react';

// Context 생성
const ConfigContext = createContext();

// Provider 컴포넌트
export const ConfigProvider = ({ children }) => {
    const config = {
        serverUrl : process.env.REACT_APP_Server_IP,
        kakaoApiKey : process.env.REACT_APP_KAKAO_API_KEY
    };

    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    );
};

// Context를 사용하는 커스텀 Hook
export const useConfig = () => {
    return useContext(ConfigContext);
};
