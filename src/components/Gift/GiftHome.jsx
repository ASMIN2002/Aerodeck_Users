import "./GiftHome.css";
import { API } from "../../services/api";

function GiftHome({

    user,
    categories,
    gifts,
    onCategoryClick

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

                    <h3>
                        Suggested Gifts
                    </h3>

                </div>


                <div className="gift-suggested-placeholder">

                    Suggested products will appear here.

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