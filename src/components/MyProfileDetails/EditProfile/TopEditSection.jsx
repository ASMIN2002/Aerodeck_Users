// TopEditSection.jsx - Complete working code

import "./TopEditSection.css";
import { useRef, useState, useEffect } from "react";
import { API } from "../../../services/api";
import NODP from "../../../assets/NODP.png";
import { useNavigate } from "react-router-dom";
import ImageCropper from "../../../pages/Crop/ImageCropper";

function TopEditSection({
    profile,
    setProfile
}) {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadAction, setUploadAction] = useState("");

    // ✅ NEW: Preview image URL state
    const [previewImage, setPreviewImage] = useState(null);

    // ===== STATES FOR CROP & POPUP =====
    const [showPopup, setShowPopup] = useState(false);
    const [showCropModal, setShowCropModal] = useState(false);
    const [imageForCrop, setImageForCrop] = useState(null);

    const handleGoBack = () => {
        navigate(-1);
    };
    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image.");
            return;
        }

        const imageUrl = URL.createObjectURL(file);

        setImageForCrop(imageUrl);
        setShowCropModal(true);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const getCroppedImage = () => {
        if (!imageForCrop || !crop) {
            alert("No image to crop");
            return;
        }

        const image = new Image();
        image.src = imageForCrop;
        image.crossOrigin = "anonymous";

        image.onload = () => {
            try {
                console.log("Image size:", image.naturalWidth, "x", image.naturalHeight);

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // ✅ CRITICAL: Correct crop calculation
                // crop.x, crop.y, crop.width, crop.height are in percentage (0-100)
                const imgWidth = image.naturalWidth;
                const imgHeight = image.naturalHeight;

                // Convert percentage to pixels
                const cropX = (crop.x / 100) * imgWidth;
                const cropY = (crop.y / 100) * imgHeight;
                const cropWidth = (crop.width / 100) * imgWidth;
                const cropHeight = (crop.height / 100) * imgHeight;

                canvas.width = Math.round(cropWidth);
                canvas.height = Math.round(cropHeight);

                // ✅ Draw ONLY the cropped area
                ctx.drawImage(
                    image,
                    cropX,           // Source X
                    cropY,           // Source Y
                    cropWidth,       // Source Width
                    cropHeight,      // Source Height
                    0,               // Dest X
                    0,               // Dest Y
                    canvas.width,    // Dest Width
                    canvas.height    // Dest Height
                );

                // ✅ Verify canvas has content
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                let hasContent = false;
                for (let i = 0; i < imageData.data.length; i += 4) {
                    if (imageData.data[i + 3] > 0) {
                        hasContent = true;
                        break;
                    }
                }


                if (!hasContent) {
                    alert("Cropped image is empty. Please try again.");
                    return;
                }

                // ✅ Convert to blob
                canvas.toBlob((blob) => {
                    if (!blob || blob.size === 0) {
                        alert("Failed to create cropped image.");
                        return;
                    }

                    const file = new File([blob], 'profile_cropped.jpg', {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });

                    const previewUrl = URL.createObjectURL(file);
                    setPreviewImage(previewUrl);
                    setSelectedImage(file);
                    setSelectedFile(file);
                    setShowCropModal(false);

                    // Upload
                    setTimeout(() => {
                        handleUpload(file);
                    }, 300);

                }, 'image/jpeg', 0.95);

            } catch (error) {
                console.error("Crop error:", error);
                alert("Failed to crop image: " + error.message);
            }
        };

        image.onerror = (err) => {
            console.error("Image load error:", err);
            alert("Failed to load image for cropping.");
        };
    };
    // ===== HANDLE UPLOAD =====
    const handleUpload = (file) => {
        const imageToUpload = file || selectedImage;

        if (!imageToUpload || uploading) {
            console.log("Upload skipped");
            return;
        }

        if (imageToUpload.size === 0) {
            alert("Image file is empty. Please select another image.");
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        setUploadSuccess(false);
        setUploadAction("upload");
        setShowPopup(false);

        const formData = new FormData();
        formData.append("image", imageToUpload);
        formData.append("session_token", localStorage.getItem("session_token"));

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API}/api/upload/user-profile`);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const progress = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(progress);
            }
        };

        xhr.onload = () => {
            try {
                const data = JSON.parse(xhr.responseText);
                console.log("Upload Response:", data);

                if (!data.success) {
                    setUploading(false);
                    setUploadProgress(0);
                    alert(data.message || "Upload failed.");
                    return;
                }

                // ✅ Update profile
                setProfile(data.user);
                window.dispatchEvent(new Event("profileImageUpdated"));

                // ✅ Clear selected image (profile image se replace ho jayegi)
                setSelectedImage(null);
                setPreviewImage(null); // ✅ Clear preview

                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }

                setUploadProgress(100);
                setTimeout(() => {
                    setUploading(false);
                    setUploadSuccess(true);
                    setTimeout(() => {
                        setUploadSuccess(false);
                    }, 3000);
                }, 400);

            } catch (err) {
                console.error("Parse error:", err);
                setUploading(false);
                setUploadProgress(0);
                alert("Upload failed. Please try again.");
            }
        };

        xhr.onerror = () => {
            console.error("XHR error");
            setUploading(false);
            setUploadProgress(0);
            alert("Network error. Please try again.");
        };

        xhr.send(formData);
    };

    // ===== HANDLE REMOVE =====
    const handleRemoveProfilePicture = async () => {
        if (!profile?.profile_image || uploading) return;

        setUploading(true);
        setUploadAction("remove");
        setUploadProgress(0);
        setShowPopup(false);

        try {
            const response = await fetch(
                `${API}/api/upload/remove-user-profile`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        session_token: localStorage.getItem("session_token")
                    })
                }
            );

            const data = await response.json();
            console.log("Remove Response:", data);

            if (!data.success) {
                setUploading(false);
                setUploadProgress(0);
                setUploadAction("");
                alert(data.message || "Profile picture deletion failed.");
                return;
            }

            setUploadProgress(100);
            setTimeout(() => {
                setProfile(data.user);
                window.dispatchEvent(new Event("profileImageUpdated"));
                setUploading(false);
                setUploadProgress(0);
                setUploadSuccess("removed");
                setPreviewImage(null);
                setSelectedImage(null);
                setTimeout(() => {
                    setUploadSuccess(false);
                }, 3000);
            }, 500);

        } catch (err) {
            console.error("REMOVE ERROR:", err);
            setUploading(false);
            setUploadProgress(0);
            alert("Profile picture deletion failed.");
        }
    };

    // ===== POPUP CONTROLS =====
    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handlePencilClick = (e) => {
        e.stopPropagation();
        setShowPopup(true);
    };

    const getImageSource = () => {
        // ✅ Priority: previewImage > selectedImage > profile image > NODP
        if (previewImage) {
            return previewImage;
        }
        return profile?.profile_image || NODP;
    };
    const handleCropDone = async (blob) => {
        try {

            if (!blob || blob.size === 0) {
                alert("Failed to create cropped image.");
                return;
            }

            const croppedFile = new File(
                [blob],
                "profile_cropped.jpg",
                {
                    type: "image/jpeg",
                    lastModified: Date.now()
                }
            );

            const previewUrl = URL.createObjectURL(croppedFile);

            setPreviewImage(previewUrl);
            setSelectedImage(croppedFile);

            setShowCropModal(false);
            setImageForCrop(null);

            handleUpload(croppedFile);

        } catch (error) {

            console.error("CROP DONE ERROR:", error);
            alert("Failed to process cropped image.");

        }
    };


    const handleCropCancel = () => {

        if (imageForCrop) {
            URL.revokeObjectURL(imageForCrop);
        }

        setImageForCrop(null);
        setShowCropModal(false);

    };


    return (
        <div className="top-edit-card">

            <div className="top-edit-header">
                <button className="back-button" onClick={handleGoBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5" />
                        <path d="M12 19l-7-7 7-7" />
                    </svg>
                    <span>Back</span>
                </button>
            </div>
            {/* ===== SUCCESS MESSAGE ===== */}
            {uploadSuccess && (
                <div className="profile-upload-success">
                    {uploadSuccess === "removed"
                        ? "✓ PROFILE PICTURE REMOVED SUCCESSFULLY"
                        : "✓ PROFILE PICTURE UPLOADED SUCCESSFULLY"
                    }
                </div>
            )}

            {/* ===== UPLOAD PROGRESS ===== */}
            {uploading && (
                <div className="profile-upload-screen">
                    <div className="profile-upload-box">
                        <div className="profile-upload-icon">↑</div>
                        <h2>
                            {uploadAction === "remove"
                                ? "Removing Profile Picture"
                                : "Uploading Profile Picture"
                            }
                        </h2>
                        <p>Please wait...</p>
                        <div className="profile-upload-progress">
                            <div
                                className="profile-upload-progress-fill"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <div className="profile-upload-percent">
                            {uploadProgress}%
                        </div>
                    </div>
                </div>
            )}

            {/* ===== IMAGE PREVIEW ===== */}
            <div className="mypropreview-section-pro">
                <div className="mypropreview-box-pro">
                    <img
                        src={getImageSource()} // ✅ Updated
                        alt="Profile"
                        className="mypropreview-image-pro"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = NODP;
                        }}
                    />

                    {/* ===== PENCIL BUTTON ===== */}
                    <button
                        className="profile-edit-btn"
                        onClick={handlePencilClick}
                        disabled={uploading}
                        aria-label="Edit Profile Picture"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* ===== HIDDEN FILE INPUT ===== */}
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
                disabled={uploading}
            />

            {/* ===== POPUP MODAL ===== */}
            {showPopup && (
                <div className="profile-popup-overlay" onClick={handleClosePopup}>
                    <div className="profile-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="profile-popup-header">
                            <h3>Edit Profile Picture</h3>
                            <button className="profile-popup-close" onClick={handleClosePopup}>
                                ×
                            </button>
                        </div>
                        <div className="profile-popup-options">
                            <button
                                className="popup-option upload"
                                onClick={() => {
                                    setShowPopup(false);
                                    fileInputRef.current.click();
                                }}
                            >
                                <span className="popup-icon">📷</span>
                                Upload Photo
                                <span className="popup-sub">Choose from gallery</span>
                            </button>

                            {profile?.profile_image && (
                                <button
                                    className="popup-option remove"
                                    onClick={handleRemoveProfilePicture}
                                    disabled={uploading}
                                >
                                    <span className="popup-icon">🗑️</span>
                                    Remove Photo
                                    <span className="popup-sub">Remove current photo</span>
                                </button>
                            )}

                            <button
                                className="popup-option cancel"
                                onClick={handleClosePopup}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== CROP MODAL ===== */}
            {showCropModal && imageForCrop && (
                <div className="crop-modal-overlay">
                    <div className="crop-modal">
                        <div className="crop-modal-header">
                            <h3>Crop Profile Picture</h3>
                            <button
                                className="crop-modal-close"
                                onClick={() => {
                                    setShowCropModal(false);
                                    setImageForCrop(null);
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div className="crop-modal-body">
                            {/* ===== IMAGE CROPPER ===== */}

                            {showCropModal && imageForCrop && (
                                <ImageCropper
                                    image={imageForCrop}
                                    onCancel={handleCropCancel}
                                    onCropDone={handleCropDone}
                                />
                            )}
                        </div>

                        <div className="crop-modal-footer">
                            <button
                                className="crop-btn cancel"
                                onClick={() => {
                                    setShowCropModal(false);
                                    setImageForCrop(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="crop-btn apply"
                                onClick={getCroppedImage}
                            >
                                Apply & Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default TopEditSection;