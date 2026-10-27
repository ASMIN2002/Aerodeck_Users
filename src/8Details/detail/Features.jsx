import { memo } from "react";
import {
    FiSliders, FiAward, FiTruck, FiShield, FiZap, FiCheckCircle,
    FiStar, FiLock, FiRefreshCw, FiClock, FiGift, FiHeadphones,
    FiPackage, FiHeart,
} from "react-icons/fi";
import "../detailStyle/Features.css";

const FEATURES = [
    { Icon: FiSliders, label: "Fully Customizable", color: "blue" },
    { Icon: FiAward, label: "Premium Finish", color: "amber" },
    { Icon: FiTruck, label: "Fast Delivery", color: "green" },
    { Icon: FiShield, label: "Certified Quality", color: "purple" },
    { Icon: FiZap, label: "Instant Dispatch", color: "orange" },
    { Icon: FiCheckCircle, label: "100% Authentic", color: "teal" },
    { Icon: FiStar, label: "Top Rated", color: "yellow" },
    { Icon: FiLock, label: "Secure Payment", color: "indigo" },
    { Icon: FiRefreshCw, label: "Easy Returns", color: "cyan" },
    { Icon: FiClock, label: "24/7 Support", color: "pink" },
    { Icon: FiGift, label: "Free Gift Wrap", color: "rose" },
    { Icon: FiHeadphones, label: "Customer Care", color: "violet" },
    { Icon: FiPackage, label: "Safe Packaging", color: "emerald" },
    { Icon: FiHeart, label: "Handcrafted", color: "red" },
];

function Features() {
    return (
        <div className="dt-features">
            <div className="dt-features-header">
                <h3>Why You'll Love It</h3>
                <span className="dt-features-badge">
                    <FiZap /> Premium Features
                </span>
            </div>

            <div className="dt-feature-grid">
                {FEATURES.map(({ Icon, label, color }) => (
                    <div className={`dt-feature-card dt-feature-${color}`} key={label}>
                        <div className="dt-feature-icon-wrap">
                            <Icon className="dt-feature-icon" />
                        </div>
                        <span className="dt-feature-label">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default memo(Features);