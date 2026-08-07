import "./OrderItem.css";
import { useState, useRef, useEffect } from "react";
import { API } from "../../../../services/api";
import TrackOrder from "./TrackOrder";
import UploadImages from "./UploadImages";
import Rating from "./Rating";
import HelpSupport from "./HelpSupport";
import ItemInvoice from "./ItemInvoice";

function OrderItem({

    item,
    order,
    order_id,
    onOpenDetails,
    setProfilePage,
    setSelectedInvoice,
    fetchItems

}) {

    const session_token = localStorage.getItem("session_token");

    const [cancelStatus, setCancelStatus] = useState(
        item.cancel_status || "CANCEL"
    );
    const [showCancelBox, setShowCancelBox] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const cancelBoxRef = useRef(null);
    const [orderStatus, setOrderStatus] = useState(item.order_status);
    const [isReturned, setIsReturned] = useState(
        !!item.return_status
    );
    const [reviewImages, setReviewImages] = useState([]);
    const [returned, setReturned] = useState(false);

    const images = [
        item.product_image1,
        item.product_image2,
        item.product_image3,
        item.product_image4,
    ].filter(Boolean);

    const isCancelTimeout =
        item.cancel_date &&
        new Date() > new Date(item.cancel_date);

    useEffect(() => {

        async function loadCancelStatus() {

            try {

                const response = await fetch(

                    `${API}/api/user/orders/cancel-status?order_id=${order_id}&product_id=${item.product_id}`

                );

                const data = await response.json();

                if (data.success) {

                    setCancelStatus(data.cancel_status);

                }

            } catch (err) {

                console.error(err);

            }

        }

        loadCancelStatus();

    }, [order_id, item.product_id]);
    useEffect(() => {

        function handleOutsideClick(e) {

            if (
                cancelBoxRef.current &&
                !cancelBoxRef.current.contains(e.target)
            ) {

                setShowCancelBox(false);

            }

        }

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {

            document.removeEventListener("mousedown", handleOutsideClick);

        };

    }, []);

    const handleCancelOrder = async () => {

        try {

            const response = await fetch(

                `${API}/api/user/orders/cancel-order`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        order_id,

                        product_id: item.product_id,

                        user_id: order.user_id,

                        product_category: item.product_type,

                        quantity: item.quantity,

                        order_date: order.created_at,

                        payment_status: order.payment_status,

                        cancel_reason: cancelReason

                    })

                }

            );

            const data = await response.json();

            if (data.success) {

                if (item.payment_status === "PENDING") {

                    setCancelStatus("CANCELLED");
                    setOrderStatus("CANCELLED");

                } else {

                    setCancelStatus("REQUESTED");

                }

                setShowCancelBox(false);

            }
        } catch (err) {

            console.error(err);

        }

    };

    return (

        <div className="order-item-card">


            <div className="order-item-images">

                {images.map((image, index) => (

                    <img
                        key={index}
                        src={image}
                        alt={`${item.product_name} ${index + 1}`}
                        className="order-item-image"
                    />

                ))}

            </div>

            <div className="order-item-info">

                <h3>{item.product_name}</h3>
                <div className="smallinfo1">
                    <p><strong>Product ID :</strong> {item.product_id}</p>
                    <p>
                        <strong>Order Date :</strong>{" "}
                        {new Date(order.created_at).toLocaleDateString()}
                    </p>
                </div>
                <div className="smallinfo2">
                    <p><strong>Price :</strong> ₹ {item.product_price}</p>
                    <p>
                        <strong>
                            {isReturned ? "Requested Date :" : "Cancel Till :"}
                        </strong>{" "}

                        {new Date(
                            isReturned
                                ? item.return_request_date
                                : item.cancel_date
                        ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        })}
                    </p>
                </div>

            </div>
            <TrackOrder
                orderStatus={
                    cancelStatus === "CANCELLED"
                        ? "CANCELLED"
                        : item.order_status
                }
                returnStatus={isReturned ? "REQUESTED" : null}
            />
            {item.order_status === "DELIVERED" && (
                <>
                    {
                        !isReturned && (
                            <>
                                <Rating
                                    product_id={item.product_id}
                                    order_item_id={item.order_item_id}
                                />

                                <UploadImages
                                    reviewImages={reviewImages}
                                    setReviewImages={setReviewImages}
                                    session_token={session_token}
                                    product_id={item.product_id}
                                    order_item_id={item.order_item_id}
                                />
                                
                                <HelpSupport
                                    item={item}
                                    order={order}
                                    onReturnSuccess={() => {
                                        setIsReturned(true);

                                    }}
                                />
                            </>
                        )
                    }
                </>
            )}
            <div className="order-item-actions">

                <button
                    className="down-btn1"
                    onClick={() => {

                        const type =
                            item.product_id.startsWith("G")
                                ? "gift"
                                : item.product_id.startsWith("S")
                                    ? "shop"
                                    : item.product_id.startsWith("P")
                                        ? "premium"
                                        : "card";

                        const data =
                            type === "gift"
                                ? { gift_id: item.product_id }
                                : type === "shop"
                                    ? { shop_id: item.product_id }
                                    : type === "premium"
                                        ? { premium_id: item.product_id }
                                        : { product_id: item.product_id };

                        onOpenDetails(data, type);

                    }}
                >
                    View Product
                </button>

                {
                    !isReturned && (

                        <div className="down-btn2">

                            {
                                cancelStatus === "REQUESTED" ? (

                                    <div className="cancel-order-btn requested">
                                        Requested
                                    </div>

                                ) : cancelStatus === "CANCELLED" ? (

                                    <div className="cancel-order-btn cancelled">
                                        Canceled
                                    </div>

                                ) : isCancelTimeout ? (

                                    <div className="cancel-order-btn timeout">
                                        Cancel Timeout
                                    </div>

                                ) : (

                                    !showCancelBox &&
                                    !isCancelTimeout && (

                                        <button
                                            className="cancel-order-btn cancel"
                                            onClick={() => setShowCancelBox(true)}
                                        >
                                            Cancel Order
                                        </button>

                                    )

                                )
                            }

                            {
                                showCancelBox &&
                                cancelStatus !== "REQUESTED" && (

                                    <div
                                        className="cancel-box"
                                        ref={cancelBoxRef}
                                    >

                                        {/* Existing popup code */}

                                    </div>

                                )
                            }

                        </div>

                    )
                }

            </div>
        </div>

    );

}

export default OrderItem;