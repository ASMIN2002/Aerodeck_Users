import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { FiPackage, FiStar } from "react-icons/fi";
import { API } from "../../services/api";
import "../detailStyle/RelatedProducts.css";

const MAX_RELATED = 20;
const TYPE_BY_PREFIX = { G: "gift", S: "shop", P: "premium", M: "medicine", DEFAULT: "card" };

const getProductType = (id) =>
    TYPE_BY_PREFIX[String(id).charAt(0).toUpperCase()] || TYPE_BY_PREFIX.DEFAULT;

function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function RelatedProducts({ product, onOpenDetails }) {
    const [allProducts, setAllProducts] = useState([]);
    const [related, setRelated] = useState([]);

    useEffect(() => {
        let cancelled = false;

        fetch(`${API}/api/user/products`)
            .then((r) => r.json())
            .then((res) => {
                if (!cancelled && res.success) setAllProducts(res.data || []);
            })
            .catch((err) => console.error("Related products error:", err.message));

        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (!allProducts.length) return;
        const currentId = String(product?.product_id || "");
        const filtered = allProducts.filter((i) => String(i.product_id) !== currentId);
        setRelated(shuffleInPlace([...filtered]).slice(0, MAX_RELATED));
    }, [allProducts, product?.product_id]);

    const handleOpen = useCallback(
        (item) => onOpenDetails?.(item, getProductType(item.product_id)),
        [onOpenDetails]
    );

    if (!related.length) return null;

    return (
        <div className="dt-related">
            <div className="dt-related-header">
                <h3>You May Also Like</h3>
                <span className="dt-related-count">{related.length} items</span>
            </div>

            <div className="dt-related-scroll">
                {related.map((item) => {
                    const demoPrice = Number(item.product_demo_price || 0);
                    const price = Number(item.product_price || 0);
                    const hasDiscount = demoPrice > price;
                    const discountPercent = hasDiscount
                        ? Math.round((1 - price / demoPrice) * 100)
                        : 0;

                    return (
                        <div
                            key={item.product_id}
                            className="dt-related-card"
                            onClick={() => handleOpen(item)}
                        >
                            <div className="dt-related-image-wrap">
                                {item.product_image1 ? (
                                    <img
                                        src={item.product_image1}
                                        alt={item.product_name}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                ) : (
                                    <FiPackage className="dt-related-fallback" />
                                )}
                                {hasDiscount && (
                                    <span className="dt-related-badge">{discountPercent}% OFF</span>
                                )}
                                {Number(item.product_rating) > 0 && (
                                    <span className="dt-related-rating">
                                        <FiStar /> {Number(item.product_rating).toFixed(1)}
                                    </span>
                                )}
                            </div>
                            <div className="dt-related-body">
                                <h4 className="dt-related-name">{item.product_name}</h4>
                                <div className="dt-related-price-row">
                                    <span className="dt-related-price">
                                        ₹{price.toLocaleString("en-IN")}
                                    </span>
                                    {hasDiscount && (
                                        <span className="dt-related-mrp">
                                            ₹{demoPrice.toLocaleString("en-IN")}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default memo(RelatedProducts);