import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import "../hooksstyle/Options.css";

export const MENU_OPTIONS = [
    { key: "Shop", label: "Products", icon: "🛍️", route: "/home/shop", comingSoon: false },
    { key: "Cards", label: "Cards", icon: "💳", route: "/home/cards", comingSoon: false },
    { key: "Gifts", label: "Gifts", icon: "🎁", route: "/home/gifts", comingSoon: true },
];

const DEFAULT_OPTION = MENU_OPTIONS[0];

function Options({ selectedMenu, onSelect, onComingSoon }) {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);

    const current =
        MENU_OPTIONS.find((o) => o.key === selectedMenu) || DEFAULT_OPTION;

    useEffect(() => {
        if (!open) return;

        function handleClickOutside(e) {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [open]);

    const handleClick = (option) => {
        setOpen(false);
        if (option.comingSoon) return onComingSoon(option.label);
        onSelect(option);
    };

    return (
        <div className="hd-menu-wrap" ref={wrapRef}>
            <button
                type="button"
                className={`hd-menu-trigger ${open ? "open" : ""}`}
                onClick={() => setOpen((p) => !p)}
            >
                <span className="hd-menu-icon">{current.icon}</span>
                <span className="hd-menu-label">{current.label}</span>
                <span className={`hd-menu-chevron ${open ? "rotate" : ""}`}>
                    <FiChevronDown />
                </span>
            </button>

            {open && (
                <div className="hd-menu-dropdown">
                    <div className="hd-menu-dropdown-head">Browse</div>

                    {MENU_OPTIONS.map((option) => (
                        <button
                            key={option.key}
                            type="button"
                            className={`hd-menu-option ${selectedMenu === option.key ? "active" : ""} ${option.comingSoon ? "soon" : ""}`}
                            onClick={() => handleClick(option)}
                        >
                            <span className="hd-menu-option-icon">{option.icon}</span>
                            <span className="hd-menu-option-label">{option.label}</span>

                            {option.comingSoon && (
                                <span className="hd-menu-option-badge">Soon</span>
                            )}

                            {selectedMenu === option.key && !option.comingSoon && (
                                <span className="hd-menu-option-dot" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Options;