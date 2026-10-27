import { useMemo, useCallback, memo } from "react";
import "./7ValueDeals.css";

const cleanHighlight = (text) =>
    (text || "").replace(/~cloth(e)?s\s*$/i, "").trim();

function ValueDeals({ shops, onOpenDetails }) {
    const valueDeals = useMemo(() => shops.slice(0, 6), [shops]);

    const handleOpen = useCallback(
        (shop) => onOpenDetails(shop, "shop"),
        [onOpenDetails]
    );

    const animationDelays = useMemo(
        () => valueDeals.map((_, i) => ({ animationDelay: `${i * 0.05}s` })),
        [valueDeals.length]
    );

    if (valueDeals.length === 0) return null;

    return (
        <section className="shop-value-deals-section">
            <div className="likeheader">
                <h3>Top Value Deals</h3>
            </div>

            <div className="shop-value-deals-scroll">
                <div className="shop-value-deals-grid">
                    {valueDeals.map((shop, index) => {
                        const isAvailable = Number(shop.shop_status) === 1;
                        const highlight = cleanHighlight(shop.shop_highlight_text);

                        return (
                            <div
                                key={shop.shop_id}
                                className={`shop-value-card ${!isAvailable ? "out-of-stock" : ""}`}
                                onClick={() => handleOpen(shop)}
                                style={animationDelays[index]}
                            >
                                <div className="shop-value-image">
                                    <img
                                        src={shop.shop_image1}
                                        alt={shop.shop_name}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    {!isAvailable && (
                                        <span className="shop-value-oos">OUT OF STOCK</span>
                                    )}
                                    {isAvailable && highlight && (
                                        <span className="shop-value-highlight">{highlight}</span>
                                    )}
                                </div>
                                <span className="shop-value-name">{shop.shop_name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default memo(ValueDeals);