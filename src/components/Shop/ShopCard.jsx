import "./ShopCard.css";
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
            className="heepit-shop-card"
            onClick={handleShopClick}
        >

            <div className="heepit-shop-top">

                <span
                    className={
                        product.shop_status
                            ? "heepit-shop-status available"
                            : "heepit-shop-status unavailable"
                    }
                >
                    {
                        product.shop_status
                            ? "Available"
                            : "Out of Stock"
                    }
                </span>

                <button
                    className={`heepit-shop-like ${isLiked ? "active" : ""}`}
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
                    <span className="heepit-shop-like-count">
                        {product.shop_total_likes}
                    </span>
                </button>

            </div>

            <div className="heepit-shop-image-box">
                <div className="heepit-shop-image-grid">
                    <img src={product.shop_image1} alt="" className="heepit-shop-image" />
                </div>
            </div>

            <div className="heepit-shop-body">

                {
                    product.shop_highlight_text && (
                        <div className="heepit-shop-highlight">
                            {product.shop_highlight_text}
                        </div>
                    )
                }

                <div className="heepit-shop-rating-row">

                    <span>
                        ⭐ {product.shop_rating || "4.3"}
                    </span>

                    <div className="heepit-shop-final-price">
                        ₹{product.shop_price}
                    </div>

                </div>

                <h3 className="heepit-shop-name">
                    {product.shop_name}
                </h3>

                <div className="heepit-shop-price-row">

                    <span className="heepit-shop-demo-price">
                        ₹{product.shop_demo_price}
                    </span>

                    <span className="heepit-shop-discount">
                        {product.shop_discount_percentage}% OFF
                    </span>

                </div>

            </div>

            <div className="heepit-shop-footer">

                {
                    !product.shop_status ? (

                        <button
                            className="heepit-shop-cart-btn"
                            disabled
                        >
                            Out Of Stock
                        </button>

                    ) : !isAddedToCart ? (

                        <button
                            className="heepit-shop-cart-btn"
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
                            className="heepit-shop-qty-box"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="heepit-shop-qty-btn"
                                onClick={() => onDecreaseQuantity(product.shop_id)}
                            >
                                -
                            </button>

                            <span className="heepit-shop-qty">
                                {cartQuantity}
                            </span>

                            <button
                                className="heepit-shop-qty-btn"
                                onClick={() => onIncreaseQuantity(product.shop_id)}
                            >
                                +
                            </button>

                        </div>

                    )
                }

                <button
                    className={`heepit-shop-save ${isSaved ? "active" : ""}`}
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
                    <span className="heepit-shop-save-count">
                        {product.shop_total_saves}
                    </span>
                </button>

            </div>

        </div>

    );

}

export default ProductShop;