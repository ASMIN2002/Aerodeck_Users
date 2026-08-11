import "./TrackOrder.css";
import { useEffect, useState } from "react";

function TrackOrder({
    orderStatus,
    returnStatus,
    paymentStatus,
    orderId,
    cancelStatus
}) {

    const steps = [
        "PLACED",
        "PACKED",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED"
    ];

    const currentStep = steps.indexOf(orderStatus);

    const isCancelled =
        ["REQUESTED", "PROCESSING", "CANCELLED", "REFUND"].includes(
            cancelStatus
        );

    const returnSteps = [
        "REQUESTED",
        "CONFIRMED",
        "PICKUP",
        "REFUNDED"
    ];

    const returnCurrentStep =
        returnSteps.indexOf(returnStatus);

    /*
        PENDING = COD / no payment received
        Anything other than PENDING = payment received / partial paid
    */
    const hasRefund =
        paymentStatus &&
        paymentStatus.toUpperCase() !== "PENDING";

    const cancelSteps = hasRefund
        ? [
            "REQUESTED",
            "PROCESSING",
            "CANCELLED",
            "REFUND"
        ]
        : [
            "REQUESTED",
            "PROCESSING",
            "CANCELLED"
        ];
    const cancelCurrentStep = cancelSteps.indexOf(cancelStatus);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {

        const timer = setTimeout(() => {
            setAnimate(true);
        }, 100);

        return () => clearTimeout(timer);

    }, [orderStatus, returnStatus, paymentStatus, orderId]);


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


            {/* =========================
                CANCELLED ORDER
            ========================= */}

            {
                isCancelled ? (

                    <div
                        className={`track-line cancel-track ${hasRefund
                            ? "has-refund"
                            : "no-refund"
                            }`}
                    >

                        {/* RED PROGRESS */}

                        <div
                            className={`cancel-progress-red ${animate
                                ? "animate-cancel-red"
                                : ""
                                }`}
                            style={{
                                "--cancel-progress": hasRefund
                                    ? cancelCurrentStep === 0
                                        ? "10.66%"
                                        : cancelCurrentStep === 1
                                            ? "50%"
                                            : "66.66%"
                                    : cancelCurrentStep === 0
                                        ? "15%"
                                        : cancelCurrentStep === 1
                                            ? "75%"
                                            : "100%"
                            }}
                        ></div>


                        {/* GREEN REFUND PROGRESS */}

                        {
                            hasRefund && (

                                <div
                                    className={`cancel-progress-green ${animate
                                        ? "animate-cancel-green"
                                        : ""
                                        }`}
                                ></div>

                            )
                        }


                        {/* REQUESTED */}

                        <div
                            className={`cancel-step ${["REQUESTED", "PROCESSING", "CANCELLED", "REFUND"].includes(cancelStatus)
                                ? "completed"
                                : ""
                                }`}
                        >
                            <div className="track-circle cancel-dot"></div>
                            <span>REQUESTED</span>
                        </div>


                        {/* PROCESSING */}

                        <div
                            className={`cancel-step ${["PROCESSING", "CANCELLED", "REFUND"].includes(cancelStatus)
                                ? "completed"
                                : ""
                                }`}
                        >
                            <div className="track-circle cancel-dot"></div>
                            <span>PROCESSING</span>
                        </div>


                        {/* CANCELLED */}
                        <div
                            className={`cancel-step ${["CANCELLED", "REFUND"].includes(cancelStatus)
                                ? "completed"
                                : ""
                                }`}
                        >
                            <div className="track-circle cancel-dot"></div>
                            <span>CANCELLED</span>
                        </div>


                        {/* REFUND */}

                        {hasRefund && (
                            <div
                                className={`cancel-step refund-step ${cancelStatus === "REFUND"
                                    ? "completed"
                                    : ""
                                    }`}
                            >
                                <div className="track-circle refund-dot"></div>
                                <span>REFUND</span>
                            </div>
                        )}
                    </div>

                ) : returnStatus ? (

                    /* =========================
                       RETURN TRACKING
                    ========================= */

                    <div className="track-line">

                        <div
                            className={`track-progress-line ${animate
                                ? "animate-progress"
                                : ""
                                }`}
                            style={{
                                "--progress":
                                    returnCurrentStep <= 0
                                        ? "0%"
                                        : `${(
                                            returnCurrentStep /
                                            (returnSteps.length - 1)
                                        ) * 100}%`
                            }}
                        ></div>


                        <div
                            className={`track-step ${returnCurrentStep >= 0
                                ? "completed"
                                : ""
                                }`}
                        >
                            <div className="track-circle"></div>

                            <span>REQUESTED</span>

                            <small>11-AUG-2026</small>
                        </div>


                        <div
                            className={`track-step ${returnCurrentStep >= 1
                                ? "completed"
                                : ""
                                }`}
                        >
                            <div className="track-circle"></div>

                            <span>CONFIRMED</span>

                            <small>12-AUG-2026</small>
                        </div>


                        <div
                            className={`track-step ${returnCurrentStep >= 2
                                ? "completed"
                                : ""
                                }`}
                        >
                            <div className="track-circle"></div>

                            <span>PICKUP</span>

                            <small>13-AUG-2026</small>
                        </div>


                        <div
                            className={`track-step ${returnCurrentStep >= 3
                                ? "completed"
                                : ""
                                }`}
                        >
                            <div className="track-circle"></div>

                            <span>REFUND</span>

                            <small>14-AUG-2026</small>
                        </div>

                    </div>

                ) : (

                    /* =========================
                       NORMAL ORDER TRACKING
                    ========================= */

                    <div className="track-line">

                        <div
                            className={`track-progress-line ${animate
                                ? "animate-progress"
                                : ""
                                }`}
                            style={{
                                "--progress":
                                    currentStep === 0
                                        ? "10%"
                                        : `${(
                                            currentStep /
                                            (steps.length - 1)
                                        ) * 100}%`
                            }}
                        ></div>


                        <div className={`track-step ${currentStep >= 0 ? "completed" : ""
                            }`}>
                            <div className="track-circle"></div>
                            <span>PLACED</span>
                            <small>11-AUG-2026</small>
                        </div>


                        <div className={`track-step ${currentStep >= 1 ? "completed" : ""
                            }`}>
                            <div className="track-circle"></div>
                            <span>PACKED</span>
                            <small>11-AUG-2026</small>
                        </div>


                        <div className={`track-step ${currentStep >= 2 ? "completed" : ""
                            }`}>
                            <div className="track-circle"></div>
                            <span>SHIPPED</span>
                            <small>12-AUG-2026</small>
                        </div>


                        <div className={`track-step ${currentStep >= 3 ? "completed" : ""
                            }`}>
                            <div className="track-circle"></div>
                            <span>OOD</span>
                            <small>13-AUG-2026</small>
                        </div>


                        <div className={`track-step ${currentStep >= 4 ? "completed" : ""
                            }`}>
                            <div className="track-circle"></div>
                            <span>DELIVERED</span>
                            <small>14-AUG-2026</small>
                        </div>

                    </div>

                )
            }

        </div>
    );
}

export default TrackOrder;