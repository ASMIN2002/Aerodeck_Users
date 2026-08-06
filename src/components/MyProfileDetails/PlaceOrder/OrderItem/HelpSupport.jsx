import { useRef, useState, useEffect } from "react";
import { API } from "../../../../services/api";
import "./HelpSupport.css";

function HelpSupport({

    item,

    order,

    onReturnSuccess

}) {

    const [showReturnBox, setShowReturnBox] = useState(false);
    const [returnReason, setReturnReason] = useState("");
    const returnBoxRef = useRef(null);
    const today = new Date();
    const canReturn =
        item.return_date &&
        new Date(item.return_date) >= today;
    const returnExpired =
        item.return_date &&
        new Date(item.return_date) < today;
    const handleReturnProduct = async () => {
        if (
            item.product_type !== "GIFT" &&
            item.product_type !== "SHOP"
        ) {
            return;
        }

        try {

            const res = await fetch(

                `${API}/api/user/orders/return-product`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        order_item_id: item.order_item_id,

                        user_id: order.user_id,

                        order_id: item.order_id,

                        product_id: item.product_id,

                        quantity: item.quantity,

                        return_reason: returnReason,

                        order_date: item.order_date

                    })

                }

            );

            const data = await res.json();
            if (data.success) {
                onReturnSuccess();
                setShowReturnBox(false);
            }
        }

        catch (err) {

            console.log(err);

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

        return () => {

            document.removeEventListener("mousedown", handleOutsideClick);

        };

    }, []);

    return (

        <div className="help-support">

            <h3>Help & Support</h3>

            <p className="help-note">
                Need assistance? Our support team is here to help you with your order, payments, delivery, returns, or any other queries.
            </p>

            <div className="support-options">

                <button className="support-btn">
                    Chat Support
                </button>

                {
                    !item.return_date ? (

                        <button
                            className="support-btn"
                            disabled
                        >
                            No Return
                        </button>

                    ) : canReturn ? (

                        <button
                            className="support-btn"
                            onClick={() => setShowReturnBox(true)}
                        >

                            Return Product

                        </button>

                    ) : (

                        <button
                            className="support-btn"
                            disabled
                        >

                            Return Expired

                        </button>

                    )
                }

            </div>
            {
                showReturnBox && (

                    <div className="return-popup-overlay">

                        <div
                            className="return-popup"
                            ref={returnBoxRef}
                        >

                            <h3>

                                Return Product

                            </h3>

                            <p>

                                Why are you returning this product?

                            </p>

                            <textarea

                                maxLength={20}

                                value={returnReason}

                                onChange={(e) =>
                                    setReturnReason(e.target.value)
                                }

                                placeholder="Maximum 20 letters"

                            />

                            <div className="return-popup-buttons">

                                <button
                                    onClick={() =>
                                        setShowReturnBox(false)
                                    }
                                >

                                    Cancel

                                </button>

                                <button
                                    onClick={handleReturnProduct}
                                >

                                    Confirm Return

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </div>

    );

}

export default HelpSupport;