import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API } from "../../../services/api";
import { FiX, FiStar, FiZap, FiSmile, FiHeart, FiAward, FiTrendingUp } from "react-icons/fi";
import "../levelstyle/CardsTab.css";

const MAX_RANDOM_CATEGORIES = 8;
const CARDS_CATNAME = "CARDS";
const PREMIUM_CATEGORY = "PREMIUM";

const PREMIUM_PEEKS = [
    { Icon: FiStar, msg: "Hi there!" },
    { Icon: FiSmile, msg: "How are you?" },
    { Icon: FiHeart, msg: "Check our brand!" },
    { Icon: FiZap, msg: "Something special!" },
    { Icon: FiAward, msg: "Have a nice day!" },
];

const TABS = [
    { key: "regular", label: "Regular" },
    { key: "premium", label: "Premium" },
];

const shuffleAndSlice = (arr, count) => [...arr].sort(() => Math.random() - 0.5).slice(0, count);

const isRegularCategory = (item) => {
    if (item.catname !== CARDS_CATNAME) return false;
    return String(item.category).trim().toUpperCase() !== PREMIUM_CATEGORY;
};

function CardsTab({ onCategoryChange }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState("regular");
    const [categories, setCategories] = useState([]);
    const [randomEight, setRandomEight] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        setActiveTab(location.pathname.includes("/premium") ? "premium" : "regular");
    }, [location.pathname]);

    useEffect(() => {
        fetch(`${API}/api/category`)
            .then((r) => r.json())
            .then((data) => { if (data.success) setCategories((data.data || []).filter(isRegularCategory)); })
            .catch((err) => console.error("Category load error:", err.message));
    }, []);

    useEffect(() => {
        if (categories.length) setRandomEight(shuffleAndSlice(categories, MAX_RANDOM_CATEGORIES));
    }, [categories]);

    const handleTabClick = (tab) => {
        let basePath = "/home/cards";

        if (location.pathname.includes("/cards")) {
            basePath = "/home/cards";
        }

        if (tab === "premium") {
            navigate(`${basePath}/premium`, { replace: true });
        } else {
            navigate(basePath, { replace: true });
        }
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        onCategoryChange?.(category.category);
    };

    const handleCancel = () => {
        setSelectedCategory(null);
        setRandomEight(shuffleAndSlice(categories, MAX_RANDOM_CATEGORIES));
        onCategoryChange?.("All");
    };

    const renderImage = (category, fallbackClass) => {
        if (category.image) {
            return <img src={category.image} alt={category.category} draggable={false} loading="lazy" />;
        }
        return <span className={fallbackClass}>{category.category?.charAt(0)?.toUpperCase() || "?"}</span>;
    };

    const renderSlot = () => {
        if (activeTab === "premium") {
            return (
                <div className="cardstab-lion-wrap">
                    {PREMIUM_PEEKS.map(({ Icon, msg }, i) => (
                        <div className="cardstab-peek" key={i}>
                            <Icon className="cardstab-peek-icon" />
                            <span className="cardstab-msg">{msg}</span>
                        </div>
                    ))}
                </div>
            );
        }

        if (selectedCategory) {
            return (
                <div className="cardstab-selected">
                    <div className="cardstab-selected-image">
                        {renderImage(selectedCategory, "cardstab-selected-fallback")}
                    </div>
                    <span className="cardstab-selected-name">{selectedCategory.category}</span>
                    <button type="button" className="cardstab-selected-cancel" onClick={handleCancel} aria-label="Cancel">
                        <FiX />
                    </button>
                </div>
            );
        }

        return (
            <div className="cardstab-cat-scroll">
                {randomEight.map((item) => (
                    <button type="button" key={item.catid} className="cardstab-cat-chip" onClick={() => handleCategoryClick(item)}>
                        <span className="cardstab-cat-chip-icon">
                            {renderImage(item, "cardstab-cat-chip-fallback")}
                        </span>
                        <span className="cardstab-cat-chip-name">{item.category}</span>
                    </button>
                ))}
            </div>
        );
    };

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