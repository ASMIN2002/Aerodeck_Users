import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiArrowLeft, FiPackage, FiGift, FiClock, FiCheckCircle,
    FiXCircle, FiSlash, FiZap, FiChevronRight, FiX,
} from "react-icons/fi";
import { API } from "../../services/api";
import "../profilestyles/Orders.css";

const MIN_ORDER_FOR_REWARD = 250;
const CANCEL_REASONS = ["Changed my mind", "Ordered by mistake", "Found a better option", "Product no longer required", "Other"];
const STATUS_LABELS = ["REQUESTED", "PROCESSING", "CANCELLED", "DELIVERED"];
const REWARD_ICONS = { got: FiGift, "on-way": FiClock, redeemed: FiCheckCircle, lost: FiXCircle, "no-chance": FiSlash };

const getSession = () => localStorage.getItem("session_token");

const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();

const getStatusLabel = (order) =>
    STATUS_LABELS.includes(order.order_status) ? order.order_status : formatDate(order.created_at);

const getRewardInfo = (order, userRewardCount) => {
    const amount = Number(order.total_amount) || 0;
    const chances = Math.floor(amount / MIN_ORDER_FOR_REWARD);
    const plural = chances > 1 ? "s" : "";

    if (order.order_status === "CANCELLED") {
        return amount < MIN_ORDER_FOR_REWARD
            ? { type: "no-chance", text: `No chance — Min ₹${MIN_ORDER_FOR_REWARD}` }
            : { type: "lost", text: `Lost ${chances} chance${plural}` };
    }

    if (amount < MIN_ORDER_FOR_REWARD) {
        return { type: "no-chance", text: `No chance for reward — Min ₹${MIN_ORDER_FOR_REWARD}` };
    }

    if (order.order_status === "DELIVERED") {
        return userRewardCount === 0
            ? { type: "redeemed", text: "Already Redeemed" }
            : { type: "got", text: `Got ${chances} chance${plural} — Check in Rewards` };
    }

    return { type: "on-way", text: `${chances} chance${plural} on the way` };
};

const canCancelOrder = (status) => !["DELIVERED", "CANCELLED", "REQUESTED"].includes(status);

function MyOrders({ setProfilePage, setSelectedOrder }) {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [userRewardCount, setUserRewardCount] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelOrderData, setCancelOrderData] = useState(null);
    const [cancelReason, setCancelReason] = useState("");

    const sortedOrders = useMemo(
        () => [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
        [orders]
    );

    const fetchOrders = () => {
        fetch(`${API}/api/user/orders?session_token=${encodeURIComponent(getSession())}`)
            .then((r) => r.json())
            .then((data) => { if (data.success) setOrders(data.data || []); })
            .catch((err) => console.error("Orders fetch error:", err.message));
    };

    useEffect(() => {
        fetchOrders();
        const token = getSession();
        if (!token) return;
        fetch(`${API}/api/user/rewards?session_token=${encodeURIComponent(token)}`)
            .then((r) => r.json())
            .then((data) => { if (data.success) setUserRewardCount(data.data?.count ?? 0); })
            .catch((err) => console.error("Rewards fetch error:", err.message));
    }, []);

    const handleOpenOrder = (order) => {
        setSelectedOrder(order);
        setProfilePage("order-details");
        navigate(`/profile/orders/order/${order.order_id}`);
    };

    const closeCancelModal = () => {
        setShowCancelModal(false);
        setCancelReason("");
        setCancelOrderData(null);
    };

    const handleCancelOrder = async () => {
        if (!cancelReason) return;
        try {
            const data = await fetch(`${API}/api/user/orders/cancel-whole-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_token: getSession(),
                    order_id: cancelOrderData.order_id,
                    cancel_reason: cancelReason,
                }),
            }).then((r) => r.json());
            if (data.success) { closeCancelModal(); fetchOrders(); }
        } catch (err) { console.error("Cancel order error:", err.message); }
    };

    return (
        <div className="myorders">
            <div className="orders-header">
                <button className="orders-back" onClick={() => { setProfilePage("profile"); navigate("/profile"); }} aria-label="Back">
                    <FiArrowLeft />
                </button>
                <h2 className="orders-title">My Orders</h2>
                {orders.length > 0 && <span className="orders-count">{orders.length}</span>}
            </div>

            {orders.length === 0 ? (
                <div className="orders-empty">
                    <FiPackage className="orders-empty-icon" />
                    <h3>No Orders Yet</h3>
                    <p>Your placed orders will appear here.</p>
                </div>
            ) : (
                <div className="orders-list">
                    {sortedOrders.map((order) => {
                        const reward = getRewardInfo(order, userRewardCount);
                        const showCancel = canCancelOrder(order.order_status);
                        const RewardIcon = REWARD_ICONS[reward.type];
                        const statusClass = order.order_status.toLowerCase();
                        const isDelivered = order.order_status === "DELIVERED";
                        const isHypoUsed = order.is_hypo_used === 1;

                        return (
                            <div className="order-card" key={order.order_id} onClick={() => handleOpenOrder(order)}>
                                <div className="order-top">
                                    <div className="order-number-info">
                                        <h3 className="order-number">Order #{order.order_number}</h3>
                                        <p className="order-meta">
                                            {order.total_items} item{order.total_items > 1 ? "s" : ""} · {formatDate(order.created_at)}
                                        </p>
                                    </div>
                                    <div className="order-price-status">
                                        <h4 className="order-price">₹{Number(order.total_amount).toLocaleString("en-IN")}</h4>
                                        <span className={`order-status ${statusClass}`}>{getStatusLabel(order)}</span>
                                    </div>
                                </div>

                                <div className="order-badges">
                                    {isDelivered && (
                                        <div className="order-badge delivered">
                                            <FiCheckCircle /> Delivered
                                        </div>
                                    )}
                                    <div className={`order-badge reward-${reward.type}`}>
                                        <RewardIcon /> {reward.text}
                                    </div>
                                    <div className={`order-badge hypo ${isHypoUsed ? "used" : "not-used"}`}>
                                        <FiZap /> HYPO {isHypoUsed ? "USED" : "NOT USED"}
                                    </div>
                                </div>

                                <div className="order-footer">
                                    {showCancel && (
                                        <button
                                            className="order-cancel-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCancelOrderData(order);
                                                setShowCancelModal(true);
                                            }}
                                        >
                                            <FiX /> Cancel Order
                                        </button>
                                    )}
                                    <span className="order-view-details">
                                        View Details <FiChevronRight />
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showCancelModal && (
                <div className="cancel-modal-overlay" onClick={closeCancelModal}>
                    <div className="cancel-modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="cancel-modal-icon"><FiX /></div>
                        <h3>Cancel Order?</h3>
                        <p>All items in this order will be cancelled.</p>

                        <select
                            className="cancel-modal-select"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                        >
                            <option value="">Select a reason</option>
                            {CANCEL_REASONS.map((reason) => (
                                <option key={reason} value={reason}>{reason}</option>
                            ))}
                        </select>

                        <div className="cancel-modal-actions">
                            <button className="cancel-modal-cancel" onClick={closeCancelModal}>No, Keep</button>
                            <button className="cancel-modal-confirm" disabled={!cancelReason} onClick={handleCancelOrder}>Yes, Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyOrders;