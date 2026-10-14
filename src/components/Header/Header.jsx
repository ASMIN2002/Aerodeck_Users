import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import Notification from "./Notification";
import { API } from "../../services/api";
import "./Header.css";

const MENU_OPTIONS = [
    { key: "Shop", label: "Products", icon: "🛍️", route: "/home/shop", comingSoon: false },
    { key: "Cards", label: "Cards", icon: "💳", route: "/home/cards", comingSoon: false },
    { key: "Gifts", label: "Gifts", icon: "🎁", route: "/home/gifts", comingSoon: true },
];

const DEFAULT_OPTION = MENU_OPTIONS[0];
const TOAST_DURATION = 2000;

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
    const menuDropdownRef = useRef(null);
    const autoOpenedRef = useRef(false);
    const navigate = useNavigate();

    const [version, setVersion] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [showNotifOverlay, setShowNotifOverlay] = useState(false);
    const [hasNotification, setHasNotification] = useState(false);
    const [notifCount, setNotifCount] = useState(0);
    const [showMenuDropdown, setShowMenuDropdown] = useState(false);

    const currentOption =
        MENU_OPTIONS.find((opt) => opt.key === selectedMenu) || DEFAULT_OPTION;

    useEffect(() => {
        if (!userId) return;

        async function loadVersion() {
            try {
                const res = await fetch(`${API}/user/app-version/${userId}`);
                const data = await res.json();
                if (data.success) setVersion(data.version);
            } catch (err) {
                console.error("Version load error:", err.message);
            }
        }

        loadVersion();
    }, [userId]);

    useEffect(() => {
        if (!userId) return;

        async function checkNotifications() {
            try {
                const sessionToken = localStorage.getItem("session_token");

                const rewardRes = await fetch(
                    `${API}/api/user/rewards?session_token=${sessionToken}`
                );
                const rewardData = await rewardRes.json();

                let hasPendingRequest = false;

                if (rewardData.success && rewardData.data) {
                    const rId = rewardData.data.req_userid || 0;
                    const isRedeemed = rewardData.data.redeemed === 1;

                    if (rId > 0 && !isRedeemed) {
                        hasPendingRequest = true;
                        if (!autoOpenedRef.current) {
                            autoOpenedRef.current = true;
                            setShowNotifOverlay(true);
                        }
                    }
                }

                const res = await fetch(`${API}/api/user/notification/count`);
                const data = await res.json();

                if (data.success) {
                    const count = data.count || 0;
                    setNotifCount(count);

                    const lastSeen = parseInt(
                        localStorage.getItem("lastSeenCount") || "0",
                        10
                    );

                    setHasNotification(
                        hasPendingRequest || count > lastSeen
                    );
                }
            } catch (err) {
                console.error("Notification check error:", err.message);
            }
        }

        checkNotifications();
    }, [userId]);

    useEffect(() => {
        if (!showMenuDropdown) return;

        function handleClickOutside(e) {
            if (
                menuDropdownRef.current &&
                !menuDropdownRef.current.contains(e.target)
            ) {
                setShowMenuDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [showMenuDropdown]);

    const handleNotifOpen = () => {
        localStorage.setItem("lastSeenCount", String(notifCount));
        setHasNotification(false);
        setShowNotifOverlay(true);
    };

    const handleNotifClose = () => setShowNotifOverlay(false);

    const handleRedeemHandled = () => {
        setHasNotification(false);
        autoOpenedRef.current = true;
    };

    const handleComingSoon = (feature) => {
        setToastMessage(`${feature} Coming Soon!`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), TOAST_DURATION);
    };

    const handleTabClick = (menu) => {
        if (isDetailsOpen) closeDetails();
        setSelectedBottomTab("Home");
        setSelectedMenu(menu);
        setIsMenuOpen(false);
    };

    const handleMenuOptionClick = (option) => {
        setShowMenuDropdown(false);

        if (option.comingSoon) {
            handleComingSoon(option.label);
            return;
        }

        handleTabClick(option.key);
        if (onReloadHome) onReloadHome();
        navigate(option.route, { replace: true });
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
                            <div className="hd-version">
                                <span className="hd-version-dot" />
                                v {version || "27.03.01"}
                            </div>
                        </div>
                    </div>

                    <div className="hd-actions">
                        <div className="hd-menu-wrap" ref={menuDropdownRef}>
                            <button
                                type="button"
                                className={`hd-menu-trigger ${showMenuDropdown ? "open" : ""}`}
                                onClick={() => setShowMenuDropdown((p) => !p)}
                                aria-haspopup="true"
                                aria-expanded={showMenuDropdown}
                            >
                                <span className="hd-menu-icon">{currentOption.icon}</span>
                                <span className="hd-menu-label">{currentOption.label}</span>
                                <span
                                    className={`hd-menu-chevron ${showMenuDropdown ? "rotate" : ""}`}
                                >
                                    <FiChevronDown />
                                </span>
                            </button>

                            {showMenuDropdown && (
                                <div className="hd-menu-dropdown" role="menu">
                                    <div className="hd-menu-dropdown-head">Browse</div>
                                    {MENU_OPTIONS.map((option) => (
                                        <button
                                            key={option.key}
                                            type="button"
                                            role="menuitem"
                                            className={`hd-menu-option ${selectedMenu === option.key ? "active" : ""} ${option.comingSoon ? "soon" : ""}`}
                                            onClick={() => handleMenuOptionClick(option)}
                                        >
                                            <span className="hd-menu-option-icon">
                                                {option.icon}
                                            </span>
                                            <span className="hd-menu-option-label">
                                                {option.label}
                                            </span>
                                            {option.comingSoon && (
                                                <span className="hd-menu-option-badge">
                                                    Soon
                                                </span>
                                            )}
                                            {selectedMenu === option.key && !option.comingSoon && (
                                                <span className="hd-menu-option-dot" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            className={`hd-notif-btn ${hasNotification ? "has-dot" : ""}`}
                            onClick={handleNotifOpen}
                            aria-label="Notifications"
                        >
                            <IoNotificationsOutline className="hd-notif-icon" />
                            {hasNotification && (
                                <>
                                    <span className="hd-notif-dot" />
                                    {notifCount > 0 && (
                                        <span className="hd-notif-badge">
                                            {notifCount > 9 ? "9+" : notifCount}
                                        </span>
                                    )}
                                </>
                            )}
                            <span className="hd-notif-ripple" />
                        </button>
                    </div>
                </div>
            </header>

            {showNotifOverlay && (
                <Notification
                    onClose={handleNotifClose}
                    onRedeemHandled={handleRedeemHandled}
                />
            )}

            {showToast &&
                createPortal(
                    <div className="hd-toast" role="status" aria-live="polite">
                        <span className="hd-toast-icon">
                            <HiOutlineSparkles />
                        </span>
                        <span className="hd-toast-text">{toastMessage}</span>
                        <span className="hd-toast-bar" />
                    </div>,
                    document.body
                )}
        </>
    );
}

export default Header;