import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiStar, FiMessageSquare, FiPackage } from "react-icons/fi";
import { API } from "../../services/api";
import "../profilestyles/MyReviews.css";

const TYPE_MAP = { gifts: "gift", shop: "shop", premium: "premium", products: "card", medicine: "medicine" };

const getSession = () => localStorage.getItem("session_token");

const Stars = ({ rating }) => {
    const count = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    return (
        <div className="my-reviews-stars">
            {Array.from({ length: 5 }).map((_, i) => (
                <FiStar key={i} className={i < count ? "my-reviews-star filled" : "my-reviews-star"} />
            ))}
        </div>
    );
};

function MyReviews({ setProfilePage, onOpenDetails }) {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch(`${API}/api/user/review/my?session_token=${getSession()}`)
            .then((r) => r.json())
            .then((data) => { if (data.success) setReviews(data.data || []); })
            .catch((err) => console.error("Reviews fetch error:", err.message));
    }, []);

    const handleBack = () => { setProfilePage("profile"); navigate("/profile", { replace: true }); };

    const handleOpen = (review) => {
        const productData = {
            product_id: review.product_id,
            product_name: review.product_name,
            product_price: review.product_price,
            product_image1: review.product_image,
        };
        onOpenDetails?.(productData, TYPE_MAP[review.product_type] || "card");
    };

    return (
        <div className="my-reviews">
            <div className="my-reviews-header">
                <button className="my-reviews-back" onClick={handleBack} aria-label="Back">
                    <FiArrowLeft />
                </button>
                <h2 className="my-reviews-title">My Reviews</h2>
                {reviews.length > 0 && <span className="my-reviews-count-badge">{reviews.length}</span>}
            </div>

            {reviews.length === 0 ? (
                <div className="my-reviews-empty">
                    <FiMessageSquare className="my-reviews-empty-icon" />
                    <h3>No Reviews Yet</h3>
                    <p>Reviews you write will appear here.</p>
                </div>
            ) : (
                <div className="my-reviews-grid">
                    {reviews.map((review) => (
                        <div key={review.rating_id} className="my-reviews-card" onClick={() => handleOpen(review)}>
                            <div className="my-reviews-image-wrap">
                                {review.product_image ? (
                                    <img src={review.product_image} alt={review.product_name} className="my-reviews-image" loading="lazy" />
                                ) : (
                                    <FiPackage className="my-reviews-fallback" />
                                )}
                            </div>

                            <div className="my-reviews-info">
                                <h4 className="my-reviews-name">{review.product_name}</h4>
                                <Stars rating={review.rating} />
                                {review.review_message && (
                                    <p className="my-reviews-msg">{review.review_message}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyReviews;