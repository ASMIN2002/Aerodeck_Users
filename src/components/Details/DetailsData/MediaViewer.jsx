import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { API } from "../../../services/api";
import { FaStar, FaRegStar } from "react-icons/fa";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";
import "../DetailsDataStyle/MediaViewer.css";

function MediaViewer({

    product_id,

    media_id,

    onClose,

    getTimeAgo

}) {

    const [images, setImages] = useState([]);

    const [selectedIndex, setSelectedIndex] = useState(0);

    const [direction, setDirection] = useState("right");

    useEffect(() => {

        async function loadImages() {

            if (!product_id) return;

            try {

                const response = await fetch(

                    `${API}/api/user/review/media/${product_id}`

                );

                const data = await response.json();

                if (data.success) {

                    setImages(data.images);

                    const index = data.images.findIndex(

                        item => item.media_id === media_id

                    );

                    if (index !== -1) {

                        setSelectedIndex(index);

                    }

                }

            } catch (err) {

                console.error(err);

            }

        }

        loadImages();

    }, [

        product_id,

        media_id

    ]);


    if (images.length === 0) return null;

    const currentImage = images[selectedIndex];

    if (!currentImage) return null;

    return createPortal(
        <div
            className="heepit-mv-overlay"
            onClick={onClose}
        >
            <div className="heepit-mv-box">

                <button
                    className="heepit-mv-close"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                >
                    <IoClose />
                </button>

                {selectedIndex > 0 && (
                    <button
                        className="heepit-mv-arrow heepit-mv-arrow-left"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (selectedIndex <= 0) return;
                            setDirection("left");
                            setSelectedIndex(selectedIndex - 1);
                        }}
                    >
                        <IoChevronBack />
                    </button>
                )}

                {selectedIndex < images.length - 1 && (
                    <button
                        className="heepit-mv-arrow heepit-mv-arrow-right"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (selectedIndex >= images.length - 1) return;
                            setDirection("right");
                            setSelectedIndex(selectedIndex + 1);
                        }}
                    >
                        <IoChevronForward />
                    </button>
                )}

                <div
                    className="heepit-mv-image-wrapper"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={currentImage.image_url}
                        alt=""
                        className={`heepit-mv-image ${direction}`}
                    />
                </div>

                <div
                    className="heepit-mv-bottom"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="heepit-mv-user">
                        <img
                            src={currentImage.profile_image}
                            alt=""
                            className="heepit-mv-profile"
                        />
                        <div className="heepit-mv-user-info">
                            <h3>{currentImage.full_name}</h3>
                            <span>{getTimeAgo(currentImage.upload_date)}</span>
                        </div>
                    </div>

                    <div className="heepit-mv-rating">
                        {[...Array(5)].map((_, index) =>
                            index < currentImage.rating ? (
                                <FaStar key={index} className="heepit-mv-star heepit-mv-star-filled" />
                            ) : (
                                <FaRegStar key={index} className="heepit-mv-star" />
                            )
                        )}
                    </div>
                </div>

            </div>
        </div>,
        document.body
    );

}

export default MediaViewer;