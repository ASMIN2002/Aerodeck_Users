import "./GiftHome.css";
import { API } from "../../services/api";

function GiftHome({

    user,
    categories,
    gifts,
    onCategoryClick,
    onOpenDetails,
    onOpenAllGifts

}) {

    return (

        <div className="gift-home">
            <section className="gift-category-section">

                <div className="gift-section-title">

                    <h3>
                        {user?.full_name?.split(" ")[0]}, still you are looking for this ?
                    </h3>

                </div>


                <div className="gift-category-scroll">

                    {
                        categories.map((category) => {

                            const categoryGift = gifts.find(
                                gift => gift.gift_category === category
                            );

                            return (

                                <button
                                    key={category}
                                    className="gift-category-box"
                                    onClick={() => onCategoryClick(category)}
                                >

                                    <div className="gift-category-icon">

                                        <img
                                            src={categoryGift?.gift_image1}
                                            alt={categoryGift?.gift_name || category}
                                        />

                                    </div>

                                    <span>
                                        {categoryGift?.gift_name || category}
                                    </span>
                                    <strong>
                                        View {categoryGift?.gift_category}
                                    </strong>

                                </button>

                            );

                        })
                    }

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
                        All →
                    </button>

                </div>


                <div className="gift-suggested-scroll">
                    <div className="gift-suggested-grid">

                        {
                            gifts.slice(0, 20).map((gift) => (

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


            <section className="gift-offer-section">

                <div className="gift-section-title">

                    <h3>
                        Offers
                    </h3>

                </div>


                <div className="gift-offer-placeholder">

                    Offers will appear here.

                </div>

            </section>

        </div>

    );

}

export default GiftHome;