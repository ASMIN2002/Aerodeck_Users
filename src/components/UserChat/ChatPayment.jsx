import "./ChatPayment.css";
import React, { useState, useEffect } from "react";
import { API } from "../../services/api";

function ChatPayment({
    chatId,
    sessionToken,
    totalPrice,
    productId,
    quantity,
    onPay80,
    onPayFull,
    onSeeDemo,
    onCancel,
    onCancelOrder,
    onConfirmCancel
}) {
    const [paymentSelected, setPaymentSelected] = useState(null);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [paymentDone, setPaymentDone] = useState(false);
    const [paymentScreenshot, setPaymentScreenshot] = useState(null);
    const [paymentName, setPaymentName] = useState("");
    const [paymentNumber, setPaymentNumber] = useState("");
    const [paymentProcessing, setPaymentProcessing] = useState(false);


    useEffect(() => {

        const loadPaymentStatus = async () => {

            if (!chatId || !sessionToken) {
                return;
            }

            try {

                const response = await fetch(
                    `${API}/api/user/chat/${chatId}/messages?session_token=${sessionToken}`
                );

                const data = await response.json();

                if (!data.success) {
                    return;
                }

                const paymentMessage = [...data.data]
                    .reverse()
                    .find(
                        (msg) =>
                            msg.sender === "system" &&
                            (
                                msg.message === "80% Payment" ||
                                msg.message === "100% Payment" ||
                                msg.message === "See Demo" ||
                                msg.message === "PROCESSING"
                            )
                    );

                if (!paymentMessage) {
                    return;
                }

                if (paymentMessage.message === "80% Payment") {
                    setPaymentSelected("80");
                }

                if (paymentMessage.message === "100% Payment") {
                    setPaymentSelected("100");
                }

                if (paymentMessage.message === "See Demo") {
                    setPaymentSelected("demo");
                }

                if (paymentMessage.message === "PROCESSING") {
                    setPaymentProcessing(true);
                    setPaymentDone(true);
                }

            } catch (err) {

                console.error(
                    "PAYMENT STATUS LOAD ERROR:",
                    err
                );

            }

        };

        loadPaymentStatus();

    }, [chatId, sessionToken]);

    const showPaymentScreen =
        !paymentDone &&
        (paymentSelected === "80" ||
            paymentSelected === "100");

    return (

        <div className="user-chat-payment-box">

            {paymentDone ? (

                paymentProcessing ? (

                    <div className="user-chat-payment-processing">
                        PROCESSING
                    </div>

                ) : (

                    <>

                        <div className="user-chat-system-message">

                            <label>
                                Upload the screenshot
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    setPaymentScreenshot(
                                        e.target.files?.[0] || null
                                    );
                                }}
                            />

                            <label>
                                Write Name
                            </label>

                            <input
                                type="text"
                                placeholder="Name used for payment"
                                value={paymentName}
                                onChange={(e) => {
                                    setPaymentName(e.target.value);
                                }}
                            />

                            <label>
                                Write Number
                            </label>

                            <input
                                type="tel"
                                placeholder="Number used for payment"
                                value={paymentNumber}
                                onChange={(e) => {
                                    setPaymentNumber(e.target.value);
                                }}
                            />

                            <button
                                className="user-chat-confirm-btn"
                                disabled={
                                    !paymentScreenshot ||
                                    !paymentName.trim() ||
                                    !paymentNumber.trim()
                                }
                                onClick={async () => {
                                    if (!paymentScreenshot) {
                                        alert("Please upload payment screenshot.");
                                        return;
                                    }

                                    if (!paymentName.trim()) {
                                        alert("Please enter the name used for payment.");
                                        return;
                                    }

                                    if (!paymentNumber.trim()) {
                                        alert("Please enter the number used for payment.");
                                        return;
                                    }
                                    try {

                                        const formData = new FormData();

                                        formData.append(
                                            "payment_screenshot",
                                            paymentScreenshot
                                        );

                                        formData.append(
                                            "session_token",
                                            sessionToken
                                        );

                                        formData.append(
                                            "product_id",
                                            productId
                                        );

                                        formData.append(
                                            "name",
                                            paymentName.trim()
                                        );

                                        formData.append(
                                            "number",
                                            paymentNumber.trim()
                                        );

                                        const response = await fetch(
                                            `${API}/api/upload/payment-proof`,
                                            {
                                                method: "POST",
                                                body: formData
                                            }
                                        );

                                        const data = await response.json();

                                        if (!data.success) {
                                            alert(
                                                data.message ||
                                                "Unable to save payment details."
                                            );
                                            return;
                                        }

                                        // Remove payment details form
                                        setPaymentScreenshot(null);
                                        setPaymentName("");
                                        setPaymentNumber("");
                                        await fetch(
                                            `${API}/api/user/chat/${chatId}/message`,
                                            {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify({
                                                    session_token: sessionToken,
                                                    sender: "system",
                                                    message: "PROCESSING",
                                                    image_url: null
                                                })
                                            }
                                        );
                                        const orderResponse = await fetch(
                                            `${API}/api/upload/processing-order`,
                                            {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify({
                                                    user_id: null,
                                                    product_id: productId,
                                                    quantity: quantity,
                                                    subtotal: Number(totalPrice),
                                                    discount: 0,
                                                    gst: Number(totalPrice) * 0.18,
                                                    platform_fee: 0,
                                                    delivery_fee: 0,
                                                    total_amount: Number(totalPrice) * 1.18,
                                                    advance_amount:
                                                        paymentSelected === "80"
                                                            ? Number(totalPrice) * 0.80
                                                            : Number(totalPrice),
                                                    remaining_amount:
                                                        paymentSelected === "80"
                                                            ? Number(totalPrice) * 0.20
                                                            : 0,
                                                    payment_method: "UPI",
                                                    address_id: null,
                                                    items: [
                                                        {
                                                            product_id: productId,
                                                            product_type: "CARD",
                                                            product_name: "Card",
                                                            product_image: null,
                                                            unit_price:
                                                                Number(totalPrice) /
                                                                Number(quantity || 1),
                                                            quantity: Number(quantity || 1),
                                                            total_price: Number(totalPrice)
                                                        }
                                                    ]
                                                })
                                            }
                                        );

                                        const orderData = await orderResponse.json();

                                        if (!orderData.success) {
                                            alert(
                                                orderData.message ||
                                                "Unable to create processing order."
                                            );
                                            return;
                                        }
                                        setPaymentProcessing(true);

                                    } catch (err) {

                                        console.error(
                                            "SUBMIT PAYMENT PROOF ERROR:",
                                            err
                                        );

                                        alert(
                                            "Unable to submit payment details."
                                        );

                                    }

                                }}
                            >
                                Save
                            </button>

                        </div>
                    </>
                )

            ) : showPaymentScreen ? (

                <>
                    <div className="user-chat-system-message">
                        {paymentSelected === "80"
                            ? "80% Payment"
                            : "100% Payment"}
                    </div>

                    <div className="user-chat-payment-amount">

                        <div>
                            <strong>Total Price:</strong>{" "}
                            ₹{Number(totalPrice).toFixed(2)}
                        </div>

                        <div>
                            <strong>Quantity:</strong>{" "}
                            {quantity}
                        </div>

                        <div>
                            <strong>Payment Amount:</strong>{" "}
                            ₹
                            {(
                                paymentSelected === "80"
                                    ? Number(totalPrice) * 0.80
                                    : Number(totalPrice)
                            ).toFixed(2)}
                        </div>

                        <div className="user-chat-payment-warning">
                            Please pay exactly ₹
                            {(
                                paymentSelected === "80"
                                    ? Number(totalPrice) * 0.80
                                    : Number(totalPrice)
                            ).toFixed(2)}
                            .
                            <br />
                            Do not pay less or more than this amount.
                        </div>

                    </div>

                    <div className="user-chat-system-message">
                        Must take a screenshot after payment.
                    </div>

                    <img
                        src="/payment-scanner.png"
                        alt="Payment Scanner"
                        className="user-chat-payment-scanner"
                    />

                    <div className="user-chat-action-buttons">

                        <button
                            className="user-chat-cancel-btn"
                            onClick={() => {
                                setShowCancelConfirm(true);
                            }}
                        >
                            Cancel Your Order
                        </button>

                        <button
                            className="user-chat-confirm-btn"
                            onClick={async () => {

                                const message =
                                    paymentSelected === "80"
                                        ? "80% Payment Done"
                                        : "100% Payment Done";

                                try {

                                    const response = await fetch(
                                        `${API}/api/user/chat/${chatId}/message`,
                                        {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify({
                                                session_token: sessionToken,
                                                sender: "system",
                                                message,
                                                image_url: null
                                            })
                                        }
                                    );

                                    const data = await response.json();

                                    if (!data.success) {
                                        alert(
                                            data.message ||
                                            "Unable to save payment status."
                                        );
                                        return;
                                    }

                                    setPaymentDone(true);

                                } catch (err) {

                                    console.error(
                                        "PAYMENT DONE ERROR:",
                                        err
                                    );

                                    alert(
                                        "Unable to save payment status."
                                    );

                                }

                            }}
                        >
                            Payment Done
                        </button>

                    </div>

                    {showCancelConfirm && (
                        <div className="user-chat-cancel-confirm">

                            <div className="user-chat-system-message">
                                Are you sure you want to cancel this order?
                            </div>

                            <div className="user-chat-action-buttons">

                                <button
                                    className="user-chat-cancel-btn"
                                    onClick={() => {
                                        setShowCancelConfirm(false);
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="user-chat-confirm-btn"
                                    onClick={onConfirmCancel}
                                >
                                    Confirm Cancel
                                </button>

                            </div>

                        </div>
                    )}

                </>

            ) : (

                <>
                    <div className="user-chat-system-message">
                        Please choose your payment option.
                    </div>

                    <button
                        className="user-chat-payment-btn"
                        onClick={async () => {

                            try {

                                const response = await fetch(
                                    `${API}/api/user/chat/${chatId}/message`,
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            session_token: sessionToken,
                                            sender: "system",
                                            message: "80% Payment",
                                            image_url: null
                                        })
                                    }
                                );

                                const data = await response.json();

                                if (!data.success) {
                                    alert(data.message || "Unable to save payment option.");
                                    return;
                                }

                                setPaymentSelected("80");
                                onPay80();

                            } catch (err) {

                                console.error("80% PAYMENT SAVE ERROR:", err);
                                alert("Unable to save payment option.");

                            }

                        }}
                    >
                        Pay 80% Now — Rest 20% on Delivery
                    </button>

                    <button
                        className="user-chat-payment-btn"
                        onClick={async () => {

                            try {

                                const response = await fetch(
                                    `${API}/api/user/chat/${chatId}/message`,
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            session_token: sessionToken,
                                            sender: "system",
                                            message: "100% Payment",
                                            image_url: null
                                        })
                                    }
                                );

                                const data = await response.json();

                                if (!data.success) {
                                    alert(
                                        data.message ||
                                        "Unable to save payment option."
                                    );
                                    return;
                                }

                                setPaymentSelected("100");
                                onPayFull();

                            } catch (err) {

                                console.error(
                                    "100% PAYMENT SAVE ERROR:",
                                    err
                                );

                                alert("Unable to save payment option.");

                            }

                        }}
                    >
                        Pay Full Amount
                    </button>

                    <button
                        className="user-chat-payment-btn"
                        onClick={async () => {

                            try {

                                const response = await fetch(
                                    `${API}/api/user/chat/${chatId}/message`,
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            session_token: sessionToken,
                                            sender: "system",
                                            message: "See Demo",
                                            image_url: null
                                        })
                                    }
                                );

                                const data = await response.json();

                                if (!data.success) {
                                    alert(data.message || "Unable to save demo choice.");
                                    return;
                                }

                                setPaymentSelected("demo");

                                onSeeDemo();

                            } catch (err) {

                                console.error("DEMO SAVE ERROR:", err);
                                alert("Unable to save demo choice.");

                            }

                        }}
                    >
                        See Demo
                    </button>

                    <button
                        className="user-chat-cancel-btn"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </>

            )}

        </div>

    );

}

export default ChatPayment;