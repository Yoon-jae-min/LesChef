//기타
import React, { useState } from "react";

//CSS
import styles from "../../../CSS/customer/show/info/info.module.css";

//컴포넌트
import Main from "./mainBox";
import PwCg from "./pwCgBox";
import Btn from "./btnBox";

const CustomerInfoBox = () => {
    const [ pwdChange, setPwdChange] = useState(false);
    const [ checkedPwd, setCheckedPwd ] = useState(false);
    const [ deleteInfo, setDeleteInfo ] = useState(false);

    return(
        <div className={styles.box}>
            <div className={styles.body}>
                <Main/>
                <PwCg
                    pwdChange={pwdChange}
                    checkedPwd={checkedPwd}
                    deleteInfo={deleteInfo}
                    setPwdChange={setPwdChange}
                    setCheckedPwd={setCheckedPwd}
                    setDeleteInfo={setDeleteInfo}/>
            </div>
            <Btn
                pwdChange={pwdChange}
                checkedPwd={checkedPwd}
                deleteInfo={deleteInfo}
                setPwdChange={setPwdChange}
                setCheckedPwd={setCheckedPwd}
                setDeleteInfo={setDeleteInfo}/>
        </div>
    )
}

export default CustomerInfoBox;