import "./OrderItem.css";
import { useState } from "react";
import { API } from "../../../../services/api";
import TrackOrder from "./TrackOrder";
import UploadImages from "./UploadImages";
import Rating from "./Rating";
import HelpSupport from "./HelpSupport";

function OrderItem({

    item,
    order,
    order_id,
    onOpenDetails,
    setProfilePage,
    setSelectedInvoice,
    fetchItems,
    navigateWithLoading

}) {

    const session_token = localStorage.getItem("session_token");

    const [isReturned, setIsReturned] = useState(
        !!item.return_status
    );
    const [reviewImages, setReviewImages] = useState([]);

    const images = [
        item.product_image1,
        item.product_image2,
        item.product_image3,
        item.product_image4,
    ].filter(Boolean);

    return (

        <div className="order-item-card">

            <div className="order-item-images">

                <div>
                    {images[0] && (
                        <img
                            src={images[0]}
                            alt={item.product_name}
                            className="order-item-image"
                        />
                    )}
                </div>
                <div className="numtot">

                    <div className="numtot1">
                        <p><strong>Number :</strong> #{item.product_id}#</p>
                        <p>
                            <strong>MRP :</strong> {item.total_price}
                        </p>
                    </div>

                    <div className="numtot2">
                        <h3>{item.product_name}</h3>
                        <p>
                            <strong>Qty :</strong> {item.quantity}
                        </p>
                    </div>

                    <span className="per-piece-rate">
                        ₹{Number(item.unit_price || 0).toFixed(2)} / piece
                    </span>

                    <div className="numtot3">
                        <p>
                            <strong>Order :</strong>{" "}
                            {new Date(item.order_date)
                                .toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                })
                                .toUpperCase()
                                .replace(/ /g, "-")}
                        </p>

                        {item.order_status === "DELIVERED" && item.return_date && (
                            <p
                                className={
                                    new Date(item.return_date) < new Date()
                                        ? "return-timeout-date"
                                        : ""
                                }
                            >
                                <strong>
                                    {new Date(item.return_date) < new Date()
                                        ? "Return Timeout :"
                                        : "Return Until :"}
                                </strong>{" "}

                                {new Date(item.return_date)
                                    .toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    })
                                    .toUpperCase()
                                    .replace(/ /g, "-")}
                            </p>
                        )}
                    </div>

                </div>
            </div>

            <TrackOrder
                orderStatus={item.order_status}
                returnStatus={isReturned ? item.return_status : null}
                paymentStatus={order.payment_status}
                orderId={order_id}
                cancelStatus={"CANCEL"}
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
                                    setProfilePage={setProfilePage}
                                    navigateWithLoading={navigateWithLoading}
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

            </div>

        </div>

    );

}

export default OrderItem;