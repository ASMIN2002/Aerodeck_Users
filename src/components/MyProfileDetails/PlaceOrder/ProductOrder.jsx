import { useEffect, useState } from "react";
import "./ProductOrder.css";
import { API } from "../../../services/api";
function ProductOrder({
    setProfilePage,
    orderData,
    setOrderData,
    selectedAddress
}) {

    const products = orderData.items || [];

    const getPrice = (item) => {

        return Number(
            item.product_price ??
            item.shop_price ??
            item.gift_price ??
            0
        );

    };
    const getName = (item) => {

        return (
            item.product_name ||
            item.shop_name ||
            item.gift_name ||
            "Unknown Product"
        );

    };

    const [paymentMethod, setPaymentMethod] = useState("UPI");

    const subtotal = products.reduce((sum, item) => {

        return sum + (getPrice(item) * item.quantity);

    }, 0);

    const gst = +(subtotal * 0.18).toFixed(2);

    const platformFee = 2;

    const codCharge = paymentMethod === "COD" ? 5 : 0;

    const grandTotal =
        subtotal +
        gst +
        platformFee +
        codCharge;
    const upiTotal = subtotal + gst + platformFee;

    const [primaryAddress, setPrimaryAddress] = useState(null);

    const [placingOrder, setPlacingOrder] = useState(false);

    useEffect(() => {

        const fetchPrimaryAddress = async () => {

            try {

                const user_id = localStorage.getItem("user_id");

                const response = await fetch(
                    `${API}/api/user/address/${user_id}`
                );

                const data = await response.json();

                if (data.success) {

                    const primary = data.data.find(
                        item => item.is_primary === 1
                    );

                    setPrimaryAddress(primary || null);

                }

            } catch (err) {

                console.error(err);

            }

        };

        fetchPrimaryAddress();

    }, []);

    return (

        <div className="product-order-page">

            {/* Header */}

            <div className="product-order-header">

                <button
                    className="product-order-back"
                    onClick={() => setProfilePage("cart")}
                >
                    ←
                </button>

                <h2>Product Order</h2>

            </div>

            {/* Address */}

            <div className="order-section">

                <h3>📍 Delivery Address</h3>

                <div className="address-card">

                    {primaryAddress ? (

                        <>

                            <h4>{primaryAddress.full_name}</h4>

                            <p>+91 {primaryAddress.mobile_number}</p>

                            <p>
                                {primaryAddress.house_flat},
                                {" "}
                                {primaryAddress.area_street},
                                {" "}
                                {primaryAddress.landmark},
                                {" "}
                                {primaryAddress.city},
                                {" "}
                                {primaryAddress.state}
                                {" - "}
                                {primaryAddress.pincode}
                            </p>

                        </>

                    ) : (

                        <p>No Primary Address Found</p>

                    )}

                    <button
                        className="change-address-btn"
                        onClick={() => setProfilePage("address")}
                    >
                        Change Address
                    </button>

                </div>

            </div>

            {/* Ordered Products */}

            <div className="order-section">

                <h3>🛍 Ordered Products</h3>

                <div className="product-list">

                    {

                        products.length > 0 ? (

                            products.map((product) => (

                                <div
                                    className="product-row"
                                    key={product.product_id}
                                >

                                    <div className="product-info">

                                        <h4>
                                            {getName(product)}
                                        </h4>

                                        <small>
                                            Qty : {product.quantity}
                                        </small>

                                    </div>

                                    <div className="product-price">

                                        ₹{(
                                            getPrice(product) *
                                            product.quantity
                                        ).toFixed(2)}

                                    </div>

                                </div>

                            ))

                        ) : (

                            <p>No Products Found.</p>

                        )

                    }

                </div>

            </div>
            {/* Price Details */}

            <div className="order-section">

                <h3>💰 Price Details</h3>

                <div className="price-box">

                    <div className="row">
                        <span>Items Total</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="row">
                        <span>GST (18%)</span>
                        <span>₹{gst.toFixed(2)}</span>
                    </div>

                    <div className="row">
                        <span>Platform Fee</span>
                        <span>₹{platformFee.toFixed(2)}</span>
                    </div>

                    <hr />

                    <div className="row grand-total">

                        <strong>Grand Total</strong>

                        <strong>₹{grandTotal.toFixed(2)}</strong>

                    </div>

                </div>

            </div>
            {/* Payment Method */}

            <div className="order-section">

                <h3>💳 Choose Payment Method</h3>

                <div
                    className={`payment-card ${paymentMethod === "UPI" ? "selected" : ""}`}
                    onClick={() => setPaymentMethod("UPI")}
                >

                    <div>

                        <h4>🟢 UPI</h4>

                        <p>Pay Online</p>

                    </div>

                    <strong>

                        ₹{upiTotal.toFixed(2)}

                    </strong>

                </div>

                <div
                    className={`payment-card ${paymentMethod === "COD" ? "selected" : ""}`}
                    onClick={() => setPaymentMethod("COD")}
                >

                    <div>

                        <h4>🚚 Cash On Delivery</h4>

                        <p>₹5 COD Charge</p>

                    </div>

                    <strong>

                        ₹{(upiTotal + 5).toFixed(2)}

                    </strong>

                </div>

            </div>

            {/* Continue */}

            <button
                className="continue-payment-btn"
                onClick={() => {

                    if (paymentMethod === "UPI") {

                        setOrderData({

                            ...orderData,

                            address_id: primaryAddress.address_id,

                            payment_method: paymentMethod,

                            items: products,

                            total_items: products.length,

                            subtotal,

                            gst,

                            platform_fee: platformFee,

                            delivery_fee: 0,

                            total_amount: upiTotal

                        });

                        setProfilePage("payment");

                    } else {

                        setPlacingOrder(true);

                        setTimeout(async () => {

                            const user_id = Number(localStorage.getItem("user_id"));

                            const response = await fetch(`${API}/api/user/orders/place-order`, {

                                method: "POST",

                                headers: {
                                    "Content-Type": "application/json"
                                },

                                body: JSON.stringify({

                                    user_id,

                                    address_id: primaryAddress.address_id,

                                    payment_method: paymentMethod,

                                    order_type:
                                        orderData.orderType === "products"
                                            ? "PRODUCT"
                                            : "CARD",

                                    items: products,

                                    total_items: products.length,

                                    subtotal,

                                    gst,

                                    platform_fee: platformFee,

                                    delivery_fee: 0,

                                    total_amount: grandTotal

                                })

                            });

                            const data = await response.json();

                            console.log(data);

                            setPlacingOrder(false);

                            if (data.success) {

                                setProfilePage("ordersuccess");

                            }

                        }, 2000);

                    }

                }}
            >

                {placingOrder
                    ? "Placing Order..."
                    : paymentMethod === "UPI"
                        ? "Continue Payment"
                        : "Place Order"}
            </button>

        </div>

    );

}

export default ProductOrder;