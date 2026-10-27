import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiStar, FiMessageSquare } from "react-icons/fi";
import { API } from "../../services/api";
import "../detailStyle/AllReview.css";

const STAR_FILTERS = [5, 4, 3, 2, 1];

const getSafeName = (name) => (name?.trim() || "Anonymous");
const getInitial = (name) => name.charAt(0).toUpperCase();

const Stars = memo(function Stars({ rating }) {
    const count = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    return (
        <div className="allreview-stars">
            {Array.from({ length: 5 }).map((_, i) => (
                <FiStar key={i} className={i < count ? "ar-star filled" : "ar-star"} />
            ))}
        </div>
    );
});

function AllReview({ product_id, onBack }) {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [selectedStar, setSelectedStar] = useState(5);

    useEffect(() => {
        if (!product_id) return;

        let cancelled = false;

        fetch(`${API}/api/user/review/all/${product_id}`)
            .then((r) => r.json())
            .then((data) => {
                if (!cancelled && data.success) setReviews(data.reviews || []);
            })
            .catch((err) => console.error("Reviews load error:", err.message));

        return () => { cancelled = true; };
    }, [product_id]);

    const countsByStar = useMemo(() => {
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach((r) => {
            const star = Math.round(Number(r.rating) || 0);
            if (star >= 1 && star <= 5) counts[star]++;
        });
        return counts;
    }, [reviews]);

    const filteredReviews = useMemo(
        () => reviews.filter((r) => Math.round(Number(r.rating)) === selectedStar),
        [reviews, selectedStar]
    );

    const handleBack = useCallback(() => {
        if (onBack) onBack();
        else navigate(-1);
    }, [onBack, navigate]);

    const handleStarFilter = useCallback((star) => setSelectedStar(star), []);

    return (
        <div className="allreview-page">
            <div className="allreview-header">
                <button className="allreview-back" onClick={handleBack} aria-label="Back">
                    <FiArrowLeft />
                </button>
                <h2 className="allreview-title">Customer Reviews</h2>
            </div>

            <div className="allreview-filters">
                {STAR_FILTERS.map((star) => {
                    const count = countsByStar[star];
                    const isActive = selectedStar === star;
                    return (
                        <button
                            key={star}
                            type="button"
                            className={`allreview-filter ${isActive ? "active" : ""}`}
                            onClick={() => handleStarFilter(star)}
                        >
                            <span className="allreview-filter-star">
                                {star} <FiStar />
                            </span>
                            <span className="allreview-filter-count">({count})</span>
                        </button>
                    );
                })}
            </div>

            <div className="allreview-list">
                {filteredReviews.length > 0 ? (
                    filteredReviews.map((review, index) => {
                        const safeName = getSafeName(review.full_name);
                        return (
                            <div
                                className="allreview-card"
                                key={review.rating_id || `${safeName}-${index}`}
                            >
                                <div className="allreview-top">
                                    {review.profile_image ? (
                                        <img
                                            src={review.profile_image}
                                            alt={safeName}
                                            className="allreview-avatar-img"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    ) : (
                                        <div className="allreview-avatar">{getInitial(safeName)}</div>
                                    )}
                                    <div className="allreview-user">
                                        <h3>{safeName}</h3>
                                        <Stars rating={review.rating} />
                                    </div>
                                </div>
                                <p className="allreview-message">{review.review_message || "No message."}</p>
                            </div>
                        );
                    })
                ) : (
                    <div className="allreview-empty">
                        <FiMessageSquare className="allreview-empty-icon" />
                        <h3>No Reviews Yet</h3>
                        <p>No customer has given a {selectedStar}-star review.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default memo(AllReview);