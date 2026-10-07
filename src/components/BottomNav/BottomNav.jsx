import "./BottomNav.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiGift, FiHome, FiStar, FiShoppingCart, FiUser } from "react-icons/fi";
import { API } from "../../services/api";

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
                const sessionToken = localStorage.getItem("session_token");

                if (!sessionToken) {
                    setCartCount(0);
                    return;
                }

                const response = await fetch(
                    `${API}/api/user/cart?session_token=${sessionToken}`
                );

                if (response.status === 401) {
                    setCartCount(0);
                    return;
                }

                const data = await response.json();

                if (data.success && data.data) {
                    setCartCount(data.data.length);
                } else {
                    setCartCount(0);
                }

            } catch (error) {
                console.error("Cart count error:", error);
                setCartCount(0);
            }
        };

        fetchCartCount();
    }, [setCartCount]);

    return (
        <>
            <nav className="bn-nav">
                <button
                    className={`bn-item ${selectedBottomTab === "Home" ? "bn-active" : ""}`}
                    onClick={() => {
                        if (isDetailsOpen) {
                            closeDetails();
                        }

                        setSelectedMenu("Shop");
                        setProfilePage("profile");
                        setSelectedBottomTab("Home");

                        navigate("/home/shop");
                        setTimeout(() => {
                            document.querySelectorAll("*").forEach((element) => {
                                if (element.scrollTop > 0) {
                                    element.scrollTo({
                                        top: 0,
                                        behavior: "smooth"
                                    });
                                }
                            });

                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            });
                        }, 150);
                    }}
                >
                    <span className="bn-icon">
                        <FiHome />
                    </span>
                </button>

                <button
                    className={`bn-item ${selectedBottomTab === "Offers" ? "bn-active" : ""}`}
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
                    className={`bn-item ${selectedBottomTab === "Cart" ? "bn-active" : ""}`}
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
                        <FiShoppingCart />
                        <span className="bn-cart-count">
                            {cartCount}
                        </span>
                    </span>
                </button>

                <button
                    className={`bn-item ${selectedBottomTab === "Profile" ? "bn-active" : ""}`}
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
            )}
        </>
    );
}

export default BottomNav;