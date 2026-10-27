import { memo } from "react";
import {
    FiShield, FiTruck, FiCreditCard, FiGift, FiAward,
    FiHeart, FiUsers, FiGlobe, FiClock, FiThumbsUp,
} from "react-icons/fi";
import "../detailStyle/WhyChoose.css";

const WHY_CHOOSE = [
    { Icon: FiShield, title: "Certified Products", desc: "Quality verified at every step", color: "blue" },
    { Icon: FiTruck, title: "Lightning Fast Delivery", desc: "Dispatched within 24 hours", color: "amber" },
    { Icon: FiCreditCard, title: "100% Secure Payment", desc: "Encrypted transactions", color: "green" },
    { Icon: FiGift, title: "Premium Packaging", desc: "Gift-ready presentation", color: "purple" },
    { Icon: FiAward, title: "Trusted by Thousands", desc: "50,000+ happy customers", color: "orange" },
    { Icon: FiHeart, title: "Crafted with Love", desc: "Attention to every detail", color: "pink" },
    { Icon: FiUsers, title: "Dedicated Support", desc: "Real humans, real help", color: "teal" },
    { Icon: FiGlobe, title: "Pan-India Reach", desc: "Delivering to 19,000+ pincodes", color: "indigo" },
    { Icon: FiClock, title: "On-Time Promise", desc: "Every order, every time", color: "cyan" },
    { Icon: FiThumbsUp, title: "Easy Returns", desc: "Hassle-free policy", color: "rose" },
];

function WhyChoose() {
    return (
        <div className="dt-why">
            <div className="dt-why-header">
                <h3>Why Choose HEEPIT?</h3>
                <span className="dt-why-badge">Trusted Store</span>
            </div>

            <div className="dt-why-grid">
                {WHY_CHOOSE.map(({ Icon, title, desc, color }) => (
                    <div className={`dt-why-card dt-why-${color}`} key={title}>
                        <div className="dt-why-icon-wrap">
                            <Icon className="dt-why-icon" />
                        </div>
                        <div className="dt-why-content">
                            <h4>{title}</h4>
                            <p>{desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default memo(WhyChoose);