import "./TOPHEADER.css";
import { useNavigate } from "react-router-dom";

function TOPHEADER({ title, onBack }) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <header className="top-header">
            <div className="top-header-info">
                <button
                    type="button"
                    className="top-header-back"
                    onClick={handleBack}
                >
                    ←
                </button>
                <h2>{title}</h2>
            </div>
            <div className="top-header-title">
                <h3>HEEPIT</h3>
            </div>
        </header>
    );
}

export default TOPHEADER;