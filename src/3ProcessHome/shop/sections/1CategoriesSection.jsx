import "./1CategoriesSection.css";
import { FiArrowRight } from "react-icons/fi";

function CategoriesSection({ categories, onCategoryClick, onOpenAllShopCategories }) {
    return (
        <div className="heep-cat-sticky-wrap">
            <section className="heep-cat-section">
                <div className="heep-cat-scroll">
                    {categories.map(({ catid, category }) => (
                        <button key={catid} type="button" className="heep-cat-card" onClick={() => onCategoryClick(category)} aria-label={category}>
                            <span className="heep-cat-name">{category}</span>
                        </button>
                    ))}
                </div>
                <button type="button" className="heep-cat-viewall" onClick={onOpenAllShopCategories} aria-label="View all categories">
                    <FiArrowRight className="heep-cat-viewall-icon" />
                </button>
            </section>
        </div>
    );
}

export default CategoriesSection;