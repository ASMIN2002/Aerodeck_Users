import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import "../DetailsDataStyle/AllMedia.css";
import { FaStar, FaRegStar } from "react-icons/fa";
import MediaViewer from "./MediaViewer";
import { API } from "../../../services/api";

function AllMedia({

    product_id,

    onBack

}) {

    const [images, setImages] = useState([]);

    const [showViewer, setShowViewer] = useState(false);

    const [selectedIndex, setSelectedIndex] = useState(0);

    function getTimeAgo(uploadDate) {

        const now = new Date();

        const date = new Date(uploadDate);

        const diff = Math.floor((now - date) / 1000);

        if (diff < 86400) return "Today";

        if (diff < 172800) return "Yesterday";

        const days = Math.floor(diff / 86400);

        if (days < 30) {

            return `${days} day${days > 1 ? "s" : ""} ago`;

        }

        const months = Math.floor(days / 30);

        if (months < 12) {

            return `${months} month${months > 1 ? "s" : ""} ago`;

        }

        const years = Math.floor(months / 12);

        return `${years} year${years > 1 ? "s" : ""} ago`;

    }

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

                }

            } catch (err) {

                console.error(err);

            }

        }

        loadImages();

    }, [

        product_id

    ]);

    return (

        <div className="all-media">

            <div className="all-media-header">

                <button
                    className="all-media-back"
                    onClick={onBack}
                >

                    <IoArrowBack />

                </button>

                <h2>

                    Review Images

                </h2>

            </div>

            <div className="all-media-grid">

                {

                    images.map((image, index) => (

                        <div
                            className="all-media-card"
                            key={image.media_id}
                        >
                            <img
                                src={image.image_url}
                                alt="Customer Media"
                                className="all-media-image"
                                onClick={() => {

                                    setSelectedIndex(index);

                                    setShowViewer(true);

                                }}
                            />

                        </div>

                    ))

                }

            </div>
            {

                showViewer && (

                    <MediaViewer

                        product_id={product_id}

                        media_id={images[selectedIndex]?.media_id}

                        onClose={() => {

                            setShowViewer(false);

                        }}

                        getTimeAgo={getTimeAgo}

                    />

                )

            }

        </div>

    );

}

export default AllMedia;