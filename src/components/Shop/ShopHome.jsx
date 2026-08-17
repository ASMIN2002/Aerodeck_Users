import { useMemo, useEffect, useRef, useState } from "react";
import "./ShopHome.css";
import ShopCard from "./ShopCard";
import { API } from "../../services/api";

function ShopHome({

    user,
    categories,
    shops,
    onCategoryClick,
    onOpenDetails,
    onOpenAllShops

}) {
    const [activeOfferIndex, setActiveOfferIndex] = useState(0);
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
    const offerShops = useMemo(() => {

        const eligible = shops.filter(shop =>
            /up\s*to.*\d+%.*off/i.test(
                shop.shop_highlight_text || ""
            )
        );

        return [...eligible]
            .sort(() => Math.random() - 0.5)
            .slice(0, 5);

    }, [shops]);
    const offerScrollRef = useRef(null);
    useEffect(() => {
        if (offerShops.length <= 1) return;

        const timer = setInterval(() => {

            const container = offerScrollRef.current;

            if (!container) return;

            const nextPosition =
                container.scrollLeft + container.clientWidth;

            if (
                nextPosition >=
                container.scrollWidth - container.clientWidth
            ) {
                container.scrollTo({
                    left: 0,
                    behavior: "smooth"
                });
            } else {
                container.scrollTo({
                    left: nextPosition,
                    behavior: "smooth"
                });
            }

        }, 3000);

        return () => clearInterval(timer);

    }, [offerShops]);
    const randomShops = useMemo(() => {
        return [...shops]
            .sort(() => Math.random() - 0.5);

    }, [shops]);
    const finestDeals = useMemo(() => {
        return [...shops]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
    }, [shops]);
    return (

        <div className="shop-home">
            <section className="shop-offer-carousel-section">

                <div
                    className="shop-offer-carousel"
                    ref={offerScrollRef}
                    onScroll={(e) => {

                        const container = e.currentTarget;

                        const index = Math.round(
                            container.scrollLeft /
                            container.clientWidth
                        );

                        setActiveOfferIndex(index);

                    }}
                >
                    {offerShops.map((shop) => {

                        const highlight = shop.shop_highlight_text || "";

                        const percentMatch =
                            highlight.match(/(\d+(?:\.\d+)?)\s*%\s*off/i);

                        const percent = percentMatch
                            ? percentMatch[1]
                            : null;

                        return (
                            <div
                                key={shop.shop_id}
                                className="shop-offer-slide"
                                onClick={() =>
                                    onOpenDetails(shop, "shop")
                                }
                            >

                                <img
                                    src={shop.shop_image1}
                                    alt={shop.shop_name}
                                />

                                <div className="shop-offer-overlay">

                                    <div className="shop-offer-name">
                                        {shop.shop_name}
                                    </div>

                                    {percent && (
                                        <div className="shop-offer-percent">
                                            Up to {percent}% OFF
                                        </div>
                                    )}

                                    <div className="shop-offer-price">
                                        ₹{Number(
                                            shop.shop_price || 0
                                        ).toLocaleString("en-IN")}
                                    </div>

                                </div>

                            </div>
                        );
                    })}
                </div>
                <div className="shop-offer-dots">

                    {offerShops.map((shop, index) => (

                        <span
                            key={shop.shop_id}
                            className={`shop-offer-dot ${index === activeOfferIndex
                                ? "active"
                                : ""
                                }`}
                        />

                    ))}

                </div>
            </section>
            <section className="shop-category-section">

                <div className="shop-section-title">

                    <h3>
                        {user?.full_name
                            ?.split(" ")[0]
                            ?.toLowerCase()
                            .replace(/^./, char => char.toUpperCase())
                        }, still you are looking for this ?
                    </h3>

                </div>


                <div className="shop-category-scroll">

                    {
                        categories.map((category) => {

                            const categoryShop = shops.find(
                                shop => shop.shop_category === category
                            );

                            return (

                                <button
                                    key={category}
                                    className="shop-category-box"
                                    onClick={() => onCategoryClick(category)}
                                >

                                    <div className="shop-category-icon">

                                        <img
                                            src={categoryShop?.shop_image1}
                                            alt={categoryShop?.shop_name || category}
                                        />

                                    </div>

                                    <span>
                                        {categoryShop?.shop_name || category}
                                    </span>
                                    <strong>
                                        View {categoryShop?.shop_category}
                                    </strong>

                                </button>

                            );

                        })
                    }

                </div>

            </section>
            <section className="shop-finest-deals-section">

                <div className="shop-section-title">
                    <h4>Finest Deals</h4>
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
        </div>

    );

}

export default ShopHome;