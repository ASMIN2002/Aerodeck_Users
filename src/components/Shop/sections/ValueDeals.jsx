import "./ValueDeals.css";

function ValueDeals({ shops, onOpenDetails }) {

    const valueDeals = shops.slice(0, 6);

    return (
        <section className="shop-value-deals-section">

            <div className="likeheader">
                <h3>Top Value Deals</h3>
            </div>

            <div className="shop-value-deals-scroll">
                <div className="shop-value-deals-grid">

                    {valueDeals.map((shop, index) => (
                        <div
                            key={shop.shop_id}
                            className="shop-value-card"
                            onClick={() => onOpenDetails(shop, "shop")}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="shop-value-image">
                                <img
                                    src={shop.shop_image1}
                                    alt={shop.shop_name}
                                />
                                {shop.shop_highlight_text && (
                                    <span className="shop-value-highlight">
                                        {shop.shop_highlight_text}
                                    </span>
                                )}
                            </div>

                            <span className="shop-value-name">
                                {shop.shop_name}
                            </span>
                        </div>
                    ))}

                </div>
            </div>

        </section>
    );
}

export default ValueDeals;