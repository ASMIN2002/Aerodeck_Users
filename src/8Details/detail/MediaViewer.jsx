import { useEffect, useState, useCallback, memo } from "react";
import { createPortal } from "react-dom";
import { API } from "../../services/api";
import { FaStar, FaRegStar } from "react-icons/fa";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import "../detailStyle/MediaViewer.css";

const MAX_STARS = 5;

const renderStars = (rating) => {
    const count = Math.max(0, Math.min(MAX_STARS, Math.round(Number(rating) || 0)));
    return Array.from({ length: MAX_STARS }, (_, i) =>
        i < count ? (
            <FaStar key={i} className="heepit-mv-star heepit-mv-star-filled" />
        ) : (
            <FaRegStar key={i} className="heepit-mv-star" />
        )
    );
};

function MediaViewer({ product_id, media_id, onClose, getTimeAgo }) {
    const [images, setImages] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [direction, setDirection] = useState("right");

    useEffect(() => {
        if (!product_id) return;

        let cancelled = false;

        async function loadImages() {
            try {
                const res = await fetch(`${API}/api/user/review/media/${product_id}`);
                const data = await res.json();

                if (cancelled) return;

                if (data.success && Array.isArray(data.images)) {
                    setImages(data.images);

                    const index = data.images.findIndex((item) => item.media_id === media_id);
                    setSelectedIndex(index !== -1 ? index : 0);
                }
            } catch (err) {
                if (!cancelled) console.error("Media viewer load error:", err.message);
            }
        }

        loadImages();

        return () => { cancelled = true; };
    }, [product_id, media_id]);

    const goPrev = useCallback((e) => {
        e.stopPropagation();
        setDirection("left");
        setSelectedIndex((prev) => Math.max(0, prev - 1));
    }, []);

    const goNext = useCallback((e) => {
        e.stopPropagation();
        setDirection("right");
        setSelectedIndex((prev) => Math.min(images.length - 1, prev + 1));
    }, [images.length]);

    const handleClose = useCallback((e) => {
        if (e) e.stopPropagation();
        onClose?.();
    }, [onClose]);

    if (images.length === 0) return null;

    const currentImage = images[selectedIndex];
    if (!currentImage) return null;

    return createPortal(
        <div className="heepit-mv-overlay" onClick={handleClose}>
            <div className="heepit-mv-box">
                <button className="heepit-mv-close" onClick={handleClose}>
                    <IoClose />
                </button>

                {selectedIndex > 0 && (
                    <button className="heepit-mv-arrow heepit-mv-arrow-left" onClick={goPrev}>
                        <IoChevronBack />
                    </button>
                )}

                {selectedIndex < images.length - 1 && (
                    <button className="heepit-mv-arrow heepit-mv-arrow-right" onClick={goNext}>
                        <IoChevronForward />
                    </button>
                )}

                <div className="heepit-mv-image-wrapper" onClick={(e) => e.stopPropagation()}>
                    <img
                        src={currentImage.image_url}
                        alt={currentImage.full_name || "Review"}
                        className={`heepit-mv-image ${direction}`}
                        loading="eager"
                        decoding="async"
                    />
                </div>

                <div className="heepit-mv-bottom" onClick={(e) => e.stopPropagation()}>
                    <div className="heepit-mv-user">
                        {currentImage.profile_image && (
                            <img
                                src={currentImage.profile_image}
                                alt={currentImage.full_name || "User"}
                                className="heepit-mv-profile"
                                loading="lazy"
                                decoding="async"
                            />
                        )}
                        <div className="heepit-mv-user-info">
                            <h3>{currentImage.full_name}</h3>
                            <span>{getTimeAgo?.(currentImage.upload_date) || ""}</span>
                        </div>
                    </div>

                    <div className="heepit-mv-rating">
                        {renderStars(currentImage.rating)}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default memo(MediaViewer);