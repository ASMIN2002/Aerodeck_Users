import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import "../hooksstyle/Options.css";

export const MENU_OPTIONS = [
    { key: "Shop", label: "Products", icon: "🛍️", route: "/home/shop", comingSoon: false },
    { key: "Cards", label: "Cards", icon: "💳", route: "/home/cards", comingSoon: false },
    { key: "Gifts", label: "Gifts", icon: "🎁", route: "/home/gifts", comingSoon: true },
];

const DEFAULT_OPTION = MENU_OPTIONS[0];
const CLOSE_ANIM_MS = 220;

function Options({ selectedMenu, onSelect, onComingSoon }) {
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);
    const closeTimerRef = useRef(null);

    const current =
        MENU_OPTIONS.find((o) => o.key === selectedMenu) || DEFAULT_OPTION;

    const openMenu = () => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
        setMounted(true);
        requestAnimationFrame(() => setOpen(true));
    };

    const closeMenu = () => {
        setOpen(false);
        closeTimerRef.current = setTimeout(() => {
            setMounted(false);
            closeTimerRef.current = null;
        }, CLOSE_ANIM_MS);
    };

    const toggleMenu = () => (open ? closeMenu() : openMenu());

    useEffect(() => {
        if (!mounted) return;

        function handleClickOutside(e) {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                closeMenu();
            }
        }

        function handleEscape(e) {
            if (e.key === "Escape") closeMenu();
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [mounted]);

    useEffect(() => {
        return () => {
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        };
    }, []);

    const handleClick = (option) => {
        closeMenu();
        if (option.comingSoon) {
            onComingSoon(option.label);
            return;
        }
        onSelect(option);
    };

    return (
        <div className="hd-menu-wrap" ref={wrapRef}>
            <button
                type="button"
                className={`hd-menu-trigger ${open ? "open" : ""}`}
                onClick={toggleMenu}
                aria-haspopup="menu"
                aria-expanded={open}
            >
                <span className="hd-menu-icon">{current.icon}</span>
                <span className="hd-menu-label">{current.label}</span>
                <span className={`hd-menu-chevron ${open ? "rotate" : ""}`}>
                    <FiChevronDown />
                </span>
            </button>

            {mounted && (
                <div
                    className={`hd-menu-dropdown ${open ? "show" : "hide"}`}
                    role="menu"
                >
                    {MENU_OPTIONS.map((option) => {
                        const isActive = selectedMenu === option.key;
                        const isSoon = option.comingSoon;

                        return (
                            <button
                                key={option.key}
                                type="button"
                                role="menuitem"
                                className={`hd-menu-option ${isActive ? "active" : ""} ${isSoon ? "soon" : ""}`}
                                onClick={() => handleClick(option)}
                            >
                                <span className="hd-menu-option-icon">
                                    {option.icon}
                                </span>
                                <span className="hd-menu-option-label">
                                    {option.label}
                                </span>

                                {isSoon && (
                                    <span className="hd-menu-option-badge">
                                        Soon
                                    </span>
                                )}

                                {isActive && !isSoon && (
                                    <span className="hd-menu-option-dot" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Options;