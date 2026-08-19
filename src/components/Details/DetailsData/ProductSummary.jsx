import "../DetailsDataStyle/ProductSummary.css";
import { API } from "../../../services/api";
import { useState } from "react";

function ProductSummary({
    product,
    isLiked,
    isSaved,
    onSave,
    cartQuantity,
    onIncreaseCart,
    onDecreaseCart,
    onBuyNow
}){
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

const totalPrice =
    Number(price || 0) * Number(cartQuantity || 0);


const isShopOrGift =
    !!(
        product?.shop_name ||
        product?.gift_name ||
        product?.shop_description ||
        product?.gift_description
    );


const status =
    product?.product_status ??
    product?.gift_status ??
    product?.shop_status ??
    product?.premium_status;

const [expanded, setExpanded] = useState(false);
const LIMIT = 120;
const isLong = (description?.length || 0) > LIMIT;

const whatsappNumber = "918984031948";
const sessionToken = localStorage.getItem("session_token");

const handleOrderNow = async () => {

    const productId =
        product?.product_id ||
        product?.gift_id ||
        product?.premium_id ||
        product?.shop_id;

    if (!sessionToken || !productId) {
        return;
    }

    try {

        const response = await fetch(
            `${API}/api/user/whatsapp-order-data`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    session_token: sessionToken,
                    product_id: productId
                })
            }
        );

        const data = await response.json();

        if (!data.success) {
            return;
        }

        const message =
            `USER = #${data.user_id}HEEPITUSER\n` +
            `PRODUCT = #${data.product_id}HEEPITPRODUCT\n\n` +
            `Just press Send to know more.`;

        const whatsappUrl =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, "_blank");

    } catch (error) {

        console.error("WhatsApp order error:", error);

    }
};

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

        <div className="downcartbuy">

            {isShopOrGift ? (
                <>
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

                    <div className="ps-buy-now">

                        <button
                            className="ps-cart-btn"
                            onClick={onBuyNow}
                        >
                            Buy at&nbsp;

                            <span className="ps-total-price">
                                ₹{Number(
                                    cartQuantity > 0
                                        ? totalPrice
                                        : price
                                ).toLocaleString("en-IN")}
                            </span>

                        </button>

                    </div>
                </>
            ) : (

                <div className="ps-buy-now">

                    <button
                        className="ps-cart-btn"
                        onClick={handleOrderNow}
                    >
                        ORDER NOW
                    </button>

                </div>

            )}

        </div>

    </section>

);

}

export default ProductSummary;