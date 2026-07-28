import { FiHeart, FiBookmark } from "react-icons/fi";
import { BsHeartFill, BsBookmarkFill } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";

function ProductShop({

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

    const handleShopClick = () => {

        onOpenDetails();

    };
    return (

        <div
            className="pc-shop"
            onClick={handleShopClick}
        >

            <div className="pc-top">

                <span
                    className={
                        product.shop_status
                            ? "pc-status available"
                            : "pc-status unavailable"
                    }
                >

                    {
                        product.shop_status

                            ? "Available"

                            : "Out of Stock"

                    }

                </span>
                <button

                    className={`pc-like ${isLiked ? "active" : ""}`}

                    onClick={(e) => {

                        e.stopPropagation();

                        onLike(product.shop_id);

                    }}

                >

                    {

                        isLiked

                            ? <BsHeartFill />

                            : <FiHeart />

                    }

                    <span className="pc-like-count">

                        {product.shop_total_likes}

                    </span>

                </button>

            </div>

            <div className="pc-image-box">

                <div className="pc-image-grid">

                    <img src={product.shop_image1} alt="" className="pc-image" />
                    <img src={product.shop_image2} alt="" className="pc-image" />

                    <img src={product.shop_image3} alt="" className="pc-image" />

                    <img src={product.shop_image4} alt="" className="pc-image" />

                </div>

            </div>

            <div className="pc-body">

                {
                    product.shop_highlight_text && (
                        <div className="pc-highlight">
                            {product.shop_highlight_text}
                        </div>
                    )
                }

                <h3 className="pc-name">

                    {product.shop_name}

                </h3>

                <div className="pc-rating-row">

                    <span>

                        ⭐ {product.shop_rating || "4.3"}

                    </span>

                </div>

                <div className="pc-price-row">

                    <span className="pc-demo-price">

                        ₹{product.shop_demo_price}

                    </span>

                    <span className="pc-discount">

                        {product.shop_discount_percentage}% OFF

                    </span>

                </div>

                <div className="pc-final-price">

                    ₹{product.shop_price}

                    <span>

                        {" "}

                        / Piece

                    </span>

                </div>

            </div>

            <div className="pc-footer">

                {
                    !product.shop_status ? (

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

                                onAddToCart(product.shop_id);

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

                                onClick={() => onDecreaseQuantity(product.shop_id)}

                            >

                                -

                            </button>

                            <span className="pc-qty">

                                {cartQuantity}

                            </span>

                            <button

                                className="pc-qty-btn"

                                onClick={() => onIncreaseQuantity(product.shop_id)}

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

                        onSave(product.shop_id);

                    }}

                >

                    {

                        isSaved

                            ? <BsBookmarkFill />

                            : <FiBookmark />

                    }

                    <span className="pc-save-count">

                        {product.shop_total_saves}

                    </span>

                </button>

            </div>

        </div>

    );

}

export default ProductShop;