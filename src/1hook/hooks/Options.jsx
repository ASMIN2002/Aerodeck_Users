import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiShoppingBag, FiCreditCard, FiCoffee } from "react-icons/fi";
import "../hooksstyle/Options.css";

export const MENU_OPTIONS = [
    { key: "Shop", label: "Products", Icon: FiShoppingBag, route: "/home/shop" },
    { key: "Cards", label: "Cards", Icon: FiCreditCard, route: "/home/cards" },
    { key: "Food", label: "Food", Icon: FiCoffee, route: "/home/food", comingSoon: true },
];

const DEFAULT_OPTION = MENU_OPTIONS[0];
const CLOSE_ANIM_MS = 220;
const ESCAPE = "Escape";

function Options({ selectedMenu, onSelect, onComingSoon }) {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const wrapRef = useRef(null);
    const timerRef = useRef(null);

    const current = MENU_OPTIONS.find((o) => o.key === selectedMenu) || DEFAULT_OPTION;
    const CurrentIcon = current.Icon;

    const clearTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const openMenu = () => {
        clearTimer();
        setMounted(true);
        setOpen(true);
    };

    const closeMenu = () => {
        setOpen(false);
        timerRef.current = setTimeout(() => {
            setMounted(false);
            timerRef.current = null;
        }, CLOSE_ANIM_MS);
    };

    const toggle = () => (open ? closeMenu() : openMenu());

    useEffect(() => {
        if (!mounted) return;

        const onOutside = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) closeMenu();
        };
        const onEscape = (e) => {
            if (e.key === ESCAPE) closeMenu();
        };

        const attachTimer = setTimeout(() => {
            document.addEventListener("mousedown", onOutside);
            document.addEventListener("touchstart", onOutside);
            document.addEventListener("keydown", onEscape);
        }, 0);

        return () => {
            clearTimeout(attachTimer);
            document.removeEventListener("mousedown", onOutside);
            document.removeEventListener("touchstart", onOutside);
            document.removeEventListener("keydown", onEscape);
        };
    }, [mounted]);

    useEffect(() => clearTimer, []);

    const handleClick = (option) => {
        closeMenu();
        if (option.comingSoon) return onComingSoon(option.label);
        onSelect(option);
    };
    return (
        <div className="hd-menu-wrap" ref={wrapRef}>
            <button
                type="button"
                className={`hd-menu-trigger ${open ? "open" : ""}`}
                onClick={toggle}
                aria-haspopup="menu"
                aria-expanded={open}
            >
                <span className="hd-menu-trigger-icon">
                    <CurrentIcon className="hd-menu-icon" />
                </span>
                <span className="hd-menu-label">{current.label}</span>
                <span className={`hd-menu-chevron ${open ? "rotate" : ""}`}>
                    <FiChevronDown />
                </span>
            </button>

            {mounted && (
                <div className={`hd-menu-dropdown ${open ? "show" : "hide"}`} role="menu">
                    {MENU_OPTIONS.map(({ key, label, Icon, comingSoon }) => {
                        const isActive = selectedMenu === key;
                        return (
                            <button
                                key={key}
                                type="button"
                                role="menuitem"
                                className={`hd-menu-option ${isActive ? "active" : ""} ${comingSoon ? "soon" : ""}`}
                                onClick={() => handleClick({ key, label, comingSoon })}
                            >
                                <span className="hd-menu-option-icon">
                                    <Icon />
                                </span>
                                <span className="hd-menu-option-label">{label}</span>
                                {comingSoon && <span className="hd-menu-option-badge">Soon</span>}
                                {isActive && !comingSoon && <span className="hd-menu-option-dot" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Options;