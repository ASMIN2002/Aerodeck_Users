import "./ALLGiftCategories.css";

function ALLGiftCategories({
    categories,
    onBack,
    onCategoryClick
}) {

    const giftCategories = categories.filter(
        item =>
            String(item.catname).toUpperCase() === "GIFT"
    );

    return (

        <section className="all-gift-categories">

            <div className="all-gift-category-header">

                <button
                    type="button"
                    onClick={onBack}
                >
                    ← Back
                </button>

                <h2>
                    All Gift Categories
                </h2>

            </div>


            <div className="all-gift-category-grid">

                {giftCategories.map((item) => (

                    <button
                        key={item.catid}
                        type="button"
                        className="all-gift-category-box"
                        onClick={() =>
                            onCategoryClick(item.category)
                        }
                    >

                        <div className="all-gift-category-image">

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

    );
}

export default ALLGiftCategories;