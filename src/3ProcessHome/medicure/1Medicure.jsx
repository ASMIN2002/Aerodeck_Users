import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import "./1Medicure.css";
import MedicureData from "./2MedicureData";
import MedDoct from "./3MedDoct";

const SCROLL_TRIGGER = 80;

function Medicure({ search = "", filter = {}, setCartCount, onOpenDetails, onBuyNow }) {
    const [scrolled, setScrolled] = useState(false);
    const [docsOpen, setDocsOpen] = useState(false);
    const [pillVisible, setPillVisible] = useState(false);
    const pageRef = useRef(null);
    const pillTimerRef = useRef(null);

    useEffect(() => {
        const el = pageRef.current?.closest(".home-content");
        if (!el) return;
        let ticking = false;

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const s = el.scrollTop > SCROLL_TRIGGER;
                setScrolled((prev) => (prev !== s ? s : prev));
                ticking = false;
            });
        };

        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (pillTimerRef.current) {
            clearTimeout(pillTimerRef.current);
            pillTimerRef.current = null;
        }

        if (scrolled) {
            pillTimerRef.current = setTimeout(() => setPillVisible(true), 120);
        } else {
            setPillVisible(false);
            setDocsOpen(false);
        }

        return () => {
            if (pillTimerRef.current) clearTimeout(pillTimerRef.current);
        };
    }, [scrolled]);

    return (
        <div className="medicure-page" ref={pageRef}>
            <div className={`medicure-doc-origin ${scrolled ? "is-collapsed" : ""}`}>
                <MedDoct />
            </div>

            <MedicureData
                search={search}
                filter={filter}
                setCartCount={setCartCount}
                onOpenDetails={onOpenDetails}
                onBuyNow={onBuyNow}
            />

            <button
                type="button"
                className={`medicure-doc-pill ${pillVisible ? "is-visible" : ""} ${docsOpen ? "is-hidden" : ""}`}
                onClick={() => setDocsOpen(true)}
                aria-hidden={!pillVisible}
                tabIndex={pillVisible ? 0 : -1}
            >
                Doctors
            </button>

            <div className={`medicure-doc-overlay ${docsOpen ? "is-open" : ""}`} onClick={() => setDocsOpen(false)} />
            <div className={`medicure-doc-panel ${docsOpen ? "is-open" : ""}`} onClick={(e) => e.stopPropagation()}>
                <div className="medicure-doc-panel-header">
                    <span>Doctors</span>
                    <button type="button" className="medicure-doc-panel-close" onClick={() => setDocsOpen(false)} aria-label="Close">
                        <FiX />
                    </button>
                </div>
                <div className="medicure-doc-panel-body">
                    <MedDoct />
                </div>
            </div>
        </div>
    );
}

export default Medicure;