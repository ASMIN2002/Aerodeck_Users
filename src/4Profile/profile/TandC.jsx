import { useNavigate } from "react-router-dom";
import {
    FiArrowLeft, FiBookOpen, FiUser, FiShoppingBag, FiPackage, FiCreditCard,
    FiTruck, FiRefreshCw, FiTag, FiAlertTriangle, FiLock, FiFileText,
    FiInfo, FiHeart, FiCheckCircle, FiMail, FiShield, FiCalendar,
} from "react-icons/fi";
import "../profilestyles/TandC.css";

const TERMS_SECTIONS = [
    {
        Icon: FiBookOpen, color: "blue",
        title: "1. Introduction",
        paragraphs: [
            "Welcome to HEEPIT. These Terms & Conditions explain the rules and conditions for using the HEEPIT platform, application, products and services.",
            "By accessing or using HEEPIT, you agree to follow these Terms & Conditions. If you do not agree with any part of these terms, please discontinue use of the platform.",
        ],
    },
    {
        Icon: FiInfo, color: "cyan",
        title: "2. About HEEPIT",
        paragraphs: [
            "HEEPIT is an e-commerce platform designed to make purchasing products simple, convenient and accessible.",
            "HEEPIT may introduce new features, services, offers and other functionality from time to time. These Terms apply to all current and future features of the platform.",
        ],
    },
    {
        Icon: FiUser, color: "indigo",
        title: "3. User Account",
        paragraphs: [
            "Users are responsible for providing accurate information while creating and using their HEEPIT account.",
            "Users are also responsible for maintaining the security of their account, including keeping login credentials confidential.",
            "Any activity performed under your account is your responsibility. Notify HEEPIT immediately if you suspect unauthorized access.",
        ],
    },
    {
        Icon: FiShoppingBag, color: "amber",
        title: "4. Products & Pricing",
        paragraphs: [
            "Product names, descriptions, images, prices and availability may change from time to time.",
            "HEEPIT reserves the right to correct pricing, product information or availability errors.",
            "While we strive for accuracy, product images are for reference purposes and actual products may vary slightly.",
        ],
    },
    {
        Icon: FiPackage, color: "orange",
        title: "5. Orders",
        paragraphs: [
            "Customers must provide correct delivery and order information when placing an order.",
            "Orders may be cancelled or modified in certain circumstances including product availability or incorrect information.",
            "Once an order is placed, you will receive an order confirmation. This does not constitute final acceptance of the order.",
        ],
    },
    {
        Icon: FiCreditCard, color: "green",
        title: "6. Payments",
        paragraphs: [
            "Customers are responsible for completing payment using the payment methods provided by HEEPIT.",
            "All payments are subject to verification and fraud prevention checks. Cash on Delivery may be available in select areas.",
            "Payment must be completed in full before an order is dispatched unless Cash on Delivery is selected.",
        ],
    },
    {
        Icon: FiTruck, color: "teal",
        title: "7. Delivery",
        paragraphs: [
            "Delivery availability depends on the service areas supported by HEEPIT.",
            "Delivery times may vary depending on location, product availability and other circumstances beyond our control.",
            "Estimated delivery dates are provided as guidance and are not guaranteed.",
        ],
    },
    {
        Icon: FiRefreshCw, color: "purple",
        title: "8. Returns & Refunds",
        paragraphs: [
            "Return and refund eligibility may depend on the product and the applicable HEEPIT return policy.",
            "Products must be returned in their original condition, with packaging and tags intact, unless the product is damaged or defective.",
            "Refunds are processed within a reasonable time after inspection and approval of the return.",
        ],
    },
    {
        Icon: FiTag, color: "pink",
        title: "9. Offers & Promotions",
        paragraphs: [
            "HEEPIT may provide discounts, promotional offers and other benefits from time to time.",
            "Promotional offers may have specific eligibility, validity periods or usage limits.",
            "HEEPIT reserves the right to modify or withdraw offers at any time without prior notice.",
        ],
    },
    {
        Icon: FiAlertTriangle, color: "red",
        title: "10. Prohibited Activities",
        paragraphs: [
            "Users must not misuse HEEPIT, attempt unauthorized access, interfere with the platform or use the platform for unlawful purposes.",
            "Prohibited activities include fraud, impersonation, spreading malware, scraping data, or any action that could harm other users or HEEPIT.",
        ],
    },
    {
        Icon: FiLock, color: "slate",
        title: "11. Privacy",
        paragraphs: [
            "HEEPIT may process information required to provide services, manage accounts and process orders.",
            "Your personal information is handled in accordance with our Privacy Policy. We do not sell your personal data to third parties.",
            "By using HEEPIT, you consent to the collection and use of information as described in this section.",
        ],
    },
    {
        Icon: FiFileText, color: "violet",
        title: "12. Changes to These Terms",
        paragraphs: [
            "HEEPIT may update these Terms & Conditions when necessary.",
            "Updated terms may become effective after they are published on the platform.",
            "It is your responsibility to review these terms periodically to stay informed of any changes.",
        ],
    },
];

const QUICK_INFO = [
    { Icon: FiCalendar, label: "Last Updated", value: "January 2026" },
    { Icon: FiShield, label: "Version", value: "1.0" },
    { Icon: FiCheckCircle, label: "Sections", value: "12" },
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
                <button className="terms-back" onClick={handleBack} aria-label="Back">
                    <FiArrowLeft />
                </button>
                <div className="terms-header-title">
                    <h1>Terms & Conditions</h1>
                    <span>HEEPIT</span>
                </div>
            </header>

            <div className="terms-hero">
                <div className="terms-hero-icon"><FiFileText /></div>
                <span className="terms-hero-eyebrow">Legal Document</span>
                <h2>Read our Terms & Conditions</h2>
                <p>Please review these terms carefully before using HEEPIT.</p>
            </div>

            <div className="terms-quick-info">
                {QUICK_INFO.map(({ Icon, label, value }) => (
                    <div className="terms-info-card" key={label}>
                        <span className="terms-info-icon"><Icon /></span>
                        <span className="terms-info-label">{label}</span>
                        <strong className="terms-info-value">{value}</strong>
                    </div>
                ))}
            </div>

            <main className="terms-content">
                {TERMS_SECTIONS.map(({ Icon, color, title, paragraphs }) => (
                    <section className={`terms-section terms-section-${color}`} key={title}>
                        <div className="terms-section-header">
                            <span className="terms-section-icon"><Icon /></span>
                            <h2 className="terms-section-title">{title}</h2>
                        </div>
                        <div className="terms-section-body">
                            {paragraphs.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                    </section>
                ))}

                <section className="terms-last-note">
                    <div className="terms-last-icon"><FiHeart /></div>
                    <strong>Thank you for choosing HEEPIT</strong>
                    <p>If you have any questions about these Terms, please reach out to us at <a href="mailto:heepit.official@gmail.com">heepit.official@gmail.com</a>.</p>
                    <div className="terms-last-footer">
                        <FiMail /> heepit.official@gmail.com
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Terms;