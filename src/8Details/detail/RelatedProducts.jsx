import { useEffect, useState, useMemo } from "react";
import { FiPackage, FiStar } from "react-icons/fi";
import { API } from "../../services/api";
import "../detailStyle/RelatedProducts.css";

const MAX_RELATED = 20;
const TYPE_BY_PREFIX = { G: "gift", S: "shop", P: "premium", M: "medicine", DEFAULT: "card" };

const getProductType = (id) => TYPE_BY_PREFIX[String(id).charAt(0).toUpperCase()] || TYPE_BY_PREFIX.DEFAULT;
const shuffleAndSlice = (arr, count) => [...arr].sort(() => Math.random() - 0.5).slice(0, count);

function RelatedProducts({ product, onOpenDetails }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(`${API}/api/user/products`)
            .then((r) => r.json())
            .then((res) => { if (res.success) setProducts(res.data || []); })
            .catch((err) => console.error("Related products error:", err.message));
    }, []);

    const filteredProducts = useMemo(() => {
        const currentId = String(product?.product_id || "");
        return shuffleAndSlice(products.filter((i) => String(i.product_id) !== currentId), MAX_RELATED);
    }, [products, product?.product_id]);

    const handleOpen = (item) => onOpenDetails?.({ ...item }, getProductType(item.product_id));

    if (!filteredProducts.length) return null;

    return (
        <div className="dt-related">
            <div className="dt-related-header">
                <h3>You May Also Like</h3>
                <span className="dt-related-count">{filteredProducts.length} items</span>
            </div>

            <div className="dt-related-scroll">
                {filteredProducts.map((item) => {
                    const hasDiscount = Number(item.product_demo_price) > Number(item.product_price);
                    return (
                        <div key={item.product_id} className="dt-related-card" onClick={() => handleOpen(item)}>
                            <div className="dt-related-image-wrap">
                                {item.product_image1 ? (
                                    <img src={item.product_image1} alt={item.product_name} loading="lazy" />
                                ) : (
                                    <FiPackage className="dt-related-fallback" />
                                )}
                                {hasDiscount && (
                                    <span className="dt-related-badge">
                                        {Math.round((1 - Number(item.product_price) / Number(item.product_demo_price)) * 100)}% OFF
                                    </span>
                                )}
                                {item.product_rating > 0 && (
                                    <span className="dt-related-rating">
                                        <FiStar /> {Number(item.product_rating).toFixed(1)}
                                    </span>
                                )}
                            </div>
                            <div className="dt-related-body">
                                <h4 className="dt-related-name">{item.product_name}</h4>
                                <div className="dt-related-price-row">
                                    <span className="dt-related-price">₹{Number(item.product_price).toLocaleString("en-IN")}</span>
                                    {hasDiscount && (
                                        <span className="dt-related-mrp">₹{Number(item.product_demo_price).toLocaleString("en-IN")}</span>
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

export default RelatedProducts;