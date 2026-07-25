import "./OrderItem.css";
import TrackOrder from "./TrackOrder";
import Rating from "./Rating";

function OrderItem({
    item,
    onOpenDetails
}) {

    const images = [
        item.product_image1,
        item.product_image2,
        item.product_image3,
        item.product_image4,
    ].filter(Boolean);

    return (

        <div className="order-item-card">

            <div className="order-item-images">

                {images.map((image, index) => (

                    <img
                        key={index}
                        src={image}
                        alt={`${item.product_name} ${index + 1}`}
                        className="order-item-image"
                    />

                ))}

            </div>

            <div className="order-item-info">

                <h3>{item.product_name}</h3>

                <p>{item.product_description}</p>

                <p><strong>Product ID :</strong> {item.product_id}</p>

                <p><strong>Quantity :</strong> {item.quantity}</p>

                <p><strong>Price :</strong> ₹ {item.product_price}</p>

                <p><strong>Rating :</strong> ⭐ {item.product_rating}</p>

            </div>
            <TrackOrder />
            <Rating />
            <button
                className="view-product-btn"
                onClick={() => {
                    const type =
                        item.product_id.startsWith("G")
                            ? "gift"
                            : item.product_id.startsWith("S")
                                ? "shop"
                                : "card";

                    const data =
                        type === "gift"
                            ? { gift_id: item.product_id }
                            : type === "shop"
                                ? { shop_id: item.product_id }
                                : { product_id: item.product_id };

                    onOpenDetails(data, type);

                }}
            >
                View Product
            </button>

        </div>

    );

}

export default OrderItem;