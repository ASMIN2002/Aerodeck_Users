import { useEffect } from "react";
import "../../styles/Splash.css";

function Splash({
    setPage
}) {
    useEffect(() => {
        // const timer = setTimeout(() => {

        //     sessionStorage.setItem("aerodeck_splash", "true");
        //     setPage("startup");

        // }, 4000);
        const timer = setTimeout(() => {
            setPage("startup");
        }, 5000);
        return () => clearTimeout(timer);
    }, [
        setPage
    ]);
    return (
        <div className="sp-container">
            <div className="sp-bg1"></div>
            <div className="sp-bg2"></div>
            <div className="sp-bg3"></div>
            <div className="sp-grid"></div>
            <div className="sp-particles">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className="sp-light"></div>
            <div className="sp-content">
                <div className="sp-logo">
                    𝐇𝐈
                </div>
                <h1 className="sp-title">
                    HEEPIT
                </h1>
                <p className="sp-tagline">
                    Shop. Discover. Enjoy.
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