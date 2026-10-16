import "./CategoriesSection.css";
import { FiArrowRight } from "react-icons/fi";

function CategoriesSection({
    categories,
    onCategoryClick,
    onOpenAllShopCategories
}) {

    return (
        <div className="heep-cat-sticky-wrap">
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
                    <span className="heep-cat-viewall-btn">
                        <FiArrowRight />
                    </span>
                </button>

            </section>

        </div>
    );
}

export default CategoriesSection;