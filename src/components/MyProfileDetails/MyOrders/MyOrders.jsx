import "./MyOrders.css";
import { useEffect, useState } from "react";
import { API } from "../../../services/api";

function MyOrders({

    setProfilePage,

    onOpenDetails

}) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchOrders = async () => {

            try {

                const user_id = localStorage.getItem("user_id");

                const response = await fetch(
                    `${API}/api/user/orders?user_id=${user_id}`
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

                        <img
                            src="https://via.placeholder.com/120"
                            alt="Order"
                        />

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

                                onClick={() => onOpenDetails(order, "orders")}

                            >

                                View Product

                            </button>

                        </div>

                    </div>

                ))

            }

        </div>

    );

}

export default MyOrders;