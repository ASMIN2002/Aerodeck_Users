import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyReviews.css";
import { API } from "../../../services/api";

function renderStars(rating) {
    const count = Math.max(0, Math.min(5, Number(rating) || 0));
    return "⭐".repeat(count);
}

function MyReviews({ setProfilePage, onOpenDetails }) {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadReviews() {
            try {
                const sessionToken = localStorage.getItem("session_token");
                const res = await fetch(
                    `${API}/api/user/review/my?session_token=${sessionToken}`
                );
                const data = await res.json();
                if (data.success) setReviews(data.data || []);
            } catch (err) {
                console.error("Reviews fetch error:", err.message);
            } finally {
                setLoading(false);
            }
        }

        loadReviews();
    }, []);

    const handleBack = () => {
        setProfilePage("profile");
        navigate("/profile", { replace: true });
    };

    const handleOpen = (review) => {
        const typeMap = {
            gifts: "gift",
            shop: "shop",
            premium: "premium",
            products: "card",
        };

        const productData = {
            product_id: review.product_id,
            product_name: review.product_name,
            product_price: review.product_price,
            product_image1: review.product_image,
        };

        onOpenDetails?.(productData, typeMap[review.product_type] || "card");
    };

    if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

    return (
        <div className="my-reviews">
            <div className="my-reviews-header">
                <button className="my-reviews-back" onClick={handleBack}>←</button>
                <h2>My Reviews</h2>
            </div>

            {reviews.length === 0 ? (
                <div className="my-reviews-empty">
                    <h3>No Reviews Yet</h3>
                    <p>Reviews you write will appear here.</p>
                </div>
            ) : (
                <div className="my-reviews-grid">
                    {reviews.map((review) => (
                        <div
                            key={review.rating_id}
                            className="my-reviews-card"
                            onClick={() => handleOpen(review)}
                        >
                            <img
                                src={review.product_image}
                                alt={review.product_name}
                                className="my-reviews-image"
                            />

                            <div className="my-reviews-info">
                                <h4>{review.product_name}</h4>
                                {/* <p className="my-reviews-price">₹{review.product_price}</p> */}
                                {/* <p className="my-reviews-stars">{renderStars(review.rating)}</p> */}
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