import { useState, useEffect } from "react";
import { FiUploadCloud } from "react-icons/fi";
import "./UploadImages.css";
import { API } from "../../../../services/api";

const MAX_IMAGES = 2;
const UPLOAD_SLOTS = [0, 1];
const MESSAGE_DURATION = 3000;

function UploadImages({
    reviewImages = [],
    setReviewImages = () => { },
    session_token,
    product_id,
    order_item_id,
}) {
    const [uploading, setUploading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showDeleteBox, setShowDeleteBox] = useState(false);
    const [deleteImage, setDeleteImage] = useState(null);
    const [uploadMessage, setUploadMessage] = useState("");

    useEffect(() => {
        if (!session_token || !product_id) return;

        fetch(
            `${API}/api/user/review/my-images/${order_item_id}?session_token=${session_token}`
        )
            .then((r) => r.json())
            .then((data) => {
                if (data.success) {
                    setReviewImages([data.images[0] || null, data.images[1] || null]);
                }
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

        setLoadingText("Uploading Image...");
        setUploading(true);

        const formData = new FormData();
        formData.append("image", file);
        formData.append("session_token", session_token);
        formData.append("product_id", product_id);
        formData.append("order_item_id", order_item_id);

        try {
            const res = await fetch(`${API}/api/upload/review`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                const updated = [
                    ...(reviewImages.length ? reviewImages : [null, null]),
                ];
                updated[slot] = {
                    media_id: data.media_id,
                    image_url: data.image_url,
                    public_id: data.public_id,
                };
                setReviewImages(updated);
                showMessage("✓ Image uploaded successfully.");
            }
        } catch (err) {
            console.error("Upload error:", err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setDeleteImage(selectedImage);
        setShowDeleteBox(true);
    };

    const handleConfirmDelete = async () => {
        setLoadingText("Deleting Image...");
        setUploading(true);

        try {
            const res = await fetch(
                `${API}/api/upload/review/${deleteImage.media_id}`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_token }),
                }
            );
            const data = await res.json();

            if (data.success) {
                const updated = [...reviewImages];
                const index = updated.findIndex(
                    (img) => img && img.media_id === deleteImage.media_id
                );
                if (index !== -1) updated[index] = null;

                setReviewImages(updated);
                setShowDeleteBox(false);
                setShowPreview(false);
                setSelectedImage(null);
                setDeleteImage(null);
            }
        } catch (err) {
            console.error("Delete error:", err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-images">
            {uploadMessage && (
                <div className="upload-success-toast">{uploadMessage}</div>
            )}

            {uploading && <div className="upload-loading">{loadingText}</div>}

            <h3>Upload Images</h3>

            <p className="upload-note">
                You can upload a maximum of {MAX_IMAGES} images.
            </p>

            <div className="image-preview">
                {UPLOAD_SLOTS.map((index) => {
                    const image = reviewImages[index];

                    return (
                        <div className="preview-card" key={index}>
                            {image ? (
                                <img
                                    src={image.image_url}
                                    alt={`Image ${index + 1}`}
                                    className="preview-image"
                                    onClick={() => {
                                        setSelectedImage(image);
                                        setShowPreview(true);
                                    }}
                                />
                            ) : (
                                <label className="upload-box">
                                    <FiUploadCloud className="upload-icon" />
                                    <span>Image {index + 1}</span>
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
                <div
                    className="review-preview-overlay"
                    onClick={() => setShowPreview(false)}
                >
                    <button
                        className="review-preview-close"
                        onClick={() => setShowPreview(false)}
                    >
                        ✕
                    </button>

                    <button className="review-preview-delete" onClick={handleDeleteClick}>
                        🗑️
                    </button>

                    <img
                        src={selectedImage.image_url}
                        alt="Preview"
                        className="review-preview-image"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {showDeleteBox && (
                <div
                    className="delete-popup-overlay"
                    onClick={() => setShowDeleteBox(false)}
                >
                    <div
                        className="delete-popup"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Delete Image?</h3>
                        <p>Are you sure you want to delete this image?</p>

                        <div className="delete-popup-buttons">
                            <button
                                className="delete-cancel-btn"
                                onClick={() => setShowDeleteBox(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="delete-confirm-btn"
                                onClick={handleConfirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UploadImages;