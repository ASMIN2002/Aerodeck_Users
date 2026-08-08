import GiftCard from "./GiftCard";

function AllGifts({

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

    return (

        <section
            className="all-gifts-page"
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
                    All Gifts
                </h2>

            </div>


            {/* All Gifts */}

            <div className="cds-grid">

                {
                    gifts.map((gift) => (

                        <GiftCard

                            key={gift.gift_id}

                            product={gift}

                            isSaved={savedProducts.has(
                                String(gift.gift_id)
                            )}

                            isLiked={likedProducts.has(
                                String(gift.gift_id)
                            )}

                            isAddedToCart={
                                cartProducts.some(
                                    item =>
                                        String(item.product_id) ===
                                        String(gift.gift_id)
                                )
                            }

                            cartQuantity={
                                cartProducts.find(
                                    item =>
                                        String(item.product_id) ===
                                        String(gift.gift_id)
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
                                onOpenDetails(gift, "gift")
                            }

                        />

                    ))
                }

            </div>

        </section>

    );

}

export default AllGifts;