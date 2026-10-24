import { useEffect, useState } from "react";
import "./../processstyle/Filter.css";

const ALLOWED_MENUS = ["Cards", "Premium", "Gifts", "Shop"];
const EMPTY_FILTER = { category: "All", sort: "", rating: 0, availableOnly: false };
const STORAGE_KEY = "heep_filter";

const SORT_OPTIONS = [
    { value: "low", label: "Low → High" },
    { value: "high", label: "High → Low" },
];

const RATING_OPTIONS = [
    { value: 4, label: "4★ & Above" },
    { value: 3, label: "3★ & Above" },
];

function Filter({ selectedMenu, filter, setFilter, onClose, onApply, onClear }) {
    const [draft, setDraft] = useState(filter);

    useEffect(() => setDraft(filter), [filter]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    if (!ALLOWED_MENUS.includes(selectedMenu)) return null;

    const toggle = (field, value) => setDraft((d) => ({ ...d, [field]: d[field] === value ? (field === "sort" ? "" : 0) : value }));
    const toggleBool = (field) => setDraft((d) => ({ ...d, [field]: !d[field] }));

    const handleApply = () => {
        setFilter(draft);
        try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); } catch (e) { console.error("Filter save error:", e); }
        onApply?.();
        onClose();
    };

    const handleReset = () => {
        setDraft(EMPTY_FILTER);
        setFilter(EMPTY_FILTER);
        try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) { console.error("Filter reset error:", e); }
        onClear?.();
    };

    return (
        <>
            <div className="fl-overlay" onClick={onClose} />

            <div className="fl-dropdown" onClick={(e) => e.stopPropagation()}>
                <div className="fl-content">
                    <h4 className="fl-title">Price</h4>
                    {SORT_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            className={`fl-item ${draft.sort === value ? "active" : ""}`}
                            onClick={() => toggle("sort", value)}
                        >
                            {label}
                        </button>
                    ))}

                    <hr className="fl-divider" />
                    <h4 className="fl-title">Rating</h4>
                    {RATING_OPTIONS.map(({ value, label }) => (
                        <button
                            key={value}
                            className={`fl-item ${draft.rating === value ? "active" : ""}`}
                            onClick={() => toggle("rating", value)}
                        >
                            {label}
                        </button>
                    ))}

                    <hr className="fl-divider" />
                    <h4 className="fl-title">Availability</h4>
                    <button
                        className={`fl-item ${draft.availableOnly ? "active" : ""}`}
                        onClick={() => toggleBool("availableOnly")}
                    >
                        Available Only
                    </button>
                </div>

                <div className="fl-actions">
                    <button type="button" className="fl-reset-btn" onClick={handleReset}>Reset</button>
                    <button type="button" className="fl-apply-btn" onClick={handleApply}>Apply</button>
                </div>
            </div>
        </>
    );
}

export default Filter;