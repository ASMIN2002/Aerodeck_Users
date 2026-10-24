import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCamera, FiTrash2, FiX, FiUpload } from "react-icons/fi";
import { API } from "../../../services/api";
import NODP from "../../../assets/NODP.png";
import ImageCropper from "../../../pages/Crop/ImageCropper";
import "./TopEditSection.css";

const SUCCESS_DURATION = 3000;
const UPLOAD_FINISH_DELAY = 400;
const REMOVE_FINISH_DELAY = 500;
const CROPPED_FILENAME = "profile_cropped.jpg";

const getSession = () => localStorage.getItem("session_token");

function TopEditSection({ profile, setProfile }) {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadAction, setUploadAction] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showCropModal, setShowCropModal] = useState(false);
    const [imageForCrop, setImageForCrop] = useState(null);

    useEffect(() => {
        return () => { if (previewImage) URL.revokeObjectURL(previewImage); };
    }, [previewImage]);

    const clearFileInput = () => { if (fileInputRef.current) fileInputRef.current.value = ""; };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return alert("Please select a valid image.");

        setImageForCrop(URL.createObjectURL(file));
        setShowCropModal(true);
        clearFileInput();
    };

    const handleUpload = (file) => {
        const imageToUpload = file || selectedImage;
        if (!imageToUpload || uploading) return;
        if (imageToUpload.size === 0) return alert("Image file is empty. Please select another image.");

        setUploading(true);
        setUploadProgress(0);
        setUploadSuccess(false);
        setUploadAction("upload");
        setShowPopup(false);

        const formData = new FormData();
        formData.append("image", imageToUpload);
        formData.append("session_token", getSession());

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API}/api/upload/user-profile`);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) setUploadProgress(Math.round((event.loaded / event.total) * 100));
        };

        xhr.onload = () => {
            try {
                const data = JSON.parse(xhr.responseText);
                if (!data.success) {
                    setUploading(false);
                    setUploadProgress(0);
                    return alert(data.message || "Upload failed.");
                }
                setProfile(data.user);
                window.dispatchEvent(new Event("profileImageUpdated"));
                setSelectedImage(null);
                setPreviewImage(null);
                clearFileInput();
                setUploadProgress(100);
                setTimeout(() => {
                    setUploading(false);
                    setUploadSuccess(true);
                    setTimeout(() => setUploadSuccess(false), SUCCESS_DURATION);
                }, UPLOAD_FINISH_DELAY);
            } catch (err) {
                console.error("Parse error:", err.message);
                setUploading(false);
                setUploadProgress(0);
                alert("Upload failed. Please try again.");
            }
        };

        xhr.onerror = () => {
            setUploading(false);
            setUploadProgress(0);
            alert("Network error. Please try again.");
        };

        xhr.send(formData);
    };

    const handleRemoveProfilePicture = async () => {
        if (!profile?.profile_image || uploading) return;

        setUploading(true);
        setUploadAction("remove");
        setUploadProgress(0);
        setShowPopup(false);

        try {
            const data = await fetch(`${API}/api/upload/remove-user-profile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: getSession() }),
            }).then((r) => r.json());

            if (!data.success) {
                setUploading(false);
                setUploadProgress(0);
                setUploadAction("");
                return alert(data.message || "Profile picture deletion failed.");
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
                setTimeout(() => setUploadSuccess(false), SUCCESS_DURATION);
            }, REMOVE_FINISH_DELAY);
        } catch (err) {
            console.error("Remove error:", err.message);
            setUploading(false);
            setUploadProgress(0);
            alert("Profile picture deletion failed.");
        }
    };

    const handleCropDone = (blob) => {
        try {
            if (!blob || blob.size === 0) return alert("Failed to create cropped image.");
            const croppedFile = new File([blob], CROPPED_FILENAME, { type: "image/jpeg", lastModified: Date.now() });
            setPreviewImage(URL.createObjectURL(croppedFile));
            setSelectedImage(croppedFile);
            setShowCropModal(false);
            setImageForCrop(null);
            handleUpload(croppedFile);
        } catch (err) {
            console.error("Crop done error:", err.message);
            alert("Failed to process cropped image.");
        }
    };

    const handleCropCancel = () => {
        if (imageForCrop) URL.revokeObjectURL(imageForCrop);
        setImageForCrop(null);
        setShowCropModal(false);
    };

    const getImageSource = () => previewImage || profile?.profile_image || NODP;
    const uploadActionLabel = uploadAction === "remove" ? "Removing Profile Picture" : "Uploading Profile Picture";

    return (
        <div className="top-edit-card">
            <div className="top-edit-header">
                <button className="back-button" onClick={() => navigate(-1)} aria-label="Back">
                    <FiArrowLeft />
                </button>
                <h2>Edit Profile</h2>
            </div>

            {uploadSuccess && (
                <div className="profile-upload-success">
                    {uploadSuccess === "removed" ? "Profile picture removed successfully" : "Profile picture uploaded successfully"}
                </div>
            )}

            {uploading && (
                <div className="profile-upload-screen">
                    <div className="profile-upload-box">
                        <div className="profile-upload-icon"><FiUpload /></div>
                        <h2>{uploadActionLabel}</h2>
                        <p>Please wait...</p>
                        <div className="profile-upload-progress">
                            <div className="profile-upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
                        </div>
                        <div className="profile-upload-percent">{uploadProgress}%</div>
                    </div>
                </div>
            )}

            <div className="mypropreview-section-pro">
                <div className="mypropreview-box-pro">
                    <img
                        src={getImageSource()}
                        alt="Profile"
                        className="mypropreview-image-pro"
                        onError={(e) => { e.target.onerror = null; e.target.src = NODP; }}
                    />
                    <button
                        className="profile-edit-btn"
                        onClick={(e) => { e.stopPropagation(); setShowPopup(true); }}
                        disabled={uploading}
                        aria-label="Edit Profile Picture"
                    >
                        <FiCamera />
                    </button>
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
                disabled={uploading}
            />

            {showPopup && createPortal(
                <div className="profile-popup-overlay" onClick={() => setShowPopup(false)}>
                    <div className="profile-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="profile-popup-header">
                            <h3>Edit Profile Picture</h3>
                            <button className="profile-popup-close" onClick={() => setShowPopup(false)} aria-label="Close">
                                <FiX />
                            </button>
                        </div>

                        <div className="profile-popup-options">
                            <button className="popup-option upload" onClick={() => { setShowPopup(false); fileInputRef.current.click(); }}>
                                <span className="popup-icon"><FiCamera /></span>
                                <div>
                                    <strong>Upload Photo</strong>
                                    <span className="popup-sub">Choose from gallery</span>
                                </div>
                            </button>

                            {profile?.profile_image && (
                                <button className="popup-option remove" onClick={handleRemoveProfilePicture} disabled={uploading}>
                                    <span className="popup-icon"><FiTrash2 /></span>
                                    <div>
                                        <strong>Remove Photo</strong>
                                        <span className="popup-sub">Remove current photo</span>
                                    </div>
                                </button>
                            )}

                            <button className="popup-option cancel" onClick={() => setShowPopup(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {showCropModal && imageForCrop && createPortal(
                <div className="crop-modal-overlay">
                    <div className="crop-modal">
                        <div className="crop-modal-header">
                            <h3>Crop Profile Picture</h3>
                            <button className="crop-modal-close" onClick={handleCropCancel} aria-label="Close">
                                <FiX />
                            </button>
                        </div>
                        <div className="crop-modal-body">
                            <ImageCropper image={imageForCrop} onCancel={handleCropCancel} onCropDone={handleCropDone} />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

export default TopEditSection;