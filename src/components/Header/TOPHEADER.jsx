import "./TOPHEADER.css";

function TOPHEADER({ title, onBack }) {
    return (
        <header className="top-header">
            <div className="top-header-info">
                <button
                    type="button"
                    className="top-header-back"
                    onClick={onBack}
                >
                    ←
                </button>
                <h2>{title}</h2>
            </div>
        </header>
    );
}

export default TOPHEADER;