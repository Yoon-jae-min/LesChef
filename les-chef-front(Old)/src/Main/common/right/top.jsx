//기타
import React, {useState, useEffect} from 'react';

//CSS
import styles from "../../../CSS/main/common/right.module.css";

const MainTop = (props) => {
    const { topTxt } = props
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
    }, [topTxt]);

    return (
        <div className={styles.top}>
            <p className={`${styles.topText} ${animationClass}`}>
                {topTxt.split('\n').map((line, index) => {
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

export default MainTop;