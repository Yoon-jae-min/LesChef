import React, { createContext, useContext, useState } from "react";

const BoardContext = createContext();

export const BoardProvider = ({children}) => {
    const [boardList, setBoardList] = useState([]);
    const [selectedBoard, setSelectedBoard] = useState({});
    const [writeContent, setWriteContent] = useState({title: "", id: "", nickName: "", content: ""});
    const [commentList, setCommentList] = useState([]);

    return(
        <BoardContext.Provider 
            value={{
                boardList, setBoardList,
                selectedBoard, setSelectedBoard,
                writeContent, setWriteContent,
                commentList, setCommentList}}>
            {children}
        </BoardContext.Provider>
    )
}

export const useBoardContext = () => useContext(BoardContext);