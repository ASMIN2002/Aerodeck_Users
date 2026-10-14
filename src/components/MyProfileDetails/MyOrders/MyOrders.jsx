import "./MyOrders.css";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../../services/api";
import Loading from "../../../components/Loading/Loading";

const MIN_ORDER_FOR_REWARD = 250;
const FAKE_LOADING_DELAY = 500;

const CANCEL_REASONS = [
    "Changed my mind",
    "Ordered by mistake",
    "Found a better option",
    "Product no longer required",
    "Other",
];

const REWARD_ICONS = {
    got: "🎁",
    "on-way": "⏳",
    redeemed: "✓",
    lost: "💔",
    "no-chance": "🚫",
};

const STATUS_LABELS = ["REQUESTED", "PROCESSING", "CANCELLED", "DELIVERED"];

function getSessionToken() {
    return localStorage.getItem("session_token");
}

function formatOrderDate(date) {
    return new Date(date)
        .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        .toUpperCase();
}

function getStatusLabel(order) {
    if (STATUS_LABELS.includes(order.order_status)) return order.order_status;
    return formatOrderDate(order.created_at);
}

function getRewardInfo(order, userRewardCount) {
    const amount = Number(order.total_amount) || 0;
    const chances = Math.floor(amount / MIN_ORDER_FOR_REWARD);
    const plural = chances > 1 ? "s" : "";

    if (order.order_status === "CANCELLED") {
        if (amount < MIN_ORDER_FOR_REWARD) {
            return { type: "no-chance", text: `No chance — Min ₹${MIN_ORDER_FOR_REWARD}` };
        }
        return { type: "lost", text: `Lost ${chances} chance${plural}` };
    }

    if (amount < MIN_ORDER_FOR_REWARD) {
        return { type: "no-chance", text: `No chance for reward — Min ₹${MIN_ORDER_FOR_REWARD}` };
    }

    if (order.order_status === "DELIVERED") {
        if (userRewardCount === 0) {
            return { type: "redeemed", text: "Already Redeemed" };
        }
        return { type: "got", text: `Got ${chances} chance${plural} — Check in Rewards` };
    }

    return { type: "on-way", text: `${chances} chance${plural} on the way` };
}

function canCancelOrder(status) {
    return !["DELIVERED", "CANCELLED", "REQUESTED"].includes(status);
}

