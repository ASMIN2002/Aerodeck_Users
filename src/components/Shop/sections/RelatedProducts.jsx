import { useMemo } from "react";
import "./RelatedProducts.css";
import ShopCard from "../ShopCard";

function RelatedProducts({ shops, onOpenDetails }) {

    const randomShops = useMemo(() => {
        return [...shops].sort(() => Math.random() - 0.5);
    }, [shops]);

    return (
        <section className="shop-related-section">

            <div className="rendomhead">
                <h3>Related Products</h3>
            </div>

            <div className="shop-random-products">
                {randomShops.map((shop) => (
                    <ShopCard
                        key={shop.shop_id}
                        product={shop}
                        onOpenDetails={() => onOpenDetails(shop, "shop")}
                    />
                ))}
            </div>

        </section>
    );
}

export default RelatedProducts;