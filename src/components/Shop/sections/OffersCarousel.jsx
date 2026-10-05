import { useEffect, useMemo, useRef, useState } from "react";
import "./OffersCarousel.css";
import toast from "react-hot-toast";
import { API } from "../../../services/api";

function OffersCarousel() {

    const [openOffers, setOpenOffers] = useState([]);
    const [activeOfferIndex, setActiveOfferIndex] = useState(0);
    const [now, setNow] = useState(Date.now());

    const offerScrollRef = useRef(null);

    useEffect(() => {
        const fetchOpenOffers = async () => {
            try {
                const res = await fetch(`${API}/api/openoffers/active`);
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    setOpenOffers(data.data);
                }
            } catch (err) {
                console.error("Open offers fetch error:", err);
            }
        };
        fetchOpenOffers();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (openOffers.length <= 1) return;

        const timer = setTimeout(() => {
            const container = offerScrollRef.current;
            if (!container) return;

            const nextIndex =
                activeOfferIndex + 1 >= openOffers.length
                    ? 0
                    : activeOfferIndex + 1;

            container.scrollTo({
                left: nextIndex * container.clientWidth,
                behavior: "smooth"
            });
        }, 5000);

        return () => clearTimeout(timer);
    }, [activeOfferIndex, openOffers]);

    const getCountdown = (validAt) => {
        if (!validAt) return null;

        const end = new Date(validAt).getTime();
        const diff = end - now;

        if (diff <= 0) return { expired: true, text: "Expired" };

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        let text = "";
        if (days > 0) text += `${days}d `;
        if (days > 0 || hours > 0) text += `${hours}h `;
        text += `${minutes}m ${seconds}s`;

        return { expired: false, text };
    };

    const countdowns = useMemo(
        () => openOffers.map((offer) => getCountdown(offer.valid_at)),
        [openOffers, now]
    );

    const scrollToSlide = (index) => {
        const container = offerScrollRef.current;
        if (!container) return;

        container.scrollTo({
            left: index * container.clientWidth,
            behavior: "smooth"
        });
        setActiveOfferIndex(index);
    };

    const handleOfferClick = () => {
        toast("Feature Coming Soon 🚀", {
            duration: 2500,
            style: {
                background: "#1a1a1a",
                color: "#fff",
                borderRadius: "10px",
                padding: "12px 18px",
                fontSize: "14px",
                fontWeight: 600
            }
        });
    };

    if (openOffers.length === 0) return null;

    return (
        <section className="shop-offer-carousel-section">

            <div className="shop-offer-heading-row">
                <h2 className="shop-offer-heading">
                    Special <span>Offers</span>
                </h2>
            </div>

            <div
                className="shop-offer-carousel"
                ref={offerScrollRef}
                onScroll={(e) => {
                    const container = e.currentTarget;
                    const index = Math.round(
                        container.scrollLeft / container.clientWidth
                    );
                    setActiveOfferIndex(index);
                }}
            >
                {openOffers.map((offer, index) => {
                    const cd = countdowns[index];

                    return (
                        <div
                            key={offer.id ?? index}
                            className={`shop-offer-slide ${index === activeOfferIndex ? "active" : ""}`}
                        >
                            <button
                                type="button"
                                className="shop-offer-card-btn"
                                onClick={handleOfferClick}
                                aria-label={`${offer.shop_name} offer`}
                            >
                                <div className="shop-offer-image-wrap">
                                    <div className="shop-offer-image">
                                        {offer.image_url ? (
                                            <img
                                                src={offer.image_url}
                                                alt={offer.shop_name || "offer"}
                                                loading="lazy"
                                                draggable={false}
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                    e.currentTarget.parentElement.classList.add("shop-offer-image-fallback-active");
                                                }}
                                            />
                                        ) : null}

                                        <span className="shop-offer-image-fallback">
                                            {offer.shop_name?.charAt(0)?.toUpperCase() || "★"}
                                        </span>
                                    </div>
                                </div>

                                <div className="shop-offer-details">

                                    <div className="shop-offer-top-row">
                                        <div className="shop-offer-name">
                                            {offer.shop_name}
                                        </div>
                                        <div className="shop-offer-percent">
                                            {offer.offer_percent}%
                                        </div>
                                    </div>

                                    <div className="shop-offer-category">
                                        {offer.category}
                                    </div>

                                    <div className="shop-offer-description">
                                        {offer.description || "Limited time offer"}
                                    </div>

                                    <div className="shop-offer-bottom-row">
                                        <div className="shop-offer-price">
                                            <span className="shop-offer-price-label">From</span>
                                            <span className="shop-offer-price-value">
                                                ₹{Number(offer.price || 0).toLocaleString("en-IN")}
                                            </span>
                                        </div>

                                        <div className="shop-offer-rating">
                                            <span className="shop-offer-rating-star">★</span>
                                            <span>{offer.rating || "—"}</span>
                                        </div>
                                    </div>

                                    {cd && (
                                        <div
                                            className={`shop-offer-countdown ${cd.expired ? "expired" : ""}`}
                                        >
                                            <span className="shop-offer-countdown-icon">
                                                {cd.expired ? "⏰" : "⏳"}
                                            </span>
                                            <span className="shop-offer-countdown-text">
                                                {cd.expired ? "Expired" : cd.text}
                                            </span>
                                        </div>
                                    )}

                                </div>

                            </button>
                        </div>
                    );
                })}
            </div>

            {openOffers.length > 1 && (
                <div className="shop-offer-dots">
                    {openOffers.map((offer, index) => (
                        <button
                            key={`dot-${offer.id ?? index}`}
                            type="button"
                            className={`shop-offer-dot ${index === activeOfferIndex ? "active" : ""}`}
                            onClick={() => scrollToSlide(index)}
                            aria-label={`Go to offer ${index + 1}`}
                        />
                    ))}
                </div>
            )}

        </section>
    );
}

export default OffersCarousel;