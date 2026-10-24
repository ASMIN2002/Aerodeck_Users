import "../processstyle/BottomNav.css";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiGift, FiShoppingCart, FiUser } from "react-icons/fi";
import { MdHealthAndSafety } from "react-icons/md";
import { API } from "../../services/api";

const TOAST_DURATION = 2500;
const SCROLL_DELAY = 150;
const KEYBOARD_THRESHOLD = 150;

const NAV_ITEMS = [
    { key: "Home", label: "Home", icon: FiHome, path: "/home/shop", clearMenu: false },
    { key: "Offers", label: "Offer", icon: FiGift, path: "/offers", clearMenu: false },
    { key: "Premium", label: "Medicure", icon: MdHealthAndSafety, path: "/medicure", clearMenu: false },
    { key: "Cart", label: "My Cart", icon: FiShoppingCart, path: "/cart", showCartCount: true, clearMenu: true },
    { key: "Profile", label: "Profile", icon: FiUser, path: "/profile", clearMenu: true },
];

function getSessionToken() {
    return localStorage.getItem("session_token");
}

function scrollAllToTop() {
    const homeContent = document.querySelector(".home-content");
    if (homeContent) {
        homeContent.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function BottomNav({
    selectedBottomTab,
    setSelectedBottomTab,
    setSelectedMenu,
    isDetailsOpen,
    closeDetails,
    setProfilePage,
    cartCount,
    setCartCount,
}) {
    const navigate = useNavigate();
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [isScrolledDown, setIsScrolledDown] = useState(false);

    useEffect(() => {
        const fetchCartCount = async () => {
            const sessionToken = getSessionToken();

            if (!sessionToken) {
                setCartCount(0);
                return;
            }

            try {
                const res = await fetch(
                    `${API}/api/user/cart?session_token=${sessionToken}`
                );

                if (res.status === 401) {
                    setCartCount(0);
                    return;
                }

                const data = await res.json();

                if (data.success && data.data) {
                    setCartCount(data.data.length);
                } else {
                    setCartCount(0);
                }
            } catch (err) {
                console.error("Cart count error:", err.message);
                setCartCount(0);
            }
        };

        fetchCartCount();
    }, [setCartCount]);

    useEffect(() => {
        const vv = window.visualViewport;
        if (!vv) return;

        const handleResize = () => {
            const keyboardHeight = window.innerHeight - vv.height;
            setIsKeyboardOpen(keyboardHeight > KEYBOARD_THRESHOLD);
        };

        vv.addEventListener("resize", handleResize);
        vv.addEventListener("scroll", handleResize);
        handleResize();

        return () => {
            vv.removeEventListener("resize", handleResize);
            vv.removeEventListener("scroll", handleResize);
        };
    }, []);

    useEffect(() => {
        let lastTop = 0;
        let ticking = false;
        let targetEl = null;

        const readTop = () => {
            if (targetEl) return targetEl.scrollTop;
            return window.scrollY || document.documentElement.scrollTop || 0;
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                const current = readTop();
                const delta = current - lastTop;

                if (Math.abs(delta) > 4) {
                    const atBottom = targetEl
                        ? targetEl.scrollHeight - targetEl.scrollTop - targetEl.clientHeight < 24
                        : window.innerHeight + current >=
                        document.documentElement.scrollHeight - 24;

                    if (delta > 0 && current > 40 && !atBottom) {
                        setIsScrolledDown(true);
                    } else {
                        setIsScrolledDown(false);
                    }
                }

                lastTop = current;
                ticking = false;
            });
        };

        const attach = () => {
            targetEl = document.querySelector(".home-content");

            window.addEventListener("scroll", onScroll, { passive: true });
            if (targetEl) {
                targetEl.addEventListener("scroll", onScroll, { passive: true });
            }

            lastTop = readTop();
        };

        const detach = () => {
            window.removeEventListener("scroll", onScroll);
            if (targetEl) {
                targetEl.removeEventListener("scroll", onScroll);
                targetEl = null;
            }
        };

        attach();

        const observer = new MutationObserver(() => {
            const next = document.querySelector(".home-content");
            if (next && next !== targetEl) {
                detach();
                attach();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            detach();
        };
    }, []);

    const showComingSoonToast = useCallback(() => {
        setShowComingSoon(true);
        setTimeout(() => setShowComingSoon(false), TOAST_DURATION);
    }, []);

    const handleNavClick = useCallback(
        (item) => {
            if (item.comingSoon) {
                showComingSoonToast();
                return;
            }

            if (isDetailsOpen) closeDetails();

            if (item.clearMenu) {
                setSelectedMenu(null);
            } else if (item.key === "Home") {
                setSelectedMenu("Shop");
            }

            if (item.key === "Home") {
                setProfilePage("profile");
            } else if (item.key === "Offers") {
                setProfilePage("profile");
            } else if (item.key === "Cart") {
                setProfilePage("cart");
            } else if (item.key === "Profile") {
                setProfilePage("profile");
            }

            setSelectedBottomTab(item.key);
            navigate(item.path);

            if (item.key === "Home" || item.key === "Offers") {
                setTimeout(scrollAllToTop, SCROLL_DELAY);
            }
        },
        [
            isDetailsOpen,
            closeDetails,
            setSelectedMenu,
            setProfilePage,
            setSelectedBottomTab,
            navigate,
            showComingSoonToast,
        ]
    );

    return (
        <>
            <nav
                className={`bn-nav ${isKeyboardOpen ? "bn-hidden" : ""} ${isScrolledDown ? "bn-scrolled-down" : ""}`}
            >
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = selectedBottomTab === item.key;

                    return (
                        <button
                            key={item.key}
                            className={`bn-item ${isActive ? "bn-active" : ""}`}
                            onClick={() => handleNavClick(item)}
                        >
                            <span className={item.comingSoon ? "bn-iconpre" : "bn-icon"}>
                                <Icon />
                                {item.showCartCount && (
                                    <span className="bn-cart-count">{cartCount}</span>
                                )}
                            </span>
                            <span className="bn-label">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {showComingSoon && (
                <div className="bn-coming-toast">Available Soon</div>
            )}
        </>
    );
}

export default BottomNav;