import { useEffect, useMemo, useRef, useState } from "react";
import "./Search.css";
import Filter from "../Filter/Filter";
import { FaSearch } from "react-icons/fa";
import { API } from "../../services/api";

const PLACEHOLDER_INTERVAL = 2200;
const FILTER_TIP_DURATION = 5000;
const MAX_SUGGESTIONS = 6;

const MENU_CONFIG = {
    Cards: { data: "cards", name: "product_name", category: "product_category" },
    Gifts: { data: "gifts", name: "gift_name", category: "gift_category" },
    Shop: { data: "shops", name: "shop_name", category: "shop_category" },
    Premium: { data: "premiums", name: "premium_name", category: "premium_category" },
};

const EMPTY_FILTER = {
    category: "All",
    sort: "",
    rating: 0,
    availableOnly: false,
};

function matchCatname(item, value) {
    return item.catname?.trim().toUpperCase() === value;
}

function matchCategory(item, value) {
    return item.category?.trim().toUpperCase() === value;
}

function Search({
    selectedMenu,
    search,
    setSearch,
    filter,
    setFilter,
    cards,
    gifts,
    shops,
    premiums,
    categoryName,
}) {
    const [categories, setCategories] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [hideSuggestions, setHideSuggestions] = useState(false);
    const [showFilterTip, setShowFilterTip] = useState(false);

    const srRef = useRef(null);

    const isPremium =
        typeof window !== "undefined" &&
        window.location.pathname.includes("/premium");

    const hasActiveFilter =
        filter &&
        ((filter.sort && filter.sort !== "") ||
            (filter.rating && Number(filter.rating) > 0) ||
            filter.availableOnly === true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await fetch(`${API}/api/category`);
                const data = await res.json();

                if (data.success) {
                    setAllCategories(
                        (data.data || []).filter((item) => item.category?.trim())
                    );
                }
            } catch (err) {
                console.error("Category fetch error:", err.message);
            }
        };

        loadCategories();
    }, []);

    useEffect(() => {
        let filtered = [];

        if (selectedMenu === "Shop") {
            filtered = allCategories.filter((item) => matchCatname(item, "SHOP"));
        } else if (selectedMenu === "Gifts") {
            filtered = allCategories.filter((item) => matchCatname(item, "GIFT"));
        } else if (selectedMenu === "Cards") {
            filtered = allCategories.filter(
                (item) =>
                    matchCatname(item, "CARDS") &&
                    (isPremium
                        ? matchCategory(item, "PREMIUM")
                        : !matchCategory(item, "PREMIUM"))
            );
        }

        setCategories([...filtered].sort(() => Math.random() - 0.5));
        setPlaceholderIndex(0);
    }, [allCategories, selectedMenu, isPremium]);

    useEffect(() => {
        if (!hasActiveFilter) {
            setShowFilterTip(false);
            return;
        }

        setShowFilterTip(true);
        const timer = setTimeout(() => setShowFilterTip(false), FILTER_TIP_DURATION);
        return () => clearTimeout(timer);
    }, [hasActiveFilter]);

    const shopCategories = useMemo(
        () =>
            (categories || [])
                .map((item) => item.category?.trim())
                .filter(Boolean),
        [categories]
    );

    useEffect(() => {
        if (categoryName || search.trim() || shopCategories.length === 0) return;

        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % shopCategories.length);
        }, PLACEHOLDER_INTERVAL);

        return () => clearInterval(interval);
    }, [search, shopCategories.length, categoryName]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (srRef.current && !srRef.current.contains(event.target)) {
                setShowFilter(false);
                setHideSuggestions(true);
            }
        };

        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, []);

    const searchSuggestions = useMemo(() => {
        if (hideSuggestions || !search.trim()) return [];

        const config = MENU_CONFIG[selectedMenu];
        if (!config) return [];

        const sourceMap = { cards, gifts, shops, premiums };
        let data = sourceMap[config.data] || [];

        if (selectedMenu === "Cards") {
            data = data.filter((item) => {
                const cat = String(item.product_category || "").trim().toUpperCase();
                return isPremium ? cat === "PREMIUM" : cat !== "PREMIUM";
            });
        }

        const keyword = search.toLowerCase().trim();

        const names = data
            .filter((item) => item[config.name]?.toLowerCase().includes(keyword))
            .map((item) => ({ type: "name", value: item[config.name] }));

        const categoryValues = [
            ...new Set(
                data
                    .filter((item) =>
                        item[config.category]?.toLowerCase().includes(keyword)
                    )
                    .map((item) => item[config.category])
                    .filter(Boolean)
            ),
        ];

        const categorySuggestions = categoryValues.map((category) => ({
            type: "category",
            value: category,
        }));

        const combined = [...names, ...categorySuggestions];

        return combined
            .filter(
                (item, index, self) =>
                    index ===
                    self.findIndex(
                        (x) => x.value.toLowerCase() === item.value.toLowerCase()
                    )
            )
            .slice(0, MAX_SUGGESTIONS);
    }, [search, selectedMenu, cards, gifts, shops, premiums, hideSuggestions, isPremium]);

    const hasSuggestions = searchSuggestions.length > 0;

    const handleClearFilter = () => {
        setFilter(EMPTY_FILTER);

        try {
            sessionStorage.removeItem("heep_filter");
        } catch (err) {
            console.error("Clear filter error:", err.message);
        }

        setShowFilterTip(false);
    };

    const handleFilterButtonClick = () => {
        if (hasActiveFilter) handleClearFilter();
        else setShowFilter(!showFilter);
    };

    const handleSuggestionClick = (value) => {
        setSearch(value);
        setHideSuggestions(true);
    };

    const currentPlaceholder = categoryName
        ? `Search ${categoryName}...`
        : shopCategories.length > 0
            ? `Search ${shopCategories[placeholderIndex]}...`
            : "";

    return (
        <div className="sr-container" ref={srRef}>
            <div className="sr-top-row">
                <div className="sr-search-box">
                    {!search.trim() && currentPlaceholder && (
                        <span
                            key={categoryName || shopCategories[placeholderIndex]}
                            className={
                                categoryName
                                    ? "sr-static-placeholder"
                                    : "sr-animated-placeholder"
                            }
                        >
                            {currentPlaceholder}
                        </span>
                    )}

                    <input
                        type="text"
                        className="sr-input"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setHideSuggestions(false);
                        }}
                    />

                    <button
                        type="button"
                        className="sr-search-icon-btn"
                        aria-label="Search"
                    >
                        <FaSearch />
                    </button>
                </div>

                <div className="sr-filter-wrap">
                    {showFilterTip && (
                        <div className="sr-filter-tip">
                            Click here to remove filter
                        </div>
                    )}

                    <button
                        className={`sr-filter-btn ${hasActiveFilter ? "active" : ""}`}
                        type="button"
                        onClick={handleFilterButtonClick}
                        aria-label={hasActiveFilter ? "Clear filter" : "Filter"}
                    >
                        {hasActiveFilter ? "✕" : "⚙"}
                    </button>
                </div>
            </div>

            <div
                className={`sr-suggestions ${hasSuggestions ? "sr-suggestions-show" : ""}`}
            >
                {searchSuggestions.map((item, index) => (
                    <button
                        key={`${item.type}-${item.value}-${index}`}
                        type="button"
                        className="sr-suggestion"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSuggestionClick(item.value)}
                    >
                        <span className="sr-suggestion-icon">
                            {item.type === "category" ? "●" : "⌕"}
                        </span>
                        <span>{item.value}</span>
                    </button>
                ))}
            </div>

            {showFilter && (
                <Filter
                    selectedMenu={selectedMenu}
                    filter={filter}
                    setFilter={setFilter}
                    categories={categories}
                    onClose={() => setShowFilter(false)}
                />
            )}
        </div>
    );
}

export default Search;