import { memo, useCallback } from "react";
import { FiHeart, FiBookmark } from "react-icons/fi";
import "../levelstyle/2ShopCard.css";

const cleanHighlight = (text) =>
    (text || "").replace(/~cloth(e)?s\s*$/i, "").trim();

function ProductShop({ product, onOpenDetails }) {
    const {
        shop_status,
        shop_image1,
        shop_rating,
        shop_price,
        shop_name,
        shop_demo_price,
        shop_discount_percentage,
        shop_highlight_text,
        shop_total_likes,
        shop_total_saves,
    } = product;

    const isAvailable = Number(shop_status) === 1;
    const highlight = cleanHighlight(shop_highlight_text);

    const handleClick = useCallback(() => {
        onOpenDetails?.(product);
    }, [onOpenDetails, product]);

    return (
        <div
            className={`heepit-shop-card ${isAvailable ? "" : "out-of-stock"}`}
            onClick={handleClick}
        >
            <div className="heepit-shop-image-box">
                <div className="heepit-shop-image-grid">
                    <img
                        src={shop_image1}
                        alt={shop_name}
                        className="heepit-shop-image"
                        loading="lazy"
                        decoding="async"
                    />
                    <span className="heepit-shop-rating-badge">⭐ {shop_rating || "4.3"}</span>
                    {!isAvailable && <span className="heepit-shop-oos-overlay">OUT OF STOCK</span>}
                </div>
            </div>

            <div className="heepit-shop-body">
                <h3 className="heepit-shop-name">{shop_name}</h3>

                {highlight && <div className="heepit-shop-highlight">{highlight}</div>}

                <div className="heepit-shop-price-row">
                    <span className="heepit-shop-price">₹{shop_price}</span>
                    {shop_demo_price && (
                        <span className="heepit-shop-demo-price">₹{shop_demo_price}</span>
                    )}
                    <span className="heepit-shop-discount">{shop_discount_percentage}% OFF</span>
                </div>

                <div className="heepit-shop-meta-row">
                    <span className="heepit-shop-meta-item likes">
                        <FiHeart className="heepit-shop-meta-icon" /> {shop_total_likes || 0}
                    </span>
                    <span className="heepit-shop-meta-item saves">
                        <FiBookmark className="heepit-shop-meta-icon" /> {shop_total_saves || 0}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default memo(ProductShop, (prev, next) => {
    const a = prev.product;
    const b = next.product;
    return (
        a.shop_id === b.shop_id &&
        a.shop_total_likes === b.shop_total_likes &&
        a.shop_total_saves === b.shop_total_saves &&
        a.shop_status === b.shop_status &&
        a.shop_price === b.shop_price &&
        prev.onOpenDetails === next.onOpenDetails
    );
});