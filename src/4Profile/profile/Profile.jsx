import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiHeart, FiPackage, FiGift, FiThumbsUp, FiStar,
    FiSettings, FiInfo, FiFileText, FiLogOut, FiPhone,
} from "react-icons/fi";
import NODP from "../../assets/NODP.png";
import { API } from "../../services/api";
import "../profilestyles/Profile.css";

const MENU_ITEMS = [
    { page: "orders", Icon: FiPackage, label: "My Orders", color: "blue" },
    { page: "wishlist", Icon: FiHeart, label: "Wishlist", color: "rose" },
    { page: "likes", Icon: FiThumbsUp, label: "My Likes", color: "pink" },
    { page: "reviews", Icon: FiStar, label: "My Reviews", color: "amber" },
    { page: "rewards", Icon: FiGift, label: "My Rewards", color: "purple" },
    { page: "settings", Icon: FiSettings, label: "Settings", color: "slate" },
    { page: "about", Icon: FiInfo, label: "About HEEPIT", color: "cyan" },
    { page: "terms", Icon: FiFileText, label: "Terms & Conditions", color: "indigo" },
];

function Profile({ user, onLogout, setProfilePage }) {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [version, setVersion] = useState("");
    const [showLogoutBox, setShowLogoutBox] = useState(false);

    useEffect(() => {
        if (!user?.user_id) return;
        fetch(`${API}/user/app-version/${user.user_id}`)
            .then((r) => r.json())
            .then((data) => { if (data.success) setVersion(data.version); })
            .catch((err) => console.error("Version load error:", err.message));
    }, [user]);

    useEffect(() => {
        fetch(`${API}/api/user/profile`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_token: localStorage.getItem("session_token") }),
        })
            .then((r) => r.json())
            .then((data) => { if (data.success) setProfile(data.user); })
            .catch((err) => console.error("Profile load error:", err.message));
    }, []);

    const maskedMobile = profile?.mobile_number ? `•••• ${profile.mobile_number.slice(-4)}` : "Not set";
    const initials = profile?.full_name?.trim()?.charAt(0)?.toUpperCase() || "?";

    const handleNavigation = (page) => {
        setProfilePage(page);
        navigate(`/profile/${page}`);
    };

    return (
        <div className="profile">
            <div className="profile-header">
                <div className="prohead1">
                    {profile?.profile_image ? (
                        <img
                            src={profile.profile_image}
                            alt="Profile"
                            className="profile-image1"
                            loading="lazy"
                            onError={(e) => { e.target.onerror = null; e.target.src = NODP; }}
                        />
                    ) : (
                        <div className="profile-image1 profile-initials">{initials}</div>
                    )}
                </div>

                <div className="prohead2">
                    <h2>{profile?.full_name || "Set your name"}</h2>
                    <p className="profile-phone"><FiPhone /> {maskedMobile}</p>
                    <button className="edit-profile-btn-pro" onClick={() => handleNavigation("viewprofile")}>
                        View Profile
                    </button>
                </div>
            </div>

            <div className="profile-menu">
                {MENU_ITEMS.map(({ page, Icon, label, color }) => (
                    <button
                        key={page}
                        className={`profile-item profile-item-${color}`}
                        onClick={() => handleNavigation(page)}
                    >
                        <span className="profile-item-icon"><Icon /></span>
                        <span className="profile-item-label">{label}</span>
                    </button>
                ))}
            </div>

            <button className="logout-btn" onClick={() => setShowLogoutBox(true)}>
                <FiLogOut /> Logout
            </button>

            {version && <p className="profile-version">HEEPIT v{version}</p>}

            {showLogoutBox && (
                <div className="logout-overlay" onClick={() => setShowLogoutBox(false)}>
                    <div className="logout-message-box" onClick={(e) => e.stopPropagation()}>
                        <div className="logout-icon-wrap"><FiLogOut /></div>
                        <h3>Logout?</h3>
                        <p>Are you sure you want to logout?</p>
                        <div className="logout-box-buttons">
                            <button className="logout-cancel-btn" onClick={() => setShowLogoutBox(false)}>Cancel</button>
                            <button className="logout-confirm-btn" onClick={() => { setShowLogoutBox(false); onLogout(); }}>Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;