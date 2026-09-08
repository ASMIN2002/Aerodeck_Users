import { useState } from "react";
import Cropper from "react-easy-crop";

import "./ImageCropper.css";
import getCroppedImage from "./cropImage";

export default function ImageCropper({
    image,
    onCancel,
    onCropDone
}) {

    const [crop, setCrop] = useState({
        x: 0,
        y: 0
    });

    const [zoom, setZoom] = useState(1);

    const [croppedAreaPixels, setCroppedAreaPixels] =
        useState(null);

    const [processing, setProcessing] =
        useState(false);


    // ================================
    // CROP COMPLETE
    // ================================

    const onCropComplete = (
        croppedArea,
        croppedPixels
    ) => {

        setCroppedAreaPixels(
            croppedPixels
        );

    };


    // ================================
    // HANDLE CROP
    // ================================

    const handleCrop = async () => {

        if (!croppedAreaPixels) {
            return;
        }

        try {

            setProcessing(true);

            // Generate ONLY cropped image
            const blob =
                await getCroppedImage(
                    image,
                    croppedAreaPixels
                );


            if (!blob) {

                throw new Error(
                    "Failed to create cropped image"
                );

            }


            // Send cropped blob to parent
            onCropDone(blob);

        }

        catch (err) {

            console.error(
                "IMAGE CROP ERROR:",
                err
            );

            alert(
                "Failed to crop image. Please try again."
            );

        }

        finally {

            setProcessing(false);

        }

    };


    // ================================
    // CLOSE ON OVERLAY CLICK
    // ================================

    const handleOverlayClick = (e) => {

        if (
            e.target === e.currentTarget &&
            !processing
        ) {

            onCancel();

        }

    };


    return (

        <div
            className="fd-crop-overlay"
            onClick={handleOverlayClick}
        >

            <div className="fd-crop-card">


                {/* ================= HEADER ================= */}

                <div className="fd-crop-header">

                    <div>

                        <h2>
                            Crop Profile Picture
                        </h2>

                        <p>
                            Move and zoom your image
                        </p>

                    </div>


                    <button
                        className="fd-crop-close"
                        onClick={onCancel}
                        disabled={processing}
                        aria-label="Close"
                    >
                        ×
                    </button>

                </div>


                {/* ================= CROP AREA ================= */}

                <div className="fd-crop-container">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}

                        aspect={1}
                        cropShape="round"
                        showGrid={false}

                        minZoom={1}
                        maxZoom={4}

                        zoomWithScroll={true}

                        onCropChange={setCrop}

                        onZoomChange={setZoom}

                        onCropComplete={onCropComplete}
                    />

                </div>

                {/* ================= BUTTONS ================= */}

                <div className="fd-crop-buttons">


                    <button

                        className="fd-cancel-btn"

                        onClick={onCancel}

                        disabled={processing}

                    >

                        Cancel

                    </button>


                    <button

                        className="fd-crop-btn"

                        onClick={handleCrop}

                        disabled={
                            processing ||
                            !croppedAreaPixels
                        }

                    >

                        {processing
                            ? "Processing..."
                            : "Crop & Upload"
                        }

                    </button>


                </div>


            </div>

        </div>

    );

}
