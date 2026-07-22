import "./Orders.css";
import { useState } from "react";

function Orders() {

    const [orders] = useState([
        {
            order_id: "AD100001",
            product_id: "P101",
            product_name: "Luxury Wedding Invitation",
            product_image: "https://picsum.photos/300/200?1",
            order_status: "Delivered",
            order_date: "22 Jul 2026",
            product_price: "₹1499",
            rating: 4,
        },
        {
            order_id: "AD100002",
            product_id: "G205",
            product_name: "Birthday Greeting Card",
            product_image: "https://picsum.photos/300/200?2",
            order_status: "Shipped",
            order_date: "21 Jul 2026",
            product_price: "₹699",
            rating: 0,
        },
        {
            order_id: "AD100003",
            product_id: "S302",
            product_name: "Premium Anniversary Card",
            product_image: "https://picsum.photos/300/200?3",
            order_status: "Processing",
            order_date: "20 Jul 2026",
            product_price: "₹999",
            rating: 5,
        },
    ]);

    return (
        <div className="orders">

            {orders.length === 0 ? (

                <div className="orders-empty">
                    <h2>No Orders Yet</h2>
                    <p>Your orders will appear here.</p>
                </div>

            ) : (

                orders.map((order) => (

                    <div
                        key={order.order_id}
                        className="order-card"
                    >

                        <img
                            src={order.product_image}
                            alt={order.product_name}
                            className="order-image"
                        />

                        <div className="order-content">

                            <h3>{order.product_name}</h3>

                            <p><strong>Order ID:</strong> {order.order_id}</p>

                            <p><strong>Status:</strong> {order.order_status}</p>

                            <p><strong>Date:</strong> {order.order_date}</p>

                            <p><strong>Price:</strong> {order.product_price}</p>

                            <div className="order-stars">
                                ⭐⭐⭐⭐⭐
                            </div>

                            <button className="upload-btn">
                                Upload Image
                            </button>

                        </div>

                    </div>

                ))

            )}

        </div>
    );
}

export default Orders;