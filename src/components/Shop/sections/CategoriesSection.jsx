import "./CategoriesSection.css";
import { FiArrowRight } from "react-icons/fi";

function CategoriesSection({
    categories,
    onCategoryClick,
    onOpenAllShopCategories
}) {
    return (
        <section className="shop-category-section">
            <div className="shop-category-scroll">
                {categories.map((item) => (
                    <button
                        key={item.catid}
                        className="shop-category-box"
                        onClick={() => onCategoryClick(item.category)}
                    >
                        <div>
                            <div className="shop-category-icon">
                                <img src={item.image} alt={item.category} />
                            </div>
                        </div>
                        <span>{item.category}</span>
                    </button>
                ))}
            </div>

            <div className="shop-section-title">
                <button
                    type="button"
                    className="viewALL"
                    onClick={onOpenAllShopCategories}
                >
                    <FiArrowRight />
                </button>
            </div>
        </section>
    );
}

export default CategoriesSection;