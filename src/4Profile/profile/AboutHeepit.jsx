import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiArrowLeft, FiGlobe, FiMail, FiShoppingBag, FiShield, FiHeart,
    FiStar, FiZap, FiUsers, FiTrendingUp, FiAward, FiCheckCircle, FiGift,
} from "react-icons/fi";
import { API } from "../../services/api";
import "../profilestyles/AboutHeepit.css";

const CONTACT_LINKS = [
    { href: "https://heepitofficial.netlify.app/", Icon: FiGlobe, text: "heepitofficial.netlify.app", external: true },
    { href: "mailto:heepit.official@gmail.com", Icon: FiMail, text: "heepit.official@gmail.com", external: false },
];

const VALUES = [
    { Icon: FiHeart, title: "Curated", desc: "Products presented with clarity, not clutter.", color: "rose" },
    { Icon: FiShield, title: "Reliable", desc: "Dependable info, consistent experience.", color: "blue" },
    { Icon: FiZap, title: "Simple", desc: "Less friction, more discovery.", color: "amber" },
];

const HIGHLIGHTS = [
    { Icon: FiUsers, label: "Happy Customers", value: "50K+" },
    { Icon: FiShoppingBag, label: "Products", value: "10K+" },
    { Icon: FiTrendingUp, label: "Categories", value: "25+" },
    { Icon: FiStar, label: "Avg Rating", value: "4.8★" },
];

const PILLARS = [
    { Icon: FiAward, title: "Quality First", desc: "Every product verified before listing.", color: "amber" },
    { Icon: FiCheckCircle, title: "Trusted Service", desc: "Reliable support whenever you need it.", color: "green" },
    { Icon: FiGift, title: "Rewards Program", desc: "Earn HYPO points on every order.", color: "purple" },
];

function AboutAerodeck() {
    const navigate = useNavigate();
    const [version, setVersion] = useState("");

    useEffect(() => {
        fetch(`${API}/api/app/latest-version`)
            .then((r) => r.json())
            .then((data) => setVersion(data.success && data.version ? String(data.version) : "Unavailable"))
            .catch((err) => { console.error("Version fetch error:", err.message); setVersion("Unavailable"); });
    }, []);

    return (
        <div className="about-heepit">
            <header className="heepit-about-header">
                <button className="heepit-about-back" onClick={() => navigate(-1)} aria-label="Back">
                    <FiArrowLeft />
                </button>
                <h2 className="heepit-about-title">About HEEPIT</h2>
            </header>

            <main className="heepit-about-content">
                <section className="heepit-about-hero">
                    <div className="heepit-about-logo">H</div>
                    <span className="heepit-about-eyebrow">The HEEPIT Experience</span>
                    <h1>Shop smarter.<br />Choose better.</h1>
                    <p>HEEPIT brings products, cards, gifts and everyday essentials together in one polished experience.</p>
                </section>

                <section className="heepit-about-stats">
                    {[
                        { value: version || "...", label: "Version" },
                        { value: "HEEPIT", label: "Platform" },
                        { value: "2026", label: "Building" },
                    ].map(({ value, label }) => (
                        <div className="heepit-about-stat" key={label}>
                            <strong>{value}</strong>
                            <span>{label}</span>
                        </div>
                    ))}
                </section>

                <section className="heepit-highlights-section">
                    <div className="heepit-about-section-heading">
                        <span>By the numbers</span>
                        <h2>Growing every day.</h2>
                    </div>
                    <div className="heepit-highlights-grid">
                        {HIGHLIGHTS.map(({ Icon, label, value }) => (
                            <div className="heepit-highlight-card" key={label}>
                                <span className="heepit-highlight-icon"><Icon /></span>
                                <strong className="heepit-highlight-value">{value}</strong>
                                <span className="heepit-highlight-label">{label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="heepit-about-card">
                    <div className="heepit-about-card-icon"><FiShoppingBag /></div>
                    <div>
                        <span className="heepit-about-label">What is HEEPIT?</span>
                        <h3>A marketplace made for modern shopping.</h3>
                        <p>HEEPIT focuses on clean discovery, useful categories, reliable product info and a smoother journey from browsing to checkout. Make online shopping easier, clearer and more enjoyable.</p>
                    </div>
                </section>

                <section className="heepit-about-values">
                    <div className="heepit-about-section-heading">
                        <span>Our Approach</span>
                        <h2>Built around the customer.</h2>
                    </div>
                    <div className="heepit-value-grid">
                        {VALUES.map(({ Icon, title, desc, color }) => (
                            <article className={`heepit-value-item heepit-value-${color}`} key={title}>
                                <span className="heepit-value-icon"><Icon /></span>
                                <h3>{title}</h3>
                                <p>{desc}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="heepit-pillars-section">
                    <div className="heepit-about-section-heading">
                        <span>What we stand for</span>
                        <h2>Our core pillars.</h2>
                    </div>
                    <div className="heepit-pillars-list">
                        {PILLARS.map(({ Icon, title, desc, color }) => (
                            <div className={`heepit-pillar-card heepit-pillar-${color}`} key={title}>
                                <span className="heepit-pillar-icon"><Icon /></span>
                                <div className="heepit-pillar-text">
                                    <h3>{title}</h3>
                                    <p>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="heepit-about-contact">
                    <div>
                        <span className="heepit-about-label">Stay Connected</span>
                        <h2>HEEPIT, wherever you shop.</h2>
                    </div>
                    <div className="heepit-contact-list">
                        {CONTACT_LINKS.map(({ href, Icon, text, external }) => (
                            <a key={text} href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
                                <span className="heepit-contact-icon"><Icon /></span>
                                <span>{text}</span>
                            </a>
                        ))}
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