function MyOrders({
    setProfilePage,
    selectedOrder,
    setSelectedOrder,
    navigateWithLoading,
}) {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRewardCount, setUserRewardCount] = useState(null);

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelOrderData, setCancelOrderData] = useState(null);
    const [cancelReason, setCancelReason] = useState("");

    const sortedOrders = useMemo(
        () =>
            [...orders].sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            ),
        [orders]
    );

    const fetchOrders = async () => {
        try {
            const sessionToken = getSessionToken();
            const res = await fetch(
                `${API}/api/user/orders?session_token=${encodeURIComponent(sessionToken)}`
            );
            const data = await res.json();
            if (data.success) setOrders(data.data);
        } catch (err) {
            console.error("Orders fetch error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        const sessionToken = getSessionToken();
        if (!sessionToken) return;

        fetch(
            `${API}/api/user/rewards?session_token=${encodeURIComponent(sessionToken)}`
        )
            .then((r) => r.json())
            .then((data) => {
                if (data.success) setUserRewardCount(data.data?.count ?? 0);
            })
            .catch((err) => console.error("Rewards fetch error:", err.message));
    }, []);

    const handleOpenOrder = (order) => {
        setSelectedOrder(order);
        navigateWithLoading(
            () => {
                setProfilePage("order-details");
                navigate(`/profile/orders/order/${order.order_id}`);
            },
            "Loading Order Details...",
            FAKE_LOADING_DELAY
        );
    };

    const handleOpenCancelModal = (e, order) => {
        e.stopPropagation();
        setCancelOrderData(order);
        setShowCancelModal(true);
    };

    const handleCloseCancelModal = () => {
        setShowCancelModal(false);
        setCancelReason("");
        setCancelOrderData(null);
    };

    const handleCancelOrder = async () => {
        if (!cancelReason) return;

        try {
            const sessionToken = getSessionToken();
            const res = await fetch(`${API}/api/user/orders/cancel-whole-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_token: sessionToken,
                    order_id: cancelOrderData.order_id,
                    cancel_reason: cancelReason,
                }),
            });
            const data = await res.json();

            if (data.success) {
                handleCloseCancelModal();
                await fetchOrders();
            }
        } catch (err) {
            console.error("Cancel order error:", err.message);
        }
    };

    if (loading) {
        return (
            <Loading type="order" count={5} text="Loading Orders..." manual={true} />
        );
    }

    return (
        <div className="myorders">
            <div className="orders-header">
                <button
                    className="orders-back"
                    onClick={() => {
                        setProfilePage("profile");
                        navigate("/profile");
                    }}
                >
                    ←
                </button>
                <h2>MY ORDERS</h2>
            </div>

            {orders.length === 0 && (
                <div className="orders-empty">
                    📦
                    <h3>No Orders Yet</h3>
                    <p>Your placed orders will appear here.</p>
                </div>
            )}

            {sortedOrders.map((order) => {
                const reward = getRewardInfo(order, userRewardCount);
                const showCancel = canCancelOrder(order.order_status);

                return (
                    <div
                        className="order-card"
                        key={order.order_id}
                        onClick={() => handleOpenOrder(order)}
                    >
                        <div className="order-info">
                            <div className="top-order-number">
                                <h3>Order #{order.order_number}</h3>
                                <p>Items : {order.total_items}</p>
                                <p>Placed on : {formatOrderDate(order.created_at)}</p>
                            </div>

                            <div className="myOrder-price-status">
                                <h4>₹ {order.total_amount}</h4>
                                <span
                                    className={`order-status ${order.order_status.toLowerCase()}`}
                                >
                                    {getStatusLabel(order)}
                                </span>
                            </div>
                        </div>

                        <div className="order-bottom-row">
                            {order.order_status === "DELIVERED" && (
                                <div className="order-delivered-badge">
                                    <span className="delivered-icon">✓</span>
                                    <span className="delivered-text">Delivered</span>
                                </div>
                            )}

                            <div className={`order-reward-badge ${reward.type}`}>
                                <span className="reward-icon">
                                    {REWARD_ICONS[reward.type]}
                                </span>
                                <span className="reward-text">{reward.text}</span>
                            </div>

                            <div
                                className={
                                    order.is_hypo_used === 1
                                        ? "order-hypo-badge"
                                        : "order-hypo-hint"
                                }
                            >
                                <span
                                    className={
                                        order.is_hypo_used === 1
                                            ? "hypo-badge-icon"
                                            : "hypo-hint-icon"
                                    }
                                >
                                    ⚡
                                </span>
                                <span
                                    className={
                                        order.is_hypo_used === 1
                                            ? "hypo-badge-text"
                                            : "hypo-hint-text"
                                    }
                                >
                                    HYPO {order.is_hypo_used === 1 ? "USED" : "NOT USED"}
                                </span>
                            </div>

                            {showCancel && (
                                <button
                                    className="order-cancel-btn"
                                    onClick={(e) => handleOpenCancelModal(e, order)}
                                >
                                    Cancel Order
                                </button>
                            )}

                            <div className="order-card-arrow">&gt;</div>
                        </div>
                    </div>
                );
            })}

            {showCancelModal && (
                <div className="cancel-modal-overlay" onClick={handleCloseCancelModal}>
                    <div
                        className="cancel-modal-box"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Cancel Order?</h3>
                        <p>All items in this order will be cancelled.</p>

                        <select
                            className="cancel-modal-select"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                        >
                            <option value="">Select a reason</option>
                            {CANCEL_REASONS.map((reason) => (
                                <option key={reason} value={reason}>
                                    {reason}
                                </option>
                            ))}
                        </select>

                        <div className="cancel-modal-actions">
                            <button
                                className="cancel-modal-cancel"
                                onClick={handleCloseCancelModal}
                            >
                                No, Keep
                            </button>
                            <button
                                className="cancel-modal-confirm"
                                disabled={!cancelReason}
                                onClick={handleCancelOrder}
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyOrders;