import { useMemo, useCallback, useState, useEffect, memo } from "react";
import "./4FinestDeals.css";

function shuffleAndTake(arr, count) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count);
}

function FinestDeals({ user, shops, onOpenDetails }) {
    const [deals, setDeals] = useState([]);

    useEffect(() => {
        if (!shops || shops.length === 0) {
            setDeals([]);
            return;
        }
        setDeals(shuffleAndTake(shops, 10));
    }, [shops]);

    const userName = useMemo(() => {
        const first = user?.full_name?.split(" ")[0];
        if (!first) return null;
        return first
            .toLowerCase()
            .replace(/^./, (char) => char.toUpperCase());
    }, [user?.full_name]);

    const handleOpen = useCallback(
        (shop) => onOpenDetails(shop, "shop"),
        [onOpenDetails]
    );

    const animationDelays = useMemo(
        () => deals.map((_, i) => ({ animationDelay: `${i * 0.05}s` })),
        [deals.length]
    );

    if (deals.length === 0) return null;

    return (
        <section className="shop-finest-deals-section">
            <div className="shop-section-title">
                <h3>{userName ? `${userName}, Best products for you` : "Best products for you"}</h3>
            </div>

            <div className="shop-finest-deals-scroll">
                <div className="shop-finest-deals-grid">
                    {deals.map((shop, index) => {
                        const isAvailable = Number(shop.shop_status) === 1;
                        return (
                            <div
                                className={`shop-finest-deal-card ${!isAvailable ? "out-of-stock" : ""}`}
                                key={shop.shop_id}
                                onClick={() => handleOpen(shop)}
                                style={animationDelays[index]}
                            >
                                <div className="shop-finest-deal-image">
                                    <img
                                        src={shop.shop_image1}
                                        alt={shop.shop_name}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    {!isAvailable && (
                                        <span className="shop-finest-deal-oos">OUT OF STOCK</span>
                                    )}
                                    <span className="shop-finest-deal-price">
                                        From ₹{Number(shop.shop_price || 0).toLocaleString("en-IN")}
                                    </span>
                                </div>
                                <span className="shop-finest-deal-name">{shop.shop_name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default memo(FinestDeals);