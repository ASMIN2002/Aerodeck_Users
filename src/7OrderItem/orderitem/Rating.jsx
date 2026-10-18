import "../orderitemstyle/Rating.css";
import { useEffect, useState } from "react";
import { API } from "../../services/api";

const STARS = [1, 2, 3, 4, 5];
const MAX_REVIEW_LENGTH = 20;
const SUBMIT_FEEDBACK_DURATION = 1200;

function getSessionToken() {
    return localStorage.getItem("session_token");
}

function Rating({ product_id, order_item_id }) {
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState("");
    const [rated, setRated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");

    useEffect(() => {
        loadReview();
    }, [product_id]);

    const loadReview = async () => {
        try {
            const res = await fetch(
                `${API}/api/user/review/${order_item_id}?session_token=${getSessionToken()}`
            );
            const data = await res.json();

            if (data.success && data.rated) {
                setRating(data.rating);
                setMessage(data.review_message);
                setRated(true);
            }
        } catch (err) {
            console.error("Load review error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (rating === 0) return;
        if (!message.trim()) return;

        setSubmitting(true);

        try {
            const res = await fetch(`${API}/api/user/review`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_token: getSessionToken(),
                    order_item_id,
                    product_id,
                    rating,
                    review_message: message,
                }),
            });
            const data = await res.json();

            if (data.success) {
                setSubmitMessage("✓ Review submitted successfully");

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
                <div className="submitted-review">
                    <div className="submitted-stars">
                        {STARS.map((star) => (
                            <span
                                key={star}
                                className={star <= rating ? "filled-star" : "empty-star"}
                            >
                                ★
                            </span>
                        ))}
                    </div>

                    {message && (
                        <p className="submitted-message">{message}</p>
                    )}

                    <div className="submitted-badge">✓ Verified Purchase</div>
                </div>
            </div>
        );
    }

    return (
        <div className="order-rating">
            {submitMessage && <div className="review-toast">{submitMessage}</div>}

            {submitting && (
                <div className="review-progress-wrap">
                    <div className="review-progress-bar">
                        <div className="review-progress-fill" />
                    </div>
                    <p className="review-progress-text">Submitting your review...</p>
                </div>
            )}

            {!submitting && (
                <>
                    <h3>Rate this Product</h3>

                    <div className="rating-stars">
                        {STARS.map((star) => (
                            <span
                                key={star}
                                className={star <= rating ? "active-star" : ""}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>

                    <textarea
                        className="review-box"
                        maxLength={MAX_REVIEW_LENGTH}
                        placeholder="Write your review..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <div className="review-count">
                        {message.length}/{MAX_REVIEW_LENGTH}
                    </div>

                    <button
                        className="submit-rating"
                        onClick={handleSubmit}
                        disabled={!message.trim() || rating === 0}
                    >
                        Submit Rating
                    </button>
                </>
            )}
        </div>
    );
}

export default Rating;