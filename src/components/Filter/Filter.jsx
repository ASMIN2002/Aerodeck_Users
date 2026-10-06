import { useEffect, useState } from "react";
import "./Filter.css";

function Filter({
    selectedMenu,
    filter,
    setFilter,
    onClose,
    onApply,
    onClear
}) {

    const [draft, setDraft] = useState(filter);

    useEffect(() => {
        setDraft(filter);
    }, [filter]);

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

    const handleApply = () => {
        setFilter(draft);
        try {
            sessionStorage.setItem("heep_filter", JSON.stringify(draft));
        } catch (e) {
            console.error("Filter save error:", e);
        }
        if (onApply) onApply();
        onClose();
    };

    const handleReset = () => {
        const empty = {
            category: "All",
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
        if (onClear) onClear();
    };

    return (
        <>
            <div className="fl-overlay" onClick={onClose} />

            <div className="fl-dropdown" onClick={(e) => e.stopPropagation()}>

                <div className="fl-content">

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