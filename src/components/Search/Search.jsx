import { useEffect, useMemo, useRef, useState } from "react";
import "./Search.css";
import Filter from "../Filter/Filter";
import { FaSearch } from "react-icons/fa";
import { API } from "../../services/api";

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
    categoryName
}) {

    const [categories, setCategories] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [hideSuggestions, setHideSuggestions] = useState(false);
    const [showFilterTip, setShowFilterTip] = useState(false);

    const isPremium = typeof window !== "undefined"
        && window.location.pathname.includes("/premium");

    const hasActiveFilter =
        filter &&
        (
            (filter.sort && filter.sort !== "") ||
            (filter.rating && Number(filter.rating) > 0) ||
            (filter.availableOnly === true)
        );

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetch(`${API}/api/category`);
                const data = await response.json();

                if (data.success) {
                    const list = (data.data || []).filter(
                        (item) => item.category?.trim()
                    );
                    setAllCategories(list);
                }
            } catch (error) {
                console.error("CATEGORY FETCH ERROR:", error);
            }
        };

        loadCategories();
    }, []);

    useEffect(() => {

        let filtered = [];

        if (selectedMenu === "Shop") {
            filtered = allCategories.filter(
                (item) => item.catname?.trim().toUpperCase() === "SHOP"
            );
        } else if (selectedMenu === "Gifts") {
            filtered = allCategories.filter(
                (item) => item.catname?.trim().toUpperCase() === "GIFT"
            );
        } else if (selectedMenu === "Cards") {
            if (isPremium) {
                filtered = allCategories.filter(
                    (item) =>
                        item.catname?.trim().toUpperCase() === "CARDS" &&
                        item.category?.trim().toUpperCase() === "PREMIUM"
                );
            } else {
                filtered = allCategories.filter(
                    (item) =>
                        item.catname?.trim().toUpperCase() === "CARDS" &&
                        item.category?.trim().toUpperCase() !== "PREMIUM"
                );
            }
        }

        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        setCategories(shuffled);
        setPlaceholderIndex(0);

    }, [allCategories, selectedMenu, isPremium]);

    useEffect(() => {
        if (hasActiveFilter) {
            setShowFilterTip(true);
            const timer = setTimeout(() => setShowFilterTip(false), 5000);
            return () => clearTimeout(timer);
        } else {
            setShowFilterTip(false);
        }
    }, [hasActiveFilter]);

    const shopCategories = (categories || [])
        .map((item) => item.category?.trim())
        .filter(Boolean);

    useEffect(() => {
        if (categoryName || search.trim() || shopCategories.length === 0) return;

        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % shopCategories.length);
        }, 2200);

        return () => clearInterval(interval);
    }, [categories, search, shopCategories.length, categoryName]);

    const srRef = useRef(null);

    useEffect(() => {
        function handleOutsideClick(event) {
            if (srRef.current && !srRef.current.contains(event.target)) {
                setShowFilter(false);
                setHideSuggestions(true);
            }
        }

        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, []);

    const config = {
        Cards: { data: cards, name: "product_name", category: "product_category" },
        Gifts: { data: gifts, name: "gift_name", category: "gift_category" },
        Shop: { data: shops, name: "shop_name", category: "shop_category" },
        Premium: { data: premiums, name: "premium_name", category: "premium_category" }
    };

    const searchSuggestions = useMemo(() => {
        if (hideSuggestions) return [];

        const current = config[selectedMenu];

        if (!current || !search.trim()) return [];

        let data = current.data || [];

        if (selectedMenu === "Cards") {
            data = data.filter((item) => {
                const cat = String(item.product_category || "").trim().toUpperCase();
                return isPremium ? cat === "PREMIUM" : cat !== "PREMIUM";
            });
        }

        const keyword = search.toLowerCase().trim();

        const names = data
            .filter((item) => item[current.name]?.toLowerCase().includes(keyword))
            .map((item) => ({ type: "name", value: item[current.name] }));

        const categoryValues = [
            ...new Set(
                data
                    .filter((item) => item[current.category]?.toLowerCase().includes(keyword))
                    .map((item) => item[current.category])
                    .filter(Boolean)
            )
        ];

        const categorySuggestions = categoryValues.map((category) => ({
            type: "category",
            value: category
        }));

        const combined = [...names, ...categorySuggestions];

        return combined
            .filter((item, index, self) =>
                index === self.findIndex(
                    (x) => x.value.toLowerCase() === item.value.toLowerCase()
                )
            )
            .slice(0, 6);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, selectedMenu, cards, gifts, shops, premiums, hideSuggestions, isPremium]);

    const hasSuggestions = searchSuggestions.length > 0;

    const handleClearFilter = () => {
        setFilter({
            category: "All",
            sort: "",
            rating: 0,
            availableOnly: false
        });
        try {
            sessionStorage.removeItem("heep_filter");
        } catch (err) {
            console.error(err);
        }
        setShowFilterTip(false);
    };

    const handleFilterButtonClick = () => {
        if (hasActiveFilter) {
            handleClearFilter();
        } else {
            setShowFilter(!showFilter);
        }
    };

    return (
        <div className="sr-container" ref={srRef}>

            <div className="sr-top-row">

                <div className="sr-search-box">

                    {!search.trim() && (
                        categoryName ? (
                            <span className="sr-static-placeholder">
                                Search {categoryName}...
                            </span>
                        ) : (
                            shopCategories.length > 0 && (
                                <span
                                    key={shopCategories[placeholderIndex]}
                                    className="sr-animated-placeholder"
                                >
                                    Search {shopCategories[placeholderIndex]}...
                                </span>
                            )
                        )
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
                        onClick={() => {
                            setSearch(item.value);
                            setHideSuggestions(true);
                        }}
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