import "./GiftCard.css";
import { FiHeart, FiBookmark, FiShoppingCart } from "react-icons/fi";
import { BsHeartFill, BsBookmarkFill } from "react-icons/bs";

function GiftCard({

    gift,

    isSaved = false,

    isLiked = false,

    isAddedToCart = false,

    cartQuantity = 0,

    onSave = () => { },

    onLike = () => { },

    onAddToCart = () => { },

    onIncreaseQuantity = () => { },

    onDecreaseQuantity = () => { },

     onOpenDetails = () => {}

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
                        gift.gift_status
                            ? "gc-status available"
                            : "gc-status unavailable"
                    }
                >

                    {

                        gift.gift_status

                            ? "Available"

                            : "Out Of Stock"

                    }

                </span>

                <button

                    className={`gc-like ${isLiked ? "active" : ""}`}

                    onClick={(e) => {

                        e.stopPropagation();

                        onLike(gift.gift_id);

                    }}

                >

                    {

                        isLiked

                            ? <BsHeartFill />

                            : <FiHeart />

                    }

                    <span className="gc-like-count">

                        {gift.gift_total_likes}

                    </span>

                </button>

            </div>

            <div className="gc-image-box">

                <img

                    src={gift.gift_image1}

                    alt={gift.gift_name}

                    loading="lazy"

                    className="gc-image"

                />

            </div>

            <div className="gc-body">

                {

                    gift.gift_highlight_text && (

                        <div className="gc-highlight">

                            {gift.gift_highlight_text}

                        </div>

                    )

                }

                <h3 className="gc-name">

                    {gift.gift_name}

                </h3>

                <div className="gc-rating-row">

                    <span>

                        ⭐ {gift.gift_rating || "4.3"}

                    </span>

                </div>

                <div className="gc-price-row">

                    <span className="gc-demo-price">

                        ₹{gift.gift_demo_price}

                    </span>

                    <span className="gc-discount">

                        {gift.gift_discount_percentage}% OFF

                    </span>

                </div>

                <div className="gc-final-price">

                    ₹{gift.gift_price}

                    <span> / Piece</span>

                </div>

            </div>

            <div className="gc-footer">

                {

                    !gift.gift_status ? (

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

                                onAddToCart(gift.gift_id);

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

                                onClick={() => onDecreaseQuantity(gift.gift_id)}

                            >

                                -

                            </button>

                            <span className="gc-qty">

                                {cartQuantity}

                            </span>

                            <button

                                className="gc-qty-btn"

                                onClick={() => onIncreaseQuantity(gift.gift_id)}

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

                        onSave(gift.gift_id);

                    }}

                >

                    {

                        isSaved

                            ? <BsBookmarkFill />

                            : <FiBookmark />

                    }

                    <span className="gc-save-count">

                        {gift.gift_total_saves}

                    </span>

                </button>

            </div>

        </div>

    );

}

export default GiftCard;