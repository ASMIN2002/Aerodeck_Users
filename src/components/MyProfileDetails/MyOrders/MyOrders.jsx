import "./MyOrders.css";
import { useEffect, useState } from "react";
import { API } from "../../../services/api";

function MyOrders({
    setProfilePage,
    selectedOrder,
    setSelectedOrder
}) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchOrders = async () => {

            try {

                const sessionToken = localStorage.getItem("session_token");

                const response = await fetch(
                    `${API}/api/user/orders?session_token=${sessionToken}`
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

    if (loading) {

        return (

            <div className="myorders">

                Loading...

            </div>

        );

    }

    return (

        <div className="myorders">

            <div className="orders-header">

                <button
                    className="orders-back"
                    onClick={() => setProfilePage("profile")}
                >
                    ←
                </button>

                <h2>
                    My Orders
                </h2>

            </div>

            {

                orders.length === 0 &&

                <div className="orders-empty">

                    📦

                    <h3>
                        No Orders Yet
                    </h3>

                    <p>
                        Your placed orders will appear here.
                    </p>

                </div>

            }

            {

                orders.map((order) => (

                    <div
                        className="order-card"
                        key={order.order_id}
                    >


                        <div className="order-info">

                            <h3>

                                Order #{order.order_number}

                            </h3>

                            <p>

                                Order Date : {new Date(order.created_at).toLocaleDateString()}

                            </p>

                            <p>

                                Items : {order.total_items}

                            </p>

                            <h4>

                                ₹ {order.total_amount}

                            </h4>
                          

                            <span

                                className={`order-status ${order.order_status.toLowerCase()}`}
                            >

                                {order.order_status}

                            </span>

                            <button
                                onClick={() => {

                                    setSelectedOrder(order);

                                    setProfilePage("order-details");

                                }}
                            >
                                View Details
                            </button>
                        </div>

                    </div>

                ))

            }

        </div>

    );

}

export default MyOrders;