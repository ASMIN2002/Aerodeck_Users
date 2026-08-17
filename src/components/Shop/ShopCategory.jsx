import ShopCard from "./ShopCard";
// import "./ShopCategory.css";

function ShopCategory({
    category,
    shops,
    onBack,
    onOpenDetails,
    onSave,
    onLike,
    onAddToCart,
    onIncreaseQuantity,
    onDecreaseQuantity,
    savedProducts,
    likedProducts,
    cartProducts
}) {

    const categoryShops = shops.filter(
        shop => shop.shop_category === category
    );

    return (

        <section className="cds-section">

            <div className="gift-category-header">

                <button
                    type="button"
                    onClick={onBack}
                >
                    ← Back
                </button>

                <h2>
                    {category}
                </h2>

            </div>

            <div className="cds-grid">

                {
                    categoryShops.map((shop) => (

                        <ShopCard
                            key={shop.shop_id}
                            product={shop}

                            isSaved={savedProducts.has(
                                String(shop.shop_id)
                            )}

                            isLiked={likedProducts.has(
                                String(shop.shop_id)
                            )}

                            isAddedToCart={
                                cartProducts.some(
                                    item =>
                                        String(item.product_id) ===
                                        String(shop.shop_id)
                                )
                            }

                            cartQuantity={
                                cartProducts.find(
                                    item =>
                                        String(item.product_id) ===
                                        String(shop.shop_id)
                                )?.quantity || 0
                            }

                            onSave={onSave}
                            onLike={onLike}
                            onAddToCart={onAddToCart}

                            onIncreaseQuantity={
                                onIncreaseQuantity
                            }

                            onDecreaseQuantity={
                                onDecreaseQuantity
                            }

                            onOpenDetails={() =>
                                onOpenDetails(shop, "shop")
                            }
                        />

                    ))
                }

            </div>

        </section>

    );
}

export default ShopCategory;