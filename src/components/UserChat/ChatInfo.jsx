import "./ChatInfo.css";
function ChatInfo({
    productId,
    productName,
    productImage,
    quantity,
    price
}) {

    return (

        <div className="user-chat-info">

            <div className="user-chat-system-message">
                Please confirm your order.
            </div>

            <div className="user-chat-product-card">

                {productImage && (
                    <img
                        src={productImage}
                        alt={productName}
                    />
                )}

                <div className="user-chat-product-info">

                    <span className="user-chat-product-id">
                        Product ID: {productId}
                    </span>

                    <h3>
                        {productName}
                    </h3>

                    <p>
                        Qty: {quantity}
                    </p>

                    <strong>
                        ₹{(price * quantity).toFixed(2)}
                    </strong>

                </div>

            </div>

        </div>

    );

}

export default ChatInfo;