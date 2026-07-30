import "./TopEditSection.css";
import { useRef, useState } from "react";
import { API } from "../../../services/api";
import AerodeckDP from "../../../assets/AerodeckDP.png";


function TopEditSection({
    user,
    setUser,
    setProfilePage
}) {

    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedImage(file);
    };

    const handleUpload = async () => {

        if (!selectedImage) return;

        try {

            const formData = new FormData();

            formData.append("image", selectedImage);
            formData.append(
                "session_token",
                localStorage.getItem("session_token")
            );
            const res = await fetch(`${API}/api/upload/user-profile`, {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (!data.success) {
                alert(data.message);
                return;
            }

            setUser(data.user);
          
            setSelectedImage(null);

            fileInputRef.current.value = "";

            alert("Profile updated successfully.");

        } catch (err) {

            console.error(err);

            alert("Upload failed.");

        }

    };

    const handleRemove = async () => {

        try {

            const res = await fetch(
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

            const data = await res.json();

            if (!data.success) {
                alert(data.message);
                return;
            }

            setUser(data.user);

            setSelectedImage(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            alert("Profile image removed.");

        } catch (err) {

            console.error(err);

        }

    };

    return (

        <div className="top-edit-card">


            {/* Actions */}

            <div className="preview-actions">
                <button
                    className="mycart-back"
                    onClick={() => setProfilePage("viewprofile")}
                >
                    ← Go Back
                </button>

                <button
                    className="upload-btn"
                    disabled={!selectedImage}
                    onClick={handleUpload}
                >
                    Upload
                </button>
                <button
                    className="change-btn"
                    onClick={() => fileInputRef.current.click()}
                >
                    Change
                </button>
                <button
                    className="remove-btn"
                    onClick={handleRemove}
                >
                    Remove DP
                </button>

            </div>
            {/* Preview */}

            <div className="preview-section">

                <div className="preview-box">

                    <img
                        src={
                            selectedImage
                                ? URL.createObjectURL(selectedImage)
                                : (user?.profile_image)
                        }
                        alt="Preview"
                        className="preview-image"
                    />

                </div>

            </div>
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
            />

        </div>

    );

}

export default TopEditSection;