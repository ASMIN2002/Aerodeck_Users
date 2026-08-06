import { useEffect, useState } from "react";
import "./AllReview.css";
import { API } from "../../../services/api";

function AllReview({
    setDetailsPage,
    product_id
}) {
    const [summary, setSummary] = useState({});
    const [reviews, setReviews] = useState([]);
    const [selectedStar, setSelectedStar] = useState(5);
    const filteredReviews = reviews.filter(
        (review) => review.rating === selectedStar
    );

    useEffect(() => {

        async function loadReviews() {

            const response = await fetch(

                `${API}/api/user/review/all/${product_id}`

            );

            const data = await response.json();

            if (data.success) {
                setSummary(data.summary);
                setReviews(data.reviews);
            }
        }
        loadReviews();
    }, [product_id]);

    return (

        <div className="allreview-page">

            <div className="allreview-header">

                <button
                    className="allreview-back"
                    onClick={() => setDetailsPage("details")}
                >
                    ←
                </button>

                <div>

                    <h2>Customer Reviews</h2>

                </div>

            </div>

            <div className="review-filter">

                <button
                    className={`star-btn five ${selectedStar === 5 ? "active" : ""}`}
                    onClick={() => setSelectedStar(5)}
                >
                    5⭐ ({summary.five || 0})
                </button>

                <button
                    className={`star-btn four ${selectedStar === 4 ? "active" : ""}`}
                    onClick={() => setSelectedStar(4)}
                >
                    4⭐ ({summary.four || 0})
                </button>

                <button
                    className={`star-btn three ${selectedStar === 3 ? "active" : ""}`}
                    onClick={() => setSelectedStar(3)}
                >
                    3⭐ ({summary.three || 0})
                </button>

                <button
                    className={`star-btn two ${selectedStar === 2 ? "active" : ""}`}
                    onClick={() => setSelectedStar(2)}
                >
                    2⭐ ({summary.two || 0})
                </button>

                <button
                    className={`star-btn one ${selectedStar === 1 ? "active" : ""}`}
                    onClick={() => setSelectedStar(1)}
                >
                    1⭐ ({summary.one || 0})
                </button>

            </div>

            <div className="allreview-list">

                {

                    filteredReviews.length > 0 ? (

                        filteredReviews.map((review, index) => (

                            <div
                                className="allreview-card"
                                key={index}
                            >

                                <div className="allreview-top">

                                    {

                                        review.profile_image ? (

                                            <img
                                                src={review.profile_image}
                                                alt={review.full_name}
                                                className="allreview-avatar-image"
                                            />

                                        ) : (

                                            <div className="allreview-avatar">

                                                {

                                                    review.full_name
                                                        .charAt(0)
                                                        .toUpperCase()

                                                }

                                            </div>

                                        )

                                    }

                                    <div className="allreview-user">

                                        <h3>

                                            {review.full_name}

                                        </h3>

                                        <div className="allreview-rating">

                                            {"⭐".repeat(review.rating)}

                                        </div>

                                    </div>

                                </div>

                                <p className="allreview-message">

                                    {review.review_message}

                                </p>

                            </div>

                        ))

                    ) : (

                        <div className="no-review">

                            <h3>

                                No Reviews Yet

                            </h3>

                            <p>

                                No customer has given a {selectedStar} star review.

                            </p>

                        </div>

                    )

                }

            </div>

        </div>

    );

}

export default AllReview;