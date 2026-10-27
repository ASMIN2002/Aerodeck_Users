import { useMemo, useCallback, useState, useEffect, memo } from "react";
import { FiArrowRight } from "react-icons/fi";
import "./5SuggestedShops.css";

function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function buildSuggestions(shops) {
    const good = [];
    const medium = [];
    const veryLow = [];

    for (const shop of shops) {
        const rating = Number(shop.shop_rating || 0);
        if (rating > 3.5) good.push(shop);
        else if (rating > 1) medium.push(shop);
        else veryLow.push(shop);
    }

    const selected = [
        ...shuffleInPlace(good).slice(0, 15),
        ...shuffleInPlace(medium).slice(0, 2),
        ...shuffleInPlace(veryLow).slice(0, 3),
    ];

    return shuffleInPlace(selected);
}

function SuggestedShops({ shops, onOpenDetails, onOpenAllShops }) {
    const [suggestedShops, setSuggestedShops] = useState([]);

    useEffect(() => {
        if (!shops || shops.length === 0) {
            setSuggestedShops([]);
            return;
        }
        setSuggestedShops(buildSuggestions(shops));
    }, [shops]);

    const handleOpen = useCallback(
        (shop) => onOpenDetails(shop, "shop"),
        [onOpenDetails]
    );

    const animationDelays = useMemo(
        () => suggestedShops.map((_, i) => ({ animationDelay: `${i * 0.04}s` })),
        [suggestedShops.length]
    );

    if (suggestedShops.length === 0) return null;

    return (
        <section className="shop-suggested-section">
            <div className="shop-section-title">
                <h4>Suggested For You</h4>
            </div>

            <div className="shop-suggested-scroll">
                <div className="shop-suggested-grid">
                    {suggestedShops.map((shop, index) => {
                        const isAvailable = Number(shop.shop_status) === 1;
                        const rating = Number(shop.shop_rating);
                        return (
                            <div
                                className={`shop-suggested-card ${!isAvailable ? "out-of-stock" : ""}`}
                                key={shop.shop_id}
                                onClick={() => handleOpen(shop)}
                                style={animationDelays[index]}
                            >
                                <div className="shop-suggested-image">
                                    <img
                                        src={shop.shop_image1}
                                        alt={shop.shop_name}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    {!isAvailable && (
                                        <span className="shop-suggested-oos">OUT OF STOCK</span>
                                    )}
                                    {isAvailable && rating > 3.5 && (
                                        <span className="shop-suggested-rating">
                                            {rating.toFixed(1)}
                                            <span className="rating-star">★</span>
                                        </span>
                                    )}
                                </div>

                                <div className="shop-suggested-info">
                                    <span className="shop-suggested-name">{shop.shop_name}</span>
                                    <div className="shop-suggested-price">
                                        <del>₹{shop.shop_demo_price}</del>
                                        <strong>₹{shop.shop_price}</strong>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default memo(SuggestedShops);