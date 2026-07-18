import "../DetailsDataStyle/WhyChoose.css";

function WhyChoose() {

    return (

        <div className="dt-why">

            <h3>Why Choose AERODECK?</h3>

            <div className="dt-why-grid">

                <div className="dt-why-card">

                    <div className="dt-why-icon">🛡️</div>

                    <h4>Certified Products</h4>

                    <p>
                        Every product is quality checked before delivery.
                    </p>

                </div>

                <div className="dt-why-card">

                    <div className="dt-why-icon">🚚</div>

                    <h4>Fast Delivery</h4>

                    <p>
                        Quick and secure delivery to your doorstep.
                    </p>

                </div>

                <div className="dt-why-card">

                    <div className="dt-why-icon">💳</div>

                    <h4>Secure Payment</h4>

                    <p>
                        Safe payment experience with trusted methods.
                    </p>

                </div>

                <div className="dt-why-card">

                    <div className="dt-why-icon">🎁</div>

                    <h4>Premium Packaging</h4>

                    <p>
                        Beautiful packaging for every order.
                    </p>

                </div>

            </div>

        </div>

    );

}

export default WhyChoose;