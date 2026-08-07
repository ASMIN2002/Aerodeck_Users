import "./OrderSuccess.css";

function OrderSuccess({ setProfilePage }) {

    const orderId = "AD" + Math.floor(100000 + Math.random() * 900000);

    return (

        <div className="order-success-page">

            <div className="success-bg">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <div className="success-circle">

                ✓

            </div>

            <h1>

                Order Placed Successfully!

            </h1>

            <p>

                Thank you for shopping with AERODECK.
                <br />
                Your order has been received successfully.

            </p>

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

            <div className="success-action">

                <button
                    className="success-btn"
                    onClick={() => setProfilePage("orders")}
                >

                    View My Orders

                </button>

                <button
                    className="back-profile-btn"
                    onClick={() => setProfilePage("profile")}
                >

                    ← Back to Profile

                </button>

            </div>

        </div>

    );

}

export default OrderSuccess;