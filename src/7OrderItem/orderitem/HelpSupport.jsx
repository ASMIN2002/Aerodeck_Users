import { useRef, useState, useEffect } from "react";
import { API } from "../../services/api";
import "../orderitemstyle/HelpSupport.css";

const MAX_REASON_LENGTH = 20;
const NAV_DELAY = 500;
const RETURNABLE_TYPES = ["GIFT", "SHOP"];

function getReturnState(returnDate) {
    if (!returnDate) return "no-return";

    const today = new Date();
    const date = new Date(returnDate);

    if (date >= today) return "can-return";
    return "expired";
}

function HelpSupport({
    item,
    order,
    onReturnSuccess,
    setProfilePage,
    navigateWithLoading,
}) {
    const [showReturnBox, setShowReturnBox] = useState(false);
    const [returnReason, setReturnReason] = useState("");

    const returnBoxRef = useRef(null);

    const returnState = getReturnState(item.return_date);

    const handleReturnProduct = async () => {
        if (!RETURNABLE_TYPES.includes(item.product_type)) return;

        try {
            const res = await fetch(`${API}/api/user/orders/return-product`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_item_id: item.order_item_id,
                    user_id: order.user_id,
                    order_id: item.order_id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    return_reason: returnReason,
                    order_date: item.order_date,
                }),
            });
            const data = await res.json();

            if (data.success) {
                onReturnSuccess();
                setShowReturnBox(false);
                navigateWithLoading(
                    () => setProfilePage("orders"),
                    "Loading My Orders...",
                    NAV_DELAY
                );
            }
        } catch (err) {
            console.error("Return product error:", err.message);
        }
    };

    useEffect(() => {
        function handleOutsideClick(e) {
            if (
                returnBoxRef.current &&
                !returnBoxRef.current.contains(e.target)
            ) {
                setShowReturnBox(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const renderReturnButton = () => {
        if (returnState === "no-return") {
            return (
                <button className="support-btn" disabled>
                    Open Box (No Return Available)
                </button>
            );
        }

        if (returnState === "can-return") {
            return (
                <button
                    className="support-btn"
                    onClick={() => setShowReturnBox(true)}
                >
                    Return Product
                </button>
            );
        }

        return (
            <button className="support-btn" disabled>
                Return Expired
            </button>
        );
    };

    return (
        <div className="help-support">
            <h3>Help & Support</h3>

            <div className="support-options">{renderReturnButton()}</div>

            {showReturnBox && (
                <div className="return-popup-overlay">
                    <div className="return-popup" ref={returnBoxRef}>
                        <h3>Return Product</h3>
                        <p>Why are you returning this product?</p>

                        <textarea
                            maxLength={MAX_REASON_LENGTH}
                            value={returnReason}
                            onChange={(e) => setReturnReason(e.target.value)}
                            placeholder={`Maximum ${MAX_REASON_LENGTH} letters`}
                        />

                        <div className="return-popup-buttons">
                            <button onClick={() => setShowReturnBox(false)}>
                                Cancel
                            </button>

                            <button onClick={handleReturnProduct}>
                                Confirm Return
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HelpSupport;