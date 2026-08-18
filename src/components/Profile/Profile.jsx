import { useEffect, useState } from "react";
import "./Profile.css";
import NODP from "../../assets/NODP.png";
import Loading from "../../components/Loading/Loading";
import { API } from "../../services/api";

function Profile({
    user,
    setUser,
    setPage,
    onLogout,
    setProfilePage,
    navigateWithLoading
}) {
    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [version, setVersion] = useState("");
    useEffect(() => {
        async function loadVersion() {
            try {
                const response = await fetch(`${API}/app-version`);
                const data = await response.json();

                if (data.success) {
                    setVersion(data.data.version);
                }
            } catch (err) {
                console.log(err);
            }
        }
        loadVersion();
    }, []);

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
    if (!profile) {
        return (
            <Loading
                manual={true}
                text="Loading Profile..."
            />
        );
    }
    return (

        <div className="profile">
            {loadingProfile && (
                <div className="profile-loading">
                    <div className="profile-loader"></div>
                    <p>Loading Profile...</p>
                </div>
            )}
            <div className="profile-header">
                <div className="prohead1">
                    <img
                        src={profile?.profile_image || NODP}
                        alt="Profile"
                        className="profile-image1"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = empty;
                        }}
                    />
                </div>

                <div className="prohead2">
                    <h2>{profile?.full_name}</h2>
                    <p>{maskedMobile}</p>
                    <button
                        className="edit-profile-btn-pro"
                        onClick={() => {
                            navigateWithLoading(
                                () => {
                                    setProfilePage("viewprofile");
                                },
                                "Loading Profile Details...",
                                500
                            );
                        }}
                    >
                        View Profile
                    </button>
                </div>

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
                HEEPIT {version}
            </p>

        </div>

    );

}

export default Profile;