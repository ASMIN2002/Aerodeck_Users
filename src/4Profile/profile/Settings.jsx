import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMoon, FiSun, FiUser, FiMapPin, FiChevronRight } from "react-icons/fi";
import "../profilestyles/Settings.css";

function Settings({ setProfilePage, userId }) {
    const navigate = useNavigate();
    const themeKey = userId ? `theme_${userId}` : "theme_guest";
    const [theme, setTheme] = useState(() => localStorage.getItem(themeKey) || "light");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(themeKey, theme);
    }, [theme, themeKey]);

    const handleBack = () => { setProfilePage("profile"); navigate(-1); };
    const toggleTheme = () => setTheme((p) => (p === "light" ? "dark" : "light"));

    const goEdit = () => { setProfilePage("editprofile"); navigate("/profile/viewprofile/editprofile"); };
    const goAddress = () => { setProfilePage("viewaddress"); navigate("/profile/viewaddress"); };

    const isDark = theme === "dark";

    return (
        <div className="settings-page">
            <div className="settings-header">
                <button className="settings-back" onClick={handleBack} aria-label="Back">
                    <FiArrowLeft />
                </button>
                <h2 className="settings-title">Settings</h2>
            </div>

            <div className="settings-content">
                <div className="settings-row settings-row-theme">
                    <div className="settings-row-left">
                        <span className={`settings-row-icon ${isDark ? "theme-dark" : "theme-light"}`}>
                            {isDark ? <FiMoon /> : <FiSun />}
                        </span>
                        <div className="settings-row-text">
                            <span className="settings-row-title">{isDark ? "Dark Mode" : "Light Mode"}</span>
                            <span className="settings-row-sub">{isDark ? "Switch to light theme" : "Switch to dark theme"}</span>
                        </div>
                    </div>
                    <button className={`theme-toggle ${isDark ? "on" : ""}`} onClick={toggleTheme} aria-label="Toggle theme">
                        <span className="theme-toggle-thumb" />
                    </button>
                </div>

                <button className="settings-row settings-row-btn" onClick={goEdit}>
                    <div className="settings-row-left">
                        <span className="settings-row-icon profile-icon"><FiUser /></span>
                        <div className="settings-row-text">
                            <span className="settings-row-title">Edit Profile</span>
                            <span className="settings-row-sub">Update your name, email and photo</span>
                        </div>
                    </div>
                    <FiChevronRight className="settings-arrow" />
                </button>

                <button className="settings-row settings-row-btn" onClick={goAddress}>
                    <div className="settings-row-left">
                        <span className="settings-row-icon address-icon"><FiMapPin /></span>
                        <div className="settings-row-text">
                            <span className="settings-row-title">Edit Addresses</span>
                            <span className="settings-row-sub">Manage your saved addresses</span>
                        </div>
                    </div>
                    <FiChevronRight className="settings-arrow" />
                </button>
            </div>
        </div>
    );
}

export default Settings;