import { useEffect, useState } from "react";
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiRefreshCw, FiMapPin } from "react-icons/fi";
import { API } from "../../services/api";
import "../orderitemstyle/TrackOrder.css";

const DELIVERY_STEPS = ["PLACED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];
const RETURN_STEPS = ["REQUESTED", "CONFIRMED", "PICKUP", "REFUND"];
const CANCEL_STEPS = ["REQUESTED", "PROCESSING", "CANCELLED"];

const STATUS_ICONS = {
    PLACED: FiPackage,
    PACKED: FiPackage,
    SHIPPED: FiTruck,
    OUT_FOR_DELIVERY: FiMapPin,
    DELIVERED: FiCheckCircle,
    REQUESTED: FiRefreshCw,
    PROCESSING: FiRefreshCw,
    CONFIRMED: FiCheckCircle,
    PICKUP: FiTruck,
    REFUND: FiCheckCircle,
    CANCELLED: FiXCircle,
};

const STATUS_LABELS = {
    OUT_FOR_DELIVERY: "OOD",
    OUT_FOR_DELIVERY_FULL: "Out for Delivery",
};

function TrackOrder({ orderStatus, returnStatus, paymentStatus, orderId, cancelStatus, orderItemId }) {
    const [processingMap, setProcessingMap] = useState({});
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (!orderItemId) return;
        fetch(`${API}/api/user/processing/${orderItemId}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.success && data.data) {
                    const map = {};
                    (data.data.processing_update || "").split(",").forEach((entry) => {
                        const [status, date] = entry.split("~");
                        if (status && date) map[status.trim()] = date.trim();
                    });
                    setProcessingMap(map);
                }
            })
            .catch((err) => console.error(err));
    }, [orderItemId]);

    useEffect(() => {
        const timer = setTimeout(() => setAnimate(true), 100);
        return () => clearTimeout(timer);
    }, [orderStatus, returnStatus, paymentStatus, orderId]);

    const isCancelled = CANCEL_STEPS.includes(cancelStatus);
    const isReturn = !!returnStatus;

    const steps = isCancelled ? CANCEL_STEPS : isReturn ? RETURN_STEPS : DELIVERY_STEPS;
    const activeStatus = isCancelled ? cancelStatus : isReturn ? returnStatus : orderStatus;
    const currentStep = steps.indexOf(activeStatus);
    const progressPercent = currentStep <= 0 ? 0 : (currentStep / (steps.length - 1)) * 100;

    const title = isCancelled
        ? { icon: FiXCircle, text: "Order Cancelled", cls: "cancel" }
        : isReturn
            ? { icon: FiRefreshCw, text: `Return - ${returnStatus}`, cls: "return" }
            : { icon: FiTruck, text: `Track Order - ${orderStatus}`, cls: "delivery" };

    const TitleIcon = title.icon;

    return (
        <div className="track-order">
            <h3 className={`track-title track-title-${title.cls}`}>
                <TitleIcon /> {title.text}
            </h3>

            <div className={`track-line track-line-${title.cls}`}>
                <div className="track-bar">
                    <div
                        className={`track-progress ${animate ? "animate" : ""}`}
                        style={{ "--progress": `${progressPercent}%` }}
                    />
                </div>

                <div className="track-steps">
                    {steps.map((step, index) => {
                        const isCompleted = currentStep >= index;
                        const isActive = currentStep === index;
                        const date = processingMap[step];
                        const StepIcon = STATUS_ICONS[step] || FiPackage;
                        const label = STATUS_LABELS[step] || step;

                        return (
                            <div
                                key={step}
                                className={`track-step ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}
                                style={{ "--delay": `${index * 0.08}s` }}
                            >
                                <div className="track-dot">
                                    <StepIcon className="track-dot-icon" />
                                </div>
                                <span className="track-label">{label}</span>
                                {date && isCompleted && <small className="track-date">{date}</small>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default TrackOrder;