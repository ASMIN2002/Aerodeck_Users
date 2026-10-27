import { useMemo, useCallback, memo } from "react";
import "./6TopLikedShops.css";

function TopLikedShops({ shops, onOpenDetails }) {
    const topLikedShops = useMemo(() => {
        if (!shops || shops.length === 0) return [];
        return [...shops]
            .sort(
                (a, b) =>
                    Number(b.shop_total_likes || 0) -
                    Number(a.shop_total_likes || 0)
            )
            .slice(0, 16);
    }, [shops]);

    const handleOpen = useCallback(
        (shop) => onOpenDetails(shop, "shop"),
        [onOpenDetails]
    );

    const animationDelays = useMemo(
        () => topLikedShops.map((_, i) => ({ animationDelay: `${i * 0.04}s` })),
        [topLikedShops.length]
    );

    if (topLikedShops.length === 0) return null;

    return (
        <section className="shop-top-liked-section">
            <div className="likeheader">Top Liked</div>

            <div className="shop-liked-scroll">
                <div className="shop-liked-grid">
                    {topLikedShops.map((shop, index) => {
                        const isAvailable = Number(shop.shop_status) === 1;
                        return (
                            <div
                                key={shop.shop_id}
                                className={`shop-liked-card ${!isAvailable ? "out-of-stock" : ""}`}
                                onClick={() => handleOpen(shop)}
                                style={animationDelays[index]}
                            >
                                <div className="shop-liked-image">
                                    <img
                                        src={shop.shop_image1}
                                        alt={shop.shop_name}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    {!isAvailable && (
                                        <span className="shop-liked-oos">OUT OF STOCK</span>
                                    )}
                                    {isAvailable && (
                                        <span className="shop-liked-count">
                                            <span className="shop-liked-icon">♥</span>
                                            {Number(shop.shop_total_likes || 0).toLocaleString("en-IN")}
                                        </span>
                                    )}
                                </div>
                                <div className="shop-liked-info">
                                    <span className="shop-liked-name">{shop.shop_name}</span>
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
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default memo(TopLikedShops);