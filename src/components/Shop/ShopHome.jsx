import "./ShopHome.css";
import VideoHero from "./sections/VideoHero";
import CategoriesSection from "./sections/CategoriesSection";
import OffersCarousel from "./sections/OffersCarousel";
import FinestDeals from "./sections/FinestDeals";
import SuggestedShops from "./sections/SuggestedShops";
import TopLikedShops from "./sections/TopLikedShops";
import ValueDeals from "./sections/ValueDeals";
import RelatedProducts from "./sections/RelatedProducts";

function ShopHome({
    user,
    categories,
    shops,
    onCategoryClick,
    onOpenDetails,
    onOpenAllShops,
    onOpenAllShopCategories
}) {
    return (
        <div className="shop-home">
            <VideoHero />

            <CategoriesSection
                categories={categories}
                onCategoryClick={onCategoryClick}
                onOpenAllShopCategories={onOpenAllShopCategories}
            />

            <OffersCarousel />

            <FinestDeals
                user={user}
                shops={shops}
                onOpenDetails={onOpenDetails}
            />

            <SuggestedShops
                shops={shops}
                onOpenDetails={onOpenDetails}
                onOpenAllShops={onOpenAllShops}
            />

            <TopLikedShops
                shops={shops}
                onOpenDetails={onOpenDetails}
            />

            <ValueDeals
                shops={shops}
                onOpenDetails={onOpenDetails}
            />

            <RelatedProducts
                shops={shops}
                onOpenDetails={onOpenDetails}
            />
        </div>
    );
}

export default ShopHome;