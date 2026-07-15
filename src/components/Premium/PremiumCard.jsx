import "./PremiumCard.css";
import { FiHeart, FiBookmark, FiShoppingCart } from "react-icons/fi";
import { BsHeartFill, BsBookmarkFill } from "react-icons/bs";

function PremiumCard({

    premium,

    isSaved = false,

    isLiked = false,

    isAddedToCart = false,

    cartQuantity = 0,

    onSave = () => { },

    onLike = () => { },

    onAddToCart = () => { },

    onIncreaseQuantity = () => { },

    onDecreaseQuantity = () => { },

    onOpenDetails = () => { }

}) {
    const handleCardClick = () => {

        onOpenDetails();

    };

    return (

        <div
            className="gc-card"
            onClick={handleCardClick}
        >

            <div className="gc-top">

                <span
                    className={
                        premium.premium_status
                            ? "gc-status available"
                            : "gc-status unavailable"
                    }
                >

                    {

                        premium.premium_status

                            ? "Available"

                            : "Out Of Stock"

                    }

                </span>

                <button

                    className={`gc-like ${isLiked ? "active" : ""}`}

                    onClick={(e) => {

                        e.stopPropagation();

                        onLike(premium.premium_id);

                    }}

                >

                    {

                        isLiked

                            ? <BsHeartFill />

                            : <FiHeart />

                    }

                    <span className="gc-like-count">

                        {premium.premium_total_likes}

                    </span>

                </button>

            </div>

            <div className="gc-image-box">

                <img

                    src={premium.premium_image1}

                    alt={premium.premium_name}

                    loading="lazy"

                    className="gc-image"

                />

            </div>

            <div className="gc-body">

                {

                    premium.premium_highlight_text && (

                        <div className="gc-highlight">

                            {premium.premium_highlight_text}

                        </div>

                    )

                }

                <h3 className="gc-name">

                    {premium.premium_name}

                </h3>

                <div className="gc-rating-row">

                    <span>

                        ⭐ {premium.premium_rating || "4.3"}

                    </span>

                </div>

                <div className="gc-price-row">

                    <span className="gc-demo-price">

                        ₹{premium.premium_demo_price}

                    </span>

                    <span className="gc-discount">

                        {premium.premium_discount_percentage}% OFF

                    </span>

                </div>

                <div className="gc-final-price">

                    ₹{premium.premium_price}

                    <span> / Piece</span>

                </div>

            </div>

            <div className="gc-footer">

                {

                    !premium.premium_status ? (

                        <button
                            className="gc-cart-btn"
                            disabled
                        >

                            Out Of Stock

                        </button>

                    ) : !isAddedToCart ? (

                        <button

                            className="gc-cart-btn"

                            onClick={(e) => {

                                e.stopPropagation();

                                onAddToCart(premium.premium_id);

                            }}

                        >

                            <FiShoppingCart />

                            <span>Add To Cart</span>

                        </button>

                    ) : (

                        <div
                            className="gc-qty-box"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <button

                                className="gc-qty-btn"

                                onClick={() => onDecreaseQuantity(premium.premium_id)}

                            >

                                -

                            </button>

                            <span className="gc-qty">

                                {cartQuantity}

                            </span>

                            <button

                                className="gc-qty-btn"

                                onClick={() => onIncreaseQuantity(premium.premium_id)}

                            >

                                +

                            </button>

                        </div>

                    )

                }

                <button

                    className={`gc-save ${isSaved ? "active" : ""}`}

                    onClick={(e) => {

                        e.stopPropagation();

                        onSave(premium.premium_id);

                    }}

                >

                    {

                        isSaved

                            ? <BsBookmarkFill />

                            : <FiBookmark />

                    }

                    <span className="gc-save-count">

                        {premium.premium_total_saves}

                    </span>

                </button>

            </div>

        </div>

    );

}

export default PremiumCard;