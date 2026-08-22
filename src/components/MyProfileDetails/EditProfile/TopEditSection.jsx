import "./TopEditSection.css";
import { useRef, useState } from "react";
import { API } from "../../../services/api";
import NODP from "../../../assets/NODP.png";

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

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setSelectedImage(file);
    };

    const handleRemoveProfilePicture = async () => {

        if (!profile?.profile_image || uploading) return;

        setUploading(true);
        setUploadAction("remove");
        setUploadProgress(0);
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

            if (!data.success) {

                setUploading(false);
                setUploadProgress(0);
                setUploadAction("");

                alert(
                    data.message ||
                    "Profile picture deletion failed."
                );

                return;
            }

            // Loading screen complete
            setUploadProgress(100);

            setTimeout(() => {


                setProfile(data.user);
                window.dispatchEvent(
                    new Event("profileImageUpdated")
                );
                setUploading(false);
                setUploadProgress(0);

                setUploadSuccess("removed");
                // Hide message after 3 seconds
                setTimeout(() => {

                    setUploadSuccess(false);

                }, 3000);

            }, 500);

        } catch (err) {

            console.error(
                "REMOVE PROFILE PICTURE ERROR:",
                err
            );

            setUploading(false);
            setUploadProgress(0);

            alert("Profile picture deletion failed.");
        }
    };
    const handleUpload = () => {

        if (!selectedImage || uploading) return;

        setUploading(true);
        setUploadProgress(0);
        setUploadSuccess(false);
        setUploadAction("upload");


        const formData = new FormData();

        formData.append("image", selectedImage);
        formData.append(
            "session_token",
            localStorage.getItem("session_token")
        );

        const xhr = new XMLHttpRequest();

        xhr.open(
            "POST",
            `${API}/api/upload/user-profile`
        );

        // Fixed 5-second progress
        let progress = 0;

        const progressTimer = setInterval(() => {

            progress += 30;

            if (progress >= 100) {
                progress = 100;
                clearInterval(progressTimer);
            }

            setUploadProgress(progress);

        }, 1000);


        xhr.onload = () => {

            try {

                const data = JSON.parse(xhr.responseText);

                if (!data.success) {

                    clearInterval(progressTimer);

                    setUploading(false);
                    setUploadProgress(0);

                    alert(data.message || "Upload failed.");

                    return;
                }


                // Update profile
                setProfile(data.user);
                window.dispatchEvent(
                    new Event("profileImageUpdated")
                );
                setSelectedImage(null);

                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }

                setTimeout(() => {

                    setUploadProgress(100);

                    setTimeout(() => {

                        setUploading(false);

                        // Show success message
                        setUploadSuccess(true);

                        // Hide success message after 3 seconds
                        setTimeout(() => {
                            setUploadSuccess(false);
                        }, 3000);

                    }, 400);

                }, 100);


            } catch (err) {

                clearInterval(progressTimer);

                console.error(err);

                setUploading(false);
                setUploadProgress(0);

                alert("Upload failed.");

            }
        };


        xhr.onerror = () => {

            clearInterval(progressTimer);

            setUploading(false);
            setUploadProgress(0);

            alert("Upload failed.");

        };


        xhr.send(formData);
    };

    return (

        <div className="top-edit-card">


            {uploadSuccess && (
                <div className="profile-upload-success">
                    {uploadSuccess === "removed"
                        ? "✓ PROFILE PICTURE REMOVED SUCCESSFULLY"
                        : "✓ PROFILE PICTURE UPLOADED SUCCESSFULLY"
                    }
                </div>
            )}
            {uploading && (

                <div className="profile-upload-screen">

                    <div className="profile-upload-box">

                        <div className="profile-upload-icon">
                            ↑
                        </div>

                        <h2>
                            {uploadAction === "remove"
                                ? "Removing Profile Picture"
                                : "Uploading Profile Picture"
                            }
                        </h2>

                        <p>
                            Please wait...
                        </p>


                        <div className="profile-upload-progress">

                            <div
                                className="profile-upload-progress-fill"
                                style={{
                                    width: `${uploadProgress}%`
                                }}
                            />

                        </div>


                        <div className="profile-upload-percent">
                            {uploadProgress}%
                        </div>

                    </div>

                </div>

            )}


            {/* =========================
                ACTIONS
            ========================= */}

            <div className="preview-actions">

                <button
                    className="myproedit-back"
                    disabled={uploading}
                    onClick={() => {
                        navigateWithLoading(
                            () => {
                                setProfilePage("viewprofile");
                            },
                            "Loading Profile...",
                            500
                        );
                    }}
                >
                    ← Go Back
                </button>


                <button
                    className="myproupload-btn"
                    disabled={!selectedImage || uploading}
                    onClick={handleUpload}
                >
                    Upload
                </button>


                <button
                    className="myprochange-btn"
                    disabled={uploading}
                    onClick={() => fileInputRef.current.click()}
                >
                    Change
                </button>
                <button
                    className="myproremove-btn"
                    disabled={!profile?.profile_image || uploading}
                    onClick={handleRemoveProfilePicture}
                >
                    Remove DP
                </button>

            </div>


            {/* =========================
                IMAGE PREVIEW
            ========================= */}

            <div className="mypropreview-section-pro">
                <div className="mypropreview-box-pro">
                    <img
                        src={
                            selectedImage
                                ? URL.createObjectURL(selectedImage)
                                : profile?.profile_image || NODP
                        }
                        alt="Preview"
                        className="mypropreview-image-pro"
                    />

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

        </div>
    );
}

export default TopEditSection;