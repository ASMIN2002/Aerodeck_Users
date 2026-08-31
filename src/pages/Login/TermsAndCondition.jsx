import {
    FiArrowLeft,
    FiFileText
} from "react-icons/fi";

import "../../styles/TermsAndCondition.css";

function TermsAndCondition({ setPage }) {

    return (

        <div className="tac-container">

            <div className="tac-card">

                {/* HEADER */}

                <div className="tac-header">

                    <button
                        className="tac-back-btn"
                        onClick={() => setPage("register")}
                    >
                        <FiArrowLeft />
                    </button>

                    <div className="tac-title-area">

                        <div className="tac-icon">
                            <FiFileText />
                        </div>

                        <div>
                            <h1>
                                Terms & Conditions
                            </h1>

                            <p>
                                Please read carefully
                            </p>
                        </div>

                    </div>

                </div>


                {/* CONTENT */}

                <div className="tac-content">

                    <section className="tac-section">

                        <h2>
                            1. Acceptance of Terms
                        </h2>

                        <p>
                            By creating an account and using our platform,
                            you agree to comply with these Terms and
                            Conditions.
                        </p>

                    </section>


                    <section className="tac-section">

                        <h2>
                            2. Account Information
                        </h2>

                        <p>
                            You are responsible for providing accurate
                            information while creating your account and
                            maintaining the security of your account.
                        </p>

                    </section>


                    <section className="tac-section">

                        <h2>
                            3. User Responsibilities
                        </h2>

                        <p>
                            You agree not to misuse the platform, interfere
                            with its services, or attempt unauthorized access
                            to any system or account.
                        </p>

                    </section>


                    <section className="tac-section">

                        <h2>
                            4. Privacy
                        </h2>

                        <p>
                            Your personal information will be handled
                            according to our Privacy Policy and applicable
                            laws.
                        </p>

                    </section>


                    <section className="tac-section">

                        <h2>
                            5. Changes to Terms
                        </h2>

                        <p>
                            We may update these Terms and Conditions when
                            necessary. Continued use of the platform means
                            you accept the updated terms.
                        </p>

                    </section>

                </div>


                {/* FOOTER */}

                <div className="tac-footer">

                    <button
                        className="tac-understand-btn"
                        onClick={() => setPage("register")}
                    >
                        I UNDERSTAND
                    </button>

                </div>

            </div>

        </div>

    );

}

export default TermsAndCondition;