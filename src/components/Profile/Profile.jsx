import { useEffect, useState } from "react";
import "./Profile.css";
import AerodeckDP from "../../assets/AerodeckDP.png";
import { API } from "../../services/api";

function Profile({

    user,
    setUser,
    setPage,
    onLogout,
    setProfilePage
}) {
    const [profile, setProfile] = useState(null);

    const maskedMobile = profile?.mobile_number
        ? `******${profile.mobile_number.slice(-4)}`
        : "";

    useEffect(() => {

        async function loadProfile() {

            try {

                const response = await fetch(
                    `${API}/api/user/profile`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            session_token: localStorage.getItem("session_token")
                        })
                    }
                );

                const data = await response.json();

                if (data.success) {
                    setProfile(data.user);
                }

            } catch (err) {
                console.error(err);
            }

        }

        loadProfile();

    }, []);

    return (

        <div className="profile">

            <div className="profile-header">
                <img
                    src={profile?.profile_image || AerodeckDP}
                    alt="Profile"
                    className="profile-image"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = AerodeckDP;
                    }}
                />


                <h2>{profile?.full_name}</h2>

                <p>{maskedMobile}</p>

                <button
                    className="edit-profile-btn"
                    onClick={() => setProfilePage("viewprofile")}
                >
                    View Profile
                </button>

            </div>

            <div className="profile-menu">

                <div
                    className="profile-item"
                    onClick={() => setProfilePage("address")}
                >
                    <span>📍</span>
                    <span>My Addresses</span>
                </div>

                <div
                    className="profile-item"
                    onClick={() => setProfilePage("wishlist")}
                >
                    <span>❤️</span>
                    <span>Wishlist</span>
                </div>

                <div
                    className="profile-item"
                    onClick={() => setProfilePage("cart")}
                >
                    <span>🛒</span>
                    <span>My Cart</span>
                </div>
                <div
                    className="profile-item"
                    onClick={() => setProfilePage("orders")}
                >
                    <span>📦</span>
                    <span>My Orders</span>
                </div>

                <div
                    className="profile-item"
                    onClick={() => setProfilePage("help")}
                >
                    <span>❓</span>
                    <span>Help & Support</span>
                </div>

                <div
                    className="profile-item"
                    onClick={() => setProfilePage("about")}
                >
                    <span>ℹ️</span>
                    <span>About AERODECK</span>
                </div>

            </div>

            <button className="logout-btn"
                onClick={() => {

                    console.log("Logout Clicked");

                    onLogout();

                }}
            >
                Logout
            </button>

            <p className="profile-version">
                AERODECK v1.0.0
            </p>

        </div>

    );

}

export default Profile;