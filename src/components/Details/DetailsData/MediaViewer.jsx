import { useEffect, useState } from "react";
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

    return (

        <div
            className="media-viewer-overlay"
            onClick={onClose}
        >

            <div
                className="media-viewer"
            >

                <button
                    className="viewer-close"
                    onClick={(e) => {

                        e.stopPropagation();

                        onClose();

                    }}
                >

                    <IoClose />

                </button>

                {
                    selectedIndex > 0 && (

                        <button className="viewer-arrow left"
                            onClick={(e) => {

                                e.stopPropagation();

                                if (selectedIndex <= 0) return;

                                setDirection("left");

                                setSelectedIndex(selectedIndex - 1);

                            }}
                        >

                            <IoChevronBack />

                        </button>

                    )

                }
                {
                    selectedIndex < images.length - 1 && (

                        <button className="viewer-arrow right"
                            onClick={(e) => {

                                e.stopPropagation();

                                if (selectedIndex >= images.length - 1) return;

                                setDirection("right");

                                setSelectedIndex(selectedIndex + 1);

                            }}
                        >

                            <IoChevronForward />

                        </button>

                    )

                }

                < div
                    className="viewer-image-wrapper"
                    onClick={(e) => e.stopPropagation()}
                >

                    <img
                        src={currentImage.image_url}
                        alt=""
                        className={`viewer-image ${direction}`}
                    />

                </div>

                <div
                    className="viewer-bottom"
                    onClick={(e) => e.stopPropagation()}
                >

                    <div className="viewer-user">

                        <img
                            src={currentImage.profile_image}
                            alt=""
                            className="viewer-profile"
                        />

                        <div className="viewer-user-info">

                            <h3>

                                {currentImage.full_name}

                            </h3>

                            <span>

                                {getTimeAgo(currentImage.upload_date)}

                            </span>

                        </div>

                    </div>

                    <div className="viewer-rating">

                        {

                            [...Array(5)].map((_, index) => (

                                index < currentImage.rating ? (

                                    <FaStar
                                        key={index}
                                        className="star filled"
                                    />

                                ) : (

                                    <FaRegStar
                                        key={index}
                                        className="star"
                                    />

                                )

                            ))

                        }

                    </div>

                </div>

            </div>

        </div >

    );

}

export default MediaViewer;