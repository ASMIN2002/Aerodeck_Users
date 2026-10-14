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
    const isAvailable = Number(product.shop_status) === 1;

    const handleShopClick = () => {
        onOpenDetails();
    };

    return (
        <div
            className={`heepit-shop-card ${!isAvailable ? "out-of-stock" : ""}`}
            onClick={handleShopClick}
        >
            <div className="heepit-shop-image-box">
                <div className="heepit-shop-image-grid">
                    <img src={product.shop_image1} alt="" className="heepit-shop-image" />

                    {!isAvailable && (
                        <span className="heepit-shop-oos-overlay">
                            OUT OF STOCK
                        </span>
                    )}
                </div>
            </div>

            <div className="heepit-shop-body">
                {product.shop_highlight_text && (
                    <div className="heepit-shop-highlight">
                        {product.shop_highlight_text}
                    </div>
                )}

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
        </div>
    );
}

export default ProductShop;