import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import Notification from "./Notification";
import { API } from "../../services/api";
import "./Header.css";

function Header({
    selectedMenu,
    setSelectedMenu,
    setIsMenuOpen,
    setSelectedBottomTab,
    isDetailsOpen,
    closeDetails,
    userId,
    onReloadHome
}) {
    const dropdownRef = useRef(null);
    const menuDropdownRef = useRef(null);
    const navigate = useNavigate();

    const [version, setVersion] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [showNotifOverlay, setShowNotifOverlay] = useState(false);
    const [hasNotification, setHasNotification] = useState(false);
    const [notifCount, setNotifCount] = useState(0);

    const [showMenuDropdown, setShowMenuDropdown] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState("Products");

    /* ============================================
       LOAD APP VERSION
       ============================================ */
    useEffect(() => {
        async function loadVersion() {
            try {
                const response = await fetch(`${API}/user/app-version/${userId}`);
                const data = await response.json();
                if (data.success) setVersion(data.version);
            } catch (err) {
                console.log(err);
            }
        }
        if (userId) loadVersion();
    }, [userId]);

    /* ============================================
       CHECK NOTIFICATION COUNT + RED DOT
       ============================================ */
    useEffect(() => {
        async function checkNotifications() {
            try {
                const res = await fetch(`${API}/api/user/notification/count`);
                const data = await res.json();

                if (data.success) {
                    const currentCount = data.count || 0;
                    setNotifCount(currentCount);

                    const lastSeenCount = parseInt(
                        localStorage.getItem("lastSeenCount") || "0",
                        10
                    );

                    setHasNotification(currentCount > lastSeenCount);
                }
            } catch (err) {
                console.log(err);
            }
        }
        if (userId) checkNotifications();
    }, [userId, showNotifOverlay]);

    /* ============================================
       CLICK OUTSIDE — MENU DROPDOWN CLOSE
       ============================================ */
    useEffect(() => {
        function handleClickOutside(e) {
            if (
                menuDropdownRef.current &&
                !menuDropdownRef.current.contains(e.target)
            ) {
                setShowMenuDropdown(false);
            }
        }
        if (showMenuDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [showMenuDropdown]);

    useEffect(() => {
        if (selectedMenu === "Shop") setSelectedLabel("Products");
        else if (selectedMenu === "Gifts") setSelectedLabel("Gift");
        else if (selectedMenu === "Cards") setSelectedLabel("Card");
    }, [selectedMenu]);

    /* ============================================
       NOTIF OPEN / CLOSE
       ============================================ */
    const handleNotifOpen = () => {
        localStorage.setItem("lastSeenCount", String(notifCount));
        setHasNotification(false);
        setShowNotifOverlay(true);
        window.history.pushState({}, "", "/notification");
    };

    const handleNotifClose = () => {
        setShowNotifOverlay(false);
        navigate(-1);
        setTimeout(() => {
            setHasNotification(prev => {
                const lastSeenCount = parseInt(
                    localStorage.getItem("lastSeenCount") || "0",
                    10
                );
                return notifCount > lastSeenCount;
            });
        }, 500);
    };

    const handleComingSoon = (feature) => {
        setToastMessage(`${feature} Coming Soon!`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const menuOptions = [
        { key: "Shop", label: "Products", icon: "🛍️", comingSoon: false },
        { key: "Gifts", label: "Gifts", icon: "🎁", comingSoon: true },
        { key: "Cards", label: "Cards", icon: "💳", comingSoon: true }
    ];

    const handleMenuOptionClick = (option) => {
        setShowMenuDropdown(false);

        if (option.comingSoon) {
            handleComingSoon(option.label);
            return;
        }

        setSelectedLabel(option.label);
        handleTabClick(option.key);

        if (onReloadHome) onReloadHome();
        navigate("/home/shop", { replace: true });
    };

    const handleTabClick = (menu) => {
        if (isDetailsOpen) closeDetails();
        setSelectedBottomTab("Home");
        setSelectedMenu(menu);
        setIsMenuOpen(false);
    };

    const toastElement = showToast ? (
        <div className="hd-toast" role="status" aria-live="polite">
            <span className="hd-toast-icon">
                <HiOutlineSparkles />
            </span>
            <span className="hd-toast-text">{toastMessage}</span>
            <span className="hd-toast-bar" />
        </div>
    ) : null;

    return (
        <>
            {/* ============ HEADER ============ */}
            <header className="hd-header" ref={dropdownRef}>
                <div className="hd-glow" />

                <div className="hd-inner">

                    {/* ---- LEFT: BRAND ---- */}
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

                    {/* ---- RIGHT: ACTIONS ---- */}
                    <div className="hd-actions">

                        {/* Menu Dropdown */}
                        <div className="hd-menu-wrap" ref={menuDropdownRef}>
                            <button
                                type="button"
                                className={`hd-menu-trigger ${showMenuDropdown ? "open" : ""}`}
                                onClick={() => setShowMenuDropdown(p => !p)}
                                aria-haspopup="true"
                                aria-expanded={showMenuDropdown}
                            >
                                <span className="hd-menu-label">{selectedLabel}</span>
                                <span className={`hd-menu-chevron ${showMenuDropdown ? "rotate" : ""}`}>
                                    <FiChevronDown />
                                </span>
                            </button>

                            {showMenuDropdown && (
                                <div className="hd-menu-dropdown" role="menu">
                                    <div className="hd-menu-dropdown-head">
                                        Browse
                                    </div>
                                    {menuOptions.map((option) => (
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

                        {/* Notification Bell */}
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
                <Notification onClose={handleNotifClose} />
            )}

            {createPortal(toastElement, document.body)}
        </>
    );
}

export default Header;