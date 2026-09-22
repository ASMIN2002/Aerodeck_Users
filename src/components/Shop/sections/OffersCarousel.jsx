import { useEffect, useRef, useState } from "react";
import "./OffersCarousel.css";
import toast from "react-hot-toast";
import { API } from "../../../services/api";

function OffersCarousel() {

    const [openOffers, setOpenOffers] = useState([]);
    const [activeOfferIndex, setActiveOfferIndex] = useState(0);
    const [now, setNow] = useState(Date.now());

    const offerScrollRef = useRef(null);

    /* Fetch offers */
    useEffect(() => {
        const fetchOpenOffers = async () => {
            try {
                const res = await fetch(`${API}/api/openoffers/active`);
                const data = await res.json();
                if (data.success) setOpenOffers(data.data);
            } catch (err) {
                console.error("Open offers fetch error:", err);
            }
        };
        fetchOpenOffers();
    }, []);

    /* Live tick for countdown */
    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    /* Auto-scroll every 5s */
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

    /* Countdown helper */
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

    if (openOffers.length === 0) return null;

    return (
        <section className="shop-offer-carousel-section">

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
                {openOffers.map((offer, index) => (
                    <div
                        key={offer.id}
                        className={`shop-offer-slide ${
                            index === activeOfferIndex ? "active" : ""
                        }`}
                        onClick={() =>
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
                            })
                        }
                    >
                        {/* LEFT IMAGE */}
                        <div className="shop-offer-image">
                            <img
                                src={offer.image_url || ""}
                                alt={offer.shop_name}
                            />
                            <div className="shop-offer-time">
                                {(() => {
                                    const cd = getCountdown(offer.valid_at);
                                    if (!cd) return null;
                                    return (
                                        <div
                                            className={`shop-offer-countdown ${
                                                cd.expired ? "expired" : ""
                                            }`}
                                        >
                                            {cd.expired
                                                ? "⏰ Expired"
                                                : `⏳ Ends in ${cd.text}`}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* RIGHT DETAILS */}
                        <div className="shop-offer-details">
                            <div className="shop-offer-content">
                                <div className="shop-offer-name">
                                    {offer.shop_name}
                                </div>
                                <div className="shop-offer-category">
                                    {offer.category}
                                </div>
                                <div className="shop-offer-percent">
                                    {offer.offer_percent}% OFF
                                </div>
                                <div className="shop-offer-description">
                                    {offer.description || "Limited time offer"}
                                </div>
                                <div className="shop-offer-price">
                                    Starting ₹
                                    {Number(offer.price || 0).toLocaleString("en-IN")}
                                </div>
                                <div className="shop-offer-rating">
                                    ★ {offer.rating || "—"} •{" "}
                                    {Number(offer.customer_count || 0).toLocaleString("en-IN")}
                                    + Customers
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* DOTS */}
            <div className="shop-offer-dots">
                {openOffers.map((offer, index) => (
                    <span
                        key={offer.id}
                        className={`shop-offer-dot ${
                            index === activeOfferIndex ? "active" : ""
                        }`}
                    />
                ))}
            </div>

        </section>
    );
}

export default OffersCarousel;