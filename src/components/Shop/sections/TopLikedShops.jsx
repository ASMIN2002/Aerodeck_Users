import { useMemo } from "react";
import "./TopLikedShops.css";

function TopLikedShops({ shops, onOpenDetails }) {

    const topLikedShops = useMemo(() => {
        return [...shops]
            .sort(
                (a, b) =>
                    Number(b.shop_total_likes || 0) -
                    Number(a.shop_total_likes || 0)
            )
            .slice(0, 16);
    }, [shops]);

    return (
        <section className="shop-top-liked-section">

            <div className="likeheader">
                Top Liked
            </div>

            <div className="shop-liked-scroll">
                <div className="shop-liked-grid">

                    {topLikedShops.map((shop, index) => (
                        <div
                            key={shop.shop_id}
                            className="shop-liked-card"
                            onClick={() => onOpenDetails(shop, "shop")}
                            style={{ animationDelay: `${index * 0.04}s` }}
                        >
                            <div className="shop-liked-image">
                                <img
                                    src={shop.shop_image1}
                                    alt={shop.shop_name}
                                />
                                <span className="shop-liked-count">
                                    <span className="shop-liked-icon">♥</span>
                                    {Number(shop.shop_total_likes || 0).toLocaleString("en-IN")}
                                </span>
                            </div>

                            <div className="shop-liked-info">
                                <span className="shop-liked-name">
                                    {shop.shop_name}
                                </span>
                                <div className="shop-liked-price">
                                    <span className="shop-liked-discount">
                                        ↓ {shop.shop_discount_percentage}%
                                    </span>
                                    <strong>
                                        ₹{Number(shop.shop_price).toLocaleString("en-IN")}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

        </section>
    );
}

export default TopLikedShops;