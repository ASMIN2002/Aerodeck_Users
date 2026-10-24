import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHeart, FiPackage } from "react-icons/fi";
import { API } from "../../services/api";
import "../profilestyles/Likes.css";

const TYPE_MAP = { gifts: "gift", shop: "shop", premium: "premium", products: "card", medicine: "medicine" };

const getSession = () => localStorage.getItem("session_token");

function MyLikes({ setProfilePage, onOpenDetails }) {
    const navigate = useNavigate();
    const [likes, setLikes] = useState([]);

    useEffect(() => {
        fetch(`${API}/api/user/likes/my?session_token=${getSession()}`)
            .then((r) => r.json())
            .then((data) => { if (data.success) setLikes(data.data || []); })
            .catch((err) => console.error("Likes fetch error:", err.message));
    }, []);

    const handleBack = () => { setProfilePage("profile"); navigate("/profile", { replace: true }); };

    const handleOpen = (like) => {
        const productData = {
            product_id: like.product_id,
            product_name: like.product_name,
            product_image1: like.product_image,
        };
        onOpenDetails?.(productData, TYPE_MAP[like.product_type] || "card");
    };

    return (
        <div className="my-likes">
            <div className="my-likes-header">
                <button className="my-likes-back" onClick={handleBack} aria-label="Back">
                    <FiArrowLeft />
                </button>
                <h2 className="my-likes-title">My Likes</h2>
                {likes.length > 0 && <span className="my-likes-count-badge">{likes.length}</span>}
            </div>

            {likes.length === 0 ? (
                <div className="my-likes-empty">
                    <FiHeart className="my-likes-empty-icon" />
                    <h3>No Likes Yet</h3>
                    <p>Products you like will appear here.</p>
                </div>
            ) : (
                <div className="my-likes-list">
                    {likes.map((like) => (
                        <div key={like.like_id} className="my-likes-card" onClick={() => handleOpen(like)}>
                            <div className="my-likes-image-wrap">
                                {like.product_image ? (
                                    <img src={like.product_image} alt={like.product_name} className="my-likes-image" loading="lazy" />
                                ) : (
                                    <FiPackage className="my-likes-fallback" />
                                )}
                            </div>

                            <div className="my-likes-info">
                                <h4 className="my-likes-name">{like.product_name}</h4>
                            </div>

                            <div className="my-likes-action">
                                <FiHeart className="my-likes-heart" />
                                <span className="my-likes-like-count">{like.total_likes || 0}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyLikes;