import "./BottomNav.css";
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

    return (
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
                onClick={() => {

                    if (isDetailsOpen) {
                        closeDetails();
                    }

                    setSelectedMenu(null);
                    setProfilePage("profile");
                    setSelectedBottomTab("Offers");

                }}
            >
                <span className="bn-icon">
                    <FiGift />
                </span>

                <span className="bn-text">
                    Offers
                </span>
            </button>

            <button
                className={`bn-item ${selectedBottomTab === "Premium" ? "bn-active" : ""}`}
                onClick={() => {

                    if (isDetailsOpen) {
                        closeDetails();
                    }

                    setSelectedMenu(null);
                    setProfilePage("profile");
                    setSelectedBottomTab("Premium");

                }}
            >
                <span className="bn-icon">
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
    );
}

export default BottomNav;