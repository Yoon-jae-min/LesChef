import React, { createContext, useContext, useState } from "react";

const FoodsContext = createContext();

export const FoodsProvider = ({children}) => {
    const [sectionList, setSectionList] = useState([]);

    return(
        <FoodsContext.Provider
            value={{sectionList, setSectionList}}>
            {children}
        </FoodsContext.Provider>
    )
}

export const useFoods = () => useContext(FoodsContext); 