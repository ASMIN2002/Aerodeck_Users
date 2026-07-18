import "../DetailsDataStyle/RelatedProducts.css";

function RelatedProducts() {

    return (

        <div className="dt-related">

            <div className="dt-section-header">

                <h3>Related Products</h3>

                <button className="dt-view-all">
                    View All
                </button>

            </div>

            <div className="dt-related-scroll">

                <div className="dt-related-card">

                    <img
                        src="https://placehold.co/300x300"
                        alt=""
                    />

                    <h4>Wedding Card</h4>

                    <p>₹950</p>

                </div>

                <div className="dt-related-card">

                    <img
                        src="https://placehold.co/300x300"
                        alt=""
                    />

                    <h4>Birthday Card</h4>

                    <p>₹650</p>

                </div>

                <div className="dt-related-card">

                    <img
                        src="https://placehold.co/300x300"
                        alt=""
                    />

                    <h4>Gift Box</h4>

                    <p>₹799</p>

                </div>

            </div>

        </div>

    );

}

export default RelatedProducts;