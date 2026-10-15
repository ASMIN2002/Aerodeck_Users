import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../DetailsDataStyle/AllReview.css";
import { API } from "../../../services/api";

const STAR_FILTERS = [
    { value: 5, key: "five", label: "five" },
    { value: 4, key: "four", label: "four" },
    { value: 3, key: "three", label: "three" },
    { value: 2, key: "two", label: "two" },
    { value: 1, key: "one", label: "one" },
];

function getSafeName(name) {
    return name && name.trim() ? name.trim() : "Anonymous";
}

function renderStars(rating) {
    return "⭐".repeat(Number(rating) || 0);
}

function AllReview({ product_id }) {
    const navigate = useNavigate();

    const [summary, setSummary] = useState({});
    const [reviews, setReviews] = useState([]);
    const [selectedStar, setSelectedStar] = useState(5);

    useEffect(() => {
        if (!product_id) return;

        async function loadReviews() {
            try {
                const res = await fetch(
                    `${API}/api/user/review/all/${product_id}`
                );
                const data = await res.json();

                if (data.success) {
                    setSummary(data.summary || {});
                    setReviews(data.reviews || []);
                }
            } catch (err) {
                console.error("Reviews load error:", err.message);
            }
        }

        loadReviews();
    }, [product_id]);

    const filteredReviews = useMemo(
        () =>
            reviews.filter(
                (review) => Number(review.rating) === Number(selectedStar)
            ),
        [reviews, selectedStar]
    );

    return (
        <div className="allreview-page">
            <div className="allreview-header">
                <button
                    className="allreview-back"
                    onClick={() => navigate(-1)}
                >
                    ←
                </button>

                <div>
                    <h2>Customer Reviews</h2>
                </div>
            </div>

            <div className="review-filter">
                {STAR_FILTERS.map((star) => (
                    <button
                        key={star.value}
                        className={`star-btn ${star.label} ${selectedStar === star.value ? "active" : ""}`}
                        onClick={() => setSelectedStar(star.value)}
                    >
                        {star.value}⭐ ({summary[star.key] || 0})
                    </button>
                ))}
            </div>

            <div className="allreview-list">
                {filteredReviews.length > 0 ? (
                    filteredReviews.map((review, index) => {
                        const safeName = getSafeName(review.full_name);

                        return (
                            <div
                                className="allreview-card"
                                key={`${safeName}-${index}`}
                            >
                                <div className="allreview-top">
                                    {review.profile_image ? (
                                        <img
                                            src={review.profile_image}
                                            alt={safeName}
                                            className="allreview-avatar-image"
                                        />
                                    ) : (
                                        <div className="allreview-avatar">
                                            {safeName.charAt(0).toUpperCase()}
                                        </div>
                                    )}

                                    <div className="allreview-user">
                                        <h3>{safeName}</h3>

                                        <div className="allreview-rating">
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>
                                </div>

                                <p className="allreview-message">
                                    {review.review_message || "No message."}
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <div className="no-review">
                        <h3>No Reviews Yet</h3>
                        <p>
                            No customer has given a {selectedStar} star review.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AllReview;