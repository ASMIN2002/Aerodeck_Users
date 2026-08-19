import "./Update.css";

function Update({ onCancel, onUpdate }) {
    return (
        <div className="update-page">

            <div className="update-card">

                <div className="update-icon">
                    ↻
                </div>

                <h1>Update Available</h1>

                <p>
                    A new version of HEEPIT is available.
                    Update now to get the latest version.
                </p>

                <div className="update-actions">

                    <button
                        className="update-cancel"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        className="update-confirm"
                        onClick={() => {
                            window.location.href = "https://heepit.netlify.app/appstore";
                        }}
                    >
                        Update
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Update;