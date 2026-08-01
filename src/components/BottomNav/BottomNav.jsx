import "./BottomNav.css";

function BottomNav({

    selectedBottomTab,
    setSelectedBottomTab,
    isDetailsOpen,
    closeDetails,
    setProfilePage

}) {
    return (

        <nav className="bn-nav">
            <button

                className={`bn-item ${selectedBottomTab === "Home" ? "bn-active" : ""}`}

                onClick={() => {

                    if (isDetailsOpen) {

                        closeDetails();

                    }
                    setProfilePage("profile");   // <-- Add this
                    setSelectedBottomTab("Home");

                }}

            >

                <span className="bn-icon">
                    🏠
                </span>

                <span className="bn-text">
                    Home
                </span>

            </button>

            <button

                className={`bn-item ${selectedBottomTab === "Premium" ? "bn-active" : ""}`}

                onClick={() => {

                    if (isDetailsOpen) {

                        closeDetails();

                    }
                    setProfilePage("profile");   // <-- Add this
                    setSelectedBottomTab("Premium");

                }}

            >

                <span className="bn-icon">
                    👑
                </span>

                <span className="bn-text">
                    Premium
                </span>

            </button>

            <button

                className={`bn-item ${selectedBottomTab === "Offers" ? "bn-active" : ""}`}

                onClick={() => {

                    if (isDetailsOpen) {

                        closeDetails();

                    }
                    setProfilePage("profile");   // <-- Add this
                    setSelectedBottomTab("Offers");

                }}

            >

                <span className="bn-icon">
                    🎁
                </span>

                <span className="bn-text">
                    Offers
                </span>

            </button>

            <button

                className={`bn-item ${selectedBottomTab === "Profile" ? "bn-active" : ""}`}

                onClick={() => {

                    if (isDetailsOpen) {

                        closeDetails();

                    }

                    setSelectedBottomTab("Profile");

                }}

            >

                <span className="bn-icon">
                    👤
                </span>

                <span className="bn-text">
                    Profile
                </span>

            </button>

        </nav>

    );

}

export default BottomNav;