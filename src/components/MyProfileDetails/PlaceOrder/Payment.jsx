import { useState } from "react";
import { API } from "../../../services/api";
import "./Payment.css";

function Payment({
    setProfilePage,
    orderData
}) {

    const products = orderData?.items || [];

    const subtotal = products.reduce((sum, item) => {

        const price = Number(
            item.product_price ??
            item.shop_price ??
            item.gift_price ??
            0
        );

        return sum + (price * item.quantity);

    }, 0);

    const gst = +(subtotal * 0.18).toFixed(2);

    const platformFee = 2;

    const amount =
        orderData?.orderType === "cards"
            ? Number(orderData.total_amount)
            : subtotal + gst + platformFee;

    const upiId = "aerodeck@upi";

    const [paymentType, setPaymentType] = useState("upi");

    const [utr, setUtr] = useState("");

    const copyUpiId = () => {

        navigator.clipboard.writeText(upiId);

        alert("UPI ID copied successfully.");

    };
    const handlePayment = async () => {

        try {

            // Get Razorpay Key
            const configResponse = await fetch(
                `${API}/api/user/payment/config`
            );

            const config = await configResponse.json();

            if (!config.success) {

                alert("Unable to load payment configuration.");
                return;

            }

            // Create Razorpay Order
            const orderResponse = await fetch(
                `${API}/api/user/payment/create-order`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        amount
                    })
                }
            );

            const data = await orderResponse.json();

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



                handler: async function (response) {
                    
                    try {
                        const verifyResponse = await fetch(
                            `${API}/api/user/payment/verify`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({

                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,

                                    session_token: localStorage.getItem("session_token"),

                                    address_id: orderData.address_id,

                                    payment_method: orderData.payment_method,

                                    order_type:
                                        orderData.orderType === "products"
                                            ? "PRODUCT"
                                            : "CARD",

                                    items: orderData.items,

                                    total_items: orderData.total_items,

                                    subtotal: orderData.subtotal,

                                    gst: orderData.gst,

                                    platform_fee: orderData.platform_fee,

                                    delivery_fee: orderData.delivery_fee,

                                    total_amount: orderData.subtotal + orderData.gst + orderData.platform_fee + orderData.delivery_fee,

                                    advance_amount:
                                        orderData.orderType === "cards"
                                            ? orderData.total_amount
                                            : amount,

                                    remaining_amount:
                                        orderData.orderType === "cards"
                                            ? orderData.remaining_amount
                                            : 0,

                                })
                            }
                        );

                        const result = await verifyResponse.json();

                        if (result.success) {

                            alert("Payment Verified Successfully");

                            setProfilePage("ordersuccess");

                        } else {

                            alert(result.message);

                        }

                    } catch (error) {

                        console.error(error);

                        alert("Payment Verification Failed");

                    }

                },
                theme: {

                    color: "#2563eb"

                }

            };

            const razorpay = new window.Razorpay(options);

            razorpay.open();

        } catch (error) {

            console.error(error);

            alert("Something went wrong.");

        }

    };

    const handleVerify = () => {

        if (!utr.trim()) {

            alert("Please enter Transaction ID / UTR Number.");

            return;

        }

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

                <h2>UPI Payment</h2>

            </div>

            {/* Amount */}

            <div className="payment-amount-card">

                <p>Total Amount</p>

                <h1>₹{amount}</h1>

            </div>

            {/* Payment Method */}

            <div className="payment-section">

                <h3>Choose Payment Option</h3>

                <label className="payment-option">

                    <input
                        type="radio"
                        checked={paymentType === "upi"}
                        onChange={() => setPaymentType("upi")}
                    />

                    <span>Pay via UPI ID</span>

                </label>

                {

                    paymentType === "upi" && (

                        <div className="upi-box">

                            <h4>UPI ID</h4>

                            <div className="upi-id">

                                <span>{upiId}</span>

                                <button onClick={copyUpiId}>
                                    Copy
                                </button>

                            </div>

                        </div>

                    )

                }

                <label className="payment-option">

                    <input
                        type="radio"
                        checked={paymentType === "qr"}
                        onChange={() => setPaymentType("qr")}
                    />

                    <span>Scan QR Code</span>

                </label>

                {

                    paymentType === "qr" && (

                        <div className="qr-box">

                            <img
                                src="/qr-demo.png"
                                alt="QR Code"
                            />

                            <p>
                                Scan this QR using any UPI app.
                            </p>

                        </div>

                    )

                }

            </div>

            {/* Transaction */}

            <div className="payment-section">

                <h3>Transaction ID / UTR</h3>

                <input
                    type="text"
                    placeholder="Enter Transaction ID"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                />

                <small>
                    Enter the UTR number after completing the payment.
                </small>

            </div>

            <button
                className="pay-now-btn"
                onClick={handlePayment}
            >

                Pay Now

            </button>

        </div>

    );

}

export default Payment;