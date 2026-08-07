import "./ProductCard.css";
import { FiHeart, FiBookmark } from "react-icons/fi";
import { BsHeartFill, BsBookmarkFill } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";

function ProductCard({

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

    const handleCardClick = () => {

        onOpenDetails();

    };
    return (

        <div
            className="pc-card"
            onClick={handleCardClick}
        >

            <div className="pc-top">
                <button

                    className={`pc-like ${isLiked ? "active" : ""}`}

                    onClick={(e) => {

                        e.stopPropagation();

                        onLike(product.product_id);

                    }}

                >

                    {

                        isLiked

                            ? <BsHeartFill />

                            : <FiHeart />

                    }

                    <span className="pc-like-count">

                        {product.product_total_likes}

                    </span>

                </button>

            </div>

            <div className="pc-image-box">
                <div className="pc-image-grid">
                    <img src={product.product_image1} alt="" className="pc-image" />
                </div>
            </div>

            <div className="pc-body">
                <div className="cardrathigh">
                    {
                        product.product_highlight_text && (
                            <div className="pc-highlight">
                                {product.product_highlight_text}
                            </div>
                        )
                    }
                    <div className="pc-rating-row">

                        <span>

                            ⭐ {product.product_rating || "4.3"}

                        </span>
                        <div className="pc-final-price">

                            ₹{product.product_price}

                            <span>

                                {" "}

                                / Piece

                            </span>

                        </div>

                    </div>
                </div>


                <h3 className="pc-name">

                    {product.product_name}

                </h3>



                <div className="pc-price-row">

                    <span className="pc-demo-price">

                        ₹{product.product_demo_price}

                    </span>

                    <span className="pc-discount">

                        {product.product_discount_percentage}% OFF

                    </span>
                    <span
                        className={
                            product.product_status
                                ? "pc-status available"
                                : "pc-status unavailable"
                        }
                    >

                        {
                            product.product_status

                                ? "Available"

                                : "Out of Stock"

                        }

                    </span>

                </div>

            </div>

            <div className="pc-footer">

                {
                    !product.product_status ? (

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

                                onAddToCart(product.product_id);

                            }}

                        >
                            <span>Add To Cart</span>

                        </button>

                    ) : (

                        <div
                            className="pc-qty-box"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button

                                className="pc-qty-btn"

                                onClick={() => onDecreaseQuantity(product.product_id)}

                            >

                                -

                            </button>

                            <span className="pc-qty">

                                {cartQuantity}

                            </span>

                            <button

                                className="pc-qty-btn"

                                onClick={() => onIncreaseQuantity(product.product_id)}

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

                        onSave(product.product_id);

                    }}

                >

                    {

                        isSaved

                            ? <BsBookmarkFill />

                            : <FiBookmark />

                    }

                    <span className="pc-save-count">

                        {product.product_total_saves}

                    </span>

                </button>

            </div>

        </div>

    );

}

export default ProductCard;