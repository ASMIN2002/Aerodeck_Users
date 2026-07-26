import "./UploadImages.css";
import { FiUploadCloud } from "react-icons/fi";

function UploadImages() {

    return (

        <div className="upload-images">

            <h3>Upload Images</h3>

            <p className="upload-note">
                You can upload a maximum of 2 images.
            </p>

            <label className="upload-box">

                <FiUploadCloud className="upload-icon" />

                <span>Click to choose images</span>

                <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                />

            </label>

            <div className="image-preview">

                <div className="preview-card">
                    <span>Image 1</span>
                </div>

                <div className="preview-card">
                    <span>Image 2</span>
                </div>

            </div>

        </div>

    );

}

export default UploadImages;