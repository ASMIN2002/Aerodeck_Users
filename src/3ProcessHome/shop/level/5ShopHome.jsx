import "../levelstyle/5ShopHome.css";
import VideoHero from "../sections/2VideoHero";
import CategoriesSection from "../sections/1CategoriesSection";
import OffersCarousel from "../sections/3OffersCarousel";
import FinestDeals from "../sections/4FinestDeals";
import SuggestedShops from "../sections/5SuggestedShops";
import TopLikedShops from "../sections/6TopLikedShops";
import ValueDeals from "../sections/7ValueDeals";
import RelatedProducts from "../sections/8RelatedProducts";

function ShopHome({
    user,
    categories,
    shops,
    onCategoryClick,
    onOpenDetails,
    onOpenAllShops,
    onOpenAllShopCategories,
}) {
    return (
        <div className="shop-home">
            <CategoriesSection
                categories={categories}
                onCategoryClick={onCategoryClick}
                onOpenAllShopCategories={onOpenAllShopCategories}
            />
            <VideoHero />
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