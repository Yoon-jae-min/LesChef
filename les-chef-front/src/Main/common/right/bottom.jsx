//기타
import React, {useState, useEffect} from 'react';

//CSS
import styles from "../../../CSS/main/common/right.module.css";

const MainBottom = (props) => {
    const { bottomTxt } = props
    const [animationClass, setAnimationClass] = useState(`${styles.fadeIn}`);

    useEffect(() => {
        setTimeout(() => {
            setAnimationClass(`${styles.fadeIn}`);
        }, 100);
    }, []);

    useEffect(() => {
        setAnimationClass(`${styles.fadeOut}`);
        const timeout = setTimeout(() => {
            setAnimationClass(`${styles.fadeIn}`);
        }, 200);
        return () => clearTimeout(timeout);
    }, [bottomTxt]);

    return (
        <div className={styles.bottom}>
            <p className={`${styles.bottomText} ${animationClass}`}>
                {bottomTxt.split('\n').map((line, index) => {
                    return (
                        <React.Fragment key={index}>
                            {line}
                            <br />
                        </React.Fragment>
                    );
                })}
                            
            </p>
        </div>
    )
}

export default MainBottom;