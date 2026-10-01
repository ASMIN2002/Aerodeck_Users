import "./MyOrders.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../../services/api";
import Loading from "../../../components/Loading/Loading";

function MyOrders({
    setProfilePage,
    selectedOrder,
    setSelectedOrder,
    navigateWithLoading
}) {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRewardCount, setUserRewardCount] = useState(null);

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelOrderData, setCancelOrderData] = useState(null);
    const [cancelReason, setCancelReason] = useState("");

    useEffect(() => {

        const fetchOrders = async () => {

            try {

                const sessionToken =
                    localStorage.getItem("session_token");

                const response = await fetch(
                    `${API}/api/user/orders?session_token=${encodeURIComponent(sessionToken)}`
                );

                const data = await response.json();

                if (data.success) {
                    setOrders(data.data);
                }

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        fetchOrders();

    }, []);

    useEffect(() => {

        const fetchUserRewards = async () => {

            try {

                const sessionToken = localStorage.getItem("session_token");

                const res = await fetch(
                    `${API}/api/user/rewards?session_token=${encodeURIComponent(sessionToken)}`
                );

                const data = await res.json();

                if (data.success) {
                    setUserRewardCount(data.data?.count ?? 0);
                }

            } catch (err) {

                console.error(err);

            }

        };

        fetchUserRewards();

    }, []);

    const formatOrderDate = (date) => {
        return new Date(date)
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            })
            .toUpperCase();
    };

    const getRewardInfo = (order) => {

        const amount = Number(order.total_amount) || 0;

        if (order.order_status === "CANCELLED") {

            if (amount < 250) {
                return { type: "no-chance", text: "No chance — Min ₹250" };
            }

            const lost = Math.floor(amount / 250);

            return {
                type: "lost",
                text: `Lost ${lost} chance${lost > 1 ? "s" : ""}`
            };
        }

        if (amount < 250) {
            return { type: "no-chance", text: "No chance for reward — Min ₹250" };
        }

        const chances = Math.floor(amount / 250);

        if (order.order_status === "DELIVERED") {

            if (userRewardCount === 0) {
                return { type: "redeemed", text: "Already Redeemed" };
            }

            return {
                type: "got",
                text: `Got ${chances} chance${chances > 1 ? "s" : ""} — Check in Rewards`
            };
        }

        return {
            type: "on-way",
            text: `${chances} chance${chances > 1 ? "s" : ""} on the way`
        };

    };
    const handleCancelOrder = async () => {

        if (!cancelReason) return;

        try {

            const sessionToken = localStorage.getItem("session_token");

            const response = await fetch(
                `${API}/api/user/orders/cancel-whole-order`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        session_token: sessionToken,
                        order_id: cancelOrderData.order_id,
                        cancel_reason: cancelReason
                    })
                }
            );

            const data = await response.json();

            if (data.success) {

                setShowCancelModal(false);
                setCancelReason("");
                setCancelOrderData(null);

                const refreshRes = await fetch(
                    `${API}/api/user/orders?session_token=${encodeURIComponent(sessionToken)}`
                );
                const refreshData = await refreshRes.json();

                if (refreshData.success) {
                    setOrders(refreshData.data);
                }

            }

        } catch (err) {

            console.error(err);

        }

    };

    if (loading) {
        return (
            <Loading
                type="order"
                count={5}
                text="Loading Orders..."
                manual={true}
            />
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

            {!loading && orders.length === 0 && (

                <div className="orders-empty">
                    📦
                    <h3>No Orders Yet</h3>
                    <p>Your placed orders will appear here.</p>
                </div>

            )}

            {!loading && [...orders]
                .sort(
                    (a, b) =>
                        new Date(b.created_at) -
                        new Date(a.created_at)
                )
                .map((order) => {

                    const reward = getRewardInfo(order);

                    return (

                        <div
                            className="order-card"
                            key={order.order_id}
                            onClick={() => {

                                setSelectedOrder(order);

                                navigateWithLoading(
                                    () => {
                                        setProfilePage("order-details");
                                        navigate(
                                            `/profile/orders/order/${order.order_id}`
                                        );
                                    },
                                    "Loading Order Details...",
                                    500
                                );

                            }}
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
                                        {order.order_status === "REQUESTED"
                                            ? "REQUESTED"
                                            : order.order_status === "PROCESSING"
                                                ? "PROCESSING"
                                                : order.order_status === "CANCELLED"
                                                    ? "CANCELLED"
                                                    : order.order_status === "DELIVERED"
                                                        ? "DELIVERED"
                                                        : formatOrderDate(order.created_at)}
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
                                        {reward.type === "got" ? "🎁" :
                                            reward.type === "on-way" ? "⏳" :
                                                reward.type === "redeemed" ? "✓" :
                                                    reward.type === "lost" ? "💔" : "🚫"}
                                    </span>
                                    <span className="reward-text">{reward.text}</span>
                                </div>

                                {order.is_hypo_used === 1 ? (
                                    <div className="order-hypo-badge">
                                        <span className="hypo-badge-icon">⚡</span>
                                        <span className="hypo-badge-text">HYPO USED</span>
                                    </div>
                                ) : (
                                    <div className="order-hypo-hint">
                                        <span className="hypo-hint-icon">⚡</span>
                                        <span className="hypo-hint-text">HYPO NOT USED</span>
                                    </div>
                                )}

                                {order.order_status !== "DELIVERED" &&
                                    order.order_status !== "CANCELLED" &&
                                    order.order_status !== "REQUESTED" && (
                                        <button
                                            className="order-cancel-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCancelOrderData(order);
                                                setShowCancelModal(true);
                                            }}
                                        >
                                            Cancel Order
                                        </button>
                                    )}

                                <div className="order-card-arrow">
                                    &gt;
                                </div>

                            </div>

                        </div>

                    );

                })}

            {showCancelModal && (
                <div
                    className="cancel-modal-overlay"
                    onClick={() => setShowCancelModal(false)}
                >
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
                            <option value="Changed my mind">Changed my mind</option>
                            <option value="Ordered by mistake">Ordered by mistake</option>
                            <option value="Found a better option">Found a better option</option>
                            <option value="Product no longer required">Product no longer required</option>
                            <option value="Other">Other</option>
                        </select>

                        <div className="cancel-modal-actions">
                            <button
                                className="cancel-modal-cancel"
                                onClick={() => setShowCancelModal(false)}
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