import "../profilestyles/Wishlist.css";
import { useEffect, useState } from "react";
import { API } from "../../services/api";
import {
    FiArrowLeft,
    FiHeart,
    FiStar,
    FiBookmark,
    FiTrash2,
    FiEye,
} from "react-icons/fi";

const TYPE_KEYS = ["product", "gift", "shop", "premium"];

const PRODUCT_TYPE_MAP = {
    product_id: "products",
    gift_id: "gifts",
    shop_id: "shop",
    premium_id: "premium",
};

function pickField(item, suffix, fallback = undefined) {
    if (!item) return fallback;
    for (const key of TYPE_KEYS) {
        const val = item[`${key}_${suffix}`];
        if (val !== undefined && val !== null) return val;
    }
    return fallback;
}

function getProductId(item) {
    return pickField(item, "id");
}

function getProductType(item) {
    for (const [idKey, type] of Object.entries(PRODUCT_TYPE_MAP)) {
        if (item[idKey]) return type;
    }
    return "";
}

function normalizeForDetails(item, productType) {
    return {
        [`${productType}_id`]: getProductId(item),
        [`${productType}_name`]: pickField(item, "name", ""),
        [`${productType}_image1`]: pickField(item, "image1", ""),
        [`${productType}_price`]: pickField(item, "price", 0),
        [`${productType}_rating`]: pickField(item, "rating", 0),
        [`${productType}_discount_percentage`]: pickField(
            item,
            "discount_percentage",
            0
        ),
        [`${productType}_total_likes`]: pickField(item, "total_likes", 0),
        [`${productType}_total_saves`]: pickField(item, "total_saves", 0),
    };
}

function MyWishlist({ setProfilePage, onOpenDetails }) {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const sessionToken = localStorage.getItem("session_token");

    const fetchWishlist = async () => {
        try {
            const res = await fetch(
                `${API}/api/user/wishlist?session_token=${sessionToken}`
            );
            const data = await res.json();
            if (data.success) setWishlist(data.data || []);
        } catch (err) {
            console.error("Wishlist fetch error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleRemove = async (productId) => {
        try {
            await fetch(`${API}/api/user/wishlist/${productId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: sessionToken }),
            });
            fetchWishlist();
        } catch (err) {
            console.error("Remove error:", err.message);
        }
    };

    const handleBack = () => {
        setProfilePage("profile");
    };

    const handleView = (item, productType) => {
        const normalized = normalizeForDetails(item, productType);
        onOpenDetails(normalized, productType);
    };

    return (
        <div className="mywishlist">
            <div className="wishlist-header">
                <button className="wishlist-back" onClick={handleBack}>
                    <FiArrowLeft />
                </button>
                <h2>My Wishlist</h2>
            </div>

            {loading && <p className="wishlist-loading">Loading...</p>}

            {!loading && wishlist.length === 0 && (
                <div className="wishlist-empty">
                    <FiHeart className="wishlist-empty-icon" />
                    <h3>No Wishlist Found</h3>
                    <p>Your favourite cards will appear here.</p>
                </div>
            )}

            {wishlist.map((item) => {
                const productId = getProductId(item);
                const productType = getProductType(item);

                return (
                    <div className="wishlist-card" key={productId}>
                        <div className="wishlist-image-wrap">
                            <img
                                src={pickField(item, "image1", "")}
                                alt={pickField(item, "name", "")}
                            />
                        </div>

                        <div className="wishlist-info">
                            <h3>{pickField(item, "name", "")}</h3>

                            <div className="wishlist-meta-row">
                                <span className="wishlist-rating">
                                    <FiStar className="wishlist-meta-icon star" />
                                    {pickField(item, "rating", 0)}
                                </span>
                                <span className="wishlist-discount">
                                    {pickField(item, "discount_percentage", 0)}% OFF
                                </span>
                            </div>

                            <div className="detwish">
                                <div className="wishlist-stats">
                                    <span className="wishlist-stat">
                                        <FiHeart className="wishlist-meta-icon heart" />
                                        {pickField(item, "total_likes", 0)}
                                    </span>
                                    <span className="wishlist-stat">
                                        <FiBookmark className="wishlist-meta-icon bookmark" />
                                        {pickField(item, "total_saves", 0)}
                                    </span>
                                </div>
                                <h4>₹ {pickField(item, "price", 0)}</h4>
                            </div>
                        </div>

                        <div className="wishlist-actions">
                            <button
                                className="wishlist-view"
                                onClick={() => handleView(item, productType)}
                                aria-label="View"
                            >
                                <FiEye />
                            </button>

                            <button
                                className="wishlist-remove"
                                onClick={() => handleRemove(productId)}
                                aria-label="Remove"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default MyWishlist;