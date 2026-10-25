import { useState, useEffect } from "react";
import { FiUploadCloud, FiX, FiTrash2, FiImage } from "react-icons/fi";
import { API } from "../../services/api";
import "../orderitemstyle/UploadImages.css";

const MAX_IMAGES = 2;
const SLOTS = [0, 1];
const MESSAGE_DURATION = 3000;

function UploadImages({ reviewImages = [], setReviewImages = () => { }, session_token, product_id, order_item_id }) {
    const [uploading, setUploading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showDeleteBox, setShowDeleteBox] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");

    useEffect(() => {
        if (!session_token || !product_id) return;
        fetch(`${API}/api/user/review/my-images/${order_item_id}?session_token=${session_token}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.success) setReviewImages([data.images[0] || null, data.images[1] || null]);
            })
            .catch((err) => console.error("Load images error:", err.message));
    }, [product_id, session_token, order_item_id, setReviewImages]);

    const showMessage = (msg) => {
        setUploadMessage(msg);
        setTimeout(() => setUploadMessage(""), MESSAGE_DURATION);
    };

    const handleImageChange = async (e, slot) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoadingText("Uploading image...");
        setUploading(true);

        const formData = new FormData();
        formData.append("image", file);
        formData.append("session_token", session_token);
        formData.append("product_id", product_id);
        formData.append("order_item_id", order_item_id);

        try {
            const data = await fetch(`${API}/api/upload/review`, { method: "POST", body: formData }).then((r) => r.json());

            if (data.success) {
                const updated = reviewImages.length ? [...reviewImages] : [null, null];
                updated[slot] = { media_id: data.media_id, image_url: data.image_url, public_id: data.public_id };
                setReviewImages(updated);
                showMessage("Image uploaded successfully");
            }
        } catch (err) {
            console.error("Upload error:", err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleConfirmDelete = async () => {
        setLoadingText("Deleting image...");
        setUploading(true);

        try {
            const data = await fetch(`${API}/api/upload/review/${selectedImage.media_id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token }),
            }).then((r) => r.json());

            if (data.success) {
                const updated = reviewImages.map((img) =>
                    img && img.media_id === selectedImage.media_id ? null : img
                );
                setReviewImages(updated);
                setShowDeleteBox(false);
                setShowPreview(false);
                setSelectedImage(null);
            }
        } catch (err) {
            console.error("Delete error:", err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-images">
            {uploadMessage && <div className="upload-toast">{uploadMessage}</div>}

            {uploading && (
                <div className="upload-loading-overlay">
                    <div className="upload-loading-card">
                        <div className="upload-loading-spinner" />
                        <span>{loadingText}</span>
                    </div>
                </div>
            )}

            <div className="upload-header">
                <h3 className="upload-title">Upload Images</h3>
                <span className="upload-count">{reviewImages.filter(Boolean).length}/{MAX_IMAGES}</span>
            </div>

            <p className="upload-note">Add up to {MAX_IMAGES} images of your product.</p>

            <div className="upload-grid">
                {SLOTS.map((index) => {
                    const image = reviewImages[index];

                    return (
                        <div className="upload-slot" key={index}>
                            {image ? (
                                <div className="upload-image-wrap">
                                    <img
                                        src={image.image_url}
                                        alt={`Image ${index + 1}`}
                                        className="upload-image"
                                        onClick={() => { setSelectedImage(image); setShowPreview(true); }}
                                        loading="lazy"
                                    />
                                    <button
                                        type="button"
                                        className="upload-image-delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedImage(image);
                                            setShowDeleteBox(true);
                                        }}
                                        aria-label="Delete image"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            ) : (
                                <label className="upload-box">
                                    <FiUploadCloud className="upload-box-icon" />
                                    <span className="upload-box-text">Add Image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => handleImageChange(e, index)}
                                    />
                                </label>
                            )}
                        </div>
                    );
                })}
            </div>

            {showPreview && selectedImage && (
                <div className="preview-overlay" onClick={() => setShowPreview(false)}>
                    <button
                        type="button"
                        className="preview-close"
                        onClick={() => setShowPreview(false)}
                        aria-label="Close"
                    >
                        <FiX />
                    </button>
                    <button
                        type="button"
                        className="preview-delete"
                        onClick={(e) => { e.stopPropagation(); setShowDeleteBox(true); }}
                        aria-label="Delete"
                    >
                        <FiTrash2 />
                    </button>
                    <img
                        src={selectedImage.image_url}
                        alt="Preview"
                        className="preview-image-large"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {showDeleteBox && (
                <div className="delete-overlay" onClick={() => setShowDeleteBox(false)}>
                    <div className="delete-box" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-box-icon"><FiTrash2 /></div>
                        <h3>Delete Image?</h3>
                        <p>This action cannot be undone.</p>
                        <div className="delete-box-actions">
                            <button type="button" className="delete-cancel" onClick={() => setShowDeleteBox(false)}>Cancel</button>
                            <button type="button" className="delete-confirm" onClick={handleConfirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UploadImages;