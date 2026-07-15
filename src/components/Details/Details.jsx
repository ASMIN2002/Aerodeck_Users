import "./Details.css";
import CertifiedCard from "../../assets/CertifiedCard.png";
import { useState } from "react";

function Details() {

    const images = [

        "https://placehold.co/800x800",

        "https://placehold.co/800x800",

        "https://placehold.co/800x800",

        "https://placehold.co/800x800",

        CertifiedCard

    ];

    const [selectedImage, setSelectedImage] = useState(images[0]);

    return (

        <div className="dt-page">

            {/* Back */}

            <div className="dt-header">

                <button className="dt-back">

                    ←

                </button>

                <h2>

                    Product Details

                </h2>

            </div>

            {/* Main Image */}

            <div className="dt-image-box">

                <img

                    src={selectedImage}

                    alt="Product"

                    className="dt-main-image"

                />

            </div>

            {/* Thumbnails */}

            <div className="dt-images">

                {

                    images.map((img, index) => (

                        <img

                            key={index}

                            src={img}

                            alt=""

                            className={`dt-thumb ${selectedImage === img ? "active" : ""}`}

                            onClick={() => setSelectedImage(img)}

                        />

                    ))

                }

            </div>

            {/* Product */}

            <div className="dt-body">

                <div className="dt-highlight">

                    Premium Collection

                </div>

                <h2>

                    Wedding Invitation Card

                </h2>

                <div className="dt-rating">

                    ⭐ 4.8

                </div>

                <div className="dt-price">

                    <span className="dt-final">

                        ₹950

                    </span>

                    <span className="dt-demo">

                        ₹1200

                    </span>

                    <span className="dt-off">

                        20% OFF

                    </span>

                </div>

                <div className="dt-status">

                    Available

                </div>

                <div className="dt-description">

                    Lorem ipsum dolor sit amet consectetur adipisicing elit.

                </div>

            </div>

            {/* Quantity */}

            <div className="dt-cart">

                <button>

                    -

                </button>

                <span>

                    50

                </span>

                <button>

                    +

                </button>

            </div>

            {/* Buttons */}

            <div className="dt-buttons">

                <button>

                    ❤ Like

                </button>

                <button>

                    🔖 Save

                </button>

                <button>

                    🛒 Add To Cart

                </button>

            </div>

        </div>

    );

}

export default Details;