import "../DetailsDataStyle/DetailsData.css";

import PreviewVideo from "./PreviewVideo";
import Features from "./Features";
import Information from "./Information";
import Reviews from "./Reviews";
import RelatedProducts from "./RelatedProducts";
import WhyChoose from "./WhyChoose";
import Media from "./Media";
import ProductSummary from "./ProductSummary";

function getProductId(product) {
    if (!product) return null;
    return (
        product.product_id ||
        product.gift_id ||
        product.shop_id ||
        product.premium_id ||
        null
    );
}

function DetailsData({
    product,
    productDetail,
    isLiked,
    isSaved,
    cartQuantity,
    onLike,
    onSave,
    onIncreaseCart,
    onDecreaseCart,
    onBuyNow,
    onOpenDetails,
    onViewAll,
    onViewAllMedia,
}) {
    const productId = getProductId(product);
    return (
        <div className="dt-data">
            <ProductSummary
                product={product}
                isLiked={isLiked}
                isSaved={isSaved}
                onSave={onSave}
                cartQuantity={cartQuantity}
                onIncreaseCart={onIncreaseCart}
                onDecreaseCart={onDecreaseCart}
                onBuyNow={onBuyNow}
            />
            <Information productDetail={productDetail} />
            <PreviewVideo productDetail={productDetail} />
            <Reviews onViewAll={onViewAll} product_id={productId} />
            <Media product_id={productId} onViewAll={onViewAllMedia} />
            <Features />
            <WhyChoose />
            <RelatedProducts
                product={product}
                onOpenDetails={onOpenDetails}
                onViewAll={onViewAll}
            />
        </div>
    );
}

export default DetailsData;