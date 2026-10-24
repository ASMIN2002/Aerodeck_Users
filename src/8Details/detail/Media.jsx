import { useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { API } from "../../services/api";
import "../detailStyle/Media.css";

const MAX_VISIBLE_IMAGES = 5;

function EmptyState() {
    return (
        <div className="dt-media-scroll">
            <div className="dt-media-empty">
                <FiImage className="dt-media-empty-icon" />
                <h4>No Customer Images Yet</h4>
                <p>Be the first to share an image of this product.</p>
            </div>
        </div>
    );
}

function Media({ product_id, onViewAll }) {
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (!product_id) return;
        fetch(`${API}/api/user/review/media/${product_id}`)
            .then((r) => r.json())
            .then((data) => { if (data.success) setImages(data.images || []); })
            .catch((err) => console.error("Media fetch error:", err.message));
    }, [product_id]);

    const visibleImages = images.slice(0, MAX_VISIBLE_IMAGES);
    const remainingImages = images.length - MAX_VISIBLE_IMAGES;
    const lastIndex = MAX_VISIBLE_IMAGES - 1;

    return (
        <div className="dt-media">
            <div className="dt-media-header">
                <h3>Product Images</h3>
                {images.length > 0 && (
                    <button type="button" className="dt-view-all" onClick={onViewAll}>
                        View All
                    </button>
                )}
            </div>

            {images.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="dt-media-scroll">
                    {visibleImages.map((image, index) => (
                        <div className="dt-media-card" key={image.media_id} onClick={onViewAll}>
                            <img src={image.image_url} alt="Customer Media" className="dt-media-image" loading="lazy" />
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

export default Media;