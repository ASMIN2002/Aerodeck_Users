import { useMemo, useEffect, useRef, useState } from "react";
import "./GiftHome.css";
import GiftCard from "./GiftCard";
import { API } from "../../services/api";

function GiftHome({

    user,
    categories,
    gifts,
    onCategoryClick,
    onOpenDetails,
    onOpenAllGifts,
    onOpenAllGiftCategories

}) {
    const [activeOfferIndex, setActiveOfferIndex] = useState(0);
    const suggestedGifts = useMemo(() => {

        const good = gifts.filter(
            gift => Number(gift.gift_rating || 0) > 3.5
        );

        const medium = gifts.filter(
            gift => {
                const rating = Number(gift.gift_rating || 0);
                return rating > 1 && rating <= 3.5;
            }
        );

        const veryLow = gifts.filter(
            gift => Number(gift.gift_rating || 0) <= 1
        );

        const shuffle = (array) =>
            [...array].sort(() => Math.random() - 0.5);

        const selected = [
            ...shuffle(good).slice(0, 15),
            ...shuffle(medium).slice(0, 2),
            ...shuffle(veryLow).slice(0, 3)
        ];

        return shuffle(selected);

    }, [gifts]);

    const topLikedGifts = useMemo(() => {

        return [...gifts]
            .sort(
                (a, b) =>
                    Number(b.gift_total_likes || 0) -
                    Number(a.gift_total_likes || 0)
            )
            .slice(0, 16);

    }, [gifts]);
    const offerGifts = useMemo(() => {

        const eligible = gifts.filter(gift =>
            /up\s*to.*\d+%.*off/i.test(
                gift.gift_highlight_text || ""
            )
        );

        return [...eligible]
            .sort(() => Math.random() - 0.5)
            .slice(0, 5);

    }, [gifts]);
    const offerScrollRef = useRef(null);

    useEffect(() => {

        if (offerGifts.length <= 1) return;

        const timer = setInterval(() => {

            const container = offerScrollRef.current;

            if (!container) return;

            const nextPosition =
                container.scrollLeft + container.clientWidth;

            if (
                nextPosition >=
                container.scrollWidth - container.clientWidth
            ) {
                container.scrollTo({
                    left: 0,
                    behavior: "smooth"
                });
            } else {
                container.scrollTo({
                    left: nextPosition,
                    behavior: "smooth"
                });
            }

        }, 3000);

        return () => clearInterval(timer);

    }, [offerGifts]);
    const randomGifts = useMemo(() => {

        return [...gifts]
            .sort(() => Math.random() - 0.5);

    }, [gifts]);
    return (

        <div className="gift-home">
            <section className="gift-category-section">

                <div className="gift-section-title">

                    <h3>
                        {user?.full_name?.split(" ")[0]}, still you are looking for this ?
                    </h3>

                    <button
                        type="button"
                        onClick={onOpenAllGiftCategories} className="viewALL"
                    >
                        View All
                    </button>

                </div>


                <div className="gift-category-scroll">

                    {categories.map((item) => (

                        <button
                            key={item.catid}
                            className="gift-category-box"
                            onClick={() =>
                                onCategoryClick(item.category)
                            }
                        >

                            <div className="gift-category-icon">

                                <img
                                    src={item.image}
                                    alt={item.category}
                                />

                            </div>

                            <span>
                                {item.category}
                            </span>

                        </button>

                    ))}

                </div>

            </section>


            <section className="gift-suggested-section">

                <div className="gift-section-title">

                    <h4>
                        Suggested For You
                    </h4>

                    <button
                        type="button"
                        onClick={onOpenAllGifts}
                        className="gift-all-button"
                    >
                        View All
                    </button>

                </div>


                <div className="gift-suggested-scroll">
                    <div className="gift-suggested-grid">

                        {
                            suggestedGifts.map((gift) => (
                                <div
                                    className="gift-suggested-card"
                                    key={gift.gift_id}
                                    onClick={() => onOpenDetails(gift, "gift")}
                                >
                                    <div className="gift-suggested-image">

                                        <img
                                            src={gift.gift_image1}
                                            alt={gift.gift_name}
                                        />
                                        {Number(gift.gift_rating) > 3.5 && (
                                            <span className="gift-suggested-rating">
                                                {Number(gift.gift_rating).toFixed(1)}
                                                <span className="rating-star">★</span>
                                            </span>
                                        )}
                                    </div>

                                    <div className="gift-suggested-info">

                                        <span className="gift-suggested-name">
                                            {gift.gift_name}
                                        </span>

                                        <div className="gift-suggested-price">

                                            <del>
                                                ₹{gift.gift_demo_price}
                                            </del>

                                            <strong>
                                                ₹{gift.gift_price}
                                            </strong>

                                        </div>

                                    </div>

                                </div>

                            ))
                        }

                    </div>

                </div>

            </section>



            <section className="gift-top-liked-section">
                <div className="likeheader">Top Liked</div>

                <div className="gift-liked-scroll">

                    <div className="gift-liked-grid">

                        {topLikedGifts.map((gift) => (

                            <div
                                key={gift.gift_id}
                                className="gift-liked-card"
                                onClick={() => onOpenDetails(gift, "gift")}
                            >

                                <div className="gift-liked-image">

                                    <img
                                        src={gift.gift_image1}
                                        alt={gift.gift_name}
                                    />

                                    <span className="gift-liked-count">
                                        <span className="gift-liked-icon">♥</span>
                                        {Number(
                                            gift.gift_total_likes || 0
                                        ).toLocaleString("en-IN")}
                                    </span>

                                </div>

                                <div className="gift-liked-info">

                                    <span className="gift-liked-name">
                                        {gift.gift_name}
                                    </span>

                                    <div className="gift-liked-price">

                                        <span className="gift-liked-discount">
                                            ↓ {gift.gift_discount_percentage}%
                                        </span>

                                        <strong>
                                            ₹{Number(gift.gift_price).toLocaleString("en-IN")}
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>
            </section>
            <section className="gift-offer-carousel-section">

                <div className="gift-offer-carousel-title">

                    <h3>
                        Special Offers
                    </h3>

                </div>

                <div
                    className="gift-offer-carousel"
                    ref={offerScrollRef}
                    onScroll={(e) => {

                        const container = e.currentTarget;

                        const index = Math.round(
                            container.scrollLeft /
                            container.clientWidth
                        );

                        setActiveOfferIndex(index);

                    }}
                >
                    {offerGifts.map((gift) => {

                        const highlight = gift.gift_highlight_text || "";

                        const percentMatch =
                            highlight.match(/(\d+(?:\.\d+)?)\s*%\s*off/i);

                        const percent = percentMatch
                            ? percentMatch[1]
                            : null;

                        return (
                            <div
                                key={gift.gift_id}
                                className="gift-offer-slide"
                                onClick={() =>
                                    onOpenDetails(gift, "gift")
                                }
                            >

                                <img
                                    src={gift.gift_image1}
                                    alt={gift.gift_name}
                                />

                                <div className="gift-offer-overlay">

                                    <div className="gift-offer-name">
                                        {gift.gift_name}
                                    </div>

                                    {percent && (
                                        <div className="gift-offer-percent">
                                            Up to {percent}% OFF
                                        </div>
                                    )}

                                    <div className="gift-offer-price">
                                        ₹{Number(
                                            gift.gift_price || 0
                                        ).toLocaleString("en-IN")}
                                    </div>

                                </div>

                            </div>
                        );
                    })}
                </div>
                <div className="gift-offer-dots">

                    {offerGifts.map((gift, index) => (

                        <span
                            key={gift.gift_id}
                            className={`gift-offer-dot ${index === activeOfferIndex
                                ? "active"
                                : ""
                                }`}
                        />

                    ))}

                </div>
            </section>
            <section className="gift-value-deals-section">

                <div className="likeheader">
                    <h3>
                        Top Value Deals
                    </h3>
                </div>

                <div className="gift-value-deals-scroll">

                    <div className="gift-value-deals-grid">

                        {gifts.slice(0, 6).map((gift) => (

                            <div
                                key={gift.gift_id}
                                className="gift-value-card"
                                onClick={() => onOpenDetails(gift, "gift")}
                            >

                                <div className="gift-value-image">

                                    <img
                                        src={gift.gift_image1}
                                        alt={gift.gift_name}
                                    />

                                    {gift.gift_highlight_text && (
                                        <span className="gift-value-highlight">
                                            {gift.gift_highlight_text}
                                        </span>
                                    )}

                                </div>

                                <span className="gift-value-name">
                                    {gift.gift_name}
                                </span>
                            </div>

                        ))}

                    </div>

                </div>
            </section>

            <div className="gift-random-products">
                {randomGifts.map((gift) => (

                    <GiftCard
                        key={gift.gift_id}
                        product={gift}
                        onOpenDetails={() =>
                            onOpenDetails(gift, "gift")
                        }
                    />

                ))}

            </div>
        </div>

    );

}

export default GiftHome;