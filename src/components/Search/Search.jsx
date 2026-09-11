import { useEffect, useRef, useState } from "react";
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
    const [showFilter, setShowFilter] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetch(`${API}/api/category`);
                const data = await response.json();

                if (data.success) {
                    const shopCategories = (data.data || [])
                        .filter(item =>
                            item.catname?.trim().toUpperCase() === "SHOP"
                        )
                        .filter(item => item.category?.trim());

                    // Random order
                    const shuffled = [...shopCategories].sort(
                        () => Math.random() - 0.5
                    );

                    setCategories(shuffled);
                }
            } catch (error) {
                console.error("CATEGORY FETCH ERROR:", error);
            }
        };

        loadCategories();
    }, []);
    const shopCategories = (categories || [])
        .map(item => item.category?.trim())
        .filter(Boolean);
    useEffect(() => {

        if (
            categoryName ||
            search.trim() ||
            shopCategories.length === 0
        ) {
            return;
        }

        const interval = setInterval(() => {

            setPlaceholderIndex(prev =>
                (prev + 1) % shopCategories.length
            );

        }, 2200);

        return () => clearInterval(interval);

    }, [
        categories,
        search,
        shopCategories.length,
        categoryName
    ]);

    const srRef = useRef(null);

    useEffect(() => {

        function handleOutsideClick(event) {

            if (
                srRef.current &&
                !srRef.current.contains(event.target)
            ) {

                setShowFilter(false);
                setSearchSuggestions([]);

            }

        }

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, []);
    const config = {
        Cards: {
            data: cards,
            name: "card_name",
            category: "card_category"
        },

        Gifts: {
            data: gifts,
            name: "gift_name",
            category: "gift_category"
        },

        Shop: {
            data: shops,
            name: "shop_name",
            category: "shop_category"
        },

        Premium: {
            data: premiums,
            name: "premium_name",
            category: "premium_category"
        }
    };
    const [searchSuggestions, setSearchSuggestions] = useState([]);

    useEffect(() => {

        const current = config[selectedMenu];

        if (!current || !search.trim()) {
            setSearchSuggestions([]);
            return;
        }

        const data = current.data || [];
        const keyword = search.toLowerCase().trim();

        const names = data
            .filter(item =>
                item[current.name]
                    ?.toLowerCase()
                    .includes(keyword)
            )
            .map(item => ({
                type: "name",
                value: item[current.name]
            }));

        const categoryValues = [
            ...new Set(
                data
                    .filter(item =>
                        item[current.category]
                            ?.toLowerCase()
                            .includes(keyword)
                    )
                    .map(item => item[current.category])
                    .filter(Boolean)
            )
        ];

        const categorySuggestions = categoryValues.map(category => ({
            type: "category",
            value: category
        }));

        const combined = [
            ...names,
            ...categorySuggestions
        ];

        const unique = combined.filter(
            (item, index, self) =>
                index === self.findIndex(
                    x =>
                        x.value.toLowerCase() ===
                        item.value.toLowerCase()
                )
        );

        setSearchSuggestions(unique.slice(0, 6));

    }, [
        search,
        selectedMenu,
        cards,
        gifts,
        shops,
        premiums
    ]);

    return (

        <div
            className="sr-container"
            ref={srRef}
        >

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
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    onKeyDown={(e) => {

                        if (e.key === "Enter") {
                            setSearchSuggestions([]);
                        }

                    }}
                />
            </div>
            {
                searchSuggestions.length > 0 && (

                    <div className="sr-suggestions">

                        {searchSuggestions.map((item, index) => (

                            <button
                                key={`${item.type}-${item.value}-${index}`}
                                type="button"
                                className="sr-suggestion"
                                onClick={() => {

                                    setSearch(item.value);
                                    setSearchSuggestions([]);

                                }}
                            >

                                <span className="sr-suggestion-icon">
                                    {item.type === "category" ? "●" : "⌕"}
                                </span>

                                <span>
                                    {item.value}
                                </span>

                            </button>

                        ))}

                    </div>

                )
            }

            <button
                className="sr-filter-btn"
                type="button"
                onClick={() =>
                    setShowFilter(!showFilter)
                }
            >
                ⚙
            </button>

            {

                showFilter &&

                <Filter

                    selectedMenu={selectedMenu}

                    filter={filter}

                    setFilter={setFilter}

                    categories={categories}

                />
            }

        </div>

    );

}

export default Search;