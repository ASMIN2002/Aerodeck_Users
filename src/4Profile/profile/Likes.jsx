import "../profilestyles/Likes.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../services/api";
import { FaHeart } from "react-icons/fa";

function MyLikes({ setProfilePage, onOpenDetails }) {
    const navigate = useNavigate();
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadLikes() {
            try {
                const sessionToken = localStorage.getItem("session_token");
                const res = await fetch(
                    `${API}/api/user/likes/my?session_token=${sessionToken}`
                );
                const data = await res.json();
                if (data.success) setLikes(data.data || []);
            } catch (err) {
                console.error("Likes fetch error:", err.message);
            } finally {
                setLoading(false);
            }
        }

        loadLikes();
    }, []);

    const handleBack = () => {
        setProfilePage("profile");
        navigate("/profile", { replace: true });
    };

    const handleOpen = (like) => {
        const typeMap = {
            gifts: "gift",
            shop: "shop",
            premium: "premium",
            products: "card",
        };

        const productData = {
            product_id: like.product_id,
            product_name: like.product_name,
            product_image1: like.product_image,
        };

        onOpenDetails?.(productData, typeMap[like.product_type] || "card");
    };

    if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

    return (
        <div className="my-likes">
            <div className="my-likes-header">
                <button className="my-likes-back" onClick={handleBack}>←</button>
                <h2>My Likes</h2>
            </div>

            {likes.length === 0 ? (
                <div className="my-likes-empty">
                    <h3>No Likes Yet</h3>
                    <p>Products you like will appear here.</p>
                </div>
            ) : (
                <div className="my-likes-list">
                    {likes.map((like) => (
                        <div
                            key={like.like_id}
                            className="my-likes-card"
                            onClick={() => handleOpen(like)}
                        >
                            <img
                                src={like.product_image}
                                alt={like.product_name}
                                className="my-likes-image"
                            />

                            <div className="my-likes-info">
                                <h4>{like.product_name}</h4>
                            </div>

                            <div className="my-likes-action">
                                <FaHeart className="my-likes-heart" />
                                <span className="my-likes-count">{like.total_likes}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyLikes;