import { useRef, useState, useEffect } from "react";
import { FiRefreshCw, FiX, FiAlertCircle, FiPackage, FiCheckCircle, FiClock } from "react-icons/fi";
import { API } from "../../services/api";
import "../orderitemstyle/HelpSupport.css";

const MAX_REASON_LENGTH = 100;
const RETURNABLE_TYPES = ["GIFT", "SHOP"];

const getReturnState = (returnDate) => {
    if (!returnDate) return "no-return";
    return new Date(returnDate) >= new Date() ? "can-return" : "expired";
};

function HelpSupport({ item, order, onReturnSuccess, setProfilePage }) {
    const [showReturnBox, setShowReturnBox] = useState(false);
    const [returnReason, setReturnReason] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const returnBoxRef = useRef(null);

    const returnState = getReturnState(item.return_date);
    const isReturnable = RETURNABLE_TYPES.includes(item.product_type);

    useEffect(() => {
        if (!showReturnBox) return;
        const handler = (e) => {
            if (returnBoxRef.current && !returnBoxRef.current.contains(e.target)) {
                setShowReturnBox(false);
            }
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("touchstart", handler);
        };
    }, [showReturnBox]);

    const handleReturnProduct = async () => {
        if (!isReturnable || !returnReason.trim() || submitting) return;
        setSubmitting(true);

        try {
            const data = await fetch(`${API}/api/user/orders/return-product`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_item_id: item.order_item_id,
                    user_id: order.user_id,
                    order_id: item.order_id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    return_reason: returnReason.trim(),
                    order_date: item.order_date,
                }),
            }).then((r) => r.json());

            if (data.success) {
                onReturnSuccess();
                setShowReturnBox(false);
                setProfilePage("orders");
            }
        } catch (err) {
            console.error("Return product error:", err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleOpenReturn = () => {
        setReturnReason("");
        setShowReturnBox(true);
    };

    const renderButton = () => {
        if (!isReturnable) {
            return (
                <button className="support-btn support-btn-disabled" disabled>
                    <FiPackage /> No Return Available
                </button>
            );
        }

        if (returnState === "no-return") {
            return (
                <button className="support-btn support-btn-disabled" disabled>
                    <FiPackage /> Open Box (No Return)
                </button>
            );
        }

        if (returnState === "expired") {
            return (
                <button className="support-btn support-btn-disabled" disabled>
                    <FiClock /> Return Expired
                </button>
            );
        }

        return (
            <button className="support-btn support-btn-active" onClick={handleOpenReturn}>
                <FiRefreshCw /> Return Product
            </button>
        );
    };

    return (
        <div className="help-support">
            <div className="support-header">
                <span className="support-header-icon"><FiAlertCircle /></span>
                <h3 className="support-title">Help & Support</h3>
            </div>

            <div className="support-options">{renderButton()}</div>

            {showReturnBox && (
                <div className="return-popup-overlay" onClick={() => setShowReturnBox(false)}>
                    <div className="return-popup" ref={returnBoxRef} onClick={(e) => e.stopPropagation()}>
                        <button className="return-popup-close" onClick={() => setShowReturnBox(false)} aria-label="Close">
                            <FiX />
                        </button>

                        <div className="return-popup-icon"><FiRefreshCw /></div>
                        <h3 className="return-popup-title">Return Product</h3>
                        <p className="return-popup-subtitle">Why are you returning this product?</p>

                        <textarea
                            className="return-reason-input"
                            maxLength={MAX_REASON_LENGTH}
                            value={returnReason}
                            onChange={(e) => setReturnReason(e.target.value)}
                            placeholder="Write your reason..."
                            disabled={submitting}
                        />

                        <div className="return-reason-counter">{returnReason.length}/{MAX_REASON_LENGTH}</div>

                        <div className="return-popup-buttons">
                            <button
                                type="button"
                                className="return-cancel-btn"
                                onClick={() => setShowReturnBox(false)}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="return-confirm-btn"
                                onClick={handleReturnProduct}
                                disabled={!returnReason.trim() || submitting}
                            >
                                {submitting ? (
                                    <><span className="return-spinner" /> Submitting...</>
                                ) : (
                                    <><FiCheckCircle /> Confirm Return</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HelpSupport;