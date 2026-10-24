import { FaTrash } from "react-icons/fa";
import { FiTruck } from "react-icons/fi";
import "../cartstyle/CartCard.css";

const PREFIXES = { G: "gift", S: "shop", P: "premium", M: "medicine" };

const getField = (item, key) =>
    item[`product_${key}`] ||
    item[`gift_${key}`] ||
    item[`shop_${key}`] ||
    item[`premium_${key}`] ||
    item[`medicine_${key}`] ||
    item[`card_${key}`];

const getType = (id) => PREFIXES[String(id).charAt(0).toUpperCase()] || "card";

const formatDelivery = (days) => {
    if (!days) return "-";
    const d = new Date();
    d.setDate(d.getDate() + Number(days));
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

function CartCard({ item, onOpenDetails, onDelete, onIncrease, onDecrease }) {
    const image = getField(item, "image1");
    const name = getField(item, "name");
    const demoPrice = getField(item, "demo_price");
    const discount = getField(item, "discount_percentage");
    const price = getField(item, "price");
    const type = getType(item.product_id);

    return (
        <div className="cart-card">
            <button className="cart-delete-btn" onClick={() => onDelete(item.product_id)} aria-label="Remove">
                <FaTrash />
            </button>

            <div className="cart-image-wrap" onClick={() => onOpenDetails(item, type)}>
                {image ? (
                    <img src={image} alt={name} className="cart-image" loading="lazy" />
                ) : (
                    <div className="cart-image-fallback">{name?.charAt(0)?.toUpperCase() || "?"}</div>
                )}
            </div>

            <div className="cart-details">
                <h3 className="cart-name">{name}</h3>

                <div className="cart-price-row">
                    <span className="cart-price">₹{price}</span>
                    {demoPrice && <span className="cart-demo-price">₹{demoPrice}</span>}
                    {discount > 0 && <span className="cart-discount">{discount}% OFF</span>}
                </div>

                <p className="cart-delivery">
                    <FiTruck className="cart-delivery-icon" /> Delivery by {formatDelivery(item.delivery)}
                </p>

                <div className="cart-actions-row">
                    <div className="cart-qty">
                        <button type="button" onClick={() => onDecrease(item)} aria-label="Decrease">-</button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => onIncrease(item)} aria-label="Increase">+</button>
                    </div>

                    <button type="button" className="cart-view-btn" onClick={() => onOpenDetails(item, type)}>
                        View
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartCard;