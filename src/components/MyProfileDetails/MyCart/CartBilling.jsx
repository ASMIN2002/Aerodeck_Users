import "./CartBilling.css";

function CartBilling({

    items,

    onPlaceOrder

}) {

    const totalItems = items.length;

    const totalPrice = items.reduce((total, item) => {

        const price = Number(
            item.product_price ||
            item.gift_price ||
            item.shop_price ||
            item.premium_price ||
            0
        );

        return total + (price * item.quantity);

    }, 0);

    return (

        <div className="cart-billing">

            <div className="cart-billing-left">

                <h2>₹{totalPrice.toLocaleString()}</h2>

                <p>{totalItems} Item{totalItems !== 1 ? "s" : ""}</p>

            </div>

            <button

                className="cart-place-order"

                onClick={onPlaceOrder}

            >

                Place Order →

            </button>

        </div>

    );

}

export default CartBilling;