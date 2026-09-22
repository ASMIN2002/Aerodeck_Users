import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductOrder.css";
import { RiDiscountPercentLine } from "react-icons/ri";
import { API } from "../../../services/api";


function ProductOrder({
    setProfilePage,
    orderData,
    setOrderData,
}) {
    const navigate = useNavigate();
    const products = orderData?.items || [];

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

    const updateCartQuantity = async (productId, quantity) => {
        try {
            const sessionToken = localStorage.getItem("session_token");

            const response = await fetch(`${API}/api/user/cart`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    session_token: sessionToken,
                    product_id: productId,
                    quantity: quantity
                })
            });

            const data = await response.json();

            if (!data.success) {
                return false;
            }

            setOrderData(prev => ({
                ...prev,
                items: prev.items.map(item =>
                    String(item.product_id) === String(productId)
                        ? {
                            ...item,
                            quantity: quantity
                        }
                        : item
                )
            }));

            return true;

        } catch (error) {
            console.error("Cart quantity update error:", error);
            return false;
        }
    };

    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [openCartProduct, setOpenCartProduct] = useState(null);

    const subtotal = products.reduce((sum, item) => {

        return sum + (getPrice(item) * item.quantity);

    }, 0);

    const platformFee = 2;
    const MINIMUM_ORDER_AMOUNT = 200;

    const grandTotal =
        subtotal +
        platformFee;
    const upiTotal = subtotal + platformFee;

    const [primaryAddress, setPrimaryAddress] = useState(null);

    const [placingOrder, setPlacingOrder] = useState(false);
    const [showOrderConfirm, setShowOrderConfirm] = useState(false);
    const [addressError, setAddressError] = useState("");

    useEffect(() => {
        const handleOutsideClick = () => {
            setOpenCartProduct(null);
        };

        if (openCartProduct !== null) {
            document.addEventListener("click", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [openCartProduct]);

    useEffect(() => {

        const fetchPrimaryAddress = async () => {

            try {

                const sessionToken = localStorage.getItem("session_token");

                const response = await fetch(
                    `${API}/api/user/address?session_token=${sessionToken}`
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
    const totalSavings = products.reduce((total, product) => {

        const demoPrice = Number(
            product.product_demo_price ??
            product.shop_demo_price ??
            product.gift_demo_price ??
            product.premium_demo_price ??
            0
        );

        const price = getPrice(product);

        const saving = (demoPrice - price) * product.quantity;

        return total + saving;

    }, 0);

    return (

        <div className="product-order-page">

            {/* Header */}

            <div className="product-order-header">

                <button
                    className="product-order-back"
                    onClick={() => {
                        navigate(-1);
                    }}
                >
                    ←
                </button>

                <h2>Product Order</h2>

            </div>

            {/* Address */}

            <div className="order-section">

                <h3>Deliver To:</h3>

                <div className="address-card-card">

                    {primaryAddress ? (

                        <>
                            <div className="addplacepro">
                                <div>
                                    <div className="nameadtype">
                                        <h4>{primaryAddress.full_name}</h4>
                                        <span>{primaryAddress.address_type}</span>
                                    </div>
                                    <p>
                                        {primaryAddress.house_flat},
                                        {" "}
                                        {primaryAddress.area_street},
                                        {" "}
                                        {primaryAddress.city},
                                        {" "}
                                        {primaryAddress.pincode}
                                    </p>
                                    <p>{primaryAddress.mobile_number}</p>
                                </div>
                                <button
                                    className="change-address-btn"
                                    onClick={() => setProfilePage("address")}
                                >
                                    Change
                                </button>
                            </div>
                        </>

                    ) : (

                        <button
                            className="add-address-btn"
                            onClick={() => setProfilePage("address")}
                        >
                            + Add Address
                        </button>

                    )}


                </div>

            </div>

            {/* Ordered Products */}

            <div className="order-section">
                <div className="product-list">

                    {

                        products.length > 0 ? (

                            products.map((product) => (

                                <div
                                    className="product-row"
                                    key={product.product_id}
                                >

                                    <img
                                        src={
                                            product.product_image1 ||
                                            product.gift_image1 ||
                                            product.shop_image1 ||
                                            product.premium_image1
                                        }
                                        alt={getName(product)}
                                        className="order-product-image"
                                    />
                                    <div className="product-info">
                                        <h4>
                                            {getName(product)}
                                        </h4>
                                        <div
                                            className="order-cart-box"
                                            onClick={(e) => {
                                                e.stopPropagation();

                                                setOpenCartProduct(
                                                    openCartProduct === product.product_id
                                                        ? null
                                                        : product.product_id
                                                );
                                            }}
                                        >
                                            <span className="order-cart-icon">
                                                🛒
                                            </span>

                                            <span className="order-cart-quantity">
                                                {product.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                className="order-cart-arrow"
                                            >
                                                {openCartProduct === product.product_id ? "▼" : "▲"}
                                            </button>
                                        </div>

                                        {openCartProduct === product.product_id && (
                                            <div
                                                className="order-cart-dropdown"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {[1, 2, 3, 4, 5].map((quantity) => (
                                                    <button
                                                        key={quantity}
                                                        type="button"
                                                        className={
                                                            Number(product.quantity) === quantity
                                                                ? "selected"
                                                                : ""
                                                        }
                                                        onClick={async () => {
                                                            await updateCartQuantity(
                                                                product.product_id,
                                                                quantity
                                                            );

                                                            setOpenCartProduct(null);
                                                        }}
                                                    >
                                                        {quantity}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="product-price">

                                        ₹{(
                                            getPrice(product) *
                                            product.quantity
                                        ).toFixed(2)}

                                        <small>
                                            ₹{(
                                                (Number(
                                                    product.product_demo_price ??
                                                    product.shop_demo_price ??
                                                    product.gift_demo_price ??
                                                    product.premium_demo_price ??
                                                    0
                                                ) - getPrice(product)) *
                                                product.quantity
                                            ).toFixed(2)} Save
                                        </small>

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
                        <span>Total MRP</span>
                        <span>₹{subtotal.toFixed(2)}</span>
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
                    <div className="total-savings">
                        <div>
                            <RiDiscountPercentLine />
                        </div>
                        <div className="saveprice">
                            You will save <span>₹{totalSavings.toFixed(2)}</span> on this order!
                        </div>
                    </div>

                </div>

            </div>
            {/* Payment Method */}

            <div className="order-section">

                {/* <h3>💳 Choose Payment Method</h3>

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

                </div> */}

                <div
                    className={`payment-card ${paymentMethod === "COD" ? "selected" : ""}`}
                    onClick={() => setPaymentMethod("COD")}
                >

                    <div>

                        <h4>🚚 Cash On Delivery</h4>

                        <p>₹0 COD Charge</p>

                    </div>

                    <strong>

                        ₹{(upiTotal + 0).toFixed(2)}

                    </strong>

                </div>

            </div>

            {addressError && (
                <p className="address-error">
                    {addressError}
                </p>
            )}

            <button
                className="continue-payment-btn"
                onClick={() => {

                    if (subtotal < MINIMUM_ORDER_AMOUNT) {

                        const remainingAmount =
                            MINIMUM_ORDER_AMOUNT - subtotal;

                        setAddressError(
                            `Minimum order amount is ₹200. Add ₹${remainingAmount.toFixed(2)} more to continue.`
                        );

                        setTimeout(() => {
                            setAddressError("");
                        }, 3000);

                        return;
                    }

                    if (!primaryAddress) {

                        setAddressError("Please select the address.");

                        setTimeout(() => {
                            setAddressError("");
                        }, 2000);

                        return;
                    }

                    setAddressError("");

                    // IMPORTANT:
                    // Direct order nahi hoga.
                    // Pehle confirmation box open hoga.
                    setShowOrderConfirm(true);
                }}
            >
                {placingOrder
                    ? "Placing Order..."
                    : paymentMethod === "UPI"
                        ? "Continue Payment"
                        : "Place Order"}
            </button>

            {showOrderConfirm && (
                <div
                    className="order-confirm-overlay"
                    onClick={() => setShowOrderConfirm(false)}
                >
                    <div
                        className="order-confirm-box"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="order-confirm-icon">
                            🛒
                        </div>

                        <h3>
                            Sure to order like this?
                        </h3>

                        <p>
                            Please confirm your order before placing it.
                        </p>

                        <div className="order-confirm-actions">

                            <button
                                type="button"
                                className="order-confirm-cancel"
                                onClick={() => setShowOrderConfirm(false)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="order-confirm-submit"
                                onClick={async () => {

                                    setShowOrderConfirm(false);
                                    setPlacingOrder(true);

                                    try {

                                        const sessionToken =
                                            localStorage.getItem("session_token");

                                        const response = await fetch(
                                            `${API}/api/user/orders/place-order`,
                                            {
                                                method: "POST",

                                                headers: {
                                                    "Content-Type": "application/json"
                                                },

                                                body: JSON.stringify({
                                                    session_token: sessionToken,
                                                    address_id: primaryAddress.address_id,
                                                    payment_method: paymentMethod,

                                                    order_type:
                                                        orderData.orderType === "products"
                                                            ? "PRODUCT"
                                                            : "CARD",

                                                    items: products,
                                                    total_items: products.length,
                                                    subtotal,
                                                    platform_fee: platformFee,
                                                    delivery_fee: 0,
                                                    total_amount: grandTotal
                                                })
                                            }
                                        );

                                        const data = await response.json();

                                        if (data.success) {
                                            setProfilePage("ordersuccess");
                                        }

                                    } catch (error) {

                                        console.error(
                                            "Place order error:",
                                            error
                                        );

                                    } finally {

                                        setPlacingOrder(false);

                                    }

                                }}
                            >
                                Confirm Order
                            </button>

                        </div>
                    </div>
                </div>
            )}

        </div>

    );

}

export default ProductOrder;