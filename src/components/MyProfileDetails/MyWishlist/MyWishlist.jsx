import "./MyWishlist.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../../services/api";

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

function MyWishlist({ setProfilePage, onOpenDetails }) {
    const navigate = useNavigate();

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
        navigate(-1);
    };

    return (
        <div className="mywishlist">
            <div className="wishlist-header">
                <button className="wishlist-back" onClick={handleBack}>
                    ←
                </button>
                <h2>My Wishlist</h2>
            </div>

            {loading && <p>Loading...</p>}

            {!loading && wishlist.length === 0 && (
                <div className="wishlist-empty">
                    ❤️
                    <h3>No Wishlist Found</h3>
                    <p>Your favourite cards will appear here.</p>
                </div>
            )}

            {wishlist.map((item) => {
                const productId = getProductId(item);
                const productType = getProductType(item);

                return (
                    <div className="wishlist-card" key={productId}>
                        <img
                            src={pickField(item, "image1", "")}
                            alt={pickField(item, "name", "")}
                        />

                        <div className="wishlist-info">
                            <h3>{pickField(item, "name", "")}</h3>
                            <p>⭐ {pickField(item, "rating", 0)}</p>
                            <p className="wishlist-discount">
                                {pickField(item, "discount_percentage", 0)} % Off
                            </p>

                            <div className="detwish">
                                <p className="wishlist-stats">
                                    ❤️ {pickField(item, "total_likes", 0)} &nbsp;&nbsp; 🔖
                                    {pickField(item, "total_saves", 0)}
                                </p>
                                <h4>₹ {pickField(item, "price", 0)}</h4>
                            </div>
                        </div>

                        <div className="wishlist-actions">
                            <button
                                className="wishlist-view"
                                onClick={() => onOpenDetails(item, productType)}
                            >
                                View
                            </button>

                            <button
                                className="wishlist-remove"
                                onClick={() => handleRemove(productId)}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default MyWishlist;