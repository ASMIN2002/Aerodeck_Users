import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../profilestyles/Profile.css";
import NODP from "../../assets/NODP.png";
import Loading from "../../components/Loading/Loading";
import { API } from "../../services/api";
import {
    FiMapPin,
    FiHeart,
    FiPackage,
    FiGift,
    FiThumbsUp,
    FiStar,
    FiSettings,
    FiInfo,
    FiFileText,
    FiChevronRight
} from "react-icons/fi";

const NAV_DELAY = 500;

const MENU_ITEMS = [
    { page: "orders", Icon: FiPackage, label: "My Orders", loading: "Loading Orders..." },
    { page: "address", Icon: FiMapPin, label: "My Addresses", loading: "Loading Addresses..." },
    { page: "wishlist", Icon: FiHeart, label: "Wishlist", loading: "Loading Wishlist..." },
    { page: "likes", Icon: FiThumbsUp, label: "My Likes", loading: "Loading My Likes..." },
    { page: "reviews", Icon: FiStar, label: "My Reviews", loading: "Loading My Reviews..." },
    { page: "rewards", Icon: FiGift, label: "My Rewards", loading: "Loading My Rewards..." },
    { page: "settings", Icon: FiSettings, label: "Settings", loading: "Loading Settings..." },
    { page: "about", Icon: FiInfo, label: "About HEEPIT", loading: "Loading About HEEPIT..." },
    { page: "terms", Icon: FiFileText, label: "Terms & Conditions", loading: "Loading Terms & Conditions..." },
];

function Profile({ user, setPage, onLogout, setProfilePage, navigateWithLoading }) {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [version, setVersion] = useState("");
    const [showLogoutBox, setShowLogoutBox] = useState(false);

    useEffect(() => {
        async function loadVersion() {
            if (!user?.user_id) return;

            try {
                const res = await fetch(`${API}/user/app-version/${user.user_id}`);
                const data = await res.json();
                if (data.success) setVersion(data.version);
            } catch (err) {
                console.error("Version load error:", err.message);
            }
        }

        loadVersion();
    }, [user]);

    useEffect(() => {
        async function loadProfile() {
            try {
                const res = await fetch(`${API}/api/user/profile`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        session_token: localStorage.getItem("session_token"),
                    }),
                });
                const data = await res.json();
                if (data.success) setProfile(data.user);
            } catch (err) {
                console.error("Profile load error:", err.message);
            }
        }

        loadProfile();
    }, []);

    const maskedMobile = profile?.mobile_number
        ? `******${profile.mobile_number.slice(-4)}`
        : "";

    const handleProfileNavigation = (page, text = "Loading...") => {
        navigateWithLoading(
            () => {
                setProfilePage(page);
                navigate(`/profile/${page}`);
            },
            text,
            NAV_DELAY
        );
    };

    if (!profile) {
        return <Loading manual={true} text="Loading Profile..." />;
    }

    return (
        <div className="profile">
            <div className="profile-header">
                <div className="prohead1">
                    <img
                        src={profile?.profile_image || NODP}
                        alt="Profile"
                        className="profile-image1"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = NODP;
                        }}
                    />
                </div>

                <div className="prohead2">
                    <h2>{profile?.full_name || "Not Set"}</h2>
                    <p>{maskedMobile || "Not Set"}</p>
                    <button
                        className="edit-profile-btn-pro"
                        onClick={() =>
                            handleProfileNavigation(
                                "viewprofile",
                                "Loading Profile Details..."
                            )
                        }
                    >
                        View Profile
                    </button>
                </div>
            </div>

            <div className="profile-menu">
                {MENU_ITEMS.map(({ page, Icon, label, loading }) => (
                    <button
                        key={page}
                        className="profile-item"
                        onClick={() => handleProfileNavigation(page, loading)}
                    >
                        <span className="profile-item-icon">
                            <Icon />
                        </span>
                        <span className="profile-item-label">{label}</span>
                    </button>
                ))}
            </div>

            <button
                className="logout-btn"
                onClick={() =>
                    navigateWithLoading(
                        () => setShowLogoutBox(true),
                        "Preparing Logout...",
                        NAV_DELAY
                    )
                }
            >
                Logout
            </button>

            <p className="profile-version">HEEPIT {version}</p>

            {showLogoutBox && (
                <div className="logout-overlay">
                    <div className="logout-message-box">
                        <h3>Logout</h3>
                        <p>Do you want to logout?</p>

                        <div className="logout-box-buttons">
                            <button
                                className="logout-cancel-btn"
                                onClick={() => setShowLogoutBox(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="logout-confirm-btn"
                                onClick={() => {
                                    setShowLogoutBox(false);
                                    onLogout();
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;