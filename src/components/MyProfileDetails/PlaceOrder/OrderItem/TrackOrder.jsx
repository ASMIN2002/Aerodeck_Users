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
    const isCancelled = orderStatus === "CANCELLED";

    return (

        <div className="track-order">

            <h3 className="track-title">
                {
                    isCancelled
                        ? "❌ Order Cancelled"
                        : `🚚 Track Order - ${orderStatus}`
                }
            </h3>

            {
                isCancelled ? (

                    <div className="track-line cancelled-track">

                        <div className="track-step completed cancelled">

                            <div className="track-circle"></div>

                            <span>PLACED</span>

                        </div>

                        <div className="track-red-line"></div>

                        <div className="track-step completed cancelled">

                            <div className="track-circle"></div>

                            <span>CANCELLED</span>

                        </div>

                    </div>

                ) : (

                    <div className="track-line">

                        <div
                            className={`track-step ${currentStep >= 0 ? "completed" : ""}`}
                        >
                            <div className="track-circle"></div>
                            <span>PLACED</span>
                        </div>

                        <div
                            className={`track-step ${currentStep >= 1 ? "completed" : ""}`}
                        >
                            <div className="track-circle"></div>
                            <span>PACKED</span>
                        </div>

                        <div
                            className={`track-step ${currentStep >= 2 ? "completed" : ""}`}
                        >
                            <div className="track-circle"></div>
                            <span>SHIPPED</span>
                        </div>

                        <div
                            className={`track-step ${currentStep >= 3 ? "completed" : ""}`}
                        >
                            <div className="track-circle"></div>
                            <span>OOD</span>
                        </div>

                        <div
                            className={`track-step ${currentStep >= 4 ? "completed" : ""}`}
                        >
                            <div className="track-circle"></div>
                            <span>DELIVERED</span>
                        </div>

                    </div>

                )
            }

        </div>

    );

}

export default TrackOrder;