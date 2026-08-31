import "./ALLShopCategories.css";

function ALLShopCategories({
    categories,
    onBack,
    onCategoryClick
}) {

    const shopCategories = categories.filter(
        item =>
            String(item.catname).toUpperCase() === "SHOP"
    );

    return (

        <section className="all-shop-categories">

            <div className="gift-category-header">

                <button
                    type="button"
                    onClick={onBack}
                >
                    ← Back
                </button>

                <h2>
                    All Categories
                </h2>

            </div>


            <div className="all-shop-category-grid">

                {shopCategories.map((item) => (

                    <button
                        key={item.catid}
                        type="button"
                        className="all-shop-category-box"
                        onClick={() =>
                            onCategoryClick(item.category)
                        }
                    >

                        <div className="all-shop-category-image">

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

export default ALLShopCategories;