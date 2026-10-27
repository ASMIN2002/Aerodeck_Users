import { memo, useMemo } from "react";
import { FiArrowRight } from "react-icons/fi";
import "../cartstyle/CartBilling.css";

const getPrice = (item) => {
    const fields = ["product_price", "gift_price", "shop_price", "premium_price", "medicine_price"];
    for (const field of fields) {
        const val = item[field];
        if (val !== undefined && val !== null) {
            const num = Number(val);
            return isNaN(num) ? 0 : num;
        }
    }
    return 0;
};

function CartBilling({ items, onPlaceOrder }) {
    const { totalItems, totalPrice } = useMemo(() => {
        const totalItems = items.length;
        const totalPrice = items.reduce((sum, item) => {
            const price = getPrice(item);
            const qty = Number(item.quantity) || 0;
            return sum + price * qty;
        }, 0);
        return { totalItems, totalPrice };
    }, [items]);

    return (
        <div className="cart-billing">
            <div className="cart-billing-left">
                <span className="cart-billing-label">Total</span>
                <h2 className="cart-billing-total">₹{totalPrice.toLocaleString("en-IN")}</h2>
                <p className="cart-billing-count">
                    {totalItems} Item{totalItems !== 1 ? "s" : ""}
                </p>
            </div>

            <button type="button" className="cart-place-order" onClick={onPlaceOrder}>
                Place Order <FiArrowRight />
            </button>
        </div>
    );
}

export default memo(CartBilling);