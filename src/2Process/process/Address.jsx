import "../processstyle/Address.css";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiChevronDown } from "react-icons/fi";
import { FaCoins } from "react-icons/fa";
import { API } from "../../services/api";
import CategoriesSection from "../../3ProcessHome/shop/sections/1CategoriesSection";

const getSession = () => localStorage.getItem("session_token");

const fetchJSON = async (url) => {
    const res = await fetch(url);
    return res.json();
};

function Address({
    setProfilePage,
    setSelectedBottomTab,
    setSelectedMenu,
    setShopCategoryPage,
    setSelectedShopCategory,
    setAllShopCategoriesPage
}) {
    const navigate = useNavigate();
    const [primaryAddress, setPrimaryAddress] = useState(null);
    const [hypoPoints, setHypoPoints] = useState(0);
    const [categories, setCategories] = useState([]);
    const [openCategories, setOpenCategories] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const session = getSession();

        Promise.all([
            fetchJSON(`${API}/api/user/address?session_token=${session}`),
            fetchJSON(`${API}/api/user/rewards?session_token=${session}`),
            fetchJSON(`${API}/api/category`),
        ])
            .then(([addr, rewards, cats]) => {
                if (addr.success) {
                    setPrimaryAddress(addr.data.find((a) => a.is_primary === 1) || null);
                }
                if (rewards.success && rewards.data) {
                    setHypoPoints(rewards.data.hypo_points || 0);
                }
                if (cats.success) {
                    setCategories((cats.data || []).filter((c) => c.category?.trim()));
                }
            })
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenCategories(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

    const goto = (page, path) => {
        setSelectedBottomTab("Profile");
        setProfilePage(page);
        navigate(path);
    };

    const addressLabel = primaryAddress
        ? [primaryAddress.area_street, primaryAddress.house_flat, primaryAddress.city, primaryAddress.state, primaryAddress.full_name, primaryAddress.address_type].filter(Boolean).join(", ")
        : null;

    const handleCategoryClick = (category) => {
        setOpenCategories(false);
        setSelectedBottomTab("Home");
        if (setSelectedMenu) setSelectedMenu("Shop");
        if (setShopCategoryPage) setShopCategoryPage(true);
        if (setSelectedShopCategory) setSelectedShopCategory(category);
        if (setAllShopCategoriesPage) setAllShopCategoriesPage(false);
        navigate("/home/shop", { replace: true });
    };

    const handleOpenAll = () => {
        setOpenCategories(false);
        setSelectedBottomTab("Home");
        if (setSelectedMenu) setSelectedMenu("Shop");
        if (setAllShopCategoriesPage) setAllShopCategoriesPage(true);
        if (setShopCategoryPage) setShopCategoryPage(false);
        navigate("/home/shop", { replace: true });
    };

    return (
        <div className="ad-container">
            <div className="ad-cat-wrap" ref={dropdownRef}>
                <button
                    type="button"
                    className={`ad-cat-btn ${openCategories ? "open" : ""}`}
                    onClick={() => setOpenCategories((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={openCategories}
                    aria-label="Categories"
                >
                    <span className="ad-cat-label">Categories</span>
                    <span className={`ad-cat-chevron ${openCategories ? "rotate" : ""}`}>
                        <FiChevronDown />
                    </span>
                </button>

                {openCategories && (
                    <div className="ad-cat-dropdown">
                        <CategoriesSection
                            categories={categories}
                            onCategoryClick={handleCategoryClick}
                            onOpenAllShopCategories={handleOpenAll}
                            isDropdown={true}
                        />
                    </div>
                )}
            </div>

            <button className="ad-button" type="button" onClick={() => goto("viewaddress", "/profile/viewaddress")}>
                <span className="ad-icon-wrap">
                    <FiMapPin className="ad-icon" />
                </span>
                <span className="ad-body">
                    <span className="ad-label">Delivery Address</span>
                    {addressLabel ? (
                        <span className="ad-text">{addressLabel}</span>
                    ) : (
                        <span className="ad-text ad-no-address">Choose the primary address for delivery</span>
                    )}
                </span>
                <span className="ad-arrow" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </span>
            </button>

            <button className="ad-money-box" type="button" onClick={() => goto("rewards", "/profile/rewards")}>
                <span className="money-icon-circle">
                    <FaCoins className="money-icon" />
                </span>
                <span className="money-stack">
                    <span className="money-label">Points</span>
                    <span className="money-amount">{hypoPoints}</span>
                </span>
            </button>
        </div>
    );
}

export default Address;