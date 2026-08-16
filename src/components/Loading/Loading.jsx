import { useEffect, useState } from "react";
import "./Loading.css";

function Loading({
    duration = 3000,
    text = "Please wait...",
    onComplete,
    manual = false
}) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {

        setVisible(true);
        const timer = manual
            ? null
            : setTimeout(() => {

                setVisible(false);

                if (onComplete) {
                    onComplete();
                }

            }, duration);
        return () => {

            if (timer) {
                clearTimeout(timer);
            }

        };

    }, [duration]);

    if (!visible) {
        return null;
    }

    return (

        <div className="hp-loading-overlay">

            <div className="hp-loading-card">

                <div className="hp-loading-spinner">

                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>

                </div>

                <div className="hp-loading-text">
                    {text}
                </div>

            </div>

        </div>

    );

}

export default Loading;