import { useEffect, useState } from "react";
import { API } from "../../services/api";
import "../hooksstyle/Version.css";

function Version({ userId }) {
    const [version, setVersion] = useState("");

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

    return (
        <div className="hd-version">
            <span className="hd-version-dot" />
            v {version || "27.03.01"}
        </div>
    );
}

export default Version;