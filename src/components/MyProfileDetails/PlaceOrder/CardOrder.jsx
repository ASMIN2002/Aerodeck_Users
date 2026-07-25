import "./CardOrder.css";

function CardOrder({ setProfilePage }) {

    const cardName = "Premium Visiting Card";
    const unitPrice = 2;
    const quantity = 500;
    const minimumOrder = 50;

    const cardPrice = unitPrice * quantity;
    const gst = +(cardPrice * 0.18).toFixed(2);
    const platformFee = 29;
    const delivery = 0;

    const grandTotal = cardPrice + gst + platformFee + delivery;

    const upiAmount = (grandTotal * 0.80).toFixed(2);
    const codAmount = (grandTotal * 0.20).toFixed(2);

    return (

        <div className="card-order-page">

            {/* Header */}

            <div className="card-order-header">

                <button
                    className="card-order-back"
                    onClick={() => setProfilePage("cart")}
                >
                    ←
                </button>

                <h2>Card Order</h2>

            </div>

            {/* Delivery Address */}

            <div className="order-section">

                <h3>📍 Delivery Address</h3>

                <div className="address-card">

                    <h4>Asmin Kuldeep Jena</h4>

                    <p>Near FM College</p>

                    <p>Balasore, Odisha - 756001</p>

                    <p>+91 9876543210</p>

                    <button className="change-address-btn">

                        Change Address

                    </button>

                </div>

            </div>

            {/* Card Details */}

            <div className="order-section">

                <h3>💳 Card Details</h3>

                <div className="card-details-box">

                    <span className="premium-tag">

                        ★★★★★ Premium Quality

                    </span>

                    <h3>{cardName}</h3>

                    <div className="row">

                        <span>Unit Price</span>

                        <span>₹{unitPrice} / Card</span>

                    </div>

                    <div className="row">

                        <span>Minimum Order</span>

                        <span>{minimumOrder} Cards</span>

                    </div>

                    <div className="row">

                        <span>Ordered Quantity</span>

                        <span>{quantity} Cards</span>

                    </div>

                    <div className="row">

                        <span>Total Card Price</span>

                        <strong>₹{cardPrice}</strong>

                    </div>

                </div>

            </div>

            {/* Price Details */}

            <div className="order-section">

                <h3>💰 Price Details</h3>

                <div className="price-box">

                    <div className="row">

                        <span>Card Price</span>

                        <span>₹{cardPrice}</span>

                    </div>

                    <div className="row">

                        <span>GST (18%)</span>

                        <span>₹{gst}</span>

                    </div>

                    <div className="row">

                        <span>Platform Fee</span>

                        <span>₹{platformFee}</span>

                    </div>

                    <div className="row">

                        <span>Delivery</span>

                        <span>FREE</span>

                    </div>

                    <hr />

                    <div className="row grand-total">

                        <strong>Grand Total</strong>

                        <strong>₹{grandTotal}</strong>

                    </div>

                </div>

            </div>

            {/* Payment */}

            <div className="order-section">

                <h3>💳 Payment Method</h3>

                <div className="payment-card selected">

                    <div>

                        <h4>🟢 UPI (Recommended)</h4>

                        <p>Pay 80% Now</p>

                    </div>

                    <strong>₹{upiAmount}</strong>

                </div>

                <div className="payment-card">

                    <div>

                        <h4>🚚 Cash on Delivery</h4>

                        <p>Pay Remaining 20%</p>

                    </div>

                    <strong>₹{codAmount}</strong>

                </div>

            </div>

            {/* Invoice */}

            <div className="invoice-box">

                <h3>🧾 Invoice</h3>

                <p>

                    Please review your GST invoice before proceeding to payment.

                </p>

                <button
                    className="invoice-btn"
                    onClick={() => setProfilePage("invoice-card")}
                >

                    View Invoice

                </button>

            </div>

            {/* Continue */}

            <button className="continue-payment-btn" onClick={() => setProfilePage("payment")}>

                Continue Payment

            </button>

        </div>

    );

}

export default CardOrder;