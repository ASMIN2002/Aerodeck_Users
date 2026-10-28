import { memo, useCallback } from "react";
import { FiArrowRight, FiGrid, FiList } from "react-icons/fi";
import "./1CategoriesSection.css";

function CategoriesSection({ categories, onCategoryClick, onOpenAllShopCategories, isDropdown = false }) {
    const handleClick = useCallback(
        (category) => onCategoryClick(category),
        [onCategoryClick]
    );

    if (!categories || categories.length === 0) return null;

    const listContent = categories.map(({ catid, category }) => (
        <button
            key={catid}
            type="button"
            className="heep-cat-card"
            onClick={() => handleClick(category)}
            aria-label={category}
        >
            <span className="heep-cat-name">{category}</span>
        </button>
    ));

    if (isDropdown) {
        return (
            <div className="heep-cat-sticky-wrap is-dropdown">
                <div className="heep-cat-sticky-top">
                    <button
                        type="button"
                        className="heep-cat-action-btn"
                        onClick={onOpenAllShopCategories}
                    >
                        <FiGrid className="heep-cat-action-icon" />
                        All Categories
                    </button>
                    <button
                        type="button"
                        className="heep-cat-action-btn highlight"
                        onClick={onOpenAllShopCategories}
                    >
                        <FiList className="heep-cat-action-icon" />
                        View All
                        <FiArrowRight className="heep-cat-viewall-icon" style={{ marginLeft: 'auto' }} />
                    </button>
                </div>
                <div className="heep-cat-scroll-vertical">
                    {listContent}
                </div>
            </div>
        );
    }

    return (
        <div className="heep-cat-sticky-wrap">
            <section className="heep-cat-section">
                <div className="heep-cat-scroll">
                    {listContent}
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