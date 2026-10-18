import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../profilestyles/Settings.css";

const NAV_DELAY = 500;

function Settings({ setProfilePage, userId, navigateWithLoading }) {
    const navigate = useNavigate();

    const themeKey = userId ? `theme_${userId}` : "theme_guest";

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem(themeKey) || "light";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(themeKey, theme);
    }, [theme, themeKey]);

    const handleBack = () => {
        setProfilePage("profile");
        navigate(-1);
    };

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    const handleEditProfile = () => {
        if (navigateWithLoading) {
            navigateWithLoading(
                () => {
                    setProfilePage("editprofile");
                    navigate("/profile/viewprofile/editprofile");
                },
                "Loading Edit Profile...",
                NAV_DELAY
            );
        } else {
            setProfilePage("editprofile");
            navigate("/profile/viewprofile/editprofile");
        }
    };

    const handleEditAddress = () => {
        if (navigateWithLoading) {
            navigateWithLoading(
                () => {
                    setProfilePage("viewaddress");
                    navigate("/profile/viewaddress");
                },
                "Loading Addresses...",
                NAV_DELAY
            );
        } else {
            setProfilePage("viewaddress");
            navigate("/profile/viewaddress");
        }
    };

    return (
        <div className="settings-page">
            <div className="settings-header">
                <button className="settings-back" onClick={handleBack}>←</button>
                <h2>Settings</h2>
            </div>

            <div className="settings-content">
                <div className="settings-row">
                    <div className="settings-row-text">
                        <span className="settings-row-title">
                            {theme === "dark" ? "Dark Mode" : "Light Mode"}
                        </span>
                        <span className="settings-row-sub">
                            {theme === "dark"
                                ? "Switch to light theme"
                                : "Switch to dark theme"}
                        </span>
                    </div>

                    <button
                        className={`theme-toggle ${theme === "dark" ? "on" : ""}`}
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        <span className="theme-toggle-thumb" />
                    </button>
                </div>

                <div className="settings-row">
                    <div className="settings-row-text">
                        <span className="settings-row-title">Edit Profile</span>
                        <span className="settings-row-sub">
                            Update your name, email and photo
                        </span>
                    </div>
                    <button
                        className="settings-action-btn"
                        onClick={handleEditProfile}
                    >
                        Edit
                    </button>
                </div>

                <div className="settings-row">
                    <div className="settings-row-text">
                        <span className="settings-row-title">Edit Addresses</span>
                        <span className="settings-row-sub">
                            Manage your saved addresses
                        </span>
                    </div>
                    <button
                        className="settings-action-btn"
                        onClick={handleEditAddress}
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;