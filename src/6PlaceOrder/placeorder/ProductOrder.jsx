import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../placeorderstyle/ProductOrder.css";
import { RiDiscountPercentLine } from "react-icons/ri";
import { FaBolt } from "react-icons/fa";
import { API } from "../../services/api";

const MINIMUM_ORDER_AMOUNT = 200;
const HYPO_MIN_POINTS = 100;
const HYPO_POINTS_PER_BLOCK = 100;
const HYPO_RUPEES_PER_BLOCK = 10;
const ERROR_DURATION = 3000;
const QUANTITY_OPTIONS = [1, 2, 3, 4, 5];

const PRICE_KEYS = ["product_price", "shop_price", "gift_price", "premium_price", "medicine_price"];
const DEMO_PRICE_KEYS = [
    "product_demo_price",
    "shop_demo_price",
    "gift_demo_price",
    "premium_demo_price",
    "medicine_demo_price",
];
const NAME_KEYS = ["product_name", "shop_name", "gift_name", "premium_name", "medicine_name"];
const IMAGE_KEYS = [
    "product_image1",
    "gift_image1",
    "shop_image1",
    "premium_image1",
    "medicine_image1",
];

function pickField(item, keys, fallback = 0) {
    if (!item) return fallback;
    for (const key of keys) {
        const val = item[key];
        if (val !== undefined && val !== null) return val;
    }
    return fallback;
}

function getPrice(item) {
    return Number(pickField(item, PRICE_KEYS, 0));
}

function getDemoPrice(item) {
    return Number(pickField(item, DEMO_PRICE_KEYS, 0));
}

function getName(item) {
    return pickField(item, NAME_KEYS, "Unknown Product");
}

function getImage(item) {
    return pickField(item, IMAGE_KEYS, "");
}

function getSessionToken() {
    return localStorage.getItem("session_token");
}

