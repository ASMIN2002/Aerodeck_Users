import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductOrder.css";
import { RiDiscountPercentLine } from "react-icons/ri";
import { FaBolt } from "react-icons/fa";
import { API } from "../../../services/api";

function ProductOrder({
    setProfilePage,
    orderData,
    setOrderData,
}) {
    const navigate = useNavigate();
    const products = orderData?.items || [];

    /* ============================================
       HELPERS
       ============================================ */
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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_token: sessionToken,
                    product_id: productId,
                    quantity: quantity
                })
            });

            const data = await response.json();
            if (!data.success) return false;

            setOrderData(prev => ({
                ...prev,
                items: prev.items.map(item =>
                    String(item.product_id) === String(productId)
                        ? { ...item, quantity: quantity }
                        : item
                )
            }));

            return true;
        } catch (error) {
            console.error("Cart quantity update error:", error);
            return false;
        }
    };

    /* ============================================
       STATE
       ============================================ */
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [openCartProduct, setOpenCartProduct] = useState(null);
    const [primaryAddress, setPrimaryAddress] = useState(null);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [showOrderConfirm, setShowOrderConfirm] = useState(false);
    const [addressError, setAddressError] = useState("");

    const [hypoPoints, setHypoPoints] = useState(0);
    const [useHypo, setUseHypo] = useState(false);

    /* ============================================
       PRICE CALCULATIONS
       ============================================ */
    const subtotal = products.reduce((sum, item) => {
        return sum + (getPrice(item) * item.quantity);
    }, 0);

    const platformFee = 2;
    const MINIMUM_ORDER_AMOUNT = 200;

    const grandTotal = subtotal + platformFee;
    const upiTotal = subtotal + platformFee;

    /* ============================================
       HYPO REDEMPTION
       ============================================ */
    const usableHypo = Math.floor(hypoPoints / 100) * 100;
    const hypoRupees = usableHypo / 10;
    const canUseHypo = hypoPoints >= 100;
    const hypoSavings = useHypo && canUseHypo ? hypoRupees : 0;
    const pointsToUse = useHypo && canUseHypo ? usableHypo : 0;
    const finalTotal = grandTotal - hypoSavings;

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

    /* ============================================
       OUTSIDE CLICK
       ============================================ */
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

    /* ============================================
       FETCH ADDRESS
       ============================================ */
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

    /* ============================================
       FETCH HYPO POINTS
       ============================================ */
    useEffect(() => {
        async function loadHypoPoints() {
            try {
                const sessionToken = localStorage.getItem("session_token");
                const response = await fetch(
                    `${API}/api/user/rewards?session_token=${sessionToken}`
                );
                const data = await response.json();
                if (data.success && data.data) {
                    setHypoPoints(data.data.hypo_points || 0);
                }
            } catch (err) {
                console.error(err);
            }
        }
        loadHypoPoints();
    }, []);

    return (

        <div className="product-order-page">

            {/* HEADER */}
            <div className="product-order-header">
                <button
                    className="product-order-back"
                    onClick={() => navigate(-1)}
                >
                    ←
                </button>
                <h2>Product Order</h2>
            </div>

            {/* ADDRESS */}
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
                                    {primaryAddress.house_flat},{" "}
                                    {primaryAddress.area_street},{" "}
                                    {primaryAddress.city},{" "}
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

            {/* PRODUCTS */}
            <div className="order-section">
                <div className="product-list">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div className="product-row" key={product.product_id}>
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
                                    ₹{(getPrice(product) * product.quantity).toFixed(2)}
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
                    )}
                </div>
            </div>

            {/* ============================================
                PRICE DETAILS
               ============================================ */}
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

                    {/* HYPO SECTION */}
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
                                        Redeem <strong>{usableHypo} points</strong> = <strong>₹{hypoRupees}</strong>
                                    </span>
                                </label>
                                <p className="hypo-remaining">
                                    Remaining after use: <strong>{hypoPoints - usableHypo} points</strong>
                                </p>
                            </div>
                        ) : (
                            <p className="hypo-message">
                                Add <strong>{100 - hypoPoints} more points</strong> to unlock HYPO redemption.
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

            {/* PAYMENT METHOD */}
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
                <p className="address-error">
                    {addressError}
                </p>
            )}

            <button
                className="continue-payment-btn"
                onClick={() => {

                    if (subtotal < MINIMUM_ORDER_AMOUNT) {
                        const remainingAmount = MINIMUM_ORDER_AMOUNT - subtotal;
                        setAddressError(
                            `Minimum order amount is ₹200. Add ₹${remainingAmount.toFixed(2)} more to continue.`
                        );
                        setTimeout(() => setAddressError(""), 3000);
                        return;
                    }

                    if (!primaryAddress) {
                        setAddressError("Please select the address.");
                        setTimeout(() => setAddressError(""), 2000);
                        return;
                    }

                    setAddressError("");
                    setShowOrderConfirm(true);

                }}
            >
                {placingOrder
                    ? "Placing Order..."
                    : "Place Order"}
            </button>

            {/* ORDER CONFIRM */}
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
                                onClick={async () => {

                                    setShowOrderConfirm(false);
                                    setPlacingOrder(true);

                                    try {

                                        const sessionToken =
                                            localStorage.getItem("session_token");

                                        /* ============================================
                                           1. PLACE ORDER
                                           ============================================ */
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
                                                    total_amount: finalTotal,
                                                    hypo_points_used: pointsToUse
                                                })
                                            }
                                        );

                                        const data = await response.json();

                                        if (!data.success) {
                                            setPlacingOrder(false);
                                            return;
                                        }

                                        /* ============================================
                                           2. USE HYPO POINTS (if any)
                                           ============================================ */
                                        if (pointsToUse > 0) {

                                            try {

                                                await fetch(
                                                    `${API}/api/user/rewards/use`,
                                                    {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json"
                                                        },
                                                        body: JSON.stringify({
                                                            session_token: sessionToken,
                                                            points_used: pointsToUse
                                                        })
                                                    }
                                                );

                                            } catch (err) {
                                                console.error("HYPO use error:", err);
                                            }

                                        }

                                        setProfilePage("ordersuccess");

                                    } catch (error) {

                                        console.error("Place order error:", error);

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