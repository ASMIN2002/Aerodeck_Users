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

    const formatOrderDate = (date) => {
        return new Date(date)
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            })
            .toUpperCase();
    };

    /* ✅ LOADING STATE */
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

                <h2>
                    MY ORDERS
                </h2>

            </div>


            {/* ✅ Empty state — loading ke baad */}
            {!loading && orders.length === 0 && (

                <div className="orders-empty">

                    📦

                    <h3>
                        No Orders Yet
                    </h3>

                    <p>
                        Your placed orders will appear here.
                    </p>

                </div>

            )}


            {!loading && [...orders]
                .sort(
                    (a, b) =>
                        new Date(b.created_at) -
                        new Date(a.created_at)
                )
                .map((order) => (

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

                                <h3>
                                    Order #{order.order_number}
                                </h3>

                                <p>
                                    Items : {order.total_items}
                                </p>

                            </div>


                            <div className="myOrder-price-status">

                                <h4>
                                    ₹ {order.total_amount}
                                </h4>

                                <span
                                    className={`order-status ${order.order_status.toLowerCase()}`}
                                >
                                    {formatOrderDate(order.created_at)}
                                </span>

                            </div>

                        </div>


                        <div className="order-card-arrow">
                            &gt;
                        </div>

                    </div>

                ))}

        </div>

    );

}

export default MyOrders;