import "./HelpAndSupport.css";

function HelpAndSupport({

    setProfilePage

}) {

    return (

        <div className="helpsupport">

            <div className="help-header">

                <button
                    className="help-back"
                    onClick={() => setProfilePage("profile")}
                >
                    ←
                </button>

                <h2>
                    Help & Support
                </h2>

            </div>

            <div className="help-card">

                <span className="help-icon">
                    ❓
                </span>

                <div>

                    <h3>
                        Frequently Asked Questions
                    </h3>

                    <p>
                        Find answers to common questions.
                    </p>

                </div>

            </div>

            <div className="help-card">

                <span className="help-icon">
                    💬
                </span>

                <div>

                    <h3>
                        Live Chat
                    </h3>

                    <p>
                        Chat with our support team.
                    </p>

                </div>

            </div>

            <div className="help-card">

                <span className="help-icon">
                    📞
                </span>

                <div>

                    <h3>
                        Call Support
                    </h3>

                    <p>
                        +91 98765 43210
                    </p>

                </div>

            </div>

            <div className="help-card">

                <span className="help-icon">
                    ✉️
                </span>

                <div>

                    <h3>
                        Email Support
                    </h3>

                    <p>
                        support@aerodeck.in
                    </p>

                </div>

            </div>

        </div>

    );

}

export default HelpAndSupport;