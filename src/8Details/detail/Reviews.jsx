import { useEffect, useState } from "react";
import { API } from "../../services/api";
import "../detailStyle/Reviews.css";

const MAX_STARS = 5;

function renderStars(rating) {
    const count = Math.max(0, Math.min(MAX_STARS, Number(rating) || 0));
    return "⭐".repeat(count);
}

function Avatar({ profile_image, full_name }) {
    const [imageError, setImageError] = useState(false);
    const showImage = profile_image && !imageError;

    return (
        <div className="dt-review-avatar-wrap">
            {showImage ? (
                <img
                    src={profile_image}
                    alt={full_name}
                    className="dt-review-avatar-img"
                    onError={() => setImageError(true)}
                />
            ) : (
                <div className="dt-review-avatar">NO DP</div>
            )}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="dt-review-card dt-review-empty">
            <div className="dt-review-top">
                <div className="dt-review-avatar-wrap">
                    <div className="dt-review-star-avatar">⭐</div>
                </div>
                <div>
                    <h4>No Reviews Yet</h4>
                </div>
            </div>
            <p>Be the first customer to review this product.</p>
        </div>
    );
}

function Reviews({ onViewAll, product_id }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        async function loadReviews() {
            try {
                const res = await fetch(
                    `${API}/api/user/review/top/${product_id}`
                );
                const data = await res.json();

                if (data.success) setReviews(data.reviews);
            } catch (err) {
                console.error("Reviews fetch error:", err.message);
            }
        }

        loadReviews();
    }, [product_id]);

    return (
        <div className="dt-reviews">
            <div className="dts-section-header">
                <h4>Ratings and Reviews</h4>
                <button className="dt-view-all" onClick={onViewAll}>
                    View All
                </button>
            </div>

            <div className="dt-review-scroll">
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div
                            className="dt-review-card"
                            key={`${review.full_name}-${index}`}
                            onClick={onViewAll}
                            style={{ cursor: "pointer" }}
                        >
                            <div className="dt-review-top">
                                <Avatar
                                    profile_image={review.profile_image}
                                    full_name={review.full_name}
                                />

                                <div>
                                    <h4>{review.full_name}</h4>
                                    <span>{renderStars(review.rating)}</span>
                                </div>
                            </div>

                            <p>{review.review_message}</p>
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