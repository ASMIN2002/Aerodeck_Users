import GiftCard from "./GiftCard";

function GiftCategory({
    category,
    gifts,
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

    const categoryGifts = gifts.filter(

        gift => gift.gift_category === category

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

                    categoryGifts.map((product) => (

                        <GiftCard
                            key={product.gift_id}
                            product={product}

                            isSaved={savedProducts.has(
                                String(product.gift_id)
                            )}

                            isLiked={likedProducts.has(
                                String(product.gift_id)
                            )}

                            isAddedToCart={
                                cartProducts.some(
                                    item =>
                                        String(item.product_id) ===
                                        String(product.gift_id)
                                )
                            }

                            cartQuantity={
                                cartProducts.find(
                                    item =>
                                        String(item.product_id) ===
                                        String(product.gift_id)
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
                                onOpenDetails(product, "gift")
                            }
                        />

                    ))

                }

            </div>

        </section>

    );

}

export default GiftCategory;