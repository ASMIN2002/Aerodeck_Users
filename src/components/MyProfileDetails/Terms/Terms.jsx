import { useNavigate } from "react-router-dom";
import "./Terms.css";

const TERMS_SECTIONS = [
    {
        title: "1. Introduction",
        paragraphs: [
            "Welcome to HEEPIT. These Terms & Conditions explain the rules and conditions for using the HEEPIT platform, application, products and services.",
            "By accessing or using HEEPIT, you agree to follow these Terms & Conditions.",
        ],
    },
    {
        title: "2. About HEEPIT",
        paragraphs: [
            "HEEPIT is an e-commerce platform designed to make purchasing products simple, convenient and accessible.",
            "HEEPIT may introduce new features, services, offers and other functionality from time to time.",
        ],
    },
    {
        title: "3. User Account",
        paragraphs: [
            "Users are responsible for providing accurate information while creating and using their HEEPIT account.",
            "Users are also responsible for maintaining the security of their account.",
        ],
    },
    {
        title: "4. Products & Pricing",
        paragraphs: [
            "Product names, descriptions, images, prices and availability may change from time to time.",
            "HEEPIT reserves the right to correct pricing, product information or availability errors.",
        ],
    },
    {
        title: "5. Orders",
        paragraphs: [
            "Customers must provide correct delivery and order information when placing an order.",
            "Orders may be cancelled or modified in certain circumstances including product availability or incorrect information.",
        ],
    },
    {
        title: "6. Payments",
        paragraphs: [
            "Customers are responsible for completing payment using the payment methods provided by HEEPIT.",
        ],
    },
    {
        title: "7. Delivery",
        paragraphs: [
            "Delivery availability depends on the service areas supported by HEEPIT.",
            "Delivery times may vary depending on location, product availability and other circumstances.",
        ],
    },
    {
        title: "8. Returns & Refunds",
        paragraphs: [
            "Return and refund eligibility may depend on the product and the applicable HEEPIT return policy.",
        ],
    },
    {
        title: "9. Offers & Promotions",
        paragraphs: [
            "HEEPIT may provide discounts, promotional offers and other benefits from time to time.",
            "Promotional offers may have specific eligibility, validity periods or usage limits.",
        ],
    },
    {
        title: "10. Prohibited Activities",
        paragraphs: [
            "Users must not misuse HEEPIT, attempt unauthorized access, interfere with the platform or use the platform for unlawful purposes.",
        ],
    },
    {
        title: "11. Privacy",
        paragraphs: [
            "HEEPIT may process information required to provide services, manage accounts and process orders.",
        ],
    },
    {
        title: "12. Changes to These Terms",
        paragraphs: [
            "HEEPIT may update these Terms & Conditions when necessary.",
            "Updated terms may become effective after they are published on the platform.",
        ],
    },
];

function Terms({ setProfilePage }) {
    const navigate = useNavigate();

    const handleBack = () => {
        setProfilePage("profile");
        navigate("/profile", { replace: true });
    };

    return (
        <div className="terms-page">
            <header className="terms-header">
                <button className="terms-back" onClick={handleBack}>
                    ←
                </button>

                <div className="terms-header-title">
                    <h1>Terms & Conditions</h1>
                    <span>HEEPIT</span>
                </div>
            </header>

            <main className="terms-content">
                {TERMS_SECTIONS.map((section) => (
                    <section className="terms-section" key={section.title}>
                        <h2>{section.title}</h2>
                        {section.paragraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </section>
                ))}

                <section className="terms-last-note">
                    <strong>HEEPIT</strong>
                    <p>Thank you for using HEEPIT.</p>
                </section>
            </main>
        </div>
    );
}

export default Terms;