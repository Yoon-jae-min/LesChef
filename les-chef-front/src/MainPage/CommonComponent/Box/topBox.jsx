import React, {useState, useEffect} from 'react';

const MainTop = (props) => {
    const { topTxt } = props
    const [animationClass, setAnimationClass] = useState("fade-in");

    // const handleAnimationEnd = () => {
    //     setTimeout(() => {
    //         if (animationClass === "fade-out") {
    //             setAnimationClass("fade-in");
    //         }
    //     }, 300);
    // }

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
    }, [topTxt]);

    return (
        <div className='mainTop'>
            <p className={`topText ${animationClass}`}>
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