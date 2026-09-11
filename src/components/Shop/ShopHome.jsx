import { useMemo, useEffect, useRef, useState } from "react";
import "./ShopHome.css";
import ShopCard from "./ShopCard";
import toast from "react-hot-toast";
import { API } from "../../services/api";
import { FiArrowRight } from "react-icons/fi";

function ShopHome({

    user,
    categories,
    shops,
    onCategoryClick,
    onOpenDetails,
    onOpenAllShops,
    onOpenAllShopCategories

}) {
    const [activeOfferIndex, setActiveOfferIndex] = useState(0);
    const [openOffers, setOpenOffers] = useState([]);

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

    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const suggestedShops = useMemo(() => {

        const good = shops.filter(
            shop => Number(shop.shop_rating || 0) > 3.5
        );

        const medium = shops.filter(
            shop => {
                const rating = Number(shop.shop_rating || 0);
                return rating > 1 && rating <= 3.5;
            }
        );

        const veryLow = shops.filter(
            shop => Number(shop.shop_rating || 0) <= 1
        );

        const shuffle = (array) =>
            [...array].sort(() => Math.random() - 0.5);

        const selected = [
            ...shuffle(good).slice(0, 15),
            ...shuffle(medium).slice(0, 2),
            ...shuffle(veryLow).slice(0, 3)
        ];

        return shuffle(selected);

    }, [shops]);

    const topLikedShops = useMemo(() => {

        return [...shops]
            .sort(
                (a, b) =>
                    Number(b.shop_total_likes || 0) -
                    Number(a.shop_total_likes || 0)
            )
            .slice(0, 16);

    }, [shops]);

    const offerScrollRef = useRef(null);

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

    const randomShops = useMemo(() => {
        return [...shops]
            .sort(() => Math.random() - 0.5);

    }, [shops]);
    const finestDeals = useMemo(() => {
        return [...shops]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
    }, [shops]);
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
    
    return (

        <div className="shop-home">
            <section className="shop-category-section">
                <div className="shop-category-scroll">
                    {categories.map((item) => (

                        <button
                            key={item.catid}
                            className="shop-category-box"
                            onClick={() => onCategoryClick(item.category)}
                        >
                            <div>
                                <div className="shop-category-icon">

                                    <img
                                        src={item.image}
                                        alt={item.category}
                                    />

                                </div>
                            </div>

                            <span>
                                {item.category}
                            </span>

                        </button>

                    ))}
                </div>
                <div className="shop-section-title">
                    <button
                        type="button" className="viewALL"
                        onClick={onOpenAllShopCategories}
                    >
                        <FiArrowRight />
                    </button>
                </div>
            </section>
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
                            className={`shop-offer-slide ${index === activeOfferIndex ? "active" : ""
                                }`}
                            onClick={() => toast("Feature Coming Soon 🚀", {
                                duration: 2500,
                                style: {
                                    background: "#1a1a1a",
                                    color: "#fff",
                                    borderRadius: "10px",
                                    padding: "12px 18px",
                                    fontSize: "14px",
                                    fontWeight: 600
                                }
                            })}
                        >

                            {/* LEFT IMAGE */}
                            <div className="shop-offer-image">
                                <img
                                    src={offer.image_url || ""}
                                    alt={offer.shop_name}
                                />
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
                                        Starting ₹{Number(offer.price || 0).toLocaleString("en-IN")}
                                    </div>

                                    <div className="shop-offer-rating">
                                        ★ {offer.rating || "—"} •{" "}
                                        {Number(offer.customer_count || 0).toLocaleString("en-IN")}+ Customers
                                    </div>
                                    <div className="shop-offer-time">
                                        {(() => {
                                            const cd = getCountdown(offer.valid_at);
                                            if (!cd) return null;
                                            return (
                                                <div className={`shop-offer-countdown ${cd.expired ? "expired" : ""}`}>
                                                    {cd.expired ? "⏰ Expired" : `⏳ Ends in ${cd.text}`}
                                                </div>
                                            );
                                        })()}
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
                            className={`shop-offer-dot ${index === activeOfferIndex
                                ? "active"
                                : ""
                                }`}
                        />

                    ))}

                </div>

            </section>

            <section className="shop-finest-deals-section">


                <div className="shop-section-title">

                    <h3>
                        {user?.full_name
                            ?.split(" ")[0]
                            ?.toLowerCase()
                            .replace(/^./, char => char.toUpperCase())
                        }, Best products for you
                    </h3>

                </div>
                <div className="shop-finest-deals-scroll">
                    <div className="shop-finest-deals-grid">

                        {finestDeals.map((shop) => (

                            <div
                                className="shop-finest-deal-card"
                                key={shop.shop_id}
                                onClick={() => onOpenDetails(shop, "shop")}
                            >

                                <div className="shop-finest-deal-image">

                                    <img
                                        src={shop.shop_image1}
                                        alt={shop.shop_name}
                                    />

                                    <span className="shop-finest-deal-price">
                                        From ₹{Number(
                                            shop.shop_price || 0
                                        ).toLocaleString("en-IN")}
                                    </span>

                                </div>

                                <span className="shop-finest-deal-name">
                                    {shop.shop_name}
                                </span>

                            </div>

                        ))}

                    </div>
                </div>

            </section>

            <section className="shop-suggested-section">

                <div className="shop-section-title">

                    <h4>
                        Suggested For You
                    </h4>
                    <button
                        type="button"
                        onClick={onOpenAllShops}
                        className="viewALL"
                    >
                        <FiArrowRight />
                    </button>

                </div>


                <div className="shop-suggested-scroll">
                    <div className="shop-suggested-grid">

                        {
                            suggestedShops.map((shop) => (
                                <div
                                    className="shop-suggested-card"
                                    key={shop.shop_id}
                                    onClick={() => onOpenDetails(shop, "shop")}
                                >
                                    <div className="shop-suggested-image">

                                        <img
                                            src={shop.shop_image1}
                                            alt={shop.shop_name}
                                        />
                                        {Number(shop.shop_rating) > 3.5 && (
                                            <span className="shop-suggested-rating">
                                                {Number(shop.shop_rating).toFixed(1)}
                                                <span className="rating-star">★</span>
                                            </span>
                                        )}
                                    </div>

                                    <div className="shop-suggested-info">

                                        <span className="shop-suggested-name">
                                            {shop.shop_name}
                                        </span>

                                        <div className="shop-suggested-price">

                                            <del>
                                                ₹{shop.shop_demo_price}
                                            </del>

                                            <strong>
                                                ₹{shop.shop_price}
                                            </strong>

                                        </div>

                                    </div>

                                </div>

                            ))
                        }

                    </div>

                </div>

            </section>



            <section className="shop-top-liked-section">
                <div className="likeheader">Top Liked</div>

                <div className="shop-liked-scroll">

                    <div className="shop-liked-grid">

                        {topLikedShops.map((shop) => (

                            <div
                                key={shop.shop_id}
                                className="shop-liked-card"
                                onClick={() => onOpenDetails(shop, "shop")}
                            >

                                <div className="shop-liked-image">

                                    <img
                                        src={shop.shop_image1}
                                        alt={shop.shop_name}
                                    />

                                    <span className="shop-liked-count">
                                        <span className="shop-liked-icon">♥</span>
                                        {Number(
                                            shop.shop_total_likes || 0
                                        ).toLocaleString("en-IN")}
                                    </span>

                                </div>

                                <div className="shop-liked-info">

                                    <span className="shop-liked-name">
                                        {shop.shop_name}
                                    </span>

                                    <div className="shop-liked-price">

                                        <span className="shop-liked-discount">
                                            ↓ {shop.shop_discount_percentage}%
                                        </span>

                                        <strong>
                                            ₹{Number(shop.shop_price).toLocaleString("en-IN")}
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>
            </section>

            <section className="shop-value-deals-section">

                <div className="likeheader">
                    <h3>
                        Top Value Deals
                    </h3>
                </div>

                <div className="shop-value-deals-scroll">

                    <div className="shop-value-deals-grid">

                        {shops.slice(0, 6).map((shop) => (

                            <div
                                key={shop.shop_id}
                                className="shop-value-card"
                                onClick={() => onOpenDetails(shop, "shop")}
                            >

                                <div className="shop-value-image">

                                    <img
                                        src={shop.shop_image1}
                                        alt={shop.shop_name}
                                    />

                                    {shop.shop_highlight_text && (
                                        <span className="shop-value-highlight">
                                            {shop.shop_highlight_text}
                                        </span>
                                    )}

                                </div>

                                <span className="shop-value-name">
                                    {shop.shop_name}
                                </span>
                            </div>

                        ))}

                    </div>

                </div>
            </section>

            <section>

                <div className="rendomhead">
                    <h3>Related Products</h3>
                </div>
                <div className="shop-random-products">

                    {randomShops.map((shop) => (

                        <ShopCard
                            key={shop.shop_id}
                            product={shop}
                            onOpenDetails={() =>
                                onOpenDetails(shop, "shop")
                            }
                        />

                    ))}

                </div>
            </section>
        </div>

    );

}

export default ShopHome;