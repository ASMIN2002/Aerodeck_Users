import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPackage } from "react-icons/fi";
import { API } from "../../services/api";
import OrderItem from "../../7OrderItem/orderitem/OrderItem";
import "../placeorderstyle/OrderItemDetails.css";

function OrderItemDetails({ order, setProfilePage, onOpenDetails, setSelectedInvoice, navigateWithLoading }) {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchItems = async () => {
        if (!order?.order_id) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API}/api/user/orders/${order.order_id}`);
            const text = await response.text();

            try {
                const data = JSON.parse(text);
                if (data.success) setItems(data.data || []);
            } catch (parseErr) {
                console.error("INVALID JSON RESPONSE:", text.slice(0, 200));
            }
        } catch (error) {
            console.error("ORDER FETCH ERROR:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchItems(); }, [order?.order_id]);

    if (loading) {
        return (
            <div className="order-item-details">
                <div className="oid-loading">
                    <div className="oid-spinner" />
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="order-item-details">
            <div className="oid-header">
                <button
                    className="oid-back"
                    onClick={() => { setProfilePage("orders"); navigate("/profile/orders", { replace: true }); }}
                    aria-label="Back"
                >
                    <FiArrowLeft />
                </button>
                <h2 className="oid-title">Order Details</h2>
            </div>

            {items.length === 0 ? (
                <div className="oid-empty">
                    <FiPackage className="oid-empty-icon" />
                    <h3>No items found</h3>
                    <p>This order appears to be empty.</p>
                </div>
            ) : (
                <div className="oid-items">
                    {items.map((item) => (
                        <OrderItem
                            key={item.product_id}
                            item={item}
                            order={order}
                            order_id={order.order_id}
                            onOpenDetails={onOpenDetails}
                            setProfilePage={setProfilePage}
                            setSelectedInvoice={setSelectedInvoice}
                            fetchItems={fetchItems}
                            navigateWithLoading={navigateWithLoading}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderItemDetails;