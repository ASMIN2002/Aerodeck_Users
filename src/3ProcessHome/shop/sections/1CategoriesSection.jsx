import { memo, useCallback } from "react";
import { FiArrowRight } from "react-icons/fi";
import "./1CategoriesSection.css";

function CategoriesSection({ categories, onCategoryClick, onOpenAllShopCategories }) {
    const handleClick = useCallback(
        (category) => onCategoryClick(category),
        [onCategoryClick]
    );

    if (!categories || categories.length === 0) return null;

    return (
        <div className="heep-cat-sticky-wrap">
            <section className="heep-cat-section">
                <div className="heep-cat-scroll">
                    {categories.map(({ catid, category }) => (
                        <button
                            key={catid}
                            type="button"
                            className="heep-cat-card"
                            onClick={() => handleClick(category)}
                            aria-label={category}
                        >
                            <span className="heep-cat-name">{category}</span>
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    className="heep-cat-viewall"
                    onClick={onOpenAllShopCategories}
                    aria-label="View all categories"
                >
                    <FiArrowRight className="heep-cat-viewall-icon" />
                </button>
            </section>
        </div>
    );
}

export default memo(CategoriesSection);