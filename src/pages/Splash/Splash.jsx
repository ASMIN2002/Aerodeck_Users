import { useEffect } from "react";
import "../../styles/Splash.css";

function Splash({
    setPage
}) {
    useEffect(() => {

        const timer = setTimeout(() => {

            sessionStorage.setItem("aerodeck_splash", "true");
            setPage("startup");

        }, 3200);

        return () => clearTimeout(timer);

    }, [
        setPage
    ]);
    return (

        <div className="sp-container">

            <div className="sp-content">

                <div className="sp-logo">
                   AD
                </div>

                <h1 className="sp-title">
                    AERODECK
                </h1>

                <p className="sp-tagline">
                    Premium Cards & Gifts
                </p>

                <div className="sp-loader">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

            </div>

        </div>

    );
}

export default Splash;