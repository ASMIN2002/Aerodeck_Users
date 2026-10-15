import { useNavigate } from "react-router-dom";
import "./Settings.css";

function Settings({ setProfilePage }) {
    const navigate = useNavigate();

    const handleBack = () => {
        setProfilePage("profile");
        navigate(-1);
    };

    return (
        <div className="settings-page">
            <div className="settings-header">
                <button className="settings-back" onClick={handleBack}>←</button>
                <h2>Settings</h2>
            </div>

            <div className="settings-content">
                <p>Settings coming soon...</p>
            </div>
        </div>
    );
}

export default Settings;