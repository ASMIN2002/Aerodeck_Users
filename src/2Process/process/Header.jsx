import { useLocation, useNavigate } from "react-router-dom";
import { IoNotificationsOutline } from "react-icons/io5";
import Version from "../../1hook/hooks/Version";
import Options from "../../1hook/hooks/Options";
import Notification from "../../1hook/hooks/Notification";
import "../processstyle/Header.css";

function Header({
    selectedMenu,
    setSelectedMenu,
    setIsMenuOpen,
    setSelectedBottomTab,
    selectedBottomTab,
    isDetailsOpen,
    closeDetails,
    userId,
    onReloadHome,
}) {
    const navigate = useNavigate();
    const location = useLocation();

    const showNotifOverlay = location.pathname === "/notification";

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

    const handleOpenNotif = () => {
        navigate("/notification");
    };

    const handleCloseNotif = () => {
        navigate(-1);
    };

    const modeLabel =
        selectedBottomTab === "Offers" ? "OFFERS" :
            selectedBottomTab === "Premium" ? "MEDICURE" :
                selectedBottomTab === "Cart" ? "CART" :
                    selectedBottomTab === "Profile" ? "PROFILE" :
                        null;

    return (
        <>
            <header className="hd-header">
                <div className="hd-stars" aria-hidden="true">
                    {Array.from({ length: 28 }).map((_, i) => (
                        <span key={i} className={`hd-star hd-star-${i + 1}`} />
                    ))}
                    <span className="hd-shine" />
                </div>

                <div className="hd-inner">
                    <div className="hd-brand">
                        <div className="hd-brand-text">
                            <h1 className="hd-brand-name">HEEPIT</h1>
                            <Version userId={userId} />
                        </div>
                    </div>

                    <div className="hd-actions">
                        {selectedBottomTab === "Home" ? (
                            <Options
                                selectedMenu={selectedMenu}
                                onSelect={handleSelect}
                                onComingSoon={handleComingSoon}
                            />
                        ) : (
                            <div className="hd-mode-label">{modeLabel}</div>
                        )}

                        <button
                            className="hd-notif-btn"
                            onClick={handleOpenNotif}
                            aria-label="Notifications"
                        >
                            <IoNotificationsOutline className="hd-notif-icon" />
                        </button>
                    </div>
                </div>
            </header>

            {showNotifOverlay && (
                <Notification onClose={handleCloseNotif} />
            )}
        </>
    );
}

export default Header;