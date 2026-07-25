import "./OrderSuccess.css";

function OrderSuccess({ setProfilePage }) {

    const orderId = "AD" + Math.floor(100000 + Math.random() * 900000);

    return (

        <div className="order-success-page">

            {/* Success Icon */}

            <div className="success-circle">

                ✓

            </div>

            {/* Heading */}

            <h1>

                Order Placed Successfully!

            </h1>

            <p>

                Thank you for shopping with AERODECK.

            </p>

            {/* Order Details */}

            <div className="order-success-card">

                <div className="success-row">

                    <span>Order ID</span>

                    <strong>{orderId}</strong>

                </div>

                <div className="success-row">

                    <span>Payment Status</span>

                    <strong className="paid">

                        Paid

                    </strong>

                </div>

                <div className="success-row">

                    <span>Estimated Delivery</span>

                    <strong>

                        3 - 5 Business Days

                    </strong>

                </div>

            </div>

            {/* Buttons */}

            <button
                className="success-btn"
                onClick={() => setProfilePage("orders")}
            >

                View My Orders

            </button>

            <button
                className="home-btn"
                onClick={() => setProfilePage("home")}
            >

                Continue Shopping

            </button>

        </div>

    );

}

export default OrderSuccess;