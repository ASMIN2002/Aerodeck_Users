import "./CartCard.css";
import { FaTrash } from "react-icons/fa";

function CartCard({

    item,

    onOpenDetails,

    onDelete,

    onIncrease,

    onDecrease

}) {

    const image =

        item.product_image1 ||
        item.gift_image1 ||
        item.premium_image1 ||
        item.shop_image1;

    const name =

        item.product_name ||
        item.gift_name ||
        item.premium_name ||
        item.shop_name;

    const demoPrice =

        item.product_demo_price ||
        item.gift_demo_price ||
        item.premium_demo_price ||
        item.shop_demo_price;

    const discount =

        item.product_discount_percentage ||
        item.gift_discount_percentage ||
        item.premium_discount_percentage ||
        item.shop_discount_percentage;

    const price =

        item.product_price ||
        item.gift_price ||
        item.premium_price ||
        item.shop_price;

    return (

        <div className="cart-card">

            <img

                src={image}

                alt={name}

                className="cart-image"

            />
            <button

                className="delete-cart-btn"

                onClick={() => onDelete(item.product_id)}

            >

                <FaTrash />

            </button>

            <div className="cart-details">

                <h3>

                    {name}

                </h3>

                <p>

                    Demo Price :
                    ₹ {demoPrice}

                </p>
                <div className="cartdipri">
                    <p>

                        Discount :
                        {discount}%

                    </p>

                    <h2>

                        ₹ {price}

                    </h2>
                </div>
                <div className="qtyviewcart">
                    <div className="cart-quantity">

                        <button

                            onClick={() => onDecrease(item)}

                        >

                            -

                        </button>

                        <span>

                            {item.quantity}

                        </span>

                        <button

                            onClick={() => onIncrease(item)}

                        >

                            +

                        </button>

                    </div>

                    <button

                        className="view-product-btn"

                        onClick={() =>
                            onOpenDetails(
                                item,
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

                        View Product

                    </button>
                </div>

            </div>

        </div>

    );

}

export default CartCard;