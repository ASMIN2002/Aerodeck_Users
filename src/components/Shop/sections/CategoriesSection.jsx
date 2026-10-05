import "./CategoriesSection.css";
import { FiArrowRight } from "react-icons/fi";

function CategoriesSection({
    categories,
    onCategoryClick,
    onOpenAllShopCategories
}) {

    return (
        <div className="heep-cat-sticky-wrap">

            <div className="heep-cat-heading-row">
                <h2 className="heep-cat-heading">
                    Top <span>Categories</span>
                </h2>
            </div>

            <section className="heep-cat-section">

                <div className="heep-cat-scroll">
                    {categories.map((item) => (
                        <button
                            key={item.catid}
                            type="button"
                            className="heep-cat-card"
                            onClick={() => onCategoryClick(item.category)}
                            aria-label={item.category}
                        >
                            <div className="heep-cat-icon-wrap">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.category}
                                        loading="lazy"
                                        draggable={false}
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                            e.currentTarget.parentElement.classList.add("heep-cat-fallback-active");
                                        }}
                                    />
                                ) : null}

                                <span className="heep-cat-fallback">
                                    {item.category?.charAt(0)?.toUpperCase() || "?"}
                                </span>
                            </div>

                            <span className="heep-cat-name">
                                {item.category}
                            </span>
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    className="heep-cat-viewall"
                    onClick={onOpenAllShopCategories}
                    aria-label="View all categories"
                >
                    <span className="heep-cat-viewall-fade" />
                    <span className="heep-cat-viewall-btn">
                        <FiArrowRight />
                    </span>
                </button>

            </section>

        </div>
    );
}

export default CategoriesSection;