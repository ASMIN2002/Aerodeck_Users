import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiStar, FiShoppingCart, FiExternalLink, FiMapPin, FiShield, FiCheckCircle } from "react-icons/fi";
import { API } from "../../services/api";
import "../detailStyle/ProductSummary.css";

const WHATSAPP_NUMBER = "919583282886";
const DESC_LIMIT = 120;
const ERROR_DURATION = 3500;
const FIELD_KEYS = ["product", "gift", "shop", "medicine"];

const getField = (product, suffix, fallback) => {
    if (!product) return fallback;
    for (const key of FIELD_KEYS) {
        const val = product[`${key}_${suffix}`];
        if (val !== undefined && val !== null) return val;
    }
    return fallback;
};

const getSession = () => localStorage.getItem("session_token");

function ProductSummary({ product, cartQuantity, onIncreaseCart, onDecreaseCart, onBuyNow }) {
    const navigate = useNavigate();
    const sessionToken = getSession();

    const name = getField(product, "name");
    const description = getField(product, "description");
    const rating = getField(product, "rating", 0);
    const price = getField(product, "price");
    const demoPrice = getField(product, "demo_price");
    const discount = getField(product, "discount_percentage", 0);
    const status = getField(product, "status");

    const totalPrice = Number(price || 0) * Number(cartQuantity || 0);
    const isAvailable = Number(status) === 1;
    const isShopOrGift = !!(product?.shop_name || product?.gift_name || product?.shop_description || product?.gift_description || product?.medicine_name);
    const isLong = (description?.length || 0) > DESC_LIMIT;

    const [expanded, setExpanded] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [primaryAddress, setPrimaryAddress] = useState(null);
    const [verifyError, setVerifyError] = useState(null);

    useEffect(() => {
        if (!sessionToken) return;
        fetch(`${API}/api/user/details?session_token=${sessionToken}`)
            .then((r) => r.json())
            .then((data) => { if (data.success && data.data) setUserDetails(data.data); })
            .catch((err) => console.error("User details error:", err.message));
    }, [sessionToken]);

    useEffect(() => {
        if (!sessionToken) return;
        fetch(`${API}/api/user/address?session_token=${sessionToken}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.success) setPrimaryAddress(data.data.find((i) => i.is_primary === 1) || null);
            })
            .catch((err) => console.error("Address fetch error:", err.message));
    }, [sessionToken]);

    useEffect(() => {
        if (!verifyError) return;
        const timer = setTimeout(() => setVerifyError(null), ERROR_DURATION);
        return () => clearTimeout(timer);
    }, [verifyError]);

    const validateOrder = () => {
        if (!userDetails?.full_name?.trim()) return { text: "First give your name to continue.", action: "verify" };
        if (!userDetails?.mobile_number || userDetails.is_mobile_verified !== 1) return { text: "Please verify your mobile number first.", action: "verify" };
        if (!userDetails?.whatsapp_number || userDetails.is_whatsapp_verified !== 1) return { text: "Please verify your WhatsApp number first.", action: "verify" };
        if (!primaryAddress) return { text: "Please select the address.", action: "address" };
        return null;
    };

    const handleOrderNow = async () => {
        const error = validateOrder();
        if (error) return setVerifyError(error);

        const productId = getField(product, "id");
        if (!sessionToken || !productId) return;

        try {
            const data = await fetch(`${API}/api/user/whatsapp-order-data`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: sessionToken, product_id: productId }),
            }).then((r) => r.json());

            if (!data.success) return;

            const message = `USER = #${data.user_id}HEEPITUSER\nPRODUCT = #${data.product_id}HEEPITPRODUCT\n\nJust press Send to know more.`;
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
        } catch (err) { console.error("WhatsApp order error:", err.message); }
    };

    const handleBuyNowClick = () => {
        navigate("/buy");
        onBuyNow?.();
    };

    return (
        <section className="ps-section">
            <div className="ps-top">
                <div className="ps-price-block">
                    <span className="ps-price">₹{Number(price || 0).toLocaleString("en-IN")}</span>
                    {demoPrice && Number(demoPrice) > Number(price) && (
                        <span className="ps-demo-price">₹{demoPrice}</span>
                    )}
                    {discount > 0 && <span className="ps-discount">{discount}% OFF</span>}
                </div>
                <div className="ps-rating">
                    <FiStar /> {rating || "4.0"}
                </div>
            </div>

            <h2 className="ps-name">{name}</h2>

            <div className="ps-desc-wrap">
                <p className="ps-desc">
                    {expanded || !isLong ? description : `${description?.slice(0, DESC_LIMIT)}...`}
                </p>
                {isLong && (
                    <button type="button" className="ps-more" onClick={() => setExpanded(!expanded)}>
                        {expanded ? "Show Less" : "Read More"}
                    </button>
                )}
            </div>

            <div className="ps-actions">
                {!isAvailable ? (
                    <div className="ps-oos">
                        <FiShield className="ps-oos-icon" />
                        <div>
                            <strong>Out of Stock</strong>
                            <p>This product is currently unavailable.</p>
                        </div>
                    </div>
                ) : isShopOrGift ? (
                    <div className="ps-shop-actions">
                        {cartQuantity > 0 ? (
                            <div className="ps-qty">
                                <button type="button" onClick={onDecreaseCart} aria-label="Decrease">−</button>
                                <span>{cartQuantity}</span>
                                <button type="button" onClick={onIncreaseCart} aria-label="Increase">+</button>
                            </div>
                        ) : (
                            <button type="button" className="ps-cart-btn" onClick={onIncreaseCart}>
                                <FiShoppingCart /> Add to Cart
                            </button>
                        )}
                        <button type="button" className="ps-buy-btn" onClick={handleBuyNowClick}>
                            Buy at ₹{Number(cartQuantity > 0 ? totalPrice : price).toLocaleString("en-IN")}
                        </button>
                    </div>
                ) : (
                    <button type="button" className="ps-order-btn" onClick={handleOrderNow}>
                        <FiExternalLink /> Order Now on WhatsApp
                    </button>
                )}
            </div>

            {verifyError && (
                <div className="ps-error">
                    <FiMapPin className="ps-error-icon" />
                    <span>{verifyError.text}</span>
                    {verifyError.action === "verify" && (
                        <button type="button" className="ps-error-btn" onClick={() => navigate("/profile/viewprofile")}>Verify</button>
                    )}
                    {verifyError.action === "address" && (
                        <button type="button" className="ps-error-btn" onClick={() => navigate("/profile/viewaddress")}>Address</button>
                    )}
                </div>
            )}
        </section>
    );
}

export default ProductSummary;