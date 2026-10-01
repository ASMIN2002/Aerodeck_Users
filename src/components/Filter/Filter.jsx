import { useEffect, useState } from "react";
import "./Filter.css";

function Filter({
    selectedMenu,
    filter,
    setFilter,
    categories,
    onClose
}) {

    // ---- draft filter (temporary, jab tak apply na ho) ----
    const [draft, setDraft] = useState(filter);

    // ---- jab bhi filter change ho (bahar se), draft sync ----
    useEffect(() => {
        setDraft(filter);
    }, [filter]);

    // ---- body scroll lock ----
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    if (
        selectedMenu !== "Cards" &&
        selectedMenu !== "Premium" &&
        selectedMenu !== "Gifts" &&
        selectedMenu !== "Shop"
    ) {
        return null;
    }

    // ---- APPLY ----
    const handleApply = () => {
        setFilter(draft);

        // sessionStorage me save (tab band hone pe auto clear)
        try {
            sessionStorage.setItem(
                "heep_filter",
                JSON.stringify(draft)
            );
        } catch (e) {
            console.error("Filter save error:", e);
        }

        onClose();
    };

    // ---- RESET ----
    const handleReset = () => {
        const empty = {
            category: "",
            sort: "",
            rating: 0,
            availableOnly: false
        };

        setDraft(empty);
        setFilter(empty);

        try {
            sessionStorage.removeItem("heep_filter");
        } catch (e) {
            console.error("Filter reset error:", e);
        }
    };

    return (
        <>
            {/* ---- BACKGROUND BLUR OVERLAY ---- */}
            <div className="fl-overlay" onClick={onClose} />

            {/* ---- FILTER DROPDOWN ---- */}
            <div className="fl-dropdown" onClick={(e) => e.stopPropagation()}>

                {/* scrollable content */}
                <div className="fl-content">

                    {selectedMenu === "Cards" && (
                        <>
                            {categories.map((category, index) => (
                                <button
                                    key={`${category}-${index}`}
                                    className={`fl-item ${draft.category === category ? "active" : ""}`}
                                    onClick={() =>
                                        setDraft({ ...draft, category })
                                    }
                                >
                                    {category}
                                </button>
                            ))}
                        </>
                    )}

                    <hr className="fl-divider" />
                    <h4 className="fl-title">Price</h4>

                    <button
                        className={`fl-item ${draft.sort === "low" ? "active" : ""}`}
                        onClick={() =>
                            setDraft({
                                ...draft,
                                sort: draft.sort === "low" ? "" : "low"
                            })
                        }
                    >
                        Low → High
                    </button>

                    <button
                        className={`fl-item ${draft.sort === "high" ? "active" : ""}`}
                        onClick={() =>
                            setDraft({
                                ...draft,
                                sort: draft.sort === "high" ? "" : "high"
                            })
                        }
                    >
                        High → Low
                    </button>

                    <hr className="fl-divider" />
                    <h4 className="fl-title">Rating</h4>

                    <button
                        className={`fl-item ${draft.rating === 4 ? "active" : ""}`}
                        onClick={() =>
                            setDraft({
                                ...draft,
                                rating: draft.rating === 4 ? 0 : 4
                            })
                        }
                    >
                        4★ & Above
                    </button>

                    <button
                        className={`fl-item ${draft.rating === 3 ? "active" : ""}`}
                        onClick={() =>
                            setDraft({
                                ...draft,
                                rating: draft.rating === 3 ? 0 : 3
                            })
                        }
                    >
                        3★ & Above
                    </button>

                    <hr className="fl-divider" />
                    <h4 className="fl-title">Availability</h4>

                    <button
                        className={`fl-item ${draft.availableOnly ? "active" : ""}`}
                        onClick={() =>
                            setDraft({
                                ...draft,
                                availableOnly: !draft.availableOnly
                            })
                        }
                    >
                        Available Only
                    </button>

                </div>

                {/* ---- APPLY + RESET FOOTER ---- */}
                <div className="fl-actions">
                    <button
                        type="button"
                        className="fl-reset-btn"
                        onClick={handleReset}
                    >
                        Reset
                    </button>

                    <button
                        type="button"
                        className="fl-apply-btn"
                        onClick={handleApply}
                    >
                        Apply
                    </button>
                </div>

            </div>
        </>
    );
}

export default Filter;