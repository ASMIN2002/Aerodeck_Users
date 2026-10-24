import { useEffect, useState, useMemo } from "react";
import { FiStar, FiMessageCircle, FiX, FiGift } from "react-icons/fi";
import { API } from "../services/api";
import "./Offers.css";

const WHATSAPP_NUMBER = "919583282886";
const ERROR_DURATION = 3500;

const Stars = ({ rating }) => {
    const count = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    return (
        <div className="offer-stars">
            {Array.from({ length: 5 }).map((_, i) => (
                <FiStar key={i} className={i < count ? "offer-star filled" : "offer-star"} />
            ))}
        </div>
    );
};

function Offers() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState(null);
    const [verifyError, setVerifyError] = useState(null);
    const [activeOffer, setActiveOffer] = useState(null);

    const sessionToken = localStorage.getItem("session_token");

    const floatingIcons = useMemo(() => {
        return Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            left: `${10 + (i * 11) % 80}%`,
            top: `${15 + (i * 17) % 65}%`,
            size: `${12 + (i % 3) * 4}px`,
            duration: `${22 + (i % 3) * 4}s`,
            delay: `${i * 1.4}s`,
            color: ["#f59e0b", "#ec4899", "#a855f7", "#22d3ee"][i % 4],
        }));
    }, []);

    useEffect(() => {
        fetch(`${API}/api/openoffers/active`)
            .then((r) => r.json())
            .then((data) => { if (data.success) setOffers(data.data || []); })
            .catch((err) => console.error("Offers load error:", err.message))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!sessionToken) return;
        fetch(`${API}/api/user/details?session_token=${sessionToken}`)
            .then((r) => r.json())
            .then((data) => { if (data.success && data.data) setUserDetails(data.data); })
            .catch((err) => console.error("User details error:", err.message));
    }, [sessionToken]);

    useEffect(() => {
        if (!verifyError) return;
        const timer = setTimeout(() => setVerifyError(null), ERROR_DURATION);
        return () => clearTimeout(timer);
    }, [verifyError]);

    useEffect(() => {
        if (!activeOffer) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e) => { if (e.key === "Escape") setActiveOffer(null); };
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            document.removeEventListener("keydown", onKey);
        };
    }, [activeOffer]);

    const validateUser = () => {
        if (!userDetails?.full_name?.trim()) return "First give your name to continue.";
        if (!userDetails?.mobile_number || userDetails.is_mobile_verified !== 1) return "Please verify your mobile number first.";
        if (!userDetails?.whatsapp_number || userDetails.is_whatsapp_verified !== 1) return "Please verify your WhatsApp number first.";
        return null;
    };

    const handleOrderClick = (offer) => {
        const error = validateUser();
        if (error) return setVerifyError(error);
        if (!sessionToken) return;

        const message =
            `USER = #${userDetails?.user_id || ""}HEEPITUSER\n` +
            `OFFER = #${offer.id}HEEPITOFFER\n` +
            `SHOP = ${offer.shop_name}\n` +
            `OFFER = ${offer.offer_percent}% OFF\n` +
            `PRICE = ₹${offer.price}\n\n` +
            `Just press Send to know more.`;

        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    };

    if (loading) return <div className="offers-page"><p className="offers-loading">Loading offers...</p></div>;

    return (
        <div className="offers-page">
            <div className="offers-bg" aria-hidden="true">
                {floatingIcons.map((item) => (
                    <FiGift
                        key={item.id}
                        className="offers-float-icon"
                        style={{
                            left: item.left,
                            top: item.top,
                            fontSize: item.size,
                            animationDuration: item.duration,
                            animationDelay: item.delay,
                            color: item.color,
                        }}
                    />
                ))}
            </div>

            <div className="offers-content">
                <div className="offers-header">
                    <h2 className="offers-title">Special Offers</h2>
                    <span className="offers-subtitle">Celebrate & Save</span>
                </div>

                {verifyError && <div className="offers-error"><span>{verifyError}</span></div>}

                {offers.length === 0 ? (
                    <p className="offers-empty">No offers available right now.</p>
                ) : (
                    <div className="offers-grid">
                        {offers.map((offer) => (
                            <div key={offer.id} className="offer-card" onClick={() => setActiveOffer(offer)}>
                                <div className="offer-image">
                                    {offer.image_url ? (
                                        <img src={offer.image_url} alt={offer.shop_name} loading="lazy" />
                                    ) : (
                                        <span className="offer-image-fallback">{offer.shop_name?.charAt(0)?.toUpperCase() || "★"}</span>
                                    )}
                                    <span className="offer-percent-badge">{offer.offer_percent}% OFF</span>
                                </div>

                                <div className="offer-body">
                                    <h4 className="offer-shop">{offer.shop_name}</h4>
                                    <div className="offer-meta">
                                        <span className="offer-category">{offer.category}</span>
                                        <Stars rating={offer.rating} />
                                    </div>
                                    <div className="offer-price-row">
                                        <span className="offer-price-label">From</span>
                                        <span className="offer-price">₹{Number(offer.price || 0).toLocaleString("en-IN")}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {activeOffer && (
                <div className="offer-modal-overlay" onClick={() => setActiveOffer(null)}>
                    <div className="offer-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="offer-modal-close" onClick={() => setActiveOffer(null)} aria-label="Close">
                            <FiX />
                        </button>

                        <div className="offer-modal-image">
                            {activeOffer.image_url ? (
                                <img src={activeOffer.image_url} alt={activeOffer.shop_name} />
                            ) : (
                                <span className="offer-image-fallback">{activeOffer.shop_name?.charAt(0)?.toUpperCase() || "★"}</span>
                            )}
                            <span className="offer-percent-badge">{activeOffer.offer_percent}% OFF</span>
                        </div>

                        <div className="offer-modal-body">
                            <div className="offer-modal-top">
                                <h3>{activeOffer.shop_name}</h3>
                                <Stars rating={activeOffer.rating} />
                            </div>

                            <p className="offer-modal-category">{activeOffer.category}</p>
                            <p className="offer-modal-desc">{activeOffer.description || "Limited time offer. Grab it before it's gone!"}</p>

                            <div className="offer-modal-price-row">
                                <div>
                                    <span className="offer-price-label">Starting from</span>
                                    <span className="offer-modal-price">₹{Number(activeOffer.price || 0).toLocaleString("en-IN")}</span>
                                </div>
                                <span className="offer-modal-discount">{activeOffer.offer_percent}% OFF</span>
                            </div>

                            <button className="offer-wa-btn" type="button" onClick={() => handleOrderClick(activeOffer)}>
                                <FiMessageCircle /> Order on WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Offers;