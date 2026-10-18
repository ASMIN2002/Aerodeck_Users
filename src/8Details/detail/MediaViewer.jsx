import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { API } from "../../services/api";
import { FaStar, FaRegStar } from "react-icons/fa";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import "../detailStyle/MediaViewer.css";

const MAX_STARS = 5;

function renderStars(rating) {
    return Array.from({ length: MAX_STARS }, (_, i) =>
        i < rating ? (
            <FaStar key={i} className="heepit-mv-star heepit-mv-star-filled" />
        ) : (
            <FaRegStar key={i} className="heepit-mv-star" />
        )
    );
}

function MediaViewer({ product_id, media_id, onClose, getTimeAgo }) {
    const [images, setImages] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [direction, setDirection] = useState("right");

    useEffect(() => {
        if (!product_id) return;

        async function loadImages() {
            try {
                const res = await fetch(
                    `${API}/api/user/review/media/${product_id}`
                );
                const data = await res.json();

                if (data.success) {
                    setImages(data.images);

                    const index = data.images.findIndex(
                        (item) => item.media_id === media_id
                    );

                    if (index !== -1) setSelectedIndex(index);
                }
            } catch (err) {
                console.error("Media viewer load error:", err.message);
            }
        }

        loadImages();
    }, [product_id, media_id]);

    if (images.length === 0) return null;

    const currentImage = images[selectedIndex];
    if (!currentImage) return null;

    const goPrev = (e) => {
        e.stopPropagation();
        setDirection("left");
        setSelectedIndex((prev) => Math.max(0, prev - 1));
    };

    const goNext = (e) => {
        e.stopPropagation();
        setDirection("right");
        setSelectedIndex((prev) => Math.min(images.length - 1, prev + 1));
    };

    return createPortal(
        <div className="heepit-mv-overlay" onClick={onClose}>
            <div className="heepit-mv-box">
                <button
                    className="heepit-mv-close"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                >
                    <IoClose />
                </button>

                {selectedIndex > 0 && (
                    <button
                        className="heepit-mv-arrow heepit-mv-arrow-left"
                        onClick={goPrev}
                    >
                        <IoChevronBack />
                    </button>
                )}

                {selectedIndex < images.length - 1 && (
                    <button
                        className="heepit-mv-arrow heepit-mv-arrow-right"
                        onClick={goNext}
                    >
                        <IoChevronForward />
                    </button>
                )}

                <div
                    className="heepit-mv-image-wrapper"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={currentImage.image_url}
                        alt=""
                        className={`heepit-mv-image ${direction}`}
                    />
                </div>

                <div
                    className="heepit-mv-bottom"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="heepit-mv-user">
                        {currentImage.profile_image && (
                            <img
                                src={currentImage.profile_image}
                                alt=""
                                className="heepit-mv-profile"
                            />
                        )}
                        <div className="heepit-mv-user-info">
                            <h3>{currentImage.full_name}</h3>
                            <span>{getTimeAgo(currentImage.upload_date)}</span>
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

export default MediaViewer;