function ProductOrder({ setProfilePage, orderData, setOrderData }) {
    const navigate = useNavigate();
    const products = orderData?.items || [];

    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [openCartProduct, setOpenCartProduct] = useState(null);
    const [primaryAddress, setPrimaryAddress] = useState(null);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [showOrderConfirm, setShowOrderConfirm] = useState(false);
    const [addressError, setAddressError] = useState(null);
    const [hypoPoints, setHypoPoints] = useState(0);
    const [useHypo, setUseHypo] = useState(false);
    const [userDetails, setUserDetails] = useState(null);

    const subtotal = products.reduce(
        (sum, item) => sum + getPrice(item) * item.quantity,
        0
    );

    const grandTotal = subtotal;

    const usableHypo = Math.floor(hypoPoints / HYPO_POINTS_PER_BLOCK) * HYPO_POINTS_PER_BLOCK;
    const hypoRupees = usableHypo / (HYPO_POINTS_PER_BLOCK / HYPO_RUPEES_PER_BLOCK);
    const canUseHypo = hypoPoints >= HYPO_MIN_POINTS;
    const hypoSavings = useHypo && canUseHypo ? hypoRupees : 0;
    const pointsToUse = useHypo && canUseHypo ? usableHypo : 0;
    const finalTotal = grandTotal - hypoSavings;

    const totalSavings = products.reduce((total, product) => {
        const saving = (getDemoPrice(product) - getPrice(product)) * product.quantity;
        return total + saving;
    }, 0);

    useEffect(() => {
        const handleOutsideClick = () => setOpenCartProduct(null);
        if (openCartProduct !== null) {
            document.addEventListener("click", handleOutsideClick);
        }
        return () => document.removeEventListener("click", handleOutsideClick);
    }, [openCartProduct]);

    useEffect(() => {
        const sessionToken = getSessionToken();
        if (!sessionToken) return;

        fetch(`${API}/api/user/address?session_token=${sessionToken}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.success) {
                    const primary = data.data.find((item) => item.is_primary === 1);
                    setPrimaryAddress(primary || null);
                }
            })
            .catch((err) => console.error("Address fetch error:", err.message));
    }, []);

    useEffect(() => {
        const sessionToken = getSessionToken();
        if (!sessionToken) return;

        fetch(`${API}/api/user/rewards?session_token=${sessionToken}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.success && data.data) {
                    setHypoPoints(data.data.hypo_points || 0);
                }
            })
            .catch((err) => console.error("Rewards fetch error:", err.message));
    }, []);

    useEffect(() => {
        const sessionToken = getSessionToken();
        if (!sessionToken) return;

        fetch(`${API}/api/user/details?session_token=${sessionToken}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.success && data.data) setUserDetails(data.data);
            })
            .catch((err) => console.error("User details error:", err.message));
    }, []);

    useEffect(() => {
        if (!addressError) return;
        const timer = setTimeout(() => setAddressError(null), ERROR_DURATION);
        return () => clearTimeout(timer);
    }, [addressError]);

    const updateCartQuantity = async (productId, quantity) => {
        try {
            const res = await fetch(`${API}/api/user/cart`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_token: getSessionToken(),
                    product_id: productId,
                    quantity,
                }),
            });
            const data = await res.json();
            if (!data.success) return false;

            setOrderData((prev) => ({
                ...prev,
                items: prev.items.map((item) =>
                    String(item.product_id) === String(productId)
                        ? { ...item, quantity }
                        : item
                ),
            }));
            return true;
        } catch (err) {
            console.error("Cart update error:", err.message);
            return false;
        }
    };

    const validateOrder = () => {
        if (!userDetails?.full_name || !userDetails.full_name.trim()) {
            return { text: "First give your name to continue.", action: "verify" };
        }
        if (!userDetails?.mobile_number || userDetails.is_mobile_verified !== 1) {
            return { text: "Please verify your mobile number first.", action: "verify" };
        }
        if (subtotal < MINIMUM_ORDER_AMOUNT) {
            const remaining = MINIMUM_ORDER_AMOUNT - subtotal;
            return {
                text: `Minimum order amount is ₹${MINIMUM_ORDER_AMOUNT}. Add ₹${remaining.toFixed(2)} more to continue.`,
                action: null,
            };
        }
        if (!primaryAddress) {
            return { text: "Please select the address.", action: "address" };
        }
        return null;
    };

    const handlePlaceOrderClick = () => {
        const error = validateOrder();
        if (error) {
            setAddressError(error);
            return;
        }
        setAddressError(null);
        setShowOrderConfirm(true);
    };

    const handleConfirmOrder = async () => {
        setShowOrderConfirm(false);
        setPlacingOrder(true);

        try {
            const sessionToken = getSessionToken();

            const res = await fetch(`${API}/api/user/orders/place-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_token: sessionToken,
                    address_id: primaryAddress.address_id,
                    payment_method: paymentMethod,
                    order_type: orderData.orderType === "products" ? "PRODUCT" : "CARD",
                    items: products,
                    total_items: products.length,
                    subtotal,
                    delivery_fee: 0,
                    total_amount: finalTotal,
                    hypo_points_used: pointsToUse,
                }),
            });

            const data = await res.json();
            if (!data.success) {
                setPlacingOrder(false);
                return;
            }

            if (pointsToUse > 0) {
                try {
                    await fetch(`${API}/api/user/rewards/use`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            session_token: sessionToken,
                            points_used: pointsToUse,
                        }),
                    });
                } catch (err) {
                    console.error("HYPO use error:", err.message);
                }
            }

            setProfilePage("ordersuccess");
        } catch (err) {
            console.error("Place order error:", err.message);
        } finally {
            setPlacingOrder(false);
        }
    };

    return (
        <div className="product-order-page">
            <div className="product-order-header">
                <button className="product-order-back" onClick={() => navigate(-1)}>
                    ←
                </button>
                <h2>Product Order</h2>
            </div>

            <div className="order-section">
                <h3>Deliver To:</h3>
                <div className="address-card-card">
                    {primaryAddress ? (
                        <div className="addplacepro">
                            <div>
                                <div className="nameadtype">
                                    <h4>{primaryAddress.full_name}</h4>
                                    <span>{primaryAddress.address_type}</span>
                                </div>
                                <p>
                                    {primaryAddress.house_flat}, {primaryAddress.area_street},{" "}
                                    {primaryAddress.city}, {primaryAddress.pincode}
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

            <div className="order-section">
                <div className="product-list">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div className="product-row" key={product.product_id}>
                                {getImage(product) && (
                                    <img src={getImage(product)} alt={getName(product)} className="order-product-image" />
                                )}
                                <div className="product-info">
                                    <h4>{getName(product)}</h4>
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
                                        <span className="order-cart-icon">🛒</span>
                                        <span className="order-cart-quantity">
                                            {product.quantity}
                                        </span>
                                        <button type="button" className="order-cart-arrow">
                                            {openCartProduct === product.product_id ? "▼" : "▲"}
                                        </button>
                                    </div>

                                    {openCartProduct === product.product_id && (
                                        <div
                                            className="order-cart-dropdown"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {QUANTITY_OPTIONS.map((quantity) => (
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
                                    ₹{(getPrice(product) * product.quantity).toFixed(2)}
                                    <small>
                                        ₹
                                        {(
                                            (getDemoPrice(product) - getPrice(product)) *
                                            product.quantity
                                        ).toFixed(2)}{" "}
                                        Save
                                    </small>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No Products Found.</p>
                    )}
                </div>
            </div>

            <div className="order-section">
                <h3>💰 Price Details</h3>

                <div className="price-box">
                    <div className="row">
                        <span>Total MRP</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="hypo-section">
                        <div className="hypo-header">
                            <div className="hypo-title">
                                <FaBolt className="hypo-icon" />
                                <span>Use HYPO Points</span>
                            </div>
                            <div className="hypo-balance">
                                <span className="hypo-balance-value">{hypoPoints}</span>
                                <span className="hypo-balance-label">Points</span>
                            </div>
                        </div>

                        {canUseHypo ? (
                            <div className="hypo-usable">
                                <label className="hypo-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={useHypo}
                                        onChange={(e) => setUseHypo(e.target.checked)}
                                        className="hypo-checkbox"
                                    />
                                    <span className="hypo-checkbox-custom" />
                                    <span className="hypo-checkbox-text">
                                        Redeem <strong>{usableHypo} points</strong> ={" "}
                                        <strong>₹{hypoRupees}</strong>
                                    </span>
                                </label>
                                <p className="hypo-remaining">
                                    Remaining after use:{" "}
                                    <strong>{hypoPoints - usableHypo} points</strong>
                                </p>
                            </div>
                        ) : (
                            <p className="hypo-message">
                                Add <strong>{HYPO_MIN_POINTS - hypoPoints} more points</strong> to
                                unlock HYPO redemption.
                            </p>
                        )}
                    </div>

                    {useHypo && canUseHypo && (
                        <div className="row hypo-discount-row">
                            <span>HYPO Discount ({pointsToUse} pts)</span>
                            <span className="hypo-discount-value">
                                -₹{hypoSavings.toFixed(2)}
                            </span>
                        </div>
                    )}

                    <hr />

                    <div className="row grand-total">
                        <strong>Grand Total</strong>
                        <strong>₹{finalTotal.toFixed(2)}</strong>
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

            <div className="order-section">
                <div
                    className={`payment-card ${paymentMethod === "COD" ? "selected" : ""}`}
                    onClick={() => setPaymentMethod("COD")}
                >
                    <div>
                        <h4>🚚 Cash On Delivery</h4>
                        <p>₹0 COD Charge</p>
                    </div>
                    <strong>₹{finalTotal.toFixed(2)}</strong>
                </div>
            </div>

            {addressError && (
                <div className="address-error">
                    <span>{addressError.text}</span>

                    {addressError.action === "verify" && (
                        <button
                            className="verify-here-btn"
                            onClick={() => navigate("/profile/viewprofile")}
                        >
                            Verify
                        </button>
                    )}

                    {addressError.action === "address" && (
                        <button
                            className="verify-here-btn"
                            onClick={() => navigate("/profile/viewaddress")}
                        >
                            Address
                        </button>
                    )}
                </div>
            )}

            <button className="continue-payment-btn" onClick={handlePlaceOrderClick}>
                {placingOrder ? "Placing Order..." : "Place Order"}
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
                        <div className="order-confirm-icon">🛒</div>

                        <h3>Sure to order like this?</h3>

                        <p>Please confirm your order before placing it.</p>

                        {useHypo && canUseHypo && (
                            <div className="order-confirm-hypo">
                                <FaBolt />
                                <span>
                                    Using {pointsToUse} HYPO points = ₹{hypoSavings}
                                </span>
                            </div>
                        )}

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
                                onClick={handleConfirmOrder}
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