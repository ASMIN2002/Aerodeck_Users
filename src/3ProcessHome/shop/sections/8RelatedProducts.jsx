import { useMemo, useCallback, useState, useEffect, memo } from "react";
import "./8RelatedProducts.css";
import ShopCard from "../level/2ShopCard";

const RELATED_LIMIT = 10;

function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function RelatedProducts({ shops, onOpenDetails, savedProducts, likedProducts, cartProducts }) {
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if (!shops || shops.length === 0) {
            setRelated([]);
            return;
        }
        setRelated(shuffleInPlace([...shops]).slice(0, RELATED_LIMIT));
    }, [shops]);

    const handleOpen = useCallback(
        (shop) => onOpenDetails(shop, "shop"),
        [onOpenDetails]
    );

    const cartMap = useMemo(() => {
        const map = new Map();
        if (cartProducts) {
            for (const item of cartProducts) {
                map.set(String(item.product_id), item.quantity || 0);
            }
        }
        return map;
    }, [cartProducts]);

    if (related.length === 0) return null;

    return (
        <section className="heepit-related-section">
            <div className="heepit-related-head">
                <h3>Related Products</h3>
            </div>

            <div className="heepit-related-grid">
                {related.map((shop) => {
                    const id = String(shop.shop_id);
                    const qty = cartMap.get(id) || 0;
                    return (
                        <ShopCard
                            key={shop.shop_id}
                            product={shop}
                            isSaved={savedProducts?.has(id) || false}
                            isLiked={likedProducts?.has(id) || false}
                            isAddedToCart={qty > 0}
                            cartQuantity={qty}
                            onOpenDetails={handleOpen}
                        />
                    );
                })}
            </div>
        </section>
    );
}

export default memo(RelatedProducts);