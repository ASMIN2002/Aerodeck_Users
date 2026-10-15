import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import "../DetailsDataStyle/AllMedia.css";
import { useNavigate } from "react-router-dom";
import MediaViewer from "./MediaViewer";
import { API } from "../../../services/api";

const SECONDS_PER_DAY = 86400;
const DAYS_PER_MONTH = 30;
const MONTHS_PER_YEAR = 12;

function getTimeAgo(uploadDate) {
    const diff = Math.floor((Date.now() - new Date(uploadDate)) / 1000);

    if (diff < SECONDS_PER_DAY) return "Today";
    if (diff < SECONDS_PER_DAY * 2) return "Yesterday";

    const days = Math.floor(diff / SECONDS_PER_DAY);
    if (days < DAYS_PER_MONTH) {
        return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    const months = Math.floor(days / DAYS_PER_MONTH);
    if (months < MONTHS_PER_YEAR) {
        return `${months} month${months > 1 ? "s" : ""} ago`;
    }

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

        async function loadImages() {
            try {
                const res = await fetch(
                    `${API}/api/user/review/media/${product_id}`
                );
                const data = await res.json();

                if (data.success) setImages(data.images);
            } catch (err) {
                console.error("All media load error:", err.message);
            }
        }

        loadImages();
    }, [product_id]);

    const handleOpenViewer = (index) => {
        setSelectedIndex(index);
        setShowViewer(true);
    };

    const handleCloseViewer = () => setShowViewer(false);

    return (
        <div className="all-media">
            <div className="all-media-header">
                <button className="all-media-back" onClick={() => navigate(-1)}>
                    <IoArrowBack />
                </button>
                <h2>Review Images</h2>
            </div>

            {images.length === 0 ? (
                <div className="all-media-empty">
                    <p>No review images yet.</p>
                </div>
            ) : (
                <div className="all-media-grid">
                    {images.map((image, index) => (
                        <div className="all-media-card" key={image.media_id}>
                            <img
                                src={image.image_url}
                                alt="Customer Media"
                                className="all-media-image"
                                onClick={() => handleOpenViewer(index)}
                            />
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