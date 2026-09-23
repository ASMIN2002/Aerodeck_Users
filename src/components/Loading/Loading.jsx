import { useEffect, useState } from "react";
import "./Loading.css";

function Loading({
    duration = 3000,
    text = "Please wait...",
    onComplete,
    manual = false,
    type = "default",     /* ✅ NEW: skeleton type */
    count = 1             /* ✅ NEW: kitne skeleton items */
}) {

    const [visible, setVisible] = useState(true);

    useEffect(() => {

        setVisible(true);

        const timer = manual
            ? null
            : setTimeout(() => {
                setVisible(false);
                if (onComplete) onComplete();
            }, duration);

        return () => {
            if (timer) clearTimeout(timer);
        };

    }, [duration]);

    if (!visible) return null;

    /* ===============================
       SKELETON RENDER HELPERS
    =============================== */

    const renderSkeleton = () => {

        /* ✅ PRODUCT SKELETON */
        if (type === "product") {
            return (
                <div className="hp-skeleton-grid">
                    {Array.from({ length: count }).map((_, i) => (
                        <div className="hp-skeleton-product" key={i}>
                            <div className="hp-skeleton-box hp-skeleton-image" />
                            <div className="hp-skeleton-line hp-skeleton-line-lg" />
                            <div className="hp-skeleton-line hp-skeleton-line-sm" />
                            <div className="hp-skeleton-line hp-skeleton-line-md" />
                        </div>
                    ))}
                </div>
            );
        }

        /* ✅ DETAILS SKELETON */
        if (type === "details") {
            return (
                <div className="hp-skeleton-details">
                    <div className="hp-skeleton-box hp-skeleton-details-image" />
                    <div className="hp-skeleton-line hp-skeleton-line-lg" />
                    <div className="hp-skeleton-line hp-skeleton-line-md" />
                    <div className="hp-skeleton-line hp-skeleton-line-sm" />
                    <div className="hp-skeleton-line hp-skeleton-line-md" />
                    <div className="hp-skeleton-line hp-skeleton-line-lg" />
                </div>
            );
        }

        /* ✅ CART SKELETON */
        if (type === "cart") {
            return (
                <div className="hp-skeleton-cart-list">
                    {Array.from({ length: count }).map((_, i) => (
                        <div className="hp-skeleton-cart" key={i}>
                            <div className="hp-skeleton-box hp-skeleton-cart-image" />
                            <div className="hp-skeleton-cart-info">
                                <div className="hp-skeleton-line hp-skeleton-line-lg" />
                                <div className="hp-skeleton-line hp-skeleton-line-sm" />
                                <div className="hp-skeleton-line hp-skeleton-line-md" />
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        /* ✅ PROFILE SKELETON */
        if (type === "profile") {
            return (
                <div className="hp-skeleton-profile">
                    <div className="hp-skeleton-box hp-skeleton-avatar" />
                    <div className="hp-skeleton-line hp-skeleton-line-lg" />
                    <div className="hp-skeleton-line hp-skeleton-line-md" />
                    <div className="hp-skeleton-row">
                        <div className="hp-skeleton-line hp-skeleton-line-sm" />
                        <div className="hp-skeleton-line hp-skeleton-line-sm" />
                    </div>
                    <div className="hp-skeleton-line hp-skeleton-line-lg" />
                    <div className="hp-skeleton-line hp-skeleton-line-md" />
                </div>
            );
        }

        /* ✅ ORDER SKELETON */
        if (type === "order") {
            return (
                <div className="hp-skeleton-order-list">
                    {Array.from({ length: count }).map((_, i) => (
                        <div className="hp-skeleton-order" key={i}>
                            <div className="hp-skeleton-row">
                                <div className="hp-skeleton-line hp-skeleton-line-lg" />
                                <div className="hp-skeleton-line hp-skeleton-line-sm" />
                            </div>
                            <div className="hp-skeleton-row">
                                <div className="hp-skeleton-line hp-skeleton-line-md" />
                                <div className="hp-skeleton-line hp-skeleton-line-md" />
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        /* ✅ VIDEO SKELETON */
        if (type === "video") {
            return (
                <div className="hp-skeleton-video">
                    <div className="hp-skeleton-box hp-skeleton-video-box" />
                </div>
            );
        }

        /* ✅ DEFAULT SKELETON */
        return (
            <div className="hp-skeleton-default">
                <div className="hp-skeleton-line hp-skeleton-line-lg" />
                <div className="hp-skeleton-line hp-skeleton-line-md" />
                <div className="hp-skeleton-line hp-skeleton-line-sm" />
                <div className="hp-skeleton-line hp-skeleton-line-md" />
            </div>
        );

    };

    return (
        <div className="hp-loading-overlay">
            <div className="hp-loading-card">
                {renderSkeleton()}

                {text && (
                    <div className="hp-loading-text">
                        {text}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Loading;