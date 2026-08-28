import "./OrderItemDetails.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../../services/api";
import OrderItem from "./OrderItem/OrderItem";

function OrderItemDetails({
    order,
    setProfilePage,
    onOpenDetails,
    setSelectedTrackingOrder,
    setSelectedInvoice,
    navigateWithLoading
}) {
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {

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

                <button
                    onClick={() => {
                        setProfilePage("orders");
                        navigate("/profile/orders", { replace: true });
                    }}
                >
                    ←
                </button>

                <h2>ORDER DETAILS</h2>

            </div>

            {items.map((item) => (

                <div key={item.product_id}>

                    <OrderItem
                        item={item}
                        order={order}
                        order_id={order.order_id}
                        onOpenDetails={onOpenDetails}
                        setProfilePage={setProfilePage}
                        setSelectedInvoice={setSelectedInvoice}
                        fetchItems={fetchItems}
                        navigateWithLoading={navigateWithLoading}
                    />

                </div>

            ))}

        </div>

    );

}

export default OrderItemDetails;