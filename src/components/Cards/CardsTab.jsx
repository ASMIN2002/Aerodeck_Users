import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API } from "../../services/api";
import "./CardsTab.css";

function CardsTab({ onCategoryChange }) {

    const navigate = useNavigate();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState("regular");
    const [categories, setCategories] = useState([]);
    const [randomEight, setRandomEight] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isImageAutoScroll, setIsImageAutoScroll] = useState(true);

    useEffect(() => {
        if (location.pathname.includes("/premium")) {
            setActiveTab("premium");
        } else {
            setActiveTab("regular");
        }
    }, [location.pathname]);

    useEffect(() => {

        async function loadCategories() {
            try {
                const res = await fetch(`${API}/api/category`);
                const data = await res.json();
                if (data.success) {
                    const filtered = data.data.filter(
                        (item) =>
                            item.catname === "CARDS" &&
                            String(item.category).trim().toUpperCase() !== "PREMIUM"
                    );
                    setCategories(filtered);
                }
            } catch (err) {
                console.error("Category load error:", err);
            }
        }

        loadCategories();

    }, []);

    useEffect(() => {
        if (categories.length === 0) return;
        const shuffled = [...categories]
            .sort(() => Math.random() - 0.5)
            .slice(0, 8);
        setRandomEight(shuffled);
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
        setIsImageAutoScroll(true);   // ✅ ye zaroori hai
        if (onCategoryChange) {
            onCategoryChange(category.category);
        }
    };


    const handleCancel = () => {
        setSelectedCategory(null);
        setIsImageAutoScroll(true);
        const shuffled = [...categories]
            .sort(() => Math.random() - 0.5)
            .slice(0, 8);
        setRandomEight(shuffled);
        if (onCategoryChange) {
            onCategoryChange("All");
        }
    };

    return (
        <div className="cardstab-wrap">

            <div className="cardstab-slot">

                {activeTab === "premium" ? (
                    <div className="cardstab-lion-wrap">
                        <div className="cardstab-peek">
                            <span className="cardstab-animal">🦁</span>
                            <span className="cardstab-msg">Hi there!</span>
                        </div>
                        <div className="cardstab-peek">
                            <span className="cardstab-animal">🐮</span>
                            <span className="cardstab-msg">How are you?</span>
                        </div>
                        <div className="cardstab-peek">
                            <span className="cardstab-animal">🐐</span>
                            <span className="cardstab-msg">Check our brand!</span>
                        </div>
                        <div className="cardstab-peek">
                            <span className="cardstab-animal">🦊</span>
                            <span className="cardstab-msg">Something special!</span>
                        </div>
                        <div className="cardstab-peek">
                            <span className="cardstab-animal">🐼</span>
                            <span className="cardstab-msg">Have a nice day!</span>
                        </div>
                    </div>
                ) : selectedCategory ? (
                    <div className="cardstab-selected">
                        <div
                            className={`cardstab-selected-image ${isImageAutoScroll ? "auto-scroll" : "paused"}`}
                            onClick={() => setIsImageAutoScroll(false)}
                            onTouchStart={() => setIsImageAutoScroll(false)}
                        >
                            {selectedCategory.image ? (
                                <img
                                    src={selectedCategory.image}
                                    alt={selectedCategory.category}
                                    draggable={false}
                                />
                            ) : (
                                <span className="cardstab-selected-fallback">
                                    {selectedCategory.category?.charAt(0)?.toUpperCase() || "?"}
                                </span>
                            )}
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
                ) : (
                    <div className="cardstab-cat-scroll">
                        {randomEight.map((item) => (
                            <button
                                type="button"
                                key={item.catid}
                                className="cardstab-cat-chip"
                                onClick={() => handleCategoryClick(item)}
                            >
                                <span className="cardstab-cat-chip-icon">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.category}
                                            draggable={false}
                                        />
                                    ) : (
                                        <span className="cardstab-cat-chip-fallback">
                                            {item.category?.charAt(0)?.toUpperCase() || "?"}
                                        </span>
                                    )}
                                </span>
                                <span className="cardstab-cat-chip-name">
                                    {item.category}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

            </div>

            <div className="cardstab-buttons">
                <button
                    type="button"
                    className={`cardstab-btn ${activeTab === "regular" ? "active" : ""}`}
                    onClick={() => handleTabClick("regular")}
                >
                    Regular
                </button>

                <button
                    type="button"
                    className={`cardstab-btn ${activeTab === "premium" ? "active" : ""}`}
                    onClick={() => handleTabClick("premium")}
                >
                    Premium
                </button>
            </div>

        </div>
    );

}

export default CardsTab;