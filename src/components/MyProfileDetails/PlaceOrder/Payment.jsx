import "./Payment.css";

function Payment({ setProfilePage }) {

    const amount = 2503.46;

    const handlePayment = () => {

        setProfilePage("ordersuccess");

    };

    return (

        <div className="payment-page">

            {/* Header */}

            <div className="payment-header">

                <button
                    className="payment-back"
                    onClick={() => setProfilePage("invoice-product")}
                >
                    ←
                </button>

                <h2>Secure Payment</h2>

            </div>

            {/* Amount */}

            <div className="payment-amount-card">

                <p>Total Amount</p>

                <h1>₹{amount}</h1>

            </div>

            {/* Payment Options */}

            <div className="payment-section">

                <h3>Select Payment Method</h3>

                <label className="payment-option">

                    <input
                        type="radio"
                        name="payment"
                        defaultChecked
                    />

                    <span>🟢 UPI</span>

                </label>

                <label className="payment-option">

                    <input
                        type="radio"
                        name="payment"
                    />

                    <span>💳 Debit / Credit Card</span>

                </label>

                <label className="payment-option">

                    <input
                        type="radio"
                        name="payment"
                    />

                    <span>🏦 Net Banking</span>

                </label>

                <label className="payment-option">

                    <input
                        type="radio"
                        name="payment"
                    />

                    <span>👛 Wallet</span>

                </label>

                <label className="payment-option">

                    <input
                        type="radio"
                        name="payment"
                    />

                    <span>🚚 Cash on Delivery</span>

                </label>

            </div>

            {/* Security */}

            <div className="payment-security">

                🔒 Your payment is protected with secure encryption.

            </div>

            {/* Button */}

            <button
                className="pay-now-btn"
                onClick={handlePayment}
            >

                Pay ₹{amount}

            </button>

        </div>

    );

}

export default Payment;