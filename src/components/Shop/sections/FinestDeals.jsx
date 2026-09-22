import { useMemo } from "react";
import "./FinestDeals.css";

function FinestDeals({ user, shops, onOpenDetails }) {

    const finestDeals = useMemo(() => {
        return [...shops]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
    }, [shops]);

    const userName = user?.full_name
        ?.split(" ")[0]
        ?.toLowerCase()
        .replace(/^./, (char) => char.toUpperCase());

    return (
        <section className="shop-finest-deals-section">

            <div className="shop-section-title">
                <h3>
                    {userName}, Best products for you
                </h3>
            </div>

            <div className="shop-finest-deals-scroll">
                <div className="shop-finest-deals-grid">

                    {finestDeals.map((shop, index) => (
                        <div
                            className="shop-finest-deal-card"
                            key={shop.shop_id}
                            onClick={() => onOpenDetails(shop, "shop")}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="shop-finest-deal-image">
                                <img
                                    src={shop.shop_image1}
                                    alt={shop.shop_name}
                                />
                                <span className="shop-finest-deal-price">
                                    From ₹{Number(shop.shop_price || 0).toLocaleString("en-IN")}
                                </span>
                            </div>

                            <span className="shop-finest-deal-name">
                                {shop.shop_name}
                            </span>
                        </div>
                    ))}

                </div>
            </div>

        </section>
    );
}

export default FinestDeals;