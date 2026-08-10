import "../DetailsDataStyle/WhyChoose.css";

function WhyChoose() {

    return (

        <div className="dt-why">

            <h3>Why Choose AERODECK?</h3>

            <div className="dt-why-grid">

                <div className="dt-why-card">
                    <div className="detwhy">
                        <div className="dt-why-icon">🛡️</div>
                        <h4>Certified Products</h4>
                    </div>

                </div>

                <div className="dt-why-card">
                    <div className="detwhy">
                        <div className="dt-why-icon">🚚</div>

                        <h4>Fast Delivery</h4>
                    </div>
                  
                </div>

                <div className="dt-why-card">
                    <div className="detwhy">
                        <div className="dt-why-icon">💳</div>

                        <h4>Secure Payment</h4>
                    </div>
                </div>

                <div className="dt-why-card">
                    <div className="detwhy">
                        <div className="dt-why-icon">🎁</div>

                        <h4>Premium Packaging</h4>
                    </div>
                </div>

            </div>

        </div>

    );

}

export default WhyChoose;