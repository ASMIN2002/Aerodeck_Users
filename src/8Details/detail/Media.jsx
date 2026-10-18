import { useEffect, useState } from "react";
import "../detailStyle/Media.css";
import { API } from "../../services/api";

const MAX_VISIBLE_IMAGES = 5;

function EmptyState() {
    return (
        <div className="dt-media-scroll">
            <div className="dt-media-card dt-no-media-card">
                <div className="dt-no-media-content">
                    <h4>No Customer Images Yet</h4>
                    <p>Be the first customer to share an image of this product.</p>
                </div>
            </div>
        </div>
    );
}

function Media({ product_id, onViewAll }) {
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (!product_id) return;

        async function loadMedia() {
            try {
                const res = await fetch(
                    `${API}/api/user/review/media/${product_id}`
                );
                const data = await res.json();

                if (data.success) setImages(data.images);
            } catch (err) {
                console.error("Media fetch error:", err.message);
            }
        }

        loadMedia();
    }, [product_id]);

    const visibleImages = images.slice(0, MAX_VISIBLE_IMAGES);
    const remainingImages = images.length - MAX_VISIBLE_IMAGES;
    const lastIndex = MAX_VISIBLE_IMAGES - 1;

    return (
        <div className="dt-media">
            <div className="dt-section-header1">
                <h3>Product Images</h3>
                <button className="dt-view-all" onClick={onViewAll}>
                    View All
                </button>
            </div>

            {images.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="dt-media-scroll">
                    {visibleImages.map((image, index) => (
                        <div className="dt-media-card" key={image.media_id}>
                            <img
                                src={image.image_url}
                                alt="Customer Media"
                                className="dt-media-image"
                                onClick={onViewAll}
                                style={{ cursor: "pointer" }}
                            />

                            {index === lastIndex && remainingImages > 0 && (
                                <div
                                    className="dt-media-overlay"
                                    onClick={onViewAll}
                                >
                                    +{remainingImages}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Media;