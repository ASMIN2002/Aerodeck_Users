import { useMemo, useCallback, memo } from "react";
import "../levelstyle/4AllShopCategories.css";

function ALLShopCategories({ categories, onCategoryClick }) {
    const shopCategories = useMemo(
        () => categories.filter((item) => String(item.catname).toUpperCase() === "SHOP"),
        [categories]
    );

    const handleClick = useCallback(
        (category) => onCategoryClick(category),
        [onCategoryClick]
    );

    return (
        <section className="all-shop-categories">
            <div className="all-shop-category-grid">
                {shopCategories.map((item) => (
                    <button
                        key={item.catid}
                        type="button"
                        className="all-shop-category-box"
                        onClick={() => handleClick(item.category)}
                    >
                        <div className="all-shop-category-image">
                            <img
                                src={item.image}
                                alt={item.category}
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                        <span>{item.category}</span>
                    </button>
                ))}
            </div>
        </section>
    );
}

export default memo(ALLShopCategories);