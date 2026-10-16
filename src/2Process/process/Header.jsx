import { useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import Version from "../../1hook/hooks/Version";
import Options from "../../1hook/hooks/Options";
// import Notification from "../../Notification";
import Notification from "../../1hook/hooks/Notification";
import "../processstyle/Header.css";

function Header({
    selectedMenu,
    setSelectedMenu,
    setIsMenuOpen,
    setSelectedBottomTab,
    isDetailsOpen,
    closeDetails,
    userId,
    onReloadHome,
}) {
    const [showNotifOverlay, setShowNotifOverlay] = useState(false);

    const handleSelect = (option) => {
        if (isDetailsOpen) closeDetails();
        setSelectedBottomTab("Home");
        setSelectedMenu(option.key);
        setIsMenuOpen(false);
        if (onReloadHome) onReloadHome();
    };

    const handleComingSoon = (label) => {
        console.log(`${label} Coming Soon!`);
    };

    return (
        <>
            <header className="hd-header">
                <div className="hd-glow" />

                <div className="hd-inner">
                    <div className="hd-brand">
                        <div className="hd-brand-mark">
                            <span>H</span>
                        </div>
                        <div className="hd-brand-text">
                            <h1 className="hd-brand-name">HEEPIT</h1>
                            <Version userId={userId} />
                        </div>
                    </div>

                    <div className="hd-actions">
                        <Options
                            selectedMenu={selectedMenu}
                            onSelect={handleSelect}
                            onComingSoon={handleComingSoon}
                        />

                        <button
                            className="hd-notif-btn"
                            onClick={() => setShowNotifOverlay(true)}
                            aria-label="Notifications"
                        >
                            <IoNotificationsOutline className="hd-notif-icon" />
                        </button>
                    </div>
                </div>
            </header>

            {showNotifOverlay && (
                <Notification onClose={() => setShowNotifOverlay(false)} />
            )}
        </>
    );
}

export default Header;