import { useEffect, useMemo, useRef, useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import "./3OffersCarousel.css";
import { API } from "../../../services/api";

function CountdownBadge({ validAt }) {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        if (!validAt) return;
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, [validAt]);

    if (!validAt) return null;

    const diff = new Date(validAt).getTime() - now;
    if (diff <= 0) {
        return (
            <div className="shop-offer-countdown expired">
                <span className="shop-offer-countdown-icon">⏰</span>
                <span className="shop-offer-countdown-text">Expired</span>
            </div>
        );
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff / 3600000) % 24);
    const minutes = Math.floor((diff / 60000) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    let text = "";
    if (days > 0) text += `${days}d `;
    if (days > 0 || hours > 0) text += `${hours}h `;
    text += `${minutes}m ${seconds}s`;

    return (
        <div className="shop-offer-countdown">
            <span className="shop-offer-countdown-icon">⏳</span>
            <span className="shop-offer-countdown-text">{text}</span>
        </div>
    );
}

const MemoCountdown = memo(CountdownBadge);

function OffersCarousel() {
    const navigate = useNavigate();
    const [offers, setOffers] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const offerScrollRef = useRef(null);
    const isAutoScrollingRef = useRef(false);

    useEffect(() => {
        let cancelled = false;
        const fetchOffers = async () => {
            try {
                const res = await fetch(`${API}/api/openoffers/active`);
                const data = await res.json();
                if (!cancelled && data.success && Array.isArray(data.data)) {
                    setOffers(data.data);
                }
            } catch (err) {
                console.error("Open offers fetch error:", err);
            }
        };
        fetchOffers();
        return () => { cancelled = true; };
    }, []);

    const scrollToSlide = useCallback((index) => {
        const container = offerScrollRef.current;
        if (!container) return;
        isAutoScrollingRef.current = true;
        container.scrollTo({
            left: index * container.clientWidth,
            behavior: "smooth",
        });
        setActiveIndex(index);
        setTimeout(() => { isAutoScrollingRef.current = false; }, 600);
    }, []);

    useEffect(() => {
        if (offers.length <= 1) return;
        const timer = setTimeout(() => {
            const nextIndex = (activeIndex + 1) % offers.length;
            scrollToSlide(nextIndex);
        }, 5000);
        return () => clearTimeout(timer);
    }, [activeIndex, offers.length, scrollToSlide]);

    const handleScroll = useCallback((e) => {
        if (isAutoScrollingRef.current) return;
        const container = e.currentTarget;
        const index = Math.round(container.scrollLeft / container.clientWidth);
        setActiveIndex((prev) => (prev === index ? prev : index));
    }, []);

    const handleOfferClick = useCallback(() => navigate("/offers"), [navigate]);

    const visibleOffers = useMemo(() => {
        if (offers.length <= 3) return offers.map((o, i) => ({ offer: o, index: i }));
        const result = [];
        for (let offset = -1; offset <= 1; offset++) {
            const i = (activeIndex + offset + offers.length) % offers.length;
            result.push({ offer: offers[i], index: i });
        }
        return result;
    }, [offers, activeIndex]);

    if (offers.length === 0) return null;

    return (
        <section className="shop-offer-carousel-section">
            <div className="shop-offer-bg" aria-hidden="true">
                <span className="shop-offer-confetti shop-offer-confetti-1" />
                <span className="shop-offer-confetti shop-offer-confetti-2" />
                <span className="shop-offer-confetti shop-offer-confetti-3" />
                <span className="shop-offer-confetti shop-offer-confetti-4" />
                <span className="shop-offer-confetti shop-offer-confetti-5" />
                <span className="shop-offer-confetti shop-offer-confetti-6" />
                <span className="shop-offer-confetti shop-offer-confetti-7" />
                <span className="shop-offer-confetti shop-offer-confetti-8" />
                <span className="shop-offer-glow shop-offer-glow-1" />
                <span className="shop-offer-glow shop-offer-glow-2" />
            </div>

            <div className="shop-offer-heading-row">
                <h2 className="shop-offer-heading">Special <span>Offers</span></h2>
            </div>

            <div
                className="shop-offer-carousel"
                ref={offerScrollRef}
                onScroll={handleScroll}
            >
                {visibleOffers.map(({ offer, index }) => (
                    <div
                        key={offer.id ?? index}
                        className={`shop-offer-slide ${index === activeIndex ? "active" : ""}`}
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
                                            decoding="async"
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
                                    <div className="shop-offer-name">{offer.shop_name}</div>
                                    <div className="shop-offer-percent">{offer.offer_percent}%</div>
                                </div>
                                <div className="shop-offer-category">{offer.category}</div>
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
                                <MemoCountdown validAt={offer.valid_at} />
                            </div>
                        </button>
                    </div>
                ))}
            </div>

            {offers.length > 1 && (
                <div className="shop-offer-dots">
                    {offers.map((offer, index) => (
                        <button
                            key={`dot-${offer.id ?? index}`}
                            type="button"
                            className={`shop-offer-dot ${index === activeIndex ? "active" : ""}`}
                            onClick={() => scrollToSlide(index)}
                            aria-label={`Go to offer ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default memo(OffersCarousel);