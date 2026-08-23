import { useEffect, useState } from "react";
import { API } from "../../services/api";
import "./HeaderBack.css";

function HeaderBack({ onBack, userId }) {

    const [version, setVersion] = useState("");

    useEffect(() => {

        async function loadVersion() {

            try {

                const response = await fetch(
                    `${API}/user/app-version/${userId}`
                );

                const data = await response.json();

                if (data.success) {
                    setVersion(data.version);
                }

            } catch (err) {
                console.log(err);
            }
        }

        if (userId) {
            loadVersion();
        }

    }, [userId]);

    return (
        <header className="hdb-header">

            <button
                type="button"
                className="hdb-back-button"
                onClick={onBack}
            >
                ←
            </button>

            <div className="hdb-brand">
                <div className="hdb-brand-name">
                    HEEPIT
                </div>
            </div>

        </header>
    );
}

export default HeaderBack;