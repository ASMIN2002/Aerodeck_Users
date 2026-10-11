import "./TrackOrder.css";
import { useEffect, useState } from "react";
import { API } from "../../../../services/api";

function TrackOrder({
    orderStatus,
    returnStatus,
    paymentStatus,
    orderId,
    cancelStatus,
    orderItemId
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
        ["REQUESTED", "PROCESSING", "CANCELLED"].includes(cancelStatus);

    const returnSteps = [
        "REQUESTED",
        "CONFIRMED",
        "PICKUP",
        "REFUND"
    ];

    const returnCurrentStep =
        returnSteps.indexOf(returnStatus);

    const cancelSteps = ["REQUESTED", "PROCESSING", "CANCELLED"];
    const cancelCurrentStep = cancelSteps.indexOf(cancelStatus);

    const [animate, setAnimate] = useState(false);
    const [processingMap, setProcessingMap] = useState({});

    /* ============================================
       FETCH PROCESSING UPDATES
       ============================================ */
    useEffect(() => {
        async function loadProcessing() {
            if (!orderItemId) return;

            try {
                const res = await fetch(
                    `${API}/api/user/processing/${orderItemId}`
                );
                const data = await res.json();

                if (data.success && data.data) {
                    const map = {};

                    const raw = data.data.processing_update || "";

                    raw.split(",").forEach((entry) => {
                        const [status, date] = entry.split("~");
                        if (status && date) {
                            map[status.trim()] = date.trim();
                        }
                    });

                    setProcessingMap(map);
                }
            } catch (err) {
                console.error(err);
            }
        }

        loadProcessing();
    }, [orderItemId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimate(true);
        }, 100);

        return () => clearTimeout(timer);
    }, [orderStatus, returnStatus, paymentStatus, orderId]);

    /* ============================================
       GET DATE
       ============================================ */
    const getDate = (status) => {
        if (status === "OUT_FOR_DELIVERY") {
            return processingMap["OUT_FOR_DELIVERY"] || "N/A";
        }
        return processingMap[status] || "N/A";
    };

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

            {/* CANCELLED */}
            {
                isCancelled ? (
                    <div className="track-line cancel-track">
                        <div
                            className={`cancel-progress-red ${animate ? "animate-cancel-red" : ""}`}
                            style={{
                                "--cancel-progress":
                                    cancelCurrentStep === 0
                                        ? "16%"
                                        : cancelCurrentStep === 1
                                            ? "50%"
                                            : "83%"
                            }}
                        ></div>

                        <div
                            className={`cancel-step ${["REQUESTED", "PROCESSING", "CANCELLED"].includes(cancelStatus)
                                ? "completed"
                                : ""}`}
                        >
                            <div className="track-circle cancel-dot"></div>
                            <span>REQUESTED</span>
                        </div>

                        <div
                            className={`cancel-step ${["PROCESSING", "CANCELLED"].includes(cancelStatus)
                                ? "completed"
                                : ""}`}
                        >
                            <div className="track-circle cancel-dot"></div>
                            <span>PROCESSING</span>
                        </div>

                        <div
                            className={`cancel-step ${cancelStatus === "CANCELLED"
                                ? "completed"
                                : ""}`}
                        >
                            <div className="track-circle cancel-dot"></div>
                            <span>CANCELLED</span>
                        </div>
                    </div>
                ) : returnStatus ? (
                    /* RETURN TRACKING */
                    <div className="track-line">
                        <div
                            className={`track-progress-line ${animate ? "animate-progress" : ""}`}
                            style={{
                                "--progress":
                                    returnCurrentStep <= 0
                                        ? "0%"
                                        : `${(returnCurrentStep / (returnSteps.length - 1)) * 100}%`
                            }}
                        ></div>

                        <div className={`track-step ${returnCurrentStep >= 0 ? "completed" : ""}`}>
                            <div className="track-circle"></div>
                            <span>REQUESTED</span>
                        </div>

                        <div className={`track-step ${returnCurrentStep >= 1 ? "completed" : ""}`}>
                            <div className="track-circle"></div>
                            <span>CONFIRMED</span>
                        </div>

                        <div className={`track-step ${returnCurrentStep >= 2 ? "completed" : ""}`}>
                            <div className="track-circle"></div>
                            <span>PICKUP</span>
                        </div>

                        <div className={`track-step ${returnCurrentStep >= 3 ? "completed" : ""}`}>
                            <div className="track-circle"></div>
                            <span>REFUND</span>
                        </div>
                    </div>
                ) : (
                    /* NORMAL ORDER */
                    <div className="track-line">
                        <div
                            className={`track-progress-line ${animate ? "animate-progress" : ""}`}
                            style={{
                                "--progress":
                                    currentStep === 0
                                        ? "0%"
                                        : currentStep === 1
                                            ? "30%"
                                            : currentStep === 2
                                                ? "50%"
                                                : currentStep === 3
                                                    ? "75%"
                                                    : currentStep === 4
                                                        ? "100%"
                                                        : "0%"
                            }}
                        ></div>

                        <div className={`track-step ${currentStep >= 0 ? "completed" : ""}`}>
                            <div className="track-circle"></div>
                            <span>PLACED</span>
                            <small className="track-date">
                                {getDate("PLACED")}
                            </small>
                        </div>

                        <div className={`track-step ${currentStep >= 1 ? "completed" : ""}`}>
                            <div className="track-circle"></div>
                            <span>PACKED</span>
                            <small className="track-date">
                                {getDate("PACKED")}
                            </small>
                        </div>

                        <div className={`track-step ${currentStep >= 2 ? "completed" : ""}`}>
                            <div className="track-circle"></div>
                            <span>SHIPPED</span>
                            <small className="track-date">
                                {getDate("SHIPPED")}
                            </small>
                        </div>

                        <div className={`track-step ${currentStep >= 3 ? "completed" : ""}`}>
                            <div className="track-circle"></div>
                            <span>OOD</span>
                            <small className="track-date">
                                {getDate("OUT_FOR_DELIVERY")}
                            </small>
                        </div>

                        <div className={`track-step ${currentStep >= 4 ? "completed" : ""}`}>
                            <div className="track-circle"></div>
                            <span>DELIVERED</span>
                            <small className="track-date">
                                {getDate("DELIVERED")}
                            </small>
                        </div>
                    </div>
                )
            }

        </div>
    );
}

export default TrackOrder;