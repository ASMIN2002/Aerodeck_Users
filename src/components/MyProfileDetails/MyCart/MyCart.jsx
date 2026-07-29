import { useState, useEffect } from "react";
// import "./MyCart.css";
import Address from "../../Address/Address";
import CartBilling from "./CartBilling";
import CartCard from "./CartCard";
import { API } from "../../../services/api";

function MyCart({

    setProfilePage,
    setOrderData,
    onOpenDetails,
    setSelectedBottomTab

}) {
    const user = JSON.parse(localStorage.getItem("user"));
    const [activeTab, setActiveTab] = useState("products");
    const [cart, setCart] = useState([]);

    const products = cart.filter(item => {

        const id = String(item.product_id);

        return id.startsWith("G") || id.startsWith("S");

    });

    const cards = cart.filter(item => {

        const id = String(item.product_id);

        return !id.startsWith("G") && !id.startsWith("S");

    });
    const fetchCart = async () => {

        try {

            const res = await fetch(

                `${API}/api/user/cart?user_id=${user.user_id}`

            );

            const data = await res.json();

            console.log(data);

            if (data.success) {

                setCart(data.data || []);

            }

        }

        catch (err) {

            console.log(err);

        }

    };
    const handleDelete = async (productId) => {

        try {

            await fetch(

                `${API}/api/user/cart/${productId}`,

                {

                    method: "DELETE",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        user_id: user.user_id

                    })

                }

            );

            setCart(prev =>

                prev.filter(

                    item => item.product_id !== productId

                )

            );

        }

        catch (err) {

            console.log(err);

        }

    };
    const handleIncrease = async (item) => {

        const newQuantity = item.quantity + 1;

        const response = await fetch(`${API}/api/user/cart`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                user_id: user.user_id,

                product_id: item.product_id,

                quantity: newQuantity

            })

        });

        const data = await response.json();

        if (!data.success) return;

        setCart(prev =>

            prev.map(cartItem =>

                cartItem.cart_id === item.cart_id

                    ? {

                        ...cartItem,

                        quantity: newQuantity

                    }

                    : cartItem

            )

        );

    };
    const handleDecrease = async (item) => {

        const minQty =

            String(item.product_id).startsWith("G") ||

                String(item.product_id).startsWith("S")

                ? 1

                : 50;

        // Minimum pe delete
        if (item.quantity <= minQty) {

            await handleDelete(item.product_id);

            return;

        }

        const newQuantity = item.quantity - 1;

        const response = await fetch(`${API}/api/user/cart`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                user_id: user.user_id,

                product_id: item.product_id,

                quantity: newQuantity

            })

        });

        const data = await response.json();

        if (!data.success) return;

        setCart(prev =>

            prev.map(cartItem =>

                cartItem.cart_id === item.cart_id

                    ? {

                        ...cartItem,

                        quantity: newQuantity

                    }

                    : cartItem

            )

        );

    };
    const handlePlaceOrder = () => {
        if (activeTab === "products") {

            setOrderData({
                items: products,
                orderType: "products"
            });

            setProfilePage("productorder");

        } else {

            setOrderData({
                items: cards,
                orderType: "cards"
            });

            setProfilePage("cardorder");

        }

    };
    useEffect(() => {

        fetchCart();

    }, []);

    return (

        <div className="mycart-page">

            <div className="mycart-topbar">
                <Address
                    setProfilePage={setProfilePage}
                    setSelectedBottomTab={setSelectedBottomTab}
                />
            </div>
            <div className="mycart-tabs">


                <button
                    className="mycart-back"
                    onClick={() => setProfilePage("profile")}
                >
                    ←
                </button>

                <button

                    className={activeTab === "products" ? "active" : ""}

                    onClick={() => setActiveTab("products")}

                >

                    Products

                </button>

                <button

                    className={activeTab === "cards" ? "active" : ""}

                    onClick={() => setActiveTab("cards")}

                >

                    Cards

                </button>

            </div>
            <div className="mycart-content">

                {activeTab === "products" ? (

                    products.length > 0 ? (

                        products.map((item) => (

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

                            <h2>No Products in your cart</h2>

                        </div>

                    )

                ) : (

                    cards.length > 0 ? (

                        cards.map((item) => (

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

                            <h2>No Cards in your cart</h2>

                        </div>

                    )

                )}

            </div>
            {(
                (activeTab === "products" && products.length > 0) ||
                (activeTab === "cards" && cards.length > 0)
            ) && (
                    <CartBilling
                        items={activeTab === "products" ? products : cards}
                        onPlaceOrder={handlePlaceOrder}
                    />
                )}


        </div>

    );

}

export default MyCart;