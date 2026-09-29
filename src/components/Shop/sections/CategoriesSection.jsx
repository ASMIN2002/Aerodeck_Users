import "./CategoriesSection.css";
import { FiArrowRight } from "react-icons/fi";

function CategoriesSection({
    categories,
    onCategoryClick,
    onOpenAllShopCategories
}) {

    return (
        <>
            <div className="heepit-intro">
                <h2>Top <span>Categories</span></h2>
            </div>
            <section className="heep-shop-cat-section">
                <div className="heep-shop-cat-scroll">
                    {categories.map((item) => (
                        <button
                            key={item.catid}
                            className="heep-shop-cat-box"
                            onClick={() => onCategoryClick(item.category)}
                        >
                            <div className="heep-shop-cat-icon">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.category}
                                        onLoad={() => console.log("✅ LOADED:", item.category)}
                                        onError={() => console.log("❌ FAILED:", item.category, item.image)}

                                    />
                                ) : (
                                    <span className="heep-shop-cat-fallback-letter">
                                        {item.category?.charAt(0)?.toUpperCase() || "?"}
                                    </span>
                                )}
                            </div>
                            <span className="heep-shop-cat-name">
                                {item.category}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="heep-shop-cat-viewall-wrap">
                    <button
                        type="button"
                        className="heep-shop-cat-viewall-btn"
                        onClick={onOpenAllShopCategories}
                    >
                        <FiArrowRight />
                    </button>
                </div>
            </section>
        </>
    );
}

export default CategoriesSection;