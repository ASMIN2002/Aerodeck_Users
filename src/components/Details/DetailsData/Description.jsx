import "../DetailsDataStyle/Description.css";

function Description({ product }) {

    const name =
        product?.product_name ||
        product?.gift_name ||
        product?.shop_name ||
        product?.premium_name;

    const highlight =
        product?.product_highlight_text ||
        product?.gift_highlight_text ||
        product?.shop_highlight_text ||
        product?.premium_highlight_text;

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

    const description =
        product?.product_description ||
        product?.gift_description ||
        product?.shop_description ||
        product?.premium_description;

    const status =
        product?.product_status ??
        product?.gift_status ??
        product?.shop_status ??
        product?.premium_status;

    return (

        <div className="dt-body">

            <div className="dt-highlight">
                {highlight}
            </div>

            <h2>
                {name}
            </h2>

            <p className="dt-subtitle">
                {highlight}
            </p>

            <div className="dt-rating">
                ⭐⭐⭐⭐⭐
                <span>{rating}</span>
                <span>(285 Reviews)</span>
            </div>

            <div className="dt-price">
                <span className="dt-final">₹{price}</span>
                <span className="dt-demo">₹{demoPrice}</span>
                <span className="dt-off">{discount}% OFF</span>
            </div>

            <div className="dt-status">
                {status ? "🟢 In Stock" : "🔴 Out of Stock"}
            </div>

            <h3>Description</h3>

            <div className="dt-description">
                {description}
            </div>

        </div>

    );

}

export default Description;