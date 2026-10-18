import "../detailStyle/Features.css";

const FEATURES = [
    { icon: "🎨", label: "Fully Customizable" },
    { icon: "💎", label: "Premium Finish" },
    { icon: "🚚", label: "Fast Delivery" },
    { icon: "🛡️", label: "Certified Quality" },
];

function Features() {
    return (
        <div className="dt-features">
            <h3>Features</h3>

            <div className="dt-feature-grid">
                {FEATURES.map((feature) => (
                    <div className="dt-feature-card" key={feature.label}>
                        {feature.icon}
                        <span>{feature.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Features;