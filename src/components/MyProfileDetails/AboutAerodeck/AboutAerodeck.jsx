import "./AboutAerodeck.css";
import { useNavigate } from "react-router-dom";

function AboutAerodeck({
    setProfilePage
}) {


    const navigate = useNavigate();
    return (
        <div className="aboutaerodeck">
            <div className="about-header">
                <button
                    className="about-back"
                    onClick={() => {
                        setProfilePage("profile");
                        navigate("/profile", { replace: true });
                    }}
                >
                    ←
                </button>

                <h2>
                    About AERODECK
                </h2>

            </div>

            <div className="about-card">

                <div className="about-logo">

                    AD

                </div>

                <h1>
                    AERODECK
                </h1>

                <p className="about-version">

                    Version 1.0.0

                </p>

                <p className="about-description">

                    AERODECK is a modern marketplace for premium invitation cards,
                    greeting cards, business cards, digital cards and many more.
                    Our goal is to provide beautiful, customizable and high-quality
                    card designs with a seamless shopping experience.

                </p>

            </div>

            <div className="about-section">

                <div className="about-item">

                    <span>🏢</span>

                    <div>

                        <h3>Company</h3>

                        <p>AERODECK Technologies</p>

                    </div>

                </div>

                <div className="about-item">

                    <span>🌐</span>

                    <div>

                        <h3>Website</h3>

                        <p>www.aerodeck.in</p>

                    </div>

                </div>

                <div className="about-item">

                    <span>📧</span>

                    <div>

                        <h3>Email</h3>

                        <p>support@aerodeck.in</p>

                    </div>

                </div>

                <div className="about-item">

                    <span>📱</span>

                    <div>

                        <h3>App Version</h3>

                        <p>1.0.0</p>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AboutAerodeck;