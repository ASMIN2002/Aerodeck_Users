import "../DetailsDataStyle/Reviews.css";

function Reviews() {

    return (

        <div className="dt-reviews">

            <div className="dt-section-header">

                <h3>Customer Reviews</h3>

                <button className="dt-view-all">
                    View All
                </button>

            </div>

            <div className="dt-review-scroll">

                <div className="dt-review-card">

                    <div className="dt-review-top">

                        <div className="dt-review-avatar">
                            A
                        </div>

                        <div>
                            <h4>Asmin Jena</h4>
                            <span>⭐⭐⭐⭐⭐</span>
                        </div>

                    </div>

                    <p>
                        Excellent quality. Printing and finishing are amazing.
                    </p>

                </div>

                <div className="dt-review-card">

                    <div className="dt-review-top">

                        <div className="dt-review-avatar">
                            P
                        </div>

                        <div>
                            <h4>Priya</h4>
                            <span>⭐⭐⭐⭐⭐</span>
                        </div>

                    </div>

                    <p>
                        Worth buying. Delivery was fast and premium packing.
                    </p>

                </div>

            </div>

        </div>

    );

}

export default Reviews;