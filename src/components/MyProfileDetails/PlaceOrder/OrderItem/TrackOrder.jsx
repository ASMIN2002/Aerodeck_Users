import "./TrackOrder.css";

function TrackOrder({
    orderStatus
}) {
    const steps = [
        "PLACED",
        "PACKED",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED"
    ];

    const currentStep = steps.indexOf(orderStatus);

    return (

        <div className="track-order">

            <h3 className="track-title">
                🚚 Track Order - {orderStatus}
            </h3>

            <div className="track-line">

                <div
                    className={`track-step ${currentStep >= 0 ? "completed" : ""
                        }`}
                >
                    <div className="track-circle"></div>
                    <span>PLACED</span>
                </div>

                <div
                    className={`track-step ${currentStep >= 1 ? "completed" : ""
                        }`}
                >
                    <div className="track-circle"></div>
                    <span>PACKED</span>
                </div>

                <div
                    className={`track-step ${currentStep >= 2
                        ? "completed"
                        : currentStep === 2
                            ? "active"
                            : ""
                        }`}
                >
                    <div className="track-circle"></div>
                    <span>SHIPPED</span>
                </div>

                <div
                    className={`track-step ${currentStep >= 3
                        ? "completed"
                        : currentStep === 3
                            ? "active"
                            : ""
                        }`}
                >
                    <div className="track-circle"></div>
                    <span>OOD</span>
                </div>

                <div
                    className={`track-step ${currentStep >= 4
                        ? "completed"
                        : currentStep === 4
                            ? "active"
                            : ""
                        }`}
                >
                    <div className="track-circle"></div>
                    <span>DELIVERD</span>
                </div>
            </div>

        </div>

    );

}

export default TrackOrder;