import "../DetailsDataStyle/ProductSummary.css";
import { useState } from "react";

function ProductSummary({

    product,

    isLiked,
    isSaved,
    cartQuantity,

    onIncreaseCart,
    onDecreaseCart,

    onBuyNow

}) {
    const [showMore, setShowMore] = useState(false);


    const name =
        product?.product_name ||
        product?.gift_name ||
        product?.shop_name ||
        product?.premium_name;

    const description =
        product?.product_description ||
        product?.gift_description ||
        product?.shop_description ||
        product?.premium_description;

    const rating =
        product?.product_rating ||
        product?.gift_rating ||
        product?.shop_rating ||
        product?.premium_rating ||
        0;

    const price =
        product?.product_price ||
        product?.gift_price ||
        product?.shop_price ||
        product?.premium_price;

    const demoPrice =
        product?.product_demo_price ||
        product?.gift_demo_price ||
        product?.shop_demo_price ||
        product?.premium_demo_price;

    const discount =
        product?.product_discount_percentage ||
        product?.gift_discount_percentage ||
        product?.shop_discount_percentage ||
        product?.premium_discount_percentage ||
        0;


    const status =
        product?.product_status ??
        product?.gift_status ??
        product?.shop_status ??
        product?.premium_status;

    const [expanded, setExpanded] = useState(false);
    const LIMIT = 120;
    const isLong = (description?.length || 0) > LIMIT;

    return (

        <section className="ps-section">
            <div className="tobbardet">
                <div className="ps-price-row">

                    <div className="pridisc">
                        {demoPrice && (

                            <span className="ps-demo-price">

                                ₹{demoPrice}

                            </span>

                        )}

                        {discount > 0 && (

                            <span className="ps-discount">

                                {discount}% OFF

                            </span>

                        )}
                    </div>
                    <span className="ps-price">

                        ₹{price}

                    </span>

                </div>
                <div className="ps-rating">

                    ⭐ {rating}

                </div>


            </div>

            <div className="ps-header">
                <h2 className="ps-name">
                    {name}
                </h2>
            </div>
            <h2 className="ps-desc">
                {expanded || !isLong
                    ? description
                    : description.slice(0, LIMIT)}

                {isLong && (
                    <span
                        className="ps-more"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? " Less" : "... More"}
                    </span>
                )}
            </h2>

            <div className="ps-cart-row">

                {cartQuantity > 0 ? (

                    <div className="ps-qty">

                        <button onClick={onDecreaseCart}>
                            -
                        </button>

                        <span>
                            {cartQuantity}
                        </span>

                        <button onClick={onIncreaseCart}>
                            +
                        </button>

                    </div>

                ) : (

                    <button
                        className="ps-cart-btn"
                        onClick={onIncreaseCart}
                    >
                        🛒 Add To Cart
                    </button>

                )}

            </div>

        </section>

    );

}

export default ProductSummary;