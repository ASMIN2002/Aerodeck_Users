import "./PremiumCard.css";
import { FiHeart, FiBookmark } from "react-icons/fi";
import { BsHeartFill, BsBookmarkFill } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";

function ProductPremium({

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

    const handlePremiumClick = () => {

        onOpenDetails();

    };
    return (

        <div
            className="pc-premium"
            onClick={handlePremiumClick}
        >

            <div className="pc-top">

                <span
                    className={
                        product.premium_status
                            ? "pc-status available"
                            : "pc-status unavailable"
                    }
                >

                    {
                        product.premium_status

                            ? "Available"

                            : "Out of Stock"

                    }

                </span>
                <button

                    className={`pc-like ${isLiked ? "active" : ""}`}

                    onClick={(e) => {

                        e.stopPropagation();

                        onLike(product.premium_id);

                    }}

                >

                    {

                        isLiked

                            ? <BsHeartFill />

                            : <FiHeart />

                    }

                    <span className="pc-like-count">

                        {product.premium_total_likes}

                    </span>

                </button>

            </div>

            <div className="pc-image-box">

                <div className="pc-image-grid">

                    <img src={product.premium_image1} alt="" className="pc-image" />
                    <img src={product.premium_image2} alt="" className="pc-image" />

                    <img src={product.premium_image3} alt="" className="pc-image" />

                    <img src={product.premium_image4} alt="" className="pc-image" />

                </div>

            </div>

            <div className="pc-body">

                {
                    product.premium_highlight_text && (
                        <div className="pc-highlight">
                            {product.premium_highlight_text}
                        </div>
                    )
                }

                <h3 className="pc-name">

                    {product.premium_name}

                </h3>

                <div className="pc-rating-row">

                    <span>

                        ⭐ {product.premium_rating || "4.3"}

                    </span>

                </div>

                <div className="pc-price-row">

                    <span className="pc-demo-price">

                        ₹{product.premium_demo_price}

                    </span>

                    <span className="pc-discount">

                        {product.premium_discount_percentage}% OFF

                    </span>

                </div>

                <div className="pc-final-price">

                    ₹{product.premium_price}

                    <span>

                        {" "}

                        / Piece

                    </span>

                </div>

            </div>

            <div className="pc-footer">

                {
                    !product.premium_status ? (

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

                                onAddToCart(product.premium_id);

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

                                onClick={() => onDecreaseQuantity(product.premium_id)}

                            >

                                -

                            </button>

                            <span className="pc-qty">

                                {cartQuantity}

                            </span>

                            <button

                                className="pc-qty-btn"

                                onClick={() => onIncreaseQuantity(product.premium_id)}

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

                        onSave(product.premium_id);

                    }}

                >

                    {

                        isSaved

                            ? <BsBookmarkFill />

                            : <FiBookmark />

                    }

                    <span className="pc-save-count">

                        {product.premium_total_saves}

                    </span>

                </button>

            </div>

        </div>

    );

}

export default ProductPremium;