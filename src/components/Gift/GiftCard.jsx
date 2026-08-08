import { FiHeart, FiBookmark } from "react-icons/fi";
import { BsHeartFill, BsBookmarkFill } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";

function ProductGift({

    product,

    isSaved,

    isLiked,

    isAddedToCart,

    cartQuantity,

    onSave,

    onLike,

    onAddToCart,

    onIncreaseQuantity,

    onDecreaseQuantity,

    onOpenDetails = () => { }

}) {

    const handleGiftClick = () => {

        onOpenDetails();

    };
    return (

        <div
            className="pc-card"
            onClick={handleGiftClick}
        >

            <div className="pc-top">

                <span
                    className={
                        product.gift_status
                            ? "pc-status available"
                            : "pc-status unavailable"
                    }
                >

                    {
                        product.gift_status

                            ? "Available"

                            : "Out of Stock"

                    }

                </span>
                <button

                    className={`pc-like ${isLiked ? "active" : ""}`}

                    onClick={(e) => {

                        e.stopPropagation();

                        onLike(product.gift_id);

                    }}

                >

                    {

                        isLiked

                            ? <BsHeartFill />

                            : <FiHeart />

                    }

                    <span className="pc-like-count">

                        {product.gift_total_likes}

                    </span>

                </button>

            </div>

            <div className="pc-image-box">

                <div className="pc-image-grid">
                    <img src={product.gift_image1} alt="" className="pc-image" />
                </div>

            </div>

            <div className="pc-body">

                {
                    product.gift_highlight_text && (
                        <div className="pc-highlight">
                            {product.gift_highlight_text}
                        </div>
                    )
                }
                <div className="pc-rating-row">

                    <span>

                        ⭐ {product.gift_rating || "4.3"}

                    </span>
                    <div className="pc-final-price">

                        ₹{product.gift_price}

                        <span>

                            {" "}

                            / Piece

                        </span>

                    </div>

                </div>

                <h3 className="pc-name">

                    {product.gift_name}

                </h3>



                <div className="pc-price-row">

                    <span className="pc-demo-price">

                        ₹{product.gift_demo_price}

                    </span>

                    <span className="pc-discount">

                        {product.gift_discount_percentage}% OFF

                    </span>

                </div>



            </div>

            <div className="pc-footer">

                {
                    !product.gift_status ? (

                        <button
                            className="pc-cart-btn"
                            disabled
                        >
                            Out Of Stock
                        </button>

                    ) : !isAddedToCart ? (

                        <button

                            className="pc-cart-btn"

                            onClick={(e) => {

                                e.stopPropagation();

                                onAddToCart(product.gift_id);

                            }}

                        >

                            <FiShoppingCart />

                            <span>Add To Cart</span>

                        </button>

                    ) : (

                        <div
                            className="pc-qty-box"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button

                                className="pc-qty-btn"

                                onClick={() => onDecreaseQuantity(product.gift_id)}

                            >

                                -

                            </button>

                            <span className="pc-qty">

                                {cartQuantity}

                            </span>

                            <button

                                className="pc-qty-btn"

                                onClick={() => onIncreaseQuantity(product.gift_id)}

                            >

                                +

                            </button>

                        </div>

                    )
                }

                <button

                    className={`pc-save ${isSaved ? "active" : ""}`}

                    onClick={(e) => {

                        e.stopPropagation();

                        onSave(product.gift_id);

                    }}

                >

                    {

                        isSaved

                            ? <BsBookmarkFill />

                            : <FiBookmark />

                    }

                    <span className="pc-save-count">

                        {product.gift_total_saves}

                    </span>

                </button>

            </div>

        </div>

    );

}

export default ProductGift;