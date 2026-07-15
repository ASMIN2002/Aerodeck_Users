import "./ShopCard.css";
import { FiHeart, FiBookmark, FiShoppingCart } from "react-icons/fi";
import { BsHeartFill, BsBookmarkFill } from "react-icons/bs";

function ShopCard({

    shop,

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
                        shop.shop_status
                            ? "gc-status available"
                            : "gc-status unavailable"
                    }
                >

                    {

                        shop.shop_status

                            ? "Available"

                            : "Out Of Stock"

                    }

                </span>

                <button

                    className={`gc-like ${isLiked ? "active" : ""}`}

                    onClick={(e) => {

                        e.stopPropagation();

                        onLike(shop.shop_id);

                    }}

                >

                    {

                        isLiked

                            ? <BsHeartFill />

                            : <FiHeart />

                    }

                    <span className="gc-like-count">

                        {shop.shop_total_likes}

                    </span>

                </button>

            </div>

            <div className="gc-image-box">

                <img

                    src={shop.shop_image1}

                    alt={shop.shop_name}

                    loading="lazy"

                    className="gc-image"

                />

            </div>

            <div className="gc-body">

                {

                    shop.shop_highlight_text && (

                        <div className="gc-highlight">

                            {shop.shop_highlight_text}

                        </div>

                    )

                }

                <h3 className="gc-name">

                    {shop.shop_name}

                </h3>

                <div className="gc-rating-row">

                    <span>

                        ⭐ {shop.shop_rating || "4.3"}

                    </span>

                </div>

                <div className="gc-price-row">

                    <span className="gc-demo-price">

                        ₹{shop.shop_demo_price}

                    </span>

                    <span className="gc-discount">

                        {shop.shop_discount_percentage}% OFF

                    </span>

                </div>

                <div className="gc-final-price">

                    ₹{shop.shop_price}

                    <span> / Piece</span>

                </div>

            </div>

            <div className="gc-footer">

                {

                    !shop.shop_status ? (

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

                                onAddToCart(shop.shop_id);

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

                                onClick={() => onDecreaseQuantity(shop.shop_id)}

                            >

                                -

                            </button>

                            <span className="gc-qty">

                                {cartQuantity}

                            </span>

                            <button

                                className="gc-qty-btn"

                                onClick={() => onIncreaseQuantity(shop.shop_id)}

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

                        onSave(shop.shop_id);

                    }}

                >

                    {

                        isSaved

                            ? <BsBookmarkFill />

                            : <FiBookmark />

                    }

                    <span className="gc-save-count">

                        {shop.shop_total_saves}

                    </span>

                </button>

            </div>

        </div>

    );

}

export default ShopCard;