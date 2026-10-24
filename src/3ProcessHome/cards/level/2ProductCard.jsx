import { FiHeart, FiBookmark, FiStar } from "react-icons/fi";
import "../levelstyle/2ProductCard.css";

function ProductCard({ product, onOpenDetails = () => { } }) {
    const {
        product_status, product_discount_percentage, product_demo_price,
        product_price, product_image1, product_name, product_category,
        product_total_likes, product_total_saves, product_description,
        product_rating,
    } = product;

    const isAvailable = Number(product_status) === 1;
    const discountPercent = Number(product_discount_percentage || 0);
    const demoPrice = Number(product_demo_price || 0);
    const finalPrice = Number(product_price || 0);
    const hasDiscount = discountPercent > 0 && demoPrice > finalPrice;

    return (
        <div className={`pc-card ${isAvailable ? "" : "out-of-stock"}`} onClick={onOpenDetails}>
            <div className="pc-image-box">
                <div className="pc-image-grid">
                    <img src={product_image1} alt={product_name} className="pc-image" loading="lazy" />
                    {!isAvailable && <span className="pc-oos-overlay">OUT OF STOCK</span>}
                </div>
                {isAvailable && hasDiscount && (
                    <span className="pc-discount-badge">{discountPercent}% OFF</span>
                )}
            </div>

            <div className="pc-body">
                <div className="pc-category-row-information">
                    <span className="pc-category">{product_category}</span>
                    <div className="pc-stats-row">
                        <span className="pc-stat likes"><FiHeart /> {product_total_likes || 0}</span>
                        <span className="pc-stat saves"><FiBookmark /> {product_total_saves || 0}</span>
                    </div>
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

export default ProductCard;