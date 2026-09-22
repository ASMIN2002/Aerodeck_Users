import "./Rating.css";
import { useEffect, useState } from "react";
import { API } from "../../../../services/api";

function Rating({ product_id, order_item_id }) {

    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState("");
    const [rated, setRated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const [toast, setToast] = useState(false);

    useEffect(() => {
        loadReview();
    }, [product_id]);

    const loadReview = async () => {
        try {
            const sessionToken = localStorage.getItem("session_token");

            const response = await fetch(
                `${API}/api/user/review/${order_item_id}?session_token=${sessionToken}`
            );

            const data = await response.json();

            if (data.success && data.rated) {
                setRating(data.rating);
                setMessage(data.review_message);
                setRated(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {

        if (rating === 0) return;
        if (!message.trim()) return;

        setSubmitting(true);

        try {
            const sessionToken = localStorage.getItem("session_token");

            const response = await fetch(
                `${API}/api/user/review`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        session_token: sessionToken,
                        order_item_id,
                        product_id,
                        rating,
                        review_message: message
                    })
                }
            );

            const data = await response.json();

            if (data.success) {
                setSubmitMessage("✓ Review submitted successfully");

                setTimeout(() => {
                    setRated(true);
                    setSubmitMessage("");
                    setSubmitting(false);
                }, 1200);
            } else {
                setSubmitting(false);
            }
        } catch (err) {
            console.error(err);
            setSubmitting(false);
        }
    };

    if (loading) return null;

    /* ==========================================
       ✅ ALREADY RATED — Sirf review card dikhao
       ========================================== */
    if (rated && !submitting) {
        return (
            <div className="order-rating">
                <div className="submitted-review">

                    {/* ✅ User ka rating (stars) */}
                    <div className="submitted-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={star <= rating ? "filled-star" : "empty-star"}
                            >
                                ★
                            </span>
                        ))}
                    </div>

                    {/* ✅ User ka review message */}
                    {message && (
                        <p className="submitted-message">
                            {message}
                        </p>
                    )}

                    {/* ✅ Verified badge */}
                    <div className="submitted-badge">
                        ✓ Verified Purchase
                    </div>
                </div>
            </div>
        );
    }

    /* ==========================================
       ✅ INPUT FORM — Jab tak submit nahi hua
       ========================================== */
    return (
        <div className="order-rating">

            {submitMessage && (
                <div className="review-toast">
                    {submitMessage}
                </div>
            )}

            {submitting && (
                <div className="review-progress-wrap">
                    <div className="review-progress-bar">
                        <div className="review-progress-fill"></div>
                    </div>
                    <p className="review-progress-text">
                        Submitting your review...
                    </p>
                </div>
            )}

            {!submitting && (
                <>
                    <h3>Rate this Product</h3>

                    <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={star <= rating ? "active-star" : ""}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>

                    {toast && (
                        <div className="review-toast">
                            💙 Your review is very helpful for other users.
                        </div>
                    )}

                    <textarea
                        className="review-box"
                        maxLength={20}
                        placeholder="Write your review..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <div className="review-count">
                        {message.length}/20
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