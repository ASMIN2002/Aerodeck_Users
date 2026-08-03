import "./Rating.css";
import { useEffect, useState } from "react";
import { API } from "../../../../services/api";

function Rating({ product_id }) {

    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState("");
    const [rated, setRated] = useState(false);

    const [loading, setLoading] = useState(true);

    const [toast, setToast] = useState(false);

    useEffect(() => {

        loadReview();

    }, [product_id]);

    const loadReview = async () => {

        try {

            const sessionToken =
                localStorage.getItem("session_token");

            const response = await fetch(

                `${API}/api/user/review/${product_id}?session_token=${sessionToken}`

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

        if (rating === 0) {

            alert("Please select rating.");

            return;

        }

        try {

            const sessionToken =
                localStorage.getItem("session_token");

            const response = await fetch(

                `${API}/api/user/review`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        session_token: sessionToken,

                        product_id,

                        rating,

                        review_message: message

                    })

                }

            );

            const data = await response.json();

            if (data.success) {

                setRated(true);

                setToast(true);

                setTimeout(() => {

                    setToast(false);

                }, 3000);

            } else {

                alert(data.message);

            }

        } catch (err) {

            console.error(err);

        }

    };

    if (loading) {

        return null;

    }

    return (

        <div className="order-rating">

            <h3>

                Rate this Product

            </h3>

            <div className="rating-stars">

                {

                    [1, 2, 3, 4, 5].map((star) => (

                        <span

                            key={star}

                            className={
                                star <= rating
                                    ? "active-star"
                                    : ""
                            }

                            onClick={() => {

                                if (!rated) {

                                    setRating(star);

                                }

                            }}

                        >

                            ★

                        </span>

                    ))

                }

            </div>

            {

                !rated && (

                    <>

                        {

                            toast && (

                                <div className="review-toast">

                                    💙 Your review is very helpful for other users.

                                </div>

                            )

                        }

                        <textarea

                            className="review-box"

                            maxLength={20}

                            placeholder="Write your review..."

                            value={message}

                            onChange={(e) => {

                                setMessage(e.target.value);

                            }}

                        />

                        <div className="review-count">

                            {message.length}/20

                        </div>

                        <button

                            className="submit-rating"

                            onClick={handleSubmit}

                        >

                            Submit Rating

                        </button>

                    </>

                )

            }

            {

                rated && (

                    <div className="submitted-review">

                        <h4>

                            Your Review

                        </h4>

                        <p>

                            {

                                message ||

                                "No review message."

                            }

                        </p>

                    </div>

                )

            }

        </div>

    );

}

export default Rating;