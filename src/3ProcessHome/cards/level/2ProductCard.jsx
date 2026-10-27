import { memo, useCallback } from "react";
import { FiStar } from "react-icons/fi";
import "../levelstyle/2ProductCard.css";

function ProductCard({ product, onOpenDetails }) {
    const {
        product_status,
        product_discount_percentage,
        product_demo_price,
        product_price,
        product_image1,
        product_name,
        product_category,
        product_description,
        product_rating,
    } = product;

    const isAvailable = Number(product_status) === 1;
    const discountPercent = Number(product_discount_percentage || 0);
    const demoPrice = Number(product_demo_price || 0);
    const finalPrice = Number(product_price || 0);
    const hasDiscount = discountPercent > 0 && demoPrice > finalPrice;

    const handleClick = useCallback(() => {
        onOpenDetails?.(product);
    }, [onOpenDetails, product]);

    return (
        <div
            className={`pc-card ${isAvailable ? "" : "out-of-stock"}`}
            onClick={handleClick}
        >
            <div className="pc-image-box">
                <div className="pc-image-grid">
                    <img
                        src={product_image1}
                        alt={product_name}
                        className="pc-image"
                        loading="lazy"
                        decoding="async"
                    />
                    {!isAvailable && <span className="pc-oos-overlay">OUT OF STOCK</span>}
                </div>
                {isAvailable && hasDiscount && (
                    <span className="pc-discount-badge">{discountPercent}% OFF</span>
                )}
            </div>

            <div className="pc-body">
                <div className="pc-category-row-information">
                    <span className="pc-category">{product_category}</span>
                </div>

                <h3 className="pc-name">{product_name}</h3>
                <p className="pc-desc">{product_description}</p>

                <div className="pc-price-row">
                    <div className="pc-price-left">
                        <span className="pc-final-price">₹{finalPrice}</span>
                        {hasDiscount && <span className="pc-demo-price">₹{demoPrice}</span>}
                    </div>
                    <div className="pc-rating">
                        <FiStar /> {product_rating || "4.3"}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(ProductCard, (prev, next) => {
    return (
        prev.product.product_id === next.product.product_id &&
        prev.product.product_status === next.product.product_status &&
        prev.product.product_price === next.product.product_price &&
        prev.product.product_discount_percentage === next.product.product_discount_percentage
    );
});