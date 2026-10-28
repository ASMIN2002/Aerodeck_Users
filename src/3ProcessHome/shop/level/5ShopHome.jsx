import { useMemo, memo } from "react";
import "../levelstyle/5ShopHome.css";
import VideoHero from "../sections/2VideoHero";
// import CategoriesSection from "../sections/1CategoriesSection";
import OffersCarousel from "../sections/3OffersCarousel";
import FinestDeals from "../sections/4FinestDeals";
import SuggestedShops from "../sections/5SuggestedShops";
import TopLikedShops from "../sections/6TopLikedShops";
import ValueDeals from "../sections/7ValueDeals";
import RelatedProducts from "../sections/8RelatedProducts";
const LIMIT = 10;
function ShopHome({ user, shops, onOpenDetails, onOpenAllShops}) {
    const finestDeals = useMemo(() => {
        return [...shops]
            .sort((a, b) => Number(b.shop_rating || 0) - Number(a.shop_rating || 0))
            .slice(0, LIMIT);
    }, [shops]);
    const topLiked = useMemo(() => {
        return [...shops]
            .sort((a, b) => Number(b.shop_total_likes || 0) - Number(a.shop_total_likes || 0))
            .slice(0, LIMIT);
    }, [shops]);
    const valueDeals = useMemo(() => {
        return [...shops]
            .sort((a, b) => Number(b.shop_discount_percentage || 0) - Number(a.shop_discount_percentage || 0))
            .slice(0, LIMIT);
    }, [shops]);
    return (
        <div className="shop-home">
            {/* <CategoriesSection
                categories={categories}
                onCategoryClick={onCategoryClick}
                onOpenAllShopCategories={onOpenAllShopCategories}
            /> */}
            {/* <VideoHero /> */}
            <OffersCarousel />
            <FinestDeals user={user} shops={finestDeals} onOpenDetails={onOpenDetails} />
            <SuggestedShops shops={shops} onOpenDetails={onOpenDetails} onOpenAllShops={onOpenAllShops} />
            <TopLikedShops shops={topLiked} onOpenDetails={onOpenDetails} />
            <ValueDeals shops={valueDeals} onOpenDetails={onOpenDetails} />
            <RelatedProducts shops={shops} onOpenDetails={onOpenDetails} />
        </div>
    );
}
export default memo(ShopHome);