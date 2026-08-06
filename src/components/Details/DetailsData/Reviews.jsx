import { useEffect, useState } from "react";
import { API } from "../../../services/api";
import "../DetailsDataStyle/Reviews.css";

function Reviews({

    onViewAll,

    product_id

}) {
    const [reviews, setReviews] = useState([]);
    useEffect(() => {

        async function loadReviews() {

            const response = await fetch(

                `${API}/api/user/review/top/${product_id}`

            );

            const data = await response.json();

            if (data.success) {

                setReviews(data.reviews);

            }

        }

        loadReviews();

    }, [product_id]);

    return (

        <div className="dt-reviews">

            <div className="dt-section-header">

                <h4>Customer Reviews</h4>

                <button
                    className="dt-view-all"
                    onClick={onViewAll}
                >
                    View All
                </button>

            </div>

            <div className="dt-review-scroll">

                {

                    reviews.length > 0 ? (

                        reviews.map((review, index) => (

                            <div
                                className="dt-review-card"
                                key={index}
                            >

                                <div className="dt-review-top">

                                    {

                                        review.profile_image ? (

                                            <img
                                                src={review.profile_image}
                                                alt={review.full_name}
                                                className="dt-review-avatar-img"
                                            />

                                        ) : (

                                            <div className="dt-review-avatar">

                                                {

                                                    review.full_name
                                                        .charAt(0)
                                                        .toUpperCase()

                                                }

                                            </div>

                                        )

                                    }

                                    <div>

                                        <h4>

                                            {review.full_name}

                                        </h4>

                                        <span>

                                            {"⭐".repeat(review.rating)}

                                        </span>

                                    </div>

                                </div>

                                <p>

                                    {review.review_message}

                                </p>

                            </div>

                        ))

                    ) : (

                        <div className="dt-review-card">

                            <div className="dt-review-top">

                                <div className="dt-review-avatar">
                                    ⭐
                                </div>

                                <div>

                                    <h4>

                                        No Reviews Yet

                                    </h4>

                                </div>

                            </div>

                            <p>

                                Be the first customer to review this product.

                            </p>

                        </div>

                    )

                }

            </div>

        </div>

    );

}

export default Reviews;