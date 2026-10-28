import { useEffect, useMemo, useRef, useState } from "react";
import "../processstyle/Search.css";
import Filter from "./Filter";
import { FaSearch } from "react-icons/fa";
import { API } from "../../services/api";

const PLACEHOLDER_INTERVAL = 2200;
const FILTER_TIP_DURATION = 5000;
const MAX_SUGGESTIONS = 6;
const EMPTY_FILTER = { category: "All", sort: "", rating: 0, availableOnly: false };

const MENU_CONFIG = {
    Cards: { data: "cards", name: "product_name", category: "product_category" },
    Gifts: { data: "gifts", name: "gift_name", category: "gift_category" },
    Shop: { data: "shops", name: "shop_name", category: "shop_category" },
    Premium: { data: "premiums", name: "premium_name", category: "premium_category" },
};

const MENU_CATNAME = { Shop: "SHOP", Gifts: "GIFT", Cards: "CARDS" };

const matchCatname = (item, v) => item.catname?.trim().toUpperCase() === v;
const matchCategory = (item, v) => item.category?.trim().toUpperCase() === v;
const isPremiumCat = (item) => matchCategory(item, "PREMIUM");
const dedupeByLower = (arr) => arr.filter((x, i, self) => i === self.findIndex((y) => y.value.toLowerCase() === x.value.toLowerCase()));

function Search({ selectedMenu, search, setSearch, filter, setFilter, cards, gifts, shops, premiums, categoryName }) {
    const [allCategories, setAllCategories] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [hideSuggestions, setHideSuggestions] = useState(false);
    const [showFilterTip, setShowFilterTip] = useState(false);
    const srRef = useRef(null);

    const isPremium = window.location.pathname.includes("/premium");
    const hasActiveFilter = filter && ((filter.sort && filter.sort !== "") || (filter.rating && Number(filter.rating) > 0) || filter.availableOnly === true);

    useEffect(() => {
        fetch(`${API}/api/category`)
            .then((r) => r.json())
            .then((data) => {
                if (data.success) setAllCategories((data.data || []).filter((item) => item.category?.trim()));
            })
            .catch((err) => console.error("Category fetch error:", err.message));
    }, []);

    const categories = useMemo(() => {
        const tag = MENU_CATNAME[selectedMenu];
        let list = tag ? allCategories.filter((item) => matchCatname(item, tag)) : [];
        if (selectedMenu === "Cards") list = list.filter((item) => (isPremium ? isPremiumCat(item) : !isPremiumCat(item)));
        return [...list].sort(() => Math.random() - 0.5);
    }, [allCategories, selectedMenu, isPremium]);

    useEffect(() => setPlaceholderIndex(0), [categories]);

    useEffect(() => {
        if (!hasActiveFilter) return setShowFilterTip(false);
        setShowFilterTip(true);
        const t = setTimeout(() => setShowFilterTip(false), FILTER_TIP_DURATION);
        return () => clearTimeout(t);
    }, [hasActiveFilter]);

    const shopCategories = useMemo(() => categories.map((item) => item.category?.trim()).filter(Boolean), [categories]);

    useEffect(() => {
        if (categoryName || search.trim() || !shopCategories.length) return;
        const id = setInterval(() => setPlaceholderIndex((p) => (p + 1) % shopCategories.length), PLACEHOLDER_INTERVAL);
        return () => clearInterval(id);
    }, [search, shopCategories.length, categoryName]);

    useEffect(() => {
        const onOutside = (e) => {
            if (srRef.current && !srRef.current.contains(e.target)) {
                setShowFilter(false);
                setHideSuggestions(true);
            }
        };
        document.addEventListener("click", onOutside);
        return () => document.removeEventListener("click", onOutside);
    }, []);

    const suggestions = useMemo(() => {
        if (hideSuggestions || !search.trim()) return [];
        const config = MENU_CONFIG[selectedMenu];
        if (!config) return [];

        const sourceMap = { cards, gifts, shops, premiums };
        let data = sourceMap[config.data] || [];
        if (selectedMenu === "Cards") data = data.filter((item) => {
            const cat = String(item.product_category || "").trim().toUpperCase();
            return isPremium ? cat === "PREMIUM" : cat !== "PREMIUM";
        });

        const kw = search.toLowerCase().trim();
        const names = data.filter((i) => i[config.name]?.toLowerCase().includes(kw)).map((i) => ({ type: "name", value: i[config.name] }));
        const catValues = [...new Set(data.filter((i) => i[config.category]?.toLowerCase().includes(kw)).map((i) => i[config.category]).filter(Boolean))].map((v) => ({ type: "category", value: v }));

        return dedupeByLower([...names, ...catValues]).slice(0, MAX_SUGGESTIONS);
    }, [search, selectedMenu, cards, gifts, shops, premiums, hideSuggestions, isPremium]);

    const clearFilter = () => {
        setFilter(EMPTY_FILTER);
        try { sessionStorage.removeItem("heep_filter"); } catch (err) { console.error(err.message); }
        setShowFilterTip(false);
    };

    const onFilterClick = () => (hasActiveFilter ? clearFilter() : setShowFilter(!showFilter));
    const onSuggestionClick = (value) => { setSearch(value); setHideSuggestions(true); };

    const placeholder = categoryName
        ? `Search ${categoryName}...`
        : shopCategories.length
            ? `${shopCategories[placeholderIndex]}...`
            : "";

    return (
        <div className="sr-container" ref={srRef}>
            <div className="sr-top-row">
                <div className="sr-search-box">
                    <span className="sr-search-leading" aria-hidden="true">
                        <FaSearch />
                    </span>
                    {!search.trim() && placeholder && (
                        <span key={categoryName || shopCategories[placeholderIndex]} className={categoryName ? "sr-static-placeholder" : "sr-animated-placeholder"}>
                            {placeholder}
                        </span>
                    )}
                    <input
                        type="text"
                        className="sr-input"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setHideSuggestions(false); }}
                    />
                    {search.trim() && (
                        <button
                            type="button"
                            className="sr-clear-btn"
                            aria-label="Clear search"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => { setSearch(""); setHideSuggestions(false); }}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="sr-filter-wrap">
                    {showFilterTip && <div className="sr-filter-tip">Click here to remove filter</div>}
                    <button
                        className={`sr-filter-btn ${hasActiveFilter ? "active" : ""}`}
                        type="button"
                        onClick={onFilterClick}
                        aria-label={hasActiveFilter ? "Clear filter" : "Filter"}
                    >
                        {hasActiveFilter ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="4" y1="6" x2="20" y2="6" />
                                <line x1="4" y1="12" x2="14" y2="12" />
                                <line x1="4" y1="18" x2="10" y2="18" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            <div className={`sr-suggestions ${suggestions.length ? "sr-suggestions-show" : ""}`}>
                {suggestions.map((item, i) => (
                    <button
                        key={`${item.type}-${item.value}-${i}`}
                        type="button"
                        className="sr-suggestion"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => onSuggestionClick(item.value)}
                    >
                        <span className="sr-suggestion-icon">
                            {item.type === "category" ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
                                </svg>
                            ) : (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="7" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            )}
                        </span>
                        <span className="sr-suggestion-text">{item.value}</span>
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