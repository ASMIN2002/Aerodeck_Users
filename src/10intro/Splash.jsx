import { useEffect } from "react";
import "./Splash.css";

function Splash({ setPage }) {
    useEffect(() => {
        const timer = setTimeout(() => setPage("startup"), 5000);
        return () => clearTimeout(timer);
    }, [setPage]);

    return (
        <div className="sp-container">
            <div className="sp-bg1" />
            <div className="sp-bg2" />
            <div className="sp-bg3" />
            <div className="sp-grid" />
            <div className="sp-particles">
                {Array.from({ length: 10 }).map((_, i) => <span key={i} />)}
            </div>
            <div className="sp-light" />

            <div className="sp-content">
                <div className="sp-logo">𝐇𝐈</div>
                <h1 className="sp-title">HEEPIT</h1>
                <p className="sp-tagline">Shop. Discover. Enjoy.</p>
                <div className="sp-loader">
                    <span /><span /><span />
                </div>
            </div>
        </div>
    );
}

export default Splash;