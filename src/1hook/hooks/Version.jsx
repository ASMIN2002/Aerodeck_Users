import { useEffect, useState } from "react";
import { API } from "../../services/api";
import "../hooksstyle/Version.css";

function Version({ userId }) {
    const [version, setVersion] = useState("");
    const [theme, setTheme] = useState(
        () => document.documentElement.getAttribute("data-theme") || "light"
    );

    useEffect(() => {
        if (!userId) return;

        async function loadVersion() {
            try {
                const res = await fetch(`${API}/user/app-version/${userId}`);
                const data = await res.json();
                if (data.success) setVersion(data.version);
            } catch (err) {
                console.error("Version load error:", err.message);
            }
        }

        loadVersion();
    }, [userId]);

    const toggleTheme = () => {
        const next = theme === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme_guest", next);
        setTheme(next);
    };

    return (
        <div className="hd-version">
            <div className="hd-version-box">
                <span className="hd-version-dot" />
                <span className="hd-version-text">v {version || "27.03.01"}</span>
            </div>

            {/* <button
                className={`hd-version-toggle ${theme === "dark" ? "on" : ""}`}
                onClick={toggleTheme}
                aria-label="Toggle theme"
            >
                <span className="hd-version-toggle-thumb" />
            </button> */}
        </div>
    );
}

export default Version;