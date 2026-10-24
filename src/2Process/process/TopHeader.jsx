import "../processstyle/TopHeader.css";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

function TOPHEADER({ title, onBack }) {
    const navigate = useNavigate();

    const handleBack = () => (onBack ? onBack() : navigate(-1));

    return (
        <header className="top-header">
            <div className="top-header-info">
                <button type="button" className="top-header-back" onClick={handleBack} aria-label="Back">
                    <FiArrowLeft />
                </button>
                <h2 className="top-header-name">{title}</h2>
            </div>
            <div className="top-header-title">
                <h3>HEEPIT</h3>
            </div>
        </header>
    );
}

export default TOPHEADER;