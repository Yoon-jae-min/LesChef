//기타
import React, {useState, useEffect} from 'react';

const MainBottom = (props) => {
    const { bottomTxt } = props
    const [animationClass, setAnimationClass] = useState("fade-in");

    useEffect(() => {
            setTimeout(() => {
                setAnimationClass("fade-in");
            }, 100);
    }, []);

    useEffect(() => {
        setAnimationClass("fade-out");
        const timeout = setTimeout(() => {
            setAnimationClass("fade-in");
        }, 200);
        return () => clearTimeout(timeout);
    }, [bottomTxt]);

    return (
        <div className='mainBottom'>
            <p className={`bottomText ${animationClass}`}>
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