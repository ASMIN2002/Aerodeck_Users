import "./TopEditSection.css";
import { useRef, useState } from "react";
import { API } from "../../../services/api";
import NODP from "../../../assets/NODP.png";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function TopEditSection({
    profile,
    setProfile,
    setProfilePage,
    navigateWithLoading
}) {

    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadAction, setUploadAction] = useState("");

    // ===== STATES FOR CROP & POPUP =====
    const [showPopup, setShowPopup] = useState(false);
    const [showCropModal, setShowCropModal] = useState(false);
    const [imageForCrop, setImageForCrop] = useState(null);
    const [crop, setCrop] = useState({
        unit: '%',
        width: 80,
        height: 80,
        x: 10,
        y: 10,
        aspect: 1
    });
    const [selectedFile, setSelectedFile] = useState(null);

    // ===== HANDLE IMAGE SELECTION FROM FILE INPUT =====
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImageForCrop(reader.result);
            setShowCropModal(true);
            setSelectedFile(file);
        };
        reader.readAsDataURL(file);
        
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // ===== HANDLE CROP COMPLETE + AUTO UPLOAD =====
    const getCroppedImage = () => {
        if (!imageForCrop || !crop) return;

        const image = new Image();
        image.src = imageForCrop;

        image.onload = () => {
            const canvas = document.createElement('canvas');
            const scaleX = image.naturalWidth / 100;
            const scaleY = image.naturalHeight / 100;

            canvas.width = crop.width * scaleX;
            canvas.height = crop.height * scaleY;

            const ctx = canvas.getContext('2d');
            
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width * scaleX,
                crop.height * scaleY
            );

            const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            
            // Close crop modal
            setShowCropModal(false);
            
            // Convert data URL to File object
            fetch(croppedDataUrl)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], 'profile_cropped.jpg', { type: 'image/jpeg' });
                    setSelectedImage(file);
                    setSelectedFile(file);
                    
                    // ✅ AUTOMATIC UPLOAD - Crop ke baad directly upload
                    setTimeout(() => {
                        handleUpload(file);
                    }, 300);
                });
        };
    };

    // ===== HANDLE UPLOAD - Modified to accept file parameter =====
    const handleUpload = (file) => {
        // Use passed file or selectedImage
        const imageToUpload = file || selectedImage;
        
        if (!imageToUpload || uploading) {
            console.log("Upload skipped: No image or already uploading");
            return;
        }

        console.log("=== UPLOAD STARTED ===");
        console.log("Image to upload:", imageToUpload);

        setUploading(true);
        setUploadProgress(0);
        setUploadSuccess(false);
        setUploadAction("upload");
        setShowPopup(false);

        const formData = new FormData();
        formData.append("image", imageToUpload);
        formData.append(
            "session_token",
            localStorage.getItem("session_token")
        );

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API}/api/upload/user-profile`);

        // Real progress
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
                
                // Cleanup
                setSelectedImage(null);
                setSelectedFile(null);

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

    // ===== HANDLE REMOVE PROFILE PICTURE =====
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
                setTimeout(() => {
                    setUploadSuccess(false);
                }, 3000);
            }, 500);

        } catch (err) {
            console.error("REMOVE PROFILE PICTURE ERROR:", err);
            setUploading(false);
            setUploadProgress(0);
            alert("Profile picture deletion failed.");
        }
    };

    // ===== CLOSE POPUP =====
    const handleClosePopup = () => {
        setShowPopup(false);
    };

    // ===== HANDLE PENCIL CLICK =====
    const handlePencilClick = (e) => {
        e.stopPropagation();
        setShowPopup(true);
    };

    return (
        <div className="top-edit-card">

            {/* ===== SUCCESS MESSAGE ===== */}
            {uploadSuccess && (
                <div className="profile-upload-success">
                    {uploadSuccess === "removed"
                        ? "✓ PROFILE PICTURE REMOVED SUCCESSFULLY"
                        : "✓ PROFILE PICTURE UPLOADED SUCCESSFULLY"
                    }
                </div>
            )}

            {/* ===== UPLOAD PROGRESS OVERLAY ===== */}
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

            {/* ===== IMAGE PREVIEW WITH PENCIL BUTTON ===== */}
            <div className="mypropreview-section-pro">
                <div className="mypropreview-box-pro">
                    <img
                        src={
                            selectedImage
                                ? URL.createObjectURL(selectedImage)
                                : profile?.profile_image || NODP
                        }
                        alt="Profile"
                        className="mypropreview-image-pro"
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
                            <ReactCrop
                                crop={crop}
                                onChange={(newCrop) => setCrop(newCrop)}
                                aspect={1}
                                circularCrop
                                ruleOfThirds
                            >
                                <img 
                                    src={imageForCrop} 
                                    alt="Crop preview" 
                                    className="crop-image"
                                />
                            </ReactCrop>
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
                                onClick={getCroppedImage} // ✅ YAHAN UPLOAD TRIGGER HOGA
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