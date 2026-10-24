import { useEffect, useState } from "react";
import { FiStar, FiMessageSquare } from "react-icons/fi";
import { API } from "../../services/api";
import "../detailStyle/Reviews.css";

const MAX_STARS = 5;

function Stars({ rating }) {
    const count = Math.max(0, Math.min(MAX_STARS, Math.round(Number(rating) || 0)));
    return (
        <div className="dt-review-stars">
            {Array.from({ length: MAX_STARS }).map((_, i) => (
                <FiStar key={i} className={i < count ? "dt-star filled" : "dt-star"} />
            ))}
        </div>
    );
}

function Avatar({ profile_image, full_name }) {
    const [imageError, setImageError] = useState(false);
    const showImage = profile_image && !imageError;
    const initial = full_name?.charAt(0)?.toUpperCase() || "?";

    return (
        <div className="dt-review-avatar-wrap">
            {showImage ? (
                <img src={profile_image} alt={full_name} className="dt-review-avatar-img" onError={() => setImageError(true)} loading="lazy" />
            ) : (
                <div className="dt-review-avatar">{initial}</div>
            )}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="dt-review-card dt-review-empty">
            <FiMessageSquare className="dt-empty-icon" />
            <h4>No Reviews Yet</h4>
            <p>Be the first to review this product.</p>
        </div>
    );
}

function Reviews({ onViewAll, product_id }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch(`${API}/api/user/review/top/${product_id}`)
            .then((r) => r.json())
            .then((data) => { if (data.success) setReviews(data.reviews || []); })
            .catch((err) => console.error("Reviews fetch error:", err.message));
    }, [product_id]);

    return (
        <div className="dt-reviews">
            <div className="dt-reviews-header">
                <h4>Ratings & Reviews</h4>
                {reviews.length > 0 && (
                    <button type="button" className="dt-view-all" onClick={onViewAll}>
                        View All
                    </button>
                )}
            </div>

            <div className="dt-review-scroll">
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div
                            className="dt-review-card"
                            key={`${review.full_name}-${index}`}
                            onClick={onViewAll}
                        >
                            <div className="dt-review-top">
                                <Avatar profile_image={review.profile_image} full_name={review.full_name} />
                                <div className="dt-review-user">
                                    <h4>{review.full_name}</h4>
                                    <Stars rating={review.rating} />
                                </div>
                            </div>
                            <p className="dt-review-text">{review.review_message}</p>
                        </div>
                    ))
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
}

export default Reviews;