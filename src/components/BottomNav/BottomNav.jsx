import "./BottomNav.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiGift, FiHome, FiStar, FiShoppingCart, FiUser } from "react-icons/fi";


function BottomNav({
    selectedBottomTab,
    setSelectedBottomTab,
    setSelectedMenu,
    isDetailsOpen,
    closeDetails,
    setProfilePage,
    cartCount,
    setCartCount
}) {

    const navigate = useNavigate();
    const [showComingSoon, setShowComingSoon] = useState(false);

    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("user"));

                if (!userData?.user_id) {
                    setCartCount(0);
                    return;
                }

                const response = await fetch(
                    `https://aerodeck-server.onrender.com/api/user/cart?user_id=${userData.user_id}`
                );

                const data = await response.json();

                if (data.success && data.cart) {
                    setCartCount(data.cart.length);
                } else {
                    setCartCount(0);
                }

            } catch (error) {
                console.error("Cart count error:", error);
                setCartCount(0);
            }
        };

        fetchCartCount();
    }, []);

    return (
        <>
            <nav className="bn-nav">
                <button
                    className={`bn-item ${selectedBottomTab === "Home" ? "bn-active" : ""
                        }`}
                    onClick={() => {

                        if (isDetailsOpen) {
                            closeDetails();
                        }

                        setSelectedMenu("Shop");
                        setProfilePage("profile");
                        setSelectedBottomTab("Home");
                        navigate("/home/shop");

                    }}
                >
                    <span className="bn-icon">
                        <FiHome />
                    </span>
                </button>
                <button
                    className={`bn-item ${selectedBottomTab === "Offers"
                        ? "bn-active"
                        : ""
                        }`}
                    // onClick={() => {

                    //     if (isDetailsOpen) {
                    //         closeDetails();
                    //     }

                    //     setSelectedMenu(null);
                    //     setProfilePage("profile");
                    //     setSelectedBottomTab("Offers");
                    //     navigate("/offers");

                    // }}
                    onClick={() => {

                        setShowComingSoon(true);

                        setTimeout(() => {
                            setShowComingSoon(false);
                        }, 2500);

                    }}
                >
                    <span className="bn-iconpre">
                        <FiGift />
                    </span>
                </button>

                <button
                    className={`bn-item ${selectedBottomTab === "Premium" ? "bn-active" : ""}`}
                    // onClick={() => {

                    //     if (isDetailsOpen) {
                    //         closeDetails();
                    //     }

                    //     setSelectedMenu(null);
                    //     setProfilePage("profile");
                    //     setSelectedBottomTab("Premium");
                    //     navigate("/premium");

                    // }}
                    onClick={() => {

                        setShowComingSoon(true);

                        setTimeout(() => {
                            setShowComingSoon(false);
                        }, 2500);

                    }}
                >
                    <span className="bn-iconpre">
                        <FiStar />
                    </span>
                </button>

                <button
                    className={`bn-item ${selectedBottomTab === "Cart"
                        ? "bn-active"
                        : ""
                        }`}
                    onClick={() => {

                        if (isDetailsOpen) {
                            closeDetails();
                        }

                        setSelectedMenu(null);
                        setProfilePage("cart");
                        setSelectedBottomTab("Cart");
                        navigate("/cart");

                    }}
                >
                    <span className="bn-icon">
                        <FiShoppingCart /><span className="bn-cart-count">
                            {cartCount}
                        </span>
                    </span>
                </button>
                <button
                    className={`bn-item ${selectedBottomTab === "Profile" ? "bn-active" : ""
                        }`}
                    onClick={() => {

                        if (isDetailsOpen) {
                            closeDetails();
                        }

                        setSelectedMenu(null);
                        setProfilePage("profile");
                        setSelectedBottomTab("Profile");
                        navigate("/profile");

                    }}
                >
                    <span className="bn-icon">
                        <FiUser />
                    </span>
                </button>
            </nav>
            {showComingSoon && (
                <div className="bn-coming-toast">
                    Available Soon
                </div>
            )}</>
    );
}

export default BottomNav;