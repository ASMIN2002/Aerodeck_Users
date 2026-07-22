import "./MyOrders.css";
import { useState } from "react";

function MyOrders({

    setProfilePage,

    onOpenDetails

}) {

    const [orders] = useState([

        {
            id: 1,
            name: "Luxury Wedding Invitation",
            image: "https://via.placeholder.com/120",
            price: 1499,
            quantity: 2,
            status: "Delivered",
            orderDate: "18 Jul 2026"
        },

        {
            id: 2,
            name: "Birthday Invitation Card",
            image: "https://via.placeholder.com/120",
            price: 499,
            quantity: 1,
            status: "Processing",
            orderDate: "21 Jul 2026"
        }

    ]);

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
                        key={order.id}
                    >

                        <img
                            src={order.image}
                            alt={order.name}
                        />

                        <div className="order-info">

                            <h3>

                                {order.name}

                            </h3>

                            <p>

                                Order Date : {order.orderDate}

                            </p>

                            <p>

                                Quantity : {order.quantity}

                            </p>

                            <h4>

                                ₹ {order.price}

                            </h4>

                            <span

                                className={`order-status ${order.status.toLowerCase()}`}

                            >

                                {order.status}

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