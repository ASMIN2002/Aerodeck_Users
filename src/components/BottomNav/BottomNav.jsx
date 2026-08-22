import "./BottomNav.css";
import { useEffect, useState } from "react";
import { API } from "../../services/api";
import NODP from "../../assets/NODP.png";

function BottomNav({
    user,
    profileImageRefresh,
    selectedBottomTab,
    setSelectedBottomTab,
    setSelectedMenu,
    isDetailsOpen,
    closeDetails,
    setProfilePage,
    navigateWithLoading
}) {

    const [profileImage, setProfileImage] = useState("");

    useEffect(() => {

        async function loadProfileImage() {

            try {

                const response = await fetch(
                    `${API}/api/user/profile`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            session_token:
                                localStorage.getItem("session_token")
                        })
                    }
                );

                const data = await response.json();

                if (data.success) {
                    setProfileImage(data.user?.profile_image || "");
                }

            } catch (err) {
                console.error("BOTTOM NAV PROFILE ERROR:", err);
            }

        }

        loadProfileImage();

    }, [profileImageRefresh]);
    useEffect(() => {

        const refreshProfileImage = () => {
            setProfileImage("");

            // Database se latest DP dobara fetch karne ke liye
            fetch(
                `${API}/api/user/profile`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        session_token:
                            localStorage.getItem("session_token")
                    })
                }
            )
                .then(response => response.json())
                .then(data => {

                    if (data.success) {
                        setProfileImage(
                            data.user?.profile_image || ""
                        );
                    }

                })
                .catch(err => {
                    console.error(
                        "PROFILE IMAGE REFRESH ERROR:",
                        err
                    );
                });
        };

        window.addEventListener(
            "profileImageUpdated",
            refreshProfileImage
        );

        return () => {
            window.removeEventListener(
                "profileImageUpdated",
                refreshProfileImage
            );
        };

    }, []);
    return (
        <nav className="bn-nav">
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
                    🎁
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
                    👑
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
                    🛒
                </span>

                <span className="bn-text">
                    Cart
                </span>
            </button>

            <button
                className={`bn-item ${selectedBottomTab === "Profile" ? "bn-active" : ""}`}
                onClick={() => {

                    if (isDetailsOpen) {
                        closeDetails();
                    }

                    setSelectedMenu(null);

                    navigateWithLoading(
                        () => {
                            setProfilePage("profile");
                            setSelectedBottomTab("Profile");
                        },
                        "Loading Profile...",
                        10
                    );

                }}
            >
                <span className="bn-icon bn-profile-icon">
                    <img
                        src={profileImage || NODP}
                        alt="Profile"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = NODP;
                        }}
                    />
                </span>
                <span className="bn-text">
                    Profile
                </span>
            </button>
        </nav>
    );
}

export default BottomNav;