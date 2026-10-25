import { useEffect, useState } from "react";
import { FiStar, FiCheckCircle, FiCheck } from "react-icons/fi";
import { API } from "../../services/api";
import "../orderitemstyle/Rating.css";

const STARS = [1, 2, 3, 4, 5];
const MAX_REVIEW_LENGTH = 100;
const SUBMIT_FEEDBACK_DURATION = 1200;

const getSession = () => localStorage.getItem("session_token");

function Rating({ product_id, order_item_id }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [message, setMessage] = useState("");
    const [rated, setRated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");

    useEffect(() => {
        fetch(`${API}/api/user/review/${order_item_id}?session_token=${getSession()}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.success && data.rated) {
                    setRating(data.rating);
                    setMessage(data.review_message);
                    setRated(true);
                }
            })
            .catch((err) => console.error("Load review error:", err.message))
            .finally(() => setLoading(false));
    }, [order_item_id]);

    const handleSubmit = async () => {
        if (rating === 0 || !message.trim()) return;
        setSubmitting(true);

        try {
            const data = await fetch(`${API}/api/user/review`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_token: getSession(),
                    order_item_id,
                    product_id,
                    rating,
                    review_message: message,
                }),
            }).then((r) => r.json());

            if (data.success) {
                setSubmitMessage("Review submitted successfully");
                setTimeout(() => {
                    setRated(true);
                    setSubmitMessage("");
                    setSubmitting(false);
                }, SUBMIT_FEEDBACK_DURATION);
            } else {
                setSubmitting(false);
            }
        } catch (err) {
            console.error("Submit review error:", err.message);
            setSubmitting(false);
        }
    };

    if (loading) return null;

    if (rated && !submitting) {
        return (
            <div className="order-rating">
                <div className="rating-submitted">
                    <div className="rating-submitted-header">
                        <span className="rating-verified-badge">
                            <FiCheckCircle /> Verified Purchase
                        </span>
                    </div>

                    <div className="rating-stars-display">
                        {STARS.map((star) => (
                            <FiStar
                                key={star}
                                className={star <= rating ? "rating-star filled" : "rating-star"}
                            />
                        ))}
                    </div>

                    {message && <p className="rating-submitted-text">{message}</p>}
                </div>
            </div>
        );
    }

    const displayRating = hoverRating || rating;

    return (
        <div className="order-rating">
            {submitMessage && (
                <div className="rating-toast">
                    <FiCheckCircle /> {submitMessage}
                </div>
            )}

            {submitting && (
                <div className="rating-submitting">
                    <div className="rating-progress-bar">
                        <div className="rating-progress-fill" />
                    </div>
                    <p className="rating-progress-text">Submitting your review...</p>
                </div>
            )}

            {!submitting && (
                <>
                    <h3 className="rating-title">Rate this Product</h3>

                    <div className="rating-stars-input" onMouseLeave={() => setHoverRating(0)}>
                        {STARS.map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`rating-star-btn ${star <= displayRating ? "active" : ""}`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                aria-label={`Rate ${star} star`}
                            >
                                <FiStar />
                            </button>
                        ))}
                    </div>

                    <textarea
                        className="rating-textarea"
                        maxLength={MAX_REVIEW_LENGTH}
                        placeholder="Write your review..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <div className="rating-counter">
                        {message.length}/{MAX_REVIEW_LENGTH}
                    </div>

                    <button
                        type="button"
                        className="rating-submit-btn"
                        onClick={handleSubmit}
                        disabled={!message.trim() || rating === 0}
                    >
                        <FiCheck /> Submit Rating
                    </button>
                </>
            )}
        </div>
    );
}

export default Rating;