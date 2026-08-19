import React from "react";
import "./Terms.css";

function Terms({ setProfilePage }) {

    const handleBack = () => {
        setProfilePage("profile");
    };

    return (
        <div className="terms-page">

            <header className="terms-header">

                <button
                    type="button"
                    className="terms-back-btn"
                    onClick={handleBack}
                >
                    ←
                </button>

                <div className="terms-header-title">
                    <h1>Terms & Conditions</h1>
                    <span>HEEPIT</span>
                </div>

            </header>


            <main className="terms-content">

                <section className="terms-section">
                    <h2>1. Introduction</h2>

                    <p>
                        Welcome to HEEPIT. These Terms & Conditions
                        explain the rules and conditions for using the
                        HEEPIT platform, application, products and services.
                    </p>

                    <p>
                        By accessing or using HEEPIT, you agree to follow
                        these Terms & Conditions.
                    </p>
                </section>


                <section className="terms-section">
                    <h2>2. About HEEPIT</h2>

                    <p>
                        HEEPIT is an e-commerce platform designed to make
                        purchasing products simple, convenient and accessible.
                    </p>

                    <p>
                        HEEPIT may introduce new features, services,
                        offers and other functionality from time to time.
                    </p>
                </section>


                <section className="terms-section">
                    <h2>3. User Account</h2>

                    <p>
                        Users are responsible for providing accurate
                        information while creating and using their HEEPIT
                        account.
                    </p>

                    <p>
                        Users are also responsible for maintaining the
                        security of their account.
                    </p>
                </section>


                <section className="terms-section">
                    <h2>4. Products & Pricing</h2>

                    <p>
                        Product names, descriptions, images, prices and
                        availability may change from time to time.
                    </p>

                    <p>
                        HEEPIT reserves the right to correct pricing,
                        product information or availability errors.
                    </p>
                </section>


                <section className="terms-section">
                    <h2>5. Orders</h2>

                    <p>
                        Customers must provide correct delivery and
                        order information when placing an order.
                    </p>

                    <p>
                        Orders may be cancelled or modified in certain
                        circumstances including product availability
                        or incorrect information.
                    </p>
                </section>


                <section className="terms-section">
                    <h2>6. Payments</h2>

                    <p>
                        Customers are responsible for completing payment
                        using the payment methods provided by HEEPIT.
                    </p>
                </section>


                <section className="terms-section">
                    <h2>7. Delivery</h2>

                    <p>
                        Delivery availability depends on the service
                        areas supported by HEEPIT.
                    </p>

                    <p>
                        Delivery times may vary depending on location,
                        product availability and other circumstances.
                    </p>
                </section>


                <section className="terms-section">
                    <h2>8. Returns & Refunds</h2>

                    <p>
                        Return and refund eligibility may depend on the
                        product and the applicable HEEPIT return policy.
                    </p>
                </section>


                <section className="terms-section">
                    <h2>9. Offers & Promotions</h2>

                    <p>
                        HEEPIT may provide discounts, promotional offers
                        and other benefits from time to time.
                    </p>

                    <p>
                        Promotional offers may have specific eligibility,
                        validity periods or usage limits.
                    </p>
                </section>


                <section className="terms-section">
                    <h2>10. Prohibited Activities</h2>

                    <p>
                        Users must not misuse HEEPIT, attempt unauthorized
                        access, interfere with the platform or use the
                        platform for unlawful purposes.
                    </p>
                </section>


                <section className="terms-section">
                    <h2>11. Privacy</h2>

                    <p>
                        HEEPIT may process information required to provide
                        services, manage accounts and process orders.
                    </p>
                </section>


                <section className="terms-section">
                    <h2>12. Changes to These Terms</h2>

                    <p>
                        HEEPIT may update these Terms & Conditions when
                        necessary.
                    </p>

                    <p>
                        Updated terms may become effective after they are
                        published on the platform.
                    </p>
                </section>


                {/* ADD FUTURE SECTIONS HERE */}

                <section className="terms-last-note">
                    <strong>HEEPIT</strong>

                    <p>
                        Thank you for using HEEPIT.
                    </p>
                </section>

            </main>

        </div>
    );
}

export default Terms;
