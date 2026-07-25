import "./OrderItemDetails.css";
import { useEffect, useState } from "react";
import { API } from "../../../services/api";
import OrderItem from "./OrderItem/OrderItem";

function OrderItemDetails({
    order,
    setProfilePage,
    onOpenDetails,
    setSelectedTrackingOrder
}) {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchItems = async () => {

            try {

                const response = await fetch(
                    `${API}/api/user/orders/${order.order_id}`
                );

                const data = await response.json();

                if (data.success) {
                    setItems(data.data);
                }

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        fetchItems();

    }, [order.order_id]);

    if (loading) {

        return (
            <div className="order-item-details">
                Loading...
            </div>
        );

    }

    return (

        <div className="order-item-details">

            <div className="order-details-header">

                <button onClick={() => setProfilePage("orders")}>
                    ← Back
                </button>

                <h2>Order Details</h2>

            </div>

            {items.map((item) => (

                <div key={item.product_id}>

                    <OrderItem
                        item={item}
                        onOpenDetails={onOpenDetails}
                    />
                </div>

            ))}



        </div>

    );

}

export default OrderItemDetails;