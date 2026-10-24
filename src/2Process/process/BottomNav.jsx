import "../processstyle/BottomNav.css";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiGift, FiShoppingCart, FiUser } from "react-icons/fi";
import { MdHealthAndSafety } from "react-icons/md";
import { API } from "../../services/api";

const TOAST_DURATION = 2500;
const SCROLL_DELAY = 150;
const KEYBOARD_THRESHOLD = 150;
const SCROLL_DELTA = 4;
const TOP_THRESHOLD = 40;
const BOTTOM_THRESHOLD = 24;

const NAV_ITEMS = [
    { key: "Home", label: "Home", icon: FiHome, path: "/home/shop", profilePage: "profile", menu: "Shop" },
    { key: "Offers", label: "Offer", icon: FiGift, path: "/offers", profilePage: "profile", scrollTop: true },
    { key: "Premium", label: "Medicure", icon: MdHealthAndSafety, path: "/medicure", profilePage: "profile" },
    { key: "Cart", label: "My Cart", icon: FiShoppingCart, path: "/cart", profilePage: "cart", menu: null, showCount: true },
    { key: "Profile", label: "Profile", icon: FiUser, path: "/profile", profilePage: "profile", menu: null },
];

const getSession = () => localStorage.getItem("session_token");

const scrollAllToTop = () => {
    document.querySelector(".home-content")?.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
};

function BottomNav({ selectedBottomTab, setSelectedBottomTab, setSelectedMenu, isDetailsOpen, closeDetails, setProfilePage, cartCount, setCartCount }) {
    const navigate = useNavigate();
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [isScrolledDown, setIsScrolledDown] = useState(false);

    useEffect(() => {
        const session = getSession();
        if (!session) return setCartCount(0);

        fetch(`${API}/api/user/cart?session_token=${session}`)
            .then((res) => (res.status === 401 ? null : res.json()))
            .then((data) => setCartCount(data?.success && data.data ? data.data.length : 0))
            .catch((err) => { console.error("Cart count error:", err.message); setCartCount(0); });
    }, [setCartCount]);

    useEffect(() => {
        const vv = window.visualViewport;
        if (!vv) return;
        const onResize = () => setIsKeyboardOpen(window.innerHeight - vv.height > KEYBOARD_THRESHOLD);
        vv.addEventListener("resize", onResize);
        vv.addEventListener("scroll", onResize);
        onResize();
        return () => {
            vv.removeEventListener("resize", onResize);
            vv.removeEventListener("scroll", onResize);
        };
    }, []);

    useEffect(() => {
        let lastTop = 0;
        let ticking = false;
        let targetEl = null;

        const readTop = () => targetEl ? targetEl.scrollTop : window.scrollY || document.documentElement.scrollTop || 0;

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const current = readTop();
                const delta = current - lastTop;
                if (Math.abs(delta) > SCROLL_DELTA) {
                    const atBottom = targetEl
                        ? targetEl.scrollHeight - targetEl.scrollTop - targetEl.clientHeight < BOTTOM_THRESHOLD
                        : window.innerHeight + current >= document.documentElement.scrollHeight - BOTTOM_THRESHOLD;
                    setIsScrolledDown(delta > 0 && current > TOP_THRESHOLD && !atBottom);
                }
                lastTop = current;
                ticking = false;
            });
        };

        const attach = () => {
            targetEl = document.querySelector(".home-content");
            window.addEventListener("scroll", onScroll, { passive: true });
            targetEl?.addEventListener("scroll", onScroll, { passive: true });
            lastTop = readTop();
        };

        const detach = () => {
            window.removeEventListener("scroll", onScroll);
            targetEl?.removeEventListener("scroll", onScroll);
            targetEl = null;
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

    const handleNavClick = useCallback((item) => {
        if (item.comingSoon) return showComingSoonToast();
        if (isDetailsOpen) closeDetails();

        if (item.menu !== undefined) setSelectedMenu(item.menu);
        if (item.profilePage) setProfilePage(item.profilePage);

        setSelectedBottomTab(item.key);
        navigate(item.path);
        if (item.scrollTop || item.key === "Home") setTimeout(scrollAllToTop, SCROLL_DELAY);
    }, [isDetailsOpen, closeDetails, setSelectedMenu, setProfilePage, setSelectedBottomTab, navigate, showComingSoonToast]);

    return (
        <>
            <nav className={`bn-nav ${isKeyboardOpen ? "bn-hidden" : ""} ${isScrolledDown ? "bn-scrolled-down" : ""}`}>
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
                                {item.showCount && <span className="bn-cart-count">{cartCount}</span>}
                            </span>
                            <span className="bn-label">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {showComingSoon && <div className="bn-coming-toast">Available Soon</div>}
        </>
    );
}

export default BottomNav;