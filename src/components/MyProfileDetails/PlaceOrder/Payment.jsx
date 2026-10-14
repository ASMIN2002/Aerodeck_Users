import { API } from "../../../services/api";
import "./Payment.css";

const GST_RATE = 0.18;
const PLATFORM_FEE = 2;
const RAZORPAY_THEME = "#2563eb";

const PRICE_KEYS = ["product_price", "shop_price", "gift_price", "premium_price"];

function pickPrice(item) {
    for (const key of PRICE_KEYS) {
        const val = item[key];
        if (val !== undefined && val !== null) return Number(val);
    }
    return 0;
}

function calculateAmounts(products, orderData) {
    const subtotal = products.reduce(
        (sum, item) => sum + pickPrice(item) * item.quantity,
        0
    );

    const gst = +(subtotal * GST_RATE).toFixed(2);
    const amount =
        orderData?.orderType === "cards"
            ? Number(orderData.total_amount || 0)
            : subtotal + gst + PLATFORM_FEE;

    return { subtotal, gst, platformFee: PLATFORM_FEE, amount };
}

function Payment({ setProfilePage, orderData }) {
    const products = orderData?.items || [];

    const { subtotal, gst, platformFee, amount } = calculateAmounts(
        products,
        orderData
    );

    const buildVerifyPayload = (response) => ({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,

        session_token: localStorage.getItem("session_token"),
        address_id: orderData.address_id,
        payment_method: orderData.payment_method,

        order_type: orderData.orderType === "products" ? "PRODUCT" : "CARD",
        items: orderData.items,

        total_items: orderData.total_items,
        subtotal,
        gst,
        platform_fee: platformFee,
        delivery_fee: orderData.delivery_fee || 0,

        total_amount: subtotal + gst + platformFee + (orderData.delivery_fee || 0),

        advance_amount:
            orderData.orderType === "cards" ? orderData.total_amount : amount,

        remaining_amount:
            orderData.orderType === "cards" ? orderData.remaining_amount : 0,
    });

    const handleVerifyPayment = async (response) => {
        try {
            const verifyRes = await fetch(`${API}/api/user/payment/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(buildVerifyPayload(response)),
            });

            const result = await verifyRes.json();

            if (result.success) {
                alert("Payment Verified Successfully");
                setProfilePage("ordersuccess");
            } else {
                alert(result.message);
            }
        } catch (err) {
            console.error("Verify payment error:", err.message);
            alert("Payment Verification Failed");
        }
    };

    const handlePayment = async () => {
        try {
            const configRes = await fetch(`${API}/api/user/payment/config`);
            const config = await configRes.json();

            if (!config.success) {
                alert("Unable to load payment configuration.");
                return;
            }

            const orderRes = await fetch(`${API}/api/user/payment/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
            });

            const data = await orderRes.json();

            if (!data.success) {
                alert(data.message);
                return;
            }

            const options = {
                key: config.key,
                amount: data.order.amount,
                currency: data.order.currency,
                name: "AERODECK",
                description: "Premium Cards & Gifts",
                order_id: data.order.id,
                handler: handleVerifyPayment,
                theme: { color: RAZORPAY_THEME },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            console.error("Payment error:", err.message);
            alert("Something went wrong.");
        }
    };

    return (
        <div className="payment-page">
            <div className="payment-header">
                <button
                    className="payment-back"
                    onClick={() => setProfilePage("cart")}
                >
                    ←
                </button>
                <h2>UPI Payment</h2>
            </div>

            <div className="payment-amount-card">
                <p>Total Amount</p>
                <h1>₹{amount}</h1>
            </div>

            <button className="pay-now-btn" onClick={handlePayment}>
                Pay Now
            </button>
        </div>
    );
}

export default Payment;