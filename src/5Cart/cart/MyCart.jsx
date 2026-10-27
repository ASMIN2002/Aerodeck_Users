import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import "../cartstyle/MyCart.css";
import CartBilling from "./CartBilling";
import CartCard from "./CartCard";
import { API } from "../../services/api";
import TOPHEADER from "../../2Process/process/TopHeader";

const getSession = () => localStorage.getItem("session_token");
const isProductOrShop = (id) => {
    const s = String(id);
    return s.startsWith("G") || s.startsWith("S") || s.startsWith("M");
};
const minQtyFor = (id) => (isProductOrShop(id) ? 1 : 50);

function MyCart({ setProfilePage, setOrderData, setBuyNowFromDetails, onOpenDetails, setSelectedBottomTab, setCartCount }) {
    const navigate = useNavigate();
    const sessionToken = getSession();

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    const products = cart.filter((item) => isProductOrShop(item.product_id));
    const visibleItems = products;

    const fetchCart = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetch(`${API}/api/user/cart?session_token=${sessionToken}`).then((r) => r.json());
            if (data.success) {
                setCart(data.data || []);
                setCartCount?.(data.data.length);
            }
        } catch (err) {
            console.error("Cart fetch error:", err.message);
        } finally {
            setLoading(false);
        }
    }, [sessionToken, setCartCount]);

    const handleDelete = useCallback(async (productId) => {
        try {
            const data = await fetch(`${API}/api/user/cart/${productId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: sessionToken }),
            }).then((r) => r.json());
            if (!data.success) return;

            setCart((prev) => prev.filter((item) => String(item.product_id) !== String(productId)));
            setCartCount?.((prev) => Math.max(0, prev - 1));
        } catch (err) { console.error("Delete error:", err.message); }
    }, [sessionToken, setCartCount]);

    const updateQuantity = useCallback(async (item, newQuantity) => {
        const data = await fetch(`${API}/api/user/cart`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_token: sessionToken, product_id: item.product_id, quantity: newQuantity }),
        }).then((r) => r.json());
        if (!data.success) return false;

        setCart((prev) => prev.map((c) => (c.cart_id === item.cart_id ? { ...c, quantity: newQuantity } : c)));
        return true;
    }, [sessionToken]);

    const handleIncrease = useCallback((item) => updateQuantity(item, item.quantity + 1), [updateQuantity]);

    const handleDecrease = useCallback((item) => {
        const minQty = minQtyFor(item.product_id);
        if (item.quantity <= minQty) return handleDelete(item.product_id);
        return updateQuantity(item, item.quantity - 1);
    }, [handleDelete, updateQuantity]);

    const handlePlaceOrder = useCallback(() => {
        setBuyNowFromDetails(false);
        setSelectedBottomTab("Profile");
        setOrderData({ items: products, orderType: "products" });
        setProfilePage("productorder");
        navigate("/cart/placeorder");
    }, [products, setBuyNowFromDetails, setSelectedBottomTab, setOrderData, setProfilePage, navigate]);

    const handleBack = useCallback(() => navigate("/home/shop"), [navigate]);

    useEffect(() => { fetchCart(); }, [fetchCart]);

    if (loading) {
        return (
            <>
                <TOPHEADER title="My Cart" onBack={handleBack} />
                <div className="mycart-page">
                    <div className="mycart-content">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="mycart-skeleton-card">
                                <div className="mycart-skeleton-img" />
                                <div className="mycart-skeleton-body">
                                    <div className="mycart-skeleton-line" />
                                    <div className="mycart-skeleton-line short" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <TOPHEADER title="My Cart" onBack={handleBack} />

            <div className="mycart-page">
                <div className="mycart-content">
                    {visibleItems.length > 0 ? (
                        visibleItems.map((item) => (
                            <CartCard
                                key={item.cart_id}
                                item={item}
                                onOpenDetails={onOpenDetails}
                                onDelete={handleDelete}
                                onIncrease={handleIncrease}
                                onDecrease={handleDecrease}
                            />
                        ))
                    ) : (
                        <div className="mycart-empty">
                            <FiShoppingCart className="mycart-empty-icon" />
                            <h2>Your cart is empty</h2>
                            <p>Add products to get started.</p>
                        </div>
                    )}
                </div>

                {visibleItems.length > 0 && (
                    <CartBilling items={visibleItems} onPlaceOrder={handlePlaceOrder} />
                )}
            </div>
        </>
    );
}

export default memo(MyCart);