import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";
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

    const [showMenuDropdown, setShowMenuDropdown] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState("Products");

    /* ============================================
       LOAD APP VERSION
       ============================================ */
    useEffect(() => {
        async function loadVersion() {
            try {
                const response = await fetch(
                    `${API}/user/app-version/${userId}`
                );
                const data = await response.json();
                if (data.success) {
                    setVersion(data.version);
                }
            } catch (err) {
                console.log(err);
            }
        }

        if (userId) {
            loadVersion();
        }
    }, [userId]);

    /* ============================================
       CHECK NOTIFICATION
       ============================================ */
    useEffect(() => {

        async function checkNotifications() {
            try {
                const sessionToken = localStorage.getItem("session_token");

                const res = await fetch(
                    `${API}/api/user/rewards?session_token=${sessionToken}`
                );
                const data = await res.json();

                if (data.success && data.data) {
                    if (data.data.req_userid && data.data.req_userid > 0) {
                        setHasNotification(true);
                    } else {
                        setHasNotification(false);
                    }
                }

            } catch (err) {
                console.log(err);
            }
        }

        if (userId) {
            checkNotifications();
        }

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

    const handleNotifOpen = () => {
        setShowNotifOverlay(true);
        window.history.pushState({}, "", "/notification");
    };

    const handleNotifClose = () => {
        setShowNotifOverlay(false);
        navigate(-1);
        setTimeout(() => {
            checkNotifications();
        }, 500);
    };

    const handleComingSoon = (feature) => {
        setToastMessage(`${feature} Coming Soon!`);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 2000);
    };

    const menuOptions = [
        { key: "Shop", label: "Products", comingSoon: false },
        { key: "Gifts", label: "Gift", comingSoon: true },
        { key: "Cards", label: "Card", comingSoon: true }
    ];

    const handleMenuOptionClick = (option) => {
        setShowMenuDropdown(false);

        if (option.comingSoon) {
            handleComingSoon(option.label);
            return;
        }

        setSelectedLabel(option.label);
        handleTabClick(option.key);

        /* 🔥 Parent ko bolo reload karo */
        if (onReloadHome) {
            onReloadHome();
        }

        navigate("/home/shop", { replace: true });
    };

    const handleTabClick = (menu) => {
        if (isDetailsOpen) {
            closeDetails();
        }
        setSelectedBottomTab("Home");
        setSelectedMenu(menu);
        setIsMenuOpen(false);
    };

    const toastElement = showToast ? (
        <div className="hd-toast">
            {toastMessage}
        </div>
    ) : null;

    return (
        <>
            <header className="hd-header" ref={dropdownRef}>

                <div className="hd-top-row">

                    <div className="hd-top-line">

                        <div className="hd-center">
                            <div className="hd-brand-name">
                                HEEPIT
                            </div>
                            <div className="hd-version">
                                v {version ? version : "27.03.01"}
                            </div>
                        </div>

                        <div className="hd-right-actions">

                            <div
                                className="hd-menu-wrap"
                                ref={menuDropdownRef}
                            >
                                <button
                                    type="button"
                                    className={`hd-menu-trigger ${showMenuDropdown ? "open" : ""}`}
                                    onClick={() => setShowMenuDropdown((prev) => !prev)}
                                >
                                    <span className="hd-menu-label">
                                        {selectedLabel}
                                    </span>
                                    <FiChevronDown className="hd-menu-chevron" />
                                </button>

                                {showMenuDropdown && (
                                    <div className="hd-menu-dropdown">
                                        {menuOptions.map((option) => (
                                            <button
                                                key={option.key}
                                                type="button"
                                                className={`hd-menu-option ${selectedMenu === option.key ? "active" : ""}`}
                                                onClick={() => handleMenuOptionClick(option)}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                className="hd-notif-btn"
                                onClick={() => {
                                    setHasNotification(false);
                                    handleNotifOpen();
                                }}
                            >
                                <IoNotificationsOutline />
                                {hasNotification && <span className="hd-notif-dot" />}
                            </button>

                        </div>

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