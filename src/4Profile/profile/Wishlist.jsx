import { useEffect, useState } from "react";
import { FiArrowLeft, FiHeart, FiStar, FiBookmark, FiTrash2, FiEye, FiPackage } from "react-icons/fi";
import { API } from "../../services/api";
import "../profilestyles/Wishlist.css";

const TYPE_KEYS = ["product", "gift", "shop", "premium", "medicine"];
const PRODUCT_TYPE_MAP = { product_id: "products", gift_id: "gifts", shop_id: "shop", premium_id: "premium", medicine_id: "medicine" };

const getSession = () => localStorage.getItem("session_token");

const pickField = (item, suffix, fallback) => {
    if (!item) return fallback;
    for (const key of TYPE_KEYS) {
        const val = item[`${key}_${suffix}`];
        if (val !== undefined && val !== null) return val;
    }
    return fallback;
};

const getProductId = (item) => pickField(item, "id");
const getProductType = (item) => {
    for (const [idKey, type] of Object.entries(PRODUCT_TYPE_MAP)) if (item[idKey]) return type;
    return "";
};

const normalizeForDetails = (item, type) => ({
    [`${type}_id`]: getProductId(item),
    [`${type}_name`]: pickField(item, "name", ""),
    [`${type}_image1`]: pickField(item, "image1", ""),
    [`${type}_price`]: pickField(item, "price", 0),
    [`${type}_rating`]: pickField(item, "rating", 0),
    [`${type}_discount_percentage`]: pickField(item, "discount_percentage", 0),
    [`${type}_total_likes`]: pickField(item, "total_likes", 0),
    [`${type}_total_saves`]: pickField(item, "total_saves", 0),
});

function MyWishlist({ setProfilePage, onOpenDetails }) {
    const [wishlist, setWishlist] = useState([]);
    const sessionToken = getSession();

    useEffect(() => {
        fetch(`${API}/api/user/wishlist?session_token=${sessionToken}`)
            .then((r) => r.json())
            .then((data) => { if (data.success) setWishlist(data.data || []); })
            .catch((err) => console.error("Wishlist fetch error:", err.message));
    }, [sessionToken]);

    const handleRemove = async (productId) => {
        try {
            await fetch(`${API}/api/user/wishlist/${productId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: sessionToken }),
            });
            setWishlist((prev) => prev.filter((i) => getProductId(i) !== productId));
        } catch (err) { console.error("Remove error:", err.message); }
    };

    const handleView = (item, type) => onOpenDetails(normalizeForDetails(item, type), type);

    return (
        <div className="mywishlist">
            <div className="wishlist-header">
                <button className="wishlist-back" onClick={() => setProfilePage("profile")} aria-label="Back">
                    <FiArrowLeft />
                </button>
                <h2 className="wishlist-title">My Wishlist</h2>
                {wishlist.length > 0 && <span className="wishlist-count">{wishlist.length}</span>}
            </div>

            {wishlist.length === 0 ? (
                <div className="wishlist-empty">
                    <FiHeart className="wishlist-empty-icon" />
                    <h3>No Wishlist Found</h3>
                    <p>Your favourite items will appear here.</p>
                </div>
            ) : (
                <div className="wishlist-list">
                    {wishlist.map((item) => {
                        const productId = getProductId(item);
                        const productType = getProductType(item);
                        const image = pickField(item, "image1", "");
                        const name = pickField(item, "name", "Unknown");
                        const price = pickField(item, "price", 0);
                        const rating = pickField(item, "rating", 0);
                        const discount = pickField(item, "discount_percentage", 0);
                        const likes = pickField(item, "total_likes", 0);
                        const saves = pickField(item, "total_saves", 0);

                        return (
                            <div className="wishlist-card" key={productId}>
                                <div className="wishlist-image-wrap" onClick={() => handleView(item, productType)}>
                                    {image ? (
                                        <img src={image} alt={name} loading="lazy" />
                                    ) : (
                                        <FiPackage className="wishlist-image-fallback" />
                                    )}
                                    {discount > 0 && <span className="wishlist-discount-badge">{discount}% OFF</span>}
                                </div>

                                <div className="wishlist-info">
                                    <h3 className="wishlist-name">{name}</h3>
                                    <div className="wishlist-meta-row">
                                        <span className="wishlist-rating">
                                            <FiStar className="wishlist-meta-icon star" /> {rating || "4.0"}
                                        </span>
                                        <span className="wishlist-stat">
                                            <FiHeart className="wishlist-meta-icon heart" /> {likes}
                                        </span>
                                        <span className="wishlist-stat">
                                            <FiBookmark className="wishlist-meta-icon bookmark" /> {saves}
                                        </span>
                                    </div>
                                    <span className="wishlist-price">₹{Number(price).toLocaleString("en-IN")}</span>
                                </div>

                                <div className="wishlist-actions">
                                    <button className="wishlist-view" onClick={() => handleView(item, productType)} aria-label="View">
                                        <FiEye />
                                    </button>
                                    <button className="wishlist-remove" onClick={() => handleRemove(productId)} aria-label="Remove">
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MyWishlist;