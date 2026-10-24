import { FiArrowRight } from "react-icons/fi";
import "../cartstyle/CartBilling.css";

const getPrice = (item) =>
    Number(item.product_price || item.gift_price || item.shop_price || item.premium_price || item.medicine_price || 0);

function CartBilling({ items, onPlaceOrder }) {
    const totalItems = items.length;
    const totalPrice = items.reduce((sum, item) => sum + getPrice(item) * item.quantity, 0);

    return (
        <div className="cart-billing">
            <div className="cart-billing-left">
                <span className="cart-billing-label">Total</span>
                <h2 className="cart-billing-total">₹{totalPrice.toLocaleString("en-IN")}</h2>
                <p className="cart-billing-count">{totalItems} Item{totalItems !== 1 ? "s" : ""}</p>
            </div>

            <button type="button" className="cart-place-order" onClick={onPlaceOrder}>
                Place Order <FiArrowRight />
            </button>
        </div>
    );
}

export default CartBilling;