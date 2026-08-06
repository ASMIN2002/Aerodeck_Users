import { useEffect, useState } from "react";
import "../DetailsDataStyle/RelatedProducts.css";
import { API } from "../../../services/api";

function RelatedProducts({
    product,
    onOpenDetails,
    onViewAll
}) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(`${API}/api/user/products`)
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    setProducts(res.data);
                }
            })
            .catch(console.error);
    }, []);
    const filteredProducts = products
        .filter(item => String(item.product_id) !== String(product?.product_id))
        .sort(() => Math.random() - 0.5)
        .slice(0, 20);
    return (

        <div className="dt-related">

            <div className="dt-section-header">

                <h2>Products</h2>
                <button
                    className="dt-view-all"
                    onClick={onViewAll}
                >
                    View All
                </button>
            </div>


            <div className="dt-related-scroll">

                {filteredProducts.map((item) => (

                    <div
                        key={item.product_id}
                        className="dt-related-card"
                        onClick={() =>
                            onOpenDetails(
                                { ...item },
                                String(item.product_id).startsWith("G")
                                    ? "gift"
                                    : String(item.product_id).startsWith("S")
                                        ? "shop"
                                        : String(item.product_id).startsWith("P")
                                            ? "premium"
                                            : "card"
                            )
                        }
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