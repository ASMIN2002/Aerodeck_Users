import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { FiImage } from "react-icons/fi";
import { API } from "../../services/api";
import "../detailStyle/Media.css";

const MAX_VISIBLE_IMAGES = 5;

const EmptyState = memo(function EmptyState() {
    return (
        <div className="dt-media-scroll">
            <div className="dt-media-empty">
                <FiImage className="dt-media-empty-icon" />
                <h4>No Customer Images Yet</h4>
                <p>Be the first to share an image of this product.</p>
            </div>
        </div>
    );
});

function Media({ product_id, onViewAll }) {
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (!product_id) return;

        let cancelled = false;

        fetch(`${API}/api/user/review/media/${product_id}`)
            .then((r) => r.json())
            .then((data) => {
                if (!cancelled && data.success) setImages(data.images || []);
            })
            .catch((err) => console.error("Media fetch error:", err.message));

        return () => { cancelled = true; };
    }, [product_id]);

    const visibleImages = useMemo(() => images.slice(0, MAX_VISIBLE_IMAGES), [images]);
    const remainingImages = useMemo(() => Math.max(0, images.length - MAX_VISIBLE_IMAGES), [images.length]);
    const lastIndex = MAX_VISIBLE_IMAGES - 1;

    const handleViewAll = useCallback(() => {
        if (onViewAll) onViewAll();
    }, [onViewAll]);

    return (
        <div className="dt-media">
            <div className="dt-media-header">
                <h3>Product Images</h3>
                {images.length > 0 && (
                    <button type="button" className="dt-view-all" onClick={handleViewAll}>
                        View All
                    </button>
                )}
            </div>

            {images.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="dt-media-scroll">
                    {visibleImages.map((image, index) => (
                        <div className="dt-media-card" key={image.media_id} onClick={handleViewAll}>
                            <img
                                src={image.image_url}
                                alt={image.full_name || "Customer Media"}
                                className="dt-media-image"
                                loading="lazy"
                                decoding="async"
                            />
                            {index === lastIndex && remainingImages > 0 && (
                                <div className="dt-media-overlay">+{remainingImages}</div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default memo(Media);