import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API } from "../../services/api";
import "./CardsTab.css";

const MAX_RANDOM_CATEGORIES = 8;
const CARDS_CATNAME = "CARDS";
const PREMIUM_CATEGORY = "PREMIUM";

const PREMIUM_PEEKS = [
    { animal: "🦁", msg: "Hi there!" },
    { animal: "🐮", msg: "How are you?" },
    { animal: "🐐", msg: "Check our brand!" },
    { animal: "🦊", msg: "Something special!" },
    { animal: "🐼", msg: "Have a nice day!" },
];

function shuffleAndSlice(arr, count) {
    return [...arr]
        .sort(() => Math.random() - 0.5)
        .slice(0, count);
}

function isRegularCategory(item) {
    if (item.catname !== CARDS_CATNAME) return false;
    const cat = String(item.category).trim().toUpperCase();
    return cat !== PREMIUM_CATEGORY;
}

function CardsTab({ onCategoryChange }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState("regular");
    const [categories, setCategories] = useState([]);
    const [randomEight, setRandomEight] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isImageAutoScroll, setIsImageAutoScroll] = useState(true);

    useEffect(() => {
        setActiveTab(location.pathname.includes("/premium") ? "premium" : "regular");
    }, [location.pathname]);

    useEffect(() => {
        async function loadCategories() {
            try {
                const res = await fetch(`${API}/api/category`);
                const data = await res.json();

                if (data.success) {
                    setCategories((data.data || []).filter(isRegularCategory));
                }
            } catch (err) {
                console.error("Category load error:", err.message);
            }
        }

        loadCategories();
    }, []);

    useEffect(() => {
        if (categories.length === 0) return;
        setRandomEight(shuffleAndSlice(categories, MAX_RANDOM_CATEGORIES));
    }, [categories]);

    const handleTabClick = (tab) => {
        const basePath = location.pathname
            .replace(/\/premium$/, "")
            .replace(/\/regular$/, "")
            .replace(/\/product\/.*$/, "");

        if (tab === "premium") {
            navigate(`${basePath}/premium`, { replace: true });
        } else {
            navigate(basePath, { replace: true });
        }
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setIsImageAutoScroll(true);
        onCategoryChange?.(category.category);
    };

    const handleCancel = () => {
        setSelectedCategory(null);
        setIsImageAutoScroll(true);
        setRandomEight(shuffleAndSlice(categories, MAX_RANDOM_CATEGORIES));
        onCategoryChange?.("All");
    };

    const renderCategoryImage = (category, className) => {
        if (category.image) {
            return (
                <img
                    src={category.image}
                    alt={category.category}
                    draggable={false}
                />
            );
        }

        return (
            <span className={className}>
                {category.category?.charAt(0)?.toUpperCase() || "?"}
            </span>
        );
    };

    const renderSlot = () => {
        if (activeTab === "premium") {
            return (
                <div className="cardstab-lion-wrap">
                    {PREMIUM_PEEKS.map((peek, i) => (
                        <div className="cardstab-peek" key={i}>
                            <span className="cardstab-animal">{peek.animal}</span>
                            <span className="cardstab-msg">{peek.msg}</span>
                        </div>
                    ))}
                </div>
            );
        }

        if (selectedCategory) {
            return (
                <div className="cardstab-selected">
                    <div
                        className={`cardstab-selected-image ${isImageAutoScroll ? "auto-scroll" : "paused"}`}
                        onClick={() => setIsImageAutoScroll(false)}
                        onTouchStart={() => setIsImageAutoScroll(false)}
                    >
                        {renderCategoryImage(selectedCategory, "cardstab-selected-fallback")}
                    </div>

                    <span className="cardstab-selected-name">
                        {selectedCategory.category}
                    </span>

                    <button
                        type="button"
                        className="cardstab-selected-cancel"
                        onClick={handleCancel}
                        aria-label="Cancel"
                    >
                        ✕
                    </button>
                </div>
            );
        }

        return (
            <div className="cardstab-cat-scroll">
                {randomEight.map((item) => (
                    <button
                        type="button"
                        key={item.catid}
                        className="cardstab-cat-chip"
                        onClick={() => handleCategoryClick(item)}
                    >
                        <span className="cardstab-cat-chip-icon">
                            {renderCategoryImage(item, "cardstab-cat-chip-fallback")}
                        </span>
                        <span className="cardstab-cat-chip-name">
                            {item.category}
                        </span>
                    </button>
                ))}
            </div>
        );
    };

    const TABS = [
        { key: "regular", label: "Regular" },
        { key: "premium", label: "Premium" },
    ];

    return (
        <div className="cardstab-wrap">
            <div className="cardstab-slot">{renderSlot()}</div>

            <div className="cardstab-buttons">
                {TABS.map((tab) => (
                    <button
                        type="button"
                        key={tab.key}
                        className={`cardstab-btn ${activeTab === tab.key ? "active" : ""}`}
                        onClick={() => handleTabClick(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CardsTab;