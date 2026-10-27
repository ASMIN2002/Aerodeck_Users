import { useMemo, useCallback } from "react";
import ShopCard from "./2ShopCard";

function ShopCategory({
    category,
    shops,
    onOpenDetails,
    onSave,
    onLike,
    onAddToCart,
    onIncreaseQuantity,
    onDecreaseQuantity,
    savedProducts,
    likedProducts,
    cartProducts,
}) {
    const categoryShops = useMemo(
        () => shops.filter((shop) => shop.shop_category === category),
        [shops, category]
    );

    const cartMap = useMemo(() => {
        const map = new Map();
        for (const item of cartProducts) {
            map.set(String(item.product_id), item.quantity || 0);
        }
        return map;
    }, [cartProducts]);

    const handleOpen = useCallback(
        (shop) => onOpenDetails(shop, "shop"),
        [onOpenDetails]
    );

    return (
        <section className="shp-section">
            <div className="cds-grid">
                {categoryShops.map((shop) => {
                    const id = String(shop.shop_id);
                    const qty = cartMap.get(id) || 0;
                    return (
                        <ShopCard
                            key={shop.shop_id}
                            product={shop}
                            isSaved={savedProducts.has(id)}
                            isLiked={likedProducts.has(id)}
                            isAddedToCart={qty > 0}
                            cartQuantity={qty}
                            onSave={onSave}
                            onLike={onLike}
                            onAddToCart={onAddToCart}
                            onIncreaseQuantity={onIncreaseQuantity}
                            onDecreaseQuantity={onDecreaseQuantity}
                            onOpenDetails={handleOpen}
                        />
                    );
                })}
            </div>
        </section>
    );
}

export default ShopCategory;