import "../DetailsDataStyle/ProductSummary.css";
import { API } from "../../../services/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WHATSAPP_NUMBER = "918984031948";
const DESC_LIMIT = 120;
const ERROR_DURATION = 3500;

const FIELD_KEYS = ["product", "gift", "shop", "premium"];

function getField(product, suffix, fallback = undefined) {
    if (!product) return fallback;
    for (const key of FIELD_KEYS) {
        const val = product[`${key}_${suffix}`];
        if (val !== undefined && val !== null) return val;
    }
    return fallback;
}

function ProductSummary({
    product,
    cartQuantity,
    onIncreaseCart,
    onDecreaseCart,
    onBuyNow,
}) {
    const navigate = useNavigate();

    const name = getField(product, "name");
    const description = getField(product, "description");
    const rating = getField(product, "rating", 0);
    const price = getField(product, "price");
    const demoPrice = getField(product, "demo_price");
    const discount = getField(product, "discount_percentage", 0);
    const status = getField(product, "status");

    const totalPrice = Number(price || 0) * Number(cartQuantity || 0);
    const isAvailable = Number(status) === 1;

    const isShopOrGift = !!(
        product?.shop_name ||
        product?.gift_name ||
        product?.shop_description ||
        product?.gift_description
    );

    const [expanded, setExpanded] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [primaryAddress, setPrimaryAddress] = useState(null);
    const [verifyError, setVerifyError] = useState(null);

    const sessionToken = localStorage.getItem("session_token");
    const isLong = (description?.length || 0) > DESC_LIMIT;

    useEffect(() => {
        if (!sessionToken) return;

        fetch(`${API}/api/user/details?session_token=${sessionToken}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.success && data.data) setUserDetails(data.data);
            })
            .catch((err) => console.error("User details error:", err.message));
    }, [sessionToken]);

    useEffect(() => {
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
    }, [sessionToken]);

    useEffect(() => {
        if (!verifyError) return;
        const timer = setTimeout(() => setVerifyError(null), ERROR_DURATION);
        return () => clearTimeout(timer);
    }, [verifyError]);

    const validateOrder = () => {
        if (!userDetails?.full_name || !userDetails.full_name.trim()) {
            return { text: "First give your name to continue.", action: "verify" };
        }
        if (!userDetails?.mobile_number || userDetails.is_mobile_verified !== 1) {
            return { text: "Please verify your mobile number first.", action: "verify" };
        }
        if (!userDetails?.whatsapp_number || userDetails.is_whatsapp_verified !== 1) {
            return { text: "Please verify your WhatsApp number first.", action: "verify" };
        }
        if (!primaryAddress) {
            return { text: "Please select the address.", action: "address" };
        }
        return null;
    };

    const handleOrderNow = async () => {
        const error = validateOrder();
        if (error) {
            setVerifyError(error);
            return;
        }

        const productId = getField(product, "id");
        if (!sessionToken || !productId) return;

        try {
            const response = await fetch(`${API}/api/user/whatsapp-order-data`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_token: sessionToken,
                    product_id: productId,
                }),
            });

            const data = await response.json();
            if (!data.success) return;

            const message =
                `USER = #${data.user_id}HEEPITUSER\n` +
                `PRODUCT = #${data.product_id}HEEPITPRODUCT\n\n` +
                `Just press Send to know more.`;

            window.open(
                `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
                "_blank"
            );
        } catch (err) {
            console.error("WhatsApp order error:", err.message);
        }
    };

    const handleBuyNowClick = () => {
        navigate("/buy");
        onBuyNow?.();
    };

    return (
        <section className="ps-section">
            <div className="tobbardet">
                <div className="ps-price-row">
                    <div className="pridisc">
                        {demoPrice && <span className="ps-demo-price">₹{demoPrice}</span>}
                        {discount > 0 && (
                            <span className="ps-discount">{discount}% OFF</span>
                        )}
                    </div>
                    <span className="ps-price">₹{price}</span>
                </div>
                <div className="ps-rating">⭐ {rating}</div>
            </div>

            <div className="ps-header">
                <h2 className="ps-name">{name}</h2>
            </div>

            <h2 className="ps-desc">
                {expanded || !isLong ? description : description?.slice(0, DESC_LIMIT)}
                {isLong && (
                    <span className="ps-more" onClick={() => setExpanded(!expanded)}>
                        {expanded ? " Less" : "... More"}
                    </span>
                )}
            </h2>

            <div className="downcartbuy">
                {!isAvailable ? (
                    <div className="ps-oos-wrap">
                        <div className="ps-oos-badge">OUT OF STOCK</div>
                        <p className="ps-oos-text">This product is currently unavailable.</p>
                    </div>
                ) : isShopOrGift ? (
                    <>
                        <div className="ps-cart-row">
                            {cartQuantity > 0 ? (
                                <div className="ps-qty">
                                    <button onClick={onDecreaseCart}>-</button>
                                    <span>{cartQuantity}</span>
                                    <button onClick={onIncreaseCart}>+</button>
                                </div>
                            ) : (
                                <button className="ps-cart-btn" onClick={onIncreaseCart}>
                                    🛒 Add To Cart
                                </button>
                            )}
                        </div>

                        <div className="ps-buy-now">
                            <button className="ps-cart-btn" onClick={handleBuyNowClick}>
                                Buy at&nbsp;
                                <span className="ps-total-price">
                                    ₹{Number(
                                        cartQuantity > 0 ? totalPrice : price
                                    ).toLocaleString("en-IN")}
                                </span>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="ps-buy-now">
                        <button className="ps-cart-btn" onClick={handleOrderNow}>
                            ORDER NOW
                        </button>
                    </div>
                )}
            </div>

            {verifyError && (
                <div className="ps-verify-error">
                    <span>{verifyError.text}</span>

                    {verifyError.action === "verify" && (
                        <button
                            className="ps-verify-btn"
                            onClick={() => navigate("/profile/viewprofile")}
                        >
                            Verify
                        </button>
                    )}

                    {verifyError.action === "address" && (
                        <button
                            className="ps-verify-btn"
                            onClick={() => navigate("/profile/address")}
                        >
                            Address
                        </button>
                    )}
                </div>
            )}
        </section>
    );
}

export default ProductSummary;