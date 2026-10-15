import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyCart.css";
import Address from "../../Address/Address";
import CartBilling from "./CartBilling";
import CartCard from "./CartCard";
import TOPHEADER from "../../Header/TOPHEADER";
import { API } from "../../../services/api";

function isProductOrShop(productId) {
    const id = String(productId);
    return id.startsWith("G") || id.startsWith("S");
}

function MyCart({
    setProfilePage,
    setOrderData,
    setBuyNowFromDetails,
    onOpenDetails,
    setSelectedBottomTab,
    setCartCount,
}) {
    const navigate = useNavigate();
    const sessionToken = localStorage.getItem("session_token");

    const [activeTab] = useState("products");
    const [cart, setCart] = useState([]);

    const products = cart.filter((item) => isProductOrShop(item.product_id));
    const cards = cart.filter((item) => !isProductOrShop(item.product_id));

    const fetchCart = async () => {
        try {
            const res = await fetch(
                `${API}/api/user/cart?session_token=${sessionToken}`
            );
            const data = await res.json();
            if (data.success) setCart(data.data || []);
        } catch (err) {
            console.error("Cart fetch error:", err.message);
        }
    };

    const handleDelete = async (productId) => {
        try {
            const res = await fetch(`${API}/api/user/cart/${productId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: sessionToken }),
            });
            const data = await res.json();
            if (!data.success) return;

            setCart((prev) => prev.filter((item) => item.product_id !== productId));
            setCartCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Delete error:", err.message);
        }
    };

    const updateQuantity = async (item, newQuantity) => {
        const res = await fetch(`${API}/api/user/cart`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                session_token: sessionToken,
                product_id: item.product_id,
                quantity: newQuantity,
            }),
        });
        const data = await res.json();
        if (!data.success) return false;

        setCart((prev) =>
            prev.map((cartItem) =>
                cartItem.cart_id === item.cart_id
                    ? { ...cartItem, quantity: newQuantity }
                    : cartItem
            )
        );
        return true;
    };

    const handleIncrease = async (item) => {
        await updateQuantity(item, item.quantity + 1);
    };

    const handleDecrease = async (item) => {
        const minQty = isProductOrShop(item.product_id) ? 1 : 50;

        if (item.quantity <= minQty) {
            await handleDelete(item.product_id);
            return;
        }

        await updateQuantity(item, item.quantity - 1);
    };

    const handlePlaceOrder = () => {
        setBuyNowFromDetails(false);
        setSelectedBottomTab("Profile");

        const isProductsTab = activeTab === "products";

        setOrderData({
            items: isProductsTab ? products : cards,
            orderType: isProductsTab ? "products" : "cards",
        });

        setProfilePage(isProductsTab ? "productorder" : "cardorder");

        window.history.pushState({}, "", "/cart/placeorder");
        window.dispatchEvent(new PopStateEvent("popstate"));
    };

    useEffect(() => {
        fetchCart();
    }, [sessionToken]);

    const isProductsTab = activeTab === "products";
    const visibleItems = isProductsTab ? products : cards;

    return (
        <div className="mycart-page">
            <TOPHEADER title="My Cart" onBack={() => navigate(-1)} />
            <Address
                setProfilePage={setProfilePage}
                setSelectedBottomTab={setSelectedBottomTab}
            />
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
                    <div className="empty-cart">
                        <h2>
                            {isProductsTab
                                ? "No Products in your cart"
                                : "No Cards in your cart"}
                        </h2>
                    </div>
                )}
            </div>

            {visibleItems.length > 0 && (
                <CartBilling items={visibleItems} onPlaceOrder={handlePlaceOrder} />
            )}
        </div>
    );
}

export default MyCart;