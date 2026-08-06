import "./TrackOrder.css";
function TrackOrder({

    orderStatus,

    returnStatus

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

    const returnSteps = [
        "REQUESTED",
        "CONFIRMED",
        "PICKUP",
        "REFUNDED"
    ];

    const returnCurrentStep =
        returnSteps.indexOf(returnStatus);

    return (

        <div className="track-order">

            <h3 className="track-title">

                {

                    isCancelled

                        ? "❌ Order Cancelled"

                        : returnStatus

                            ? `🔄 Return Tracking - ${returnStatus}`

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

                ) : returnStatus ? (

                    <>


                        <div className="track-line">

                            <div
                                className={`track-step ${returnCurrentStep >= 0 ? "completed" : ""
                                    }`}
                            >

                                <div className="track-circle"></div>

                                <span>REQUESTED</span>

                            </div>

                            <div
                                className={`track-step ${returnCurrentStep >= 1 ? "completed" : ""
                                    }`}
                            >

                                <div className="track-circle"></div>

                                <span>CONFIRMED</span>

                            </div>

                            <div
                                className={`track-step ${returnCurrentStep >= 2 ? "completed" : ""
                                    }`}
                            >

                                <div className="track-circle"></div>

                                <span>PICKUP</span>

                            </div>

                            <div
                                className={`track-step ${returnCurrentStep >= 3 ? "completed" : ""
                                    }`}
                            >

                                <div className="track-circle"></div>

                                <span>REFUND</span>

                            </div>

                        </div>

                    </>

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