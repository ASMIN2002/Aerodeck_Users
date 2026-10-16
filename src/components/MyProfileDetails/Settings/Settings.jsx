import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

function Settings({ setProfilePage, userId }) {
    const navigate = useNavigate();

    // per-user storage key
    const themeKey = userId ? `theme_${userId}` : "theme_guest";

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem(themeKey) || "light";
    });

    // apply theme on mount + whenever it changes
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
            </div>
        </div>
    );
}

export default Settings;