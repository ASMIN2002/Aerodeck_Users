import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FiImage } from "react-icons/fi";
import { API } from "../../services/api";
import MediaViewer from "./MediaViewer";
import "../detailStyle/AllMedia.css";

const SECONDS_PER_DAY = 86400;
const DAYS_PER_MONTH = 30;
const MONTHS_PER_YEAR = 12;

function getTimeAgo(uploadDate) {
    const diff = Math.floor((Date.now() - new Date(uploadDate)) / 1000);
    if (diff < SECONDS_PER_DAY) return "Today";
    if (diff < SECONDS_PER_DAY * 2) return "Yesterday";

    const days = Math.floor(diff / SECONDS_PER_DAY);
    if (days < DAYS_PER_MONTH) return `${days} day${days > 1 ? "s" : ""} ago`;

    const months = Math.floor(days / DAYS_PER_MONTH);
    if (months < MONTHS_PER_YEAR) return `${months} month${months > 1 ? "s" : ""} ago`;

    const years = Math.floor(months / MONTHS_PER_YEAR);
    return `${years} year${years > 1 ? "s" : ""} ago`;
}

function AllMedia({ product_id, onBack }) {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [showViewer, setShowViewer] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (!product_id) return;
        fetch(`${API}/api/user/review/media/${product_id}`)
            .then((r) => r.json())
            .then((data) => { if (data.success) setImages(data.images || []); })
            .catch((err) => console.error("All media load error:", err.message));
    }, [product_id]);

    const handleOpenViewer = (index) => {
        setSelectedIndex(index);
        setShowViewer(true);
    };

    const handleCloseViewer = () => setShowViewer(false);
    const handleBack = () => (onBack ? onBack() : navigate(-1));

    return (
        <div className="all-media">
            <div className="all-media-header">
                <button className="all-media-back" onClick={handleBack} aria-label="Back">
                    <IoArrowBack />
                </button>
                <h2 className="all-media-title">Review Images</h2>
            </div>

            {images.length === 0 ? (
                <div className="all-media-empty">
                    <FiImage className="all-media-empty-icon" />
                    <h3>No Images Yet</h3>
                    <p>No customer has shared images for this product.</p>
                </div>
            ) : (
                <div className="all-media-grid">
                    {images.map((image, index) => (
                        <div
                            className="all-media-card"
                            key={image.media_id}
                            onClick={() => handleOpenViewer(index)}
                        >
                            <img src={image.image_url} alt="Customer Media" className="all-media-image" loading="lazy" />
                        </div>
                    ))}
                </div>
            )}

            {showViewer && (
                <MediaViewer
                    product_id={product_id}
                    media_id={images[selectedIndex]?.media_id}
                    onClose={handleCloseViewer}
                    getTimeAgo={getTimeAgo}
                />
            )}
        </div>
    );
}

export default AllMedia;