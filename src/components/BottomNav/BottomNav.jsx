import "./BottomNav.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiGift, FiHome, FiStar, FiShoppingCart, FiUser } from "react-icons/fi";


function BottomNav({
    profileImageRefresh,
    selectedBottomTab,
    setSelectedBottomTab,
    setSelectedMenu,
    isDetailsOpen,
    closeDetails,
    setProfilePage,
}) {

    const navigate = useNavigate();
    const [showComingSoon, setShowComingSoon] = useState(false);

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

                    <span className="bn-text">
                        Home
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

                    <span className="bn-text">
                        Offers
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
                    <span className="bn-text">
                        Premium
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
                        <FiShoppingCart />
                    </span>

                    <span className="bn-text">
                        Cart
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

                    <span className="bn-text">
                        Profile
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