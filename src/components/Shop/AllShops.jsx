import ShopCard from "./ShopCard";

function AllShops({

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

    return (

        <section
            className="all-shops-page"
            style={{
                padding: "0px 12px 30px",
                boxSizing: "border-box"
            }}
        >

            <div className="gift-category-header">

                <button
                    type="button"
                    onClick={onBack}
                >
                    ← Back
                </button>

                <h2>
                    All Shops
                </h2>

            </div>


            {/* All Shops */}

            <div className="cdss-grid">

                {
                    shops.map((shop) => (

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

export default AllShops;