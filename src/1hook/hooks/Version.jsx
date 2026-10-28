import { useEffect, useState } from "react";
import { API } from "../../services/api";
import "../hooksstyle/Version.css";

const FALLBACK_VERSION = "27.03.01";
const THEME_KEY = "theme_guest";

function Version({ userId }) {
    const [version, setVersion] = useState("");
    const [theme, setTheme] = useState(
        () => document.documentElement.getAttribute("data-theme") || "light"
    );

    useEffect(() => {
        if (!userId) return;
        let ignore = false;

        const loadVersion = async () => {
            try {
                const res = await fetch(`${API}/user/app-version/${userId}`);
                const { success, version: v } = await res.json();
                if (success && !ignore) setVersion(v);
            } catch (err) {
                console.error("Version load error:", err.message);
            }
        };

        loadVersion();
        return () => { ignore = true; };
    }, [userId]);

    const toggleTheme = () => {
        const next = theme === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem(THEME_KEY, next);
        setTheme(next);
    };

    return (
        <div className="hd-version">
            <div className="hd-version-box" title={`App version ${version || FALLBACK_VERSION}`}>
                <span className="hd-version-dot" aria-hidden="true" />
                <span className="hd-version-text">v {version || FALLBACK_VERSION}</span>
            </div>

            <button
                type="button"
                className={`hd-version-toggle ${theme === "dark" ? "on" : ""}`}
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
                aria-pressed={theme === "dark"}
            >
                <span className="hd-version-toggle-icon hd-version-toggle-sun" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                    </svg>
                </span>
                <span className="hd-version-toggle-icon hd-version-toggle-moon" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                </span>
                <span className="hd-version-toggle-thumb" aria-hidden="true" />
            </button>
        </div>
    );
}

export default Version;