import { useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import { API } from "../../services/api";
import TrackOrder from "./TrackOrder";
import UploadImages from "./UploadImages";
import Rating from "./Rating";
import HelpSupport from "./HelpSupport";
import "../orderitemstyle/OrderItem.css";

const PREFIX_TYPE = { G: "gift", S: "shop", M: "medicine" };

const getType = (id) => PREFIX_TYPE[String(id).charAt(0).toUpperCase()] || "card";

const getProductData = (id, type) => {
    if (type === "gift") return { gift_id: id };
    if (type === "shop") return { shop_id: id };
    if (type === "medicine") return { medicine_id: id };
    return { product_id: id };
};

const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase().replace(/ /g, "-");

function OrderItem({ item, order, order_id, onOpenDetails, setProfilePage, setSelectedInvoice, fetchItems, navigateWithLoading }) {
    const session_token = localStorage.getItem("session_token");
    const [isReturned, setIsReturned] = useState(!!item.return_status);
    const [reviewImages, setReviewImages] = useState([]);

    const image = item.product_image1;
    const isDelivered = item.order_status === "DELIVERED";
    const isReturnTimeout = item.return_date && new Date(item.return_date) < new Date();
    const productType = getType(item.product_id);

    const handleViewProduct = () => {
        onOpenDetails(getProductData(item.product_id, productType), productType);
    };

    return (
        <div className="order-item-card">
            <div className="order-item-top">
                {image && (
                    <div className="order-item-image-wrap">
                        <img src={image} alt={item.product_name} className="order-item-image" loading="lazy" />
                    </div>
                )}

                <div className="order-item-info">
                    <div className="order-item-header">
                        <p className="order-item-number">#{item.product_id}</p>
                        <p className="order-item-price">₹{Number(item.total_price || 0).toLocaleString("en-IN")}</p>
                    </div>

                    <h3 className="order-item-name">{item.product_name}</h3>

                    <div className="order-item-meta">
                        <span className="order-item-chip">Qty: {item.quantity}</span>
                        <span className="order-item-chip">₹{Number(item.unit_price || 0).toFixed(2)}/pc</span>
                    </div>

                    <div className="order-item-dates">
                        <p className="order-item-date">
                            <strong>Ordered:</strong> {formatDate(item.order_date)}
                        </p>
                        {isDelivered && item.return_date && (
                            <p className={`order-item-date ${isReturnTimeout ? "timeout" : ""}`}>
                                <strong>{isReturnTimeout ? "Return Timeout:" : "Return Until:"}</strong> {formatDate(item.return_date)}
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
                cancelStatus={item.order_status}
                orderItemId={item.order_item_id}
            />

            {isDelivered && !isReturned && (
                <>
                    <Rating product_id={item.product_id} order_item_id={item.order_item_id} />
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
                        onReturnSuccess={() => setIsReturned(true)}
                        setProfilePage={setProfilePage}
                        navigateWithLoading={navigateWithLoading}
                    />
                </>
            )}

            <button className="order-item-view-btn" onClick={handleViewProduct}>
                <FiExternalLink /> View Product
            </button>
        </div>
    );
}

export default OrderItem;