import { useState, useEffect } from "react";
import { FiUploadCloud } from "react-icons/fi";
import "./UploadImages.css";
import { API } from "../../../../services/api";

function UploadImages({

    reviewImages = [],
    setReviewImages = () => {},

    session_token,
    product_id,
    order_item_id

}) {
    const [uploading, setUploading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [showDeleteBox, setShowDeleteBox] = useState(false);
    const [deleteImage, setDeleteImage] = useState(null);

    useEffect(() => {

        async function loadImages() {

            if (!session_token || !product_id) return;

            try {

                const response = await fetch(

                   `${API}/api/user/review/my-images/${order_item_id}?session_token=${session_token}`

                );

                const data = await response.json();

                if (data.success) {

                    setReviewImages([

                        data.images[0] || null,

                        data.images[1] || null

                    ]);

                }

            } catch (err) {

                console.error(err);

            }

        }

        loadImages();

    }, [

        product_id,
        session_token

    ]);
    const handleImageChange = async (e, slot) => {
        setLoadingText("Uploading Image...");

        setUploading(true);

        const file = e.target.files[0];

        if (!file) return;

        const formData = new FormData();

        formData.append("image", file);
        formData.append("session_token", session_token);
        formData.append("product_id", product_id);
        formData.append("order_item_id", order_item_id);

        const response = await fetch(

            `${API}/api/upload/review`,

            {

                method: "POST",

                body: formData

            }

        );

        const data = await response.json();

        if (data.success) {

            const updated = [...(reviewImages.length ? reviewImages : [null, null])];

            updated[slot] = {

                media_id: data.media_id,
                image_url: data.image_url,
                public_id: data.public_id

            };

            setReviewImages(updated);

            alert("Image uploaded successfully.");

        }
        setUploading(false);

    };

    return (


        <div className="upload-images">
            {
                uploading && (

                    <div className="upload-loading">
                        {loadingText}
                    </div>

                )
            }

            <h3>Upload Images</h3>

            <p className="upload-note">

                You can upload a maximum of 2 images.

            </p>

            <div className="image-preview">

                {

                    [0, 1].map((index) => {

                        const image = reviewImages[index];

                        return (

                            <div
                                className="preview-card"
                                key={index}
                            >

                                {

                                    image ? (

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

                                            <span>

                                                Image {index + 1}

                                            </span>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                onChange={(e) => handleImageChange(e, index)}
                                            />

                                        </label>

                                    )

                                }

                            </div>

                        );

                    })

                }

            </div>
            {
                showPreview && selectedImage && (

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

                        <button
                            className="review-preview-delete"
                            onClick={(e) => {

                                e.stopPropagation();

                                setDeleteImage(selectedImage);

                                setShowDeleteBox(true);

                            }}
                        >
                            🗑️
                        </button>

                        <img
                            src={selectedImage.image_url}
                            alt="Preview"
                            className="review-preview-image"
                            onClick={(e) => e.stopPropagation()}
                        />

                    </div>

                )
            }
            {
                showDeleteBox && (

                    <div
                        className="delete-popup-overlay"
                        onClick={() => setShowDeleteBox(false)}
                    >

                        <div
                            className="delete-popup"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <h3>

                                Delete Image?

                            </h3>

                            <p>

                                Are you sure you want to delete this image?

                            </p>

                            <div className="delete-popup-buttons">

                                <button
                                    className="delete-cancel-btn"
                                    onClick={() => setShowDeleteBox(false)}
                                >

                                    Cancel

                                </button>

                                <button
                                    className="delete-confirm-btn"

                                    onClick={async () => {
                                        setLoadingText("Deleting Image...");
                                        setUploading(true);
                                        try {

                                            const response = await fetch(

                                                `${API}/api/upload/review/${deleteImage.media_id}`,

                                                {

                                                    method: "DELETE",

                                                    headers: {

                                                        "Content-Type": "application/json"

                                                    },

                                                    body: JSON.stringify({

                                                        session_token

                                                    })

                                                }

                                            );

                                            const data = await response.json();

                                            if (data.success) {

                                                const updated = [...reviewImages];

                                                const index = updated.findIndex(

                                                    img => img && img.media_id === deleteImage.media_id

                                                );

                                                if (index !== -1) {

                                                    updated[index] = null;

                                                }

                                                setReviewImages(updated);

                                                setShowDeleteBox(false);

                                                setShowPreview(false);

                                                setSelectedImage(null);

                                                setDeleteImage(null);

                                                setUploading(false);

                                            }

                                        } catch (err) {

                                            console.error(err);
                                            setUploading(false);
                                        }

                                    }}

                                >

                                    Delete

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </div>

    );

}

export default UploadImages;