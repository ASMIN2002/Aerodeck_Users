import "./ProductCard.css";

function ProductCard({
    product,
    onOpenDetails = () => { }
}) {

    const handleCardClick = () => {
        onOpenDetails();
    };

    const discountPercent = Number(product.product_discount_percentage || 0);
    const demoPrice = Number(product.product_demo_price || 0);
    const finalPrice = Number(product.product_price || 0);
    const hasDiscount = discountPercent > 0 && demoPrice > finalPrice;

    return (
        <div className="pc-card" onClick={handleCardClick}>
            <div className="pc-image-box">
                <div className="pc-image-grid">
                    <img
                        src={product.product_image1}
                        alt={product.product_name}
                        className="pc-image"
                    />
                </div>

                {hasDiscount && (
                    <span className="pc-discount-badge">
                        {discountPercent}% OFF
                    </span>
                )}

                <span
                    className={
                        product.product_status
                            ? "pc-status-pill available"
                            : "pc-status-pill unavailable"
                    }
                >
                    {product.product_status ? "Available" : "Out of Stock"}
                </span>
            </div>

            <div className="pc-body">
                <div className="pc-category-row-information">
                    <span className="pc-category">
                        {product.product_category}
                    </span>
                    <div className="pc-stats-row">
                        <span className="pc-stat">
                            ❤️ {product.product_total_likes || 0}
                        </span>

                        <span className="pc-stat">
                            🔖 {product.product_total_saves || 0}
                        </span>
                    </div>

                </div>

                <h3 className="pc-name">
                    {product.product_name}
                </h3>

                <p className="pc-desc">
                    {product.product_description}
                </p>

                <div className="pc-price-row">
                    <div className="pc-price-left">
                        <span className="pc-final-price">
                            ₹{finalPrice}
                        </span>

                        {hasDiscount && (
                            <span className="pc-demo-price">
                                ₹{demoPrice}
                            </span>
                        )}
                    </div>

                    <div className="pc-rating">
                        ⭐ {product.product_rating || "4.3"}
                    </div>
                </div>


            </div>
        </div>
    );

}

export default ProductCard;