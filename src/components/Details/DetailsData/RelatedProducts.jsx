import { useEffect, useState, useMemo } from "react";
import "../DetailsDataStyle/RelatedProducts.css";
import { API } from "../../../services/api";

const MAX_RELATED = 20;

const TYPE_BY_PREFIX = {
    G: "gift",
    S: "shop",
    P: "premium",
    DEFAULT: "card",
};

function getProductType(productId) {
    const prefix = String(productId).charAt(0);
    return TYPE_BY_PREFIX[prefix] || TYPE_BY_PREFIX.DEFAULT;
}

function shuffleAndSlice(arr, count) {
    return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
}

function RelatedProducts({ product, onOpenDetails, onViewAll }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(`${API}/api/user/products`)
            .then((res) => res.json())
            .then((res) => {
                if (res.success) setProducts(res.data);
            })
            .catch((err) => console.error("Related products error:", err.message));
    }, []);

    const filteredProducts = useMemo(() => {
        const currentId = String(product?.product_id || "");

        const filtered = products.filter(
            (item) => String(item.product_id) !== currentId
        );

        return shuffleAndSlice(filtered, MAX_RELATED);
    }, [products, product?.product_id]);

    const handleOpen = (item) => {
        onOpenDetails({ ...item }, getProductType(item.product_id));
    };

    return (
        <div className="dt-related">
            <div className="dt-section-header">
                <h2>Related Products</h2>
            </div>

            <div className="dt-related-scroll">
                {filteredProducts.map((item) => (
                    <div
                        key={item.product_id}
                        className="dt-related-card"
                        onClick={() => handleOpen(item)}
                    >
                        <img
                            src={item.product_image1}
                            alt={item.product_name}
                        />

                        <h4>{item.product_name}</h4>

                        <p>₹{item.product_price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RelatedProducts;