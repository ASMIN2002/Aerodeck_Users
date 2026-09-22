import { useMemo } from "react";
import "./SuggestedShops.css";
import { FiArrowRight } from "react-icons/fi";

function SuggestedShops({ shops, onOpenDetails, onOpenAllShops }) {

    const suggestedShops = useMemo(() => {
        const good = shops.filter(
            (shop) => Number(shop.shop_rating || 0) > 3.5
        );

        const medium = shops.filter((shop) => {
            const rating = Number(shop.shop_rating || 0);
            return rating > 1 && rating <= 3.5;
        });

        const veryLow = shops.filter(
            (shop) => Number(shop.shop_rating || 0) <= 1
        );

        const shuffle = (array) =>
            [...array].sort(() => Math.random() - 0.5);

        const selected = [
            ...shuffle(good).slice(0, 15),
            ...shuffle(medium).slice(0, 2),
            ...shuffle(veryLow).slice(0, 3)
        ];

        return shuffle(selected);
    }, [shops]);

    return (
        <section className="shop-suggested-section">

            <div className="shop-section-title">
                <h4>Suggested For You</h4>
                <button
                    type="button"
                    onClick={onOpenAllShops}
                    className="viewALL"
                >
                    <FiArrowRight />
                </button>
            </div>

            <div className="shop-suggested-scroll">
                <div className="shop-suggested-grid">

                    {suggestedShops.map((shop, index) => (
                        <div
                            className="shop-suggested-card"
                            key={shop.shop_id}
                            onClick={() => onOpenDetails(shop, "shop")}
                            style={{ animationDelay: `${index * 0.04}s` }}
                        >
                            <div className="shop-suggested-image">
                                <img
                                    src={shop.shop_image1}
                                    alt={shop.shop_name}
                                />
                                {Number(shop.shop_rating) > 3.5 && (
                                    <span className="shop-suggested-rating">
                                        {Number(shop.shop_rating).toFixed(1)}
                                        <span className="rating-star">★</span>
                                    </span>
                                )}
                            </div>

                            <div className="shop-suggested-info">
                                <span className="shop-suggested-name">
                                    {shop.shop_name}
                                </span>
                                <div className="shop-suggested-price">
                                    <del>₹{shop.shop_demo_price}</del>
                                    <strong>₹{shop.shop_price}</strong>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

        </section>
    );
}

export default SuggestedShops;