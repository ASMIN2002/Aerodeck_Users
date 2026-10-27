import { memo, useCallback, useMemo } from "react";
import { FaTrash } from "react-icons/fa";
import { FiTruck } from "react-icons/fi";
import "../cartstyle/CartCard.css";

const PREFIXES = { G: "gift", S: "shop", P: "premium", M: "medicine" };

const getField = (item, key) => {
    const fields = ["product", "gift", "shop", "premium", "medicine", "card"];
    for (const prefix of fields) {
        const val = item[`${prefix}_${key}`];
        if (val !== undefined && val !== null) return val;
    }
    return null;
};

const getType = (id) => {
    const prefix = String(id).charAt(0).toUpperCase();
    return PREFIXES[prefix] || "card";
};

const formatDelivery = (days) => {
    if (!days) return "-";
    const num = Number(days);
    if (isNaN(num)) return "-";
    const d = new Date();
    d.setDate(d.getDate() + num);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

function CartCard({ item, onOpenDetails, onDelete, onIncrease, onDecrease }) {
    const image = getField(item, "image1");
    const name = getField(item, "name");
    const demoPrice = getField(item, "demo_price");
    const discount = Number(getField(item, "discount_percentage") || 0);
    const price = getField(item, "price");
    const type = getType(item.product_id);

    const handleDelete = useCallback((e) => {
        e.stopPropagation();
        onDelete(item.product_id);
    }, [onDelete, item.product_id]);

    const handleOpen = useCallback(() => {
        onOpenDetails(item, type);
    }, [onOpenDetails, item, type]);

    const handleIncrease = useCallback(() => {
        onIncrease(item);
    }, [onIncrease, item]);

    const handleDecrease = useCallback(() => {
        onDecrease(item);
    }, [onDecrease, item]);

    const deliveryDate = useMemo(() => formatDelivery(item.delivery), [item.delivery]);

    return (
        <div className="cart-card">
            <button
                type="button"
                className="cart-delete-btn"
                onClick={handleDelete}
                aria-label="Remove"
            >
                <FaTrash />
            </button>

            <div className="cart-image-wrap" onClick={handleOpen}>
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="cart-image"
                        loading="lazy"
                        decoding="async"
                    />
                ) : (
                    <div className="cart-image-fallback">
                        {name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                )}
            </div>

            <div className="cart-details">
                <h3 className="cart-name">{name}</h3>

                <div className="cart-price-row">
                    <span className="cart-price">₹{price}</span>
                    {demoPrice && demoPrice !== price && (
                        <span className="cart-demo-price">₹{demoPrice}</span>
                    )}
                    {discount > 0 && <span className="cart-discount">{discount}% OFF</span>}
                </div>

                <p className="cart-delivery">
                    <FiTruck className="cart-delivery-icon" /> Delivery by {deliveryDate}
                </p>

                <div className="cart-actions-row">
                    <div className="cart-qty">
                        <button type="button" onClick={handleDecrease} aria-label="Decrease">-</button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={handleIncrease} aria-label="Increase">+</button>
                    </div>

                    <button type="button" className="cart-view-btn" onClick={handleOpen}>
                        View
                    </button>
                </div>
            </div>
        </div>
    );
}

export default memo(CartCard);