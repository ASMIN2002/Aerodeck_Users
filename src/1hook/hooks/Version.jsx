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
            <div className="hd-version-box">
                <span className="hd-version-dot" />
                <span className="hd-version-text">v {version || FALLBACK_VERSION}</span>
            </div>

            <button
                className={`hd-version-toggle ${theme === "dark" ? "on" : ""}`}
                onClick={toggleTheme}
                aria-label="Toggle theme"
                aria-pressed={theme === "dark"}
            >
                <span className="hd-version-toggle-thumb" />
            </button>
        </div>
    );
}

export default Version;