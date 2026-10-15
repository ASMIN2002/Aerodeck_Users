import "../DetailsDataStyle/WhyChoose.css";

const WHY_CHOOSE = [
    { icon: "🛡️", title: "Certified Products" },
    { icon: "🚚", title: "Fast Delivery" },
    { icon: "💳", title: "Secure Payment" },
    { icon: "🎁", title: "Premium Packaging" },
];

function WhyChoose() {
    return (
        <div className="dt-why">
            <h3>Why Choose HEEPIT?</h3>

            <div className="dt-why-grid">
                {WHY_CHOOSE.map((item) => (
                    <div className="dt-why-card" key={item.title}>
                        <div className="detwhy">
                            <div className="dt-why-icon">{item.icon}</div>
                            <h4>{item.title}</h4>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WhyChoose;