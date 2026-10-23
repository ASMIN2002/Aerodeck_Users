import { useEffect, useState } from "react";
import "./Offers.css";
import { API } from "../services/api";

const WHATSAPP_NUMBER = "919583282886";
const ERROR_DURATION = 3500;

function Offers() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState(null);
    const [verifyError, setVerifyError] = useState(null);

    const sessionToken = localStorage.getItem("session_token");

    useEffect(() => {
        async function loadOffers() {
            try {
                const res = await fetch(`${API}/api/openoffers/active`);
                const data = await res.json();
                if (data.success) setOffers(data.data || []);
            } catch (err) {
                console.error("Offers load error:", err.message);
            } finally {
                setLoading(false);
            }
        }

        loadOffers();
    }, []);

    useEffect(() => {
        if (!sessionToken) return;

        fetch(`${API}/api/user/details?session_token=${sessionToken}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.success && data.data) setUserDetails(data.data);
            })
            .catch((err) => console.error("User details error:", err.message));
    }, [sessionToken]);

    useEffect(() => {
        if (!verifyError) return;
        const timer = setTimeout(() => setVerifyError(null), ERROR_DURATION);
        return () => clearTimeout(timer);
    }, [verifyError]);

    const validateUser = () => {
        if (!userDetails?.full_name || !userDetails.full_name.trim()) {
            return "First give your name to continue.";
        }
        if (!userDetails?.mobile_number || userDetails.is_mobile_verified !== 1) {
            return "Please verify your mobile number first.";
        }
        if (!userDetails?.whatsapp_number || userDetails.is_whatsapp_verified !== 1) {
            return "Please verify your WhatsApp number first.";
        }
        return null;
    };

    const handleOfferClick = async (offer) => {
        const error = validateUser();
        if (error) {
            setVerifyError(error);
            return;
        }

        if (!sessionToken) return;

        try {
            const message =
                `USER = #${userDetails?.user_id || ""}HEEPITUSER\n` +
                `OFFER = #${offer.id}HEEPITOFFER\n` +
                `SHOP = ${offer.shop_name}\n` +
                `OFFER = ${offer.offer_percent}% OFF\n` +
                `PRICE = ₹${offer.price}\n\n` +
                `Just press Send to know more.`;

            window.open(
                `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
                "_blank"
            );
        } catch (err) {
            console.error("WhatsApp order error:", err.message);
        }
    };

    if (loading) {
        return (
            <div className="offers-page">
                <p className="offers-loading">Loading offers...</p>
            </div>
        );
    }

    return (
        <div className="offers-page">
            <h2>Offers</h2>

            {verifyError && (
                <div className="offers-error">
                    <span>{verifyError}</span>
                </div>
            )}

            {offers.length === 0 ? (
                <p className="offers-empty">No offers available right now.</p>
            ) : (
                <div className="offers-grid">
                    {offers.map((offer) => (
                        <div
                            key={offer.id}
                            className="offer-card"
                            onClick={() => handleOfferClick(offer)}
                        >
                            <div className="offer-image">
                                {offer.image_url ? (
                                    <img
                                        src={offer.image_url}
                                        alt={offer.shop_name}
                                    />
                                ) : (
                                    <span className="offer-image-fallback">
                                        {offer.shop_name?.charAt(0)?.toUpperCase() || "★"}
                                    </span>
                                )}
                            </div>

                            <div className="offer-body">
                                <div className="offer-top">
                                    <h4 className="offer-shop">
                                        {offer.shop_name}
                                    </h4>
                                    <span className="offer-percent">
                                        {offer.offer_percent}%
                                    </span>
                                </div>

                                <p className="offer-category">
                                    {offer.category}
                                </p>

                                <p className="offer-description">
                                    {offer.description || "Limited time offer"}
                                </p>

                                <div className="offer-bottom">
                                    <span className="offer-price">
                                        From ₹{Number(offer.price || 0).toLocaleString("en-IN")}
                                    </span>

                                    <span className="offer-rating">
                                        ★ {offer.rating || "—"}
                                    </span>
                                </div>

                                <button className="offer-wa-btn">
                                    Order on WhatsApp
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Offers;