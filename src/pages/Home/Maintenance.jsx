import "./Maintenance.css";

function Maintenance() {
    return (
        <div className="maintenance-page">

            <div className="maintenance-card">

                <div className="maintenance-icon">
                    🛠️
                </div>

                <h1 className="maintenance-title">
                    Under Maintenance
                </h1>

                <p className="maintenance-text">
                    We're currently performing scheduled maintenance.
                    <br />
                    We'll be back soon.
                </p>

                <div className="maintenance-footer">
                    Thank you for your patience ❤️
                </div>

            </div>

        </div>
    );
}

export default Maintenance;