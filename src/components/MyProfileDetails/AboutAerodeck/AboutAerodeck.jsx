import "./AboutAerodeck.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiGlobe, FiMail, FiShoppingBag, FiShield, FiHeart } from "react-icons/fi";
import { API } from "../../../services/api";

function AboutAerodeck({ setProfilePage }) {
    const navigate = useNavigate();
    const [version, setVersion] = useState("Loading...");

    useEffect(() => {
        let active = true;

        const fetchLatestVersion = async () => {
            try {
                const response = await fetch(`${API}/api/app/latest-version`);
                const data = await response.json();

                if (active && data.success && data.version) {
                    setVersion(String(data.version));
                } else if (active) {
                    setVersion("Unavailable");
                }
            } catch (error) {
                console.error("APP VERSION ERROR:", error);
                if (active) setVersion("Unavailable");
            }
        };

        fetchLatestVersion();

        return () => {
            active = false;
        };
    }, []);

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="about-heepit">
            <header className="heepit-about-header">
                <button
                    className="heepit-about-back"
                    onClick={handleBack}
                    aria-label="Go back"
                >
                    <FiArrowLeft />
                </button>

                <div className="heepit-about-title-wrap">
                    <h2>ABOUT HEEPIT</h2>
                </div>
            </header>

            <main className="heepit-about-content">
                <section className="heepit-about-hero">
                    <div className="heepit-about-logo">H</div>

                    <span className="heepit-about-eyebrow">THE HEEPiT EXPERIENCE</span>
                    <h1>Shop smarter.<br />Choose better.</h1>
                    <p>
                        HEEPIT is a modern shopping platform built to bring products,
                        cards, gifts and everyday essentials together in one simple,
                        polished experience.
                    </p>
                </section>

                <section className="heepit-about-stats">
                    <div className="heepit-about-stat">
                        <strong>{version}</strong>
                        <span>Current version</span>
                    </div>
                    <div className="heepit-about-stat">
                        <strong>HEEPIT</strong>
                        <span>Our platform</span>
                    </div>
                    <div className="heepit-about-stat">
                        <strong>2026</strong>
                        <span>Building forward</span>
                    </div>
                </section>

                <section className="heepit-about-card">
                    <div className="heepit-about-card-icon"><FiShoppingBag /></div>
                    <div>
                        <span className="heepit-about-label">WHAT IS HEEPiT?</span>
                        <h3>A marketplace made for modern shopping.</h3>
                        <p>
                            HEEPIT focuses on a clean discovery experience, useful categories,
                            reliable product information and a smoother journey from browsing
                            to checkout. The goal is simple: make online shopping feel easier,
                            clearer and more enjoyable.
                        </p>
                    </div>
                </section>

                <section className="heepit-about-values">
                    <div className="heepit-about-section-heading">
                        <span>OUR APPROACH</span>
                        <h2>Built around the customer.</h2>
                    </div>

                    <div className="heepit-value-grid">
                        <article className="heepit-value-item">
                            <FiHeart />
                            <h3>Curated</h3>
                            <p>Products and experiences presented with clarity, not clutter.</p>
                        </article>
                        <article className="heepit-value-item">
                            <FiShield />
                            <h3>Reliable</h3>
                            <p>Designed around dependable information and a consistent experience.</p>
                        </article>
                        <article className="heepit-value-item">
                            <FiShoppingBag />
                            <h3>Simple</h3>
                            <p>Less friction between discovering something and getting it.</p>
                        </article>
                    </div>
                </section>

                <section className="heepit-about-contact">
                    <div>
                        <span className="heepit-about-label">STAY CONNECTED</span>
                        <h2>HEEPIT, wherever you shop.</h2>
                    </div>

                    <div className="heepit-contact-list">
                        <a href="https://heepitofficial.netlify.app/" target="_blank" rel="noreferrer">
                            <FiGlobe />
                            <span>heepitofficial.netlify.app</span>
                        </a>
                        <a href="mailto:heepit.official@gmail.com">
                            <FiMail />
                            <span>heepit.official@gmail.com</span>
                        </a>
                    </div>
                </section>

                <footer className="heepit-about-footer">
                    <strong>HEEPIT</strong>
                    <span>© 2026 HEEPIT — All Rights Reserved.</span>
                </footer>
            </main>
        </div>
    );
}

export default AboutAerodeck;
