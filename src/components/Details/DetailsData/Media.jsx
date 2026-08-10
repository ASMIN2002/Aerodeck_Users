import { useEffect, useState } from "react";
import "../DetailsDataStyle/Media.css";
import { API } from "../../../services/api";

function Media({

    product_id,

    onViewAll

}) {

    const [images, setImages] = useState([]);

    useEffect(() => {

        async function loadMedia() {

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

        loadMedia();

    }, [

        product_id

    ]);

    const visibleImages = images.slice(0, 5);

    const remainingImages = images.length - 5;

    return (

        <div className="dt-media">

            <div className="dt-section-header">

                <h3>
                    Product Images
                </h3>

                <button
                    className="dt-view-all"
                    onClick={onViewAll}
                >

                    View All

                </button>

            </div>

            {

                images.length === 0 ? (

                    <div className="dt-media-scroll">

                        <div className="dt-media-card dt-no-media-card">

                            <div className="dt-no-media-icon">
                                📷
                            </div>

                            <div className="dt-no-media-content">

                                <h4>
                                    No Customer Images Yet
                                </h4>

                                <p>
                                    Be the first customer to share an image of this product.
                                </p>

                            </div>

                        </div>

                    </div>

                ) : (

                    <div className="dt-media-scroll">

                        {

                            visibleImages.map((image, index) => (

                                <div
                                    className="dt-media-card"
                                    key={image.media_id}
                                >

                                    <img
                                        src={image.image_url}
                                        alt="Customer Media"
                                        className="dt-media-image"
                                    />

                                    {

                                        index === 4 && remainingImages > 0 && (

                                            <div
                                                className="dt-media-overlay"
                                                onClick={onViewAll}
                                            >

                                                +{remainingImages}

                                            </div>

                                        )

                                    }

                                </div>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

}

export default Media;