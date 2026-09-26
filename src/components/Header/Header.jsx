import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { IoNotificationsOutline } from "react-icons/io5";
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
    userId
}) {
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const [version, setVersion] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [showNotifOverlay, setShowNotifOverlay] = useState(false);
    const [hasNotification, setHasNotification] = useState(false);

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
       CHECK NOTIFICATION — red dot ke liye
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
       BELL CLICK — notification overlay kholo
       ============================================ */
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

    /* ============================================
       TAB CLICK
       ============================================ */
    const handleTabClick = (menu) => {
        if (isDetailsOpen) {
            closeDetails();
        }
        setSelectedBottomTab("Home");
        setSelectedMenu(menu);
        setIsMenuOpen(false);
    };

    const handleComingSoon = (feature) => {
        setToastMessage(`${feature} Coming Soon!`);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 2000);
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

                    <div className="hd-tabs">
                        <button
                            type="button"
                            className={`hd-tab ${selectedMenu === "Shop" ? "hd-tab-active" : ""}`}
                            onClick={() => {
                                handleTabClick("Shop");
                                navigate("/home/shop");
                            }}
                        >
                            Products
                        </button>

                        <button
                            type="button"
                            className={`hd-tab ${selectedMenu === "Gifts" ? "hd-tab-active" : ""}`}
                            onClick={() => handleComingSoon("Gifts")}
                        >
                            Gifts
                        </button>

                        <button
                            type="button"
                            className={`hd-tab ${selectedMenu === "Cards" ? "hd-tab-active" : ""}`}
                            onClick={() => handleComingSoon("Cards")}
                        >
                            Cards
                        </button>
                    </div>

                </div>

            </header>

            {/* ============================================
                NOTIFICATION OVERLAY — Notification.jsx se
               ============================================ */}
            {showNotifOverlay && (
                <Notification onClose={handleNotifClose} />
            )}

            {createPortal(toastElement, document.body)}
        </>
    );
}

export default Header;