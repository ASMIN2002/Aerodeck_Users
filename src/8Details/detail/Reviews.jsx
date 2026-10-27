import { useEffect, useState, useCallback, memo } from "react";
import { FiStar, FiMessageSquare } from "react-icons/fi";
import { API } from "../../services/api";
import "../detailStyle/Reviews.css";

const MAX_STARS = 5;

const Stars = memo(function Stars({ rating }) {
    const count = Math.max(0, Math.min(MAX_STARS, Math.round(Number(rating) || 0)));
    return (
        <div className="dt-review-stars">
            {Array.from({ length: MAX_STARS }).map((_, i) => (
                <FiStar key={i} className={i < count ? "dt-star filled" : "dt-star"} />
            ))}
        </div>
    );
});

const Avatar = memo(function Avatar({ profile_image, full_name }) {
    const [imageError, setImageError] = useState(false);
    const showImage = profile_image && !imageError;
    const initial = full_name?.charAt(0)?.toUpperCase() || "?";

    return (
        <div className="dt-review-avatar-wrap">
            {showImage ? (
                <img
                    src={profile_image}
                    alt={full_name}
                    className="dt-review-avatar-img"
                    onError={() => setImageError(true)}
                    loading="lazy"
                    decoding="async"
                />
            ) : (
                <div className="dt-review-avatar">{initial}</div>
            )}
        </div>
    );
});

const EmptyState = memo(function EmptyState() {
    return (
        <div className="dt-review-card dt-review-empty">
            <FiMessageSquare className="dt-empty-icon" />
            <h4>No Reviews Yet</h4>
            <p>Be the first to review this product.</p>
        </div>
    );
});

function Reviews({ onViewAll, product_id }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (!product_id) return;

        let cancelled = false;

        fetch(`${API}/api/user/review/top/${product_id}`)
            .then((r) => r.json())
            .then((data) => {
                if (!cancelled && data.success) setReviews(data.reviews || []);
            })
            .catch((err) => console.error("Reviews fetch error:", err.message));

        return () => { cancelled = true; };
    }, [product_id]);

    const handleViewAll = useCallback(() => {
        if (onViewAll) onViewAll();
    }, [onViewAll]);

    return (
        <div className="dt-reviews">
            <div className="dt-reviews-header">
                <h4>Ratings & Reviews</h4>
                {reviews.length > 0 && (
                    <button type="button" className="dt-view-all" onClick={handleViewAll}>
                        View All
                    </button>
                )}
            </div>

            <div className="dt-review-scroll">
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div
                            className="dt-review-card"
                            key={review.rating_id || `${review.full_name}-${index}`}
                            onClick={handleViewAll}
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

export default memo(Reviews);