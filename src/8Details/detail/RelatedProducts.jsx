import { useEffect, useState, useMemo } from "react";
import { FiPackage, FiStar } from "react-icons/fi";
import { API } from "../../services/api";
import "../detailStyle/RelatedProducts.css";
const shuffleAndSlice = (arr, count) => [...arr].sort(() => Math.random() - 0.5).slice(0, count);
const TYPE_TO_ENDPOINT = {
    shop: "/api/user/shop",
    cards: "/api/user/products",
    card: "/api/user/products",
    gifts: "/api/user/gifts",
    gift: "/api/user/gifts",
    medicine: "/api/user/medicine",
};
const TYPE_FIELDS = {
    shop: { id: "shop_id", name: "shop_name", image: "shop_image1", price: "shop_price", demo: "shop_demo_price", rating: "shop_rating" },
    cards: { id: "product_id", name: "product_name", image: "product_image1", price: "product_price", demo: "product_demo_price", rating: "product_rating" },
    card: { id: "product_id", name: "product_name", image: "product_image1", price: "product_price", demo: "product_demo_price", rating: "product_rating" },
    gifts: { id: "gift_id", name: "gift_name", image: "gift_image1", price: "gift_price", demo: "gift_demo_price", rating: "gift_rating" },
    gift: { id: "gift_id", name: "gift_name", image: "gift_image1", price: "gift_price", demo: "gift_demo_price", rating: "gift_rating" },
    medicine: { id: "medicine_id", name: "medicine_name", image: "medicine_image1", price: "medicine_price", demo: "medicine_demo_price", rating: "medicine_rating" },
};
function RelatedProducts({ product, productType, onOpenDetails }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const type = productType || product?.type || "shop";
    const fields = TYPE_FIELDS[type] || TYPE_FIELDS.shop;
    const endpoint = TYPE_TO_ENDPOINT[type] || TYPE_TO_ENDPOINT.shop;
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        fetch(`${API}${endpoint}?limit=500`)
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then((res) => {
                if (!cancelled && res.success) setItems(res.data || []);
            })
            .catch((err) => {
                console.error("Related products error:", err.message);
                if (!cancelled) setItems([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, [endpoint]);
    const relatedItems = useMemo(() => {
        const currentId = String(product?.[fields.id] || product?.data?.[fields.id] || "");
        const filtered = items.filter((i) => String(i[fields.id] || "") !== currentId);
        return shuffleAndSlice(filtered, filtered.length);
    }, [items, product, fields.id]);
    const handleOpen = (item) => {
        onOpenDetails?.(item, type);
    };
    if (loading) {
        return (
            <div className="dt-related">
                <div className="dt-related-header">
                    <h3>You May Also Like</h3>
                </div>
                <div className="dt-related-scroll">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="dt-related-card dt-related-skeleton">
                            <div className="dt-related-skeleton-img" />
                            <div className="dt-related-skeleton-body">
                                <div className="dt-related-skeleton-line" />
                                <div className="dt-related-skeleton-line short" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    if (!relatedItems.length) {
        return (
            <div className="dt-related">
                <div className="dt-related-header">
                    <h3>You May Also Like</h3>
                </div>
                <div className="dt-related-empty">
                    <FiPackage className="dt-related-empty-icon" />
                    <h4>No Related Products Available</h4>
                    <p>We couldn't find similar products for this item.</p>
                </div>
            </div>
        );
    }
    return (
        <div className="dt-related">
            <div className="dt-related-header">
                <h3>You May Also Like</h3>
                <span className="dt-related-count">{relatedItems.length} items</span>
            </div>
            <div className="dt-related-scroll">
                {relatedItems.map((item) => {
                    const id = item[fields.id];
                    const name = item[fields.name];
                    const image = item[fields.image];
                    const price = Number(item[fields.price] || 0);
                    const demoPrice = Number(item[fields.demo] || 0);
                    const rating = Number(item[fields.rating] || 0);
                    const hasDiscount = demoPrice > price;
                    return (
                        <div key={id} className="dt-related-card" onClick={() => handleOpen(item)}>
                            <div className="dt-related-image-wrap">
                                {image ? (
                                    <img src={image} alt={name} loading="lazy" decoding="async" />
                                ) : (
                                    <FiPackage className="dt-related-fallback" />
                                )}
                                {hasDiscount && (
                                    <span className="dt-related-badge">
                                        {Math.round((1 - price / demoPrice) * 100)}% OFF
                                    </span>
                                )}
                                {rating > 0 && (
                                    <span className="dt-related-rating">
                                        <FiStar /> {rating.toFixed(1)}
                                    </span>
                                )}
                            </div>
                            <div className="dt-related-body">
                                <h4 className="dt-related-name">{name}</h4>
                                <div className="dt-related-price-row">
                                    <span className="dt-related-price">₹{price.toLocaleString("en-IN")}</span>
                                    {hasDiscount && (
                                        <span className="dt-related-mrp">₹{demoPrice.toLocaleString("en-IN")}</span>
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