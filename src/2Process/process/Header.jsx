import { useLocation, useNavigate } from "react-router-dom";
import { IoNotificationsOutline } from "react-icons/io5";
import Version from "../../1hook/hooks/Version";
import Options from "../../1hook/hooks/Options";
import Notification from "../../1hook/hooks/Notification";
import "../processstyle/Header.css";

const TAB_LABELS = {
    Offers: "OFFERS",
    Premium: "MEDICURE",
    Cart: "CART",
    Profile: "PROFILE",
};

const MENU_ROUTES = {
    Shop: "/home/shop",
    Cards: "/home/cards",
    Gifts: "/home/gifts",
};

const STAR_COUNT = 28;
const STARS = Array.from({ length: STAR_COUNT }, (_, i) => i + 1);

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
    const { pathname } = useLocation();

    const showNotifOverlay = pathname === "/notification";
    const isHomeTab = selectedBottomTab === "Home";
    const modeLabel = TAB_LABELS[selectedBottomTab] || null;

    const handleSelect = (option) => {
        if (isDetailsOpen) closeDetails();
        setSelectedBottomTab("Home");
        setSelectedMenu(option.key);
        setIsMenuOpen(false);

        const targetUrl = MENU_ROUTES[option.key];
        if (targetUrl && pathname !== targetUrl) {
            navigate(targetUrl);
        } else {
            onReloadHome?.();
        }
    };

    const handleComingSoon = (label) => console.log(`${label} Coming Soon!`);
    const handleOpenNotif = () => navigate("/notification");
    const handleCloseNotif = () => navigate(-1);

    return (
        <>
            <header className="hd-header">
                <div className="hd-stars" aria-hidden="true">
                    {STARS.map((n) => <span key={n} className={`hd-star hd-star-${n}`} />)}
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
                        {isHomeTab ? (
                            <Options
                                selectedMenu={selectedMenu}
                                onSelect={handleSelect}
                                onComingSoon={handleComingSoon}
                            />
                        ) : (
                            <div className="hd-mode-label">
                                <span className="hd-mode-label-text">{modeLabel}</span>
                            </div>
                        )}

                        <button
                            type="button"
                            className="hd-notif-btn"
                            onClick={handleOpenNotif}
                            aria-label="Notifications"
                        >
                            <IoNotificationsOutline className="hd-notif-icon" />
                        </button>
                    </div>
                </div>
            </header>

            {showNotifOverlay && <Notification onClose={handleCloseNotif} />}
        </>
    );
}

export default Header;