import "../DetailsDataStyle/DetailsData.css";

import PreviewVideo from "./PreviewVideo";
import Features from "./Features";
import Information from "./Information";
import Reviews from "./Reviews";
import RelatedProducts from "./RelatedProducts";
import WhyChoose from "./WhyChoose";
import Media from "./Media";
import ProductSummary from "./ProductSummary";

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
    onViewAllMedia
}) {
    return (
        <>
            <div className="dt-data">
                <ProductSummary
                    product={product}
                    isLiked={isLiked}
                    isSaved={isSaved}
                    cartQuantity={cartQuantity}
                    onIncreaseCart={onIncreaseCart}
                    onDecreaseCart={onDecreaseCart}
                    onBuyNow={onBuyNow}
                />
                <Information productDetail={productDetail} />
                <RelatedProducts
                    product={product}
                    onOpenDetails={onOpenDetails}
                    onViewAll={onViewAll}
                />
                <PreviewVideo video_link={productDetail?.video_link} />
                <Reviews
                    onViewAll={onViewAll}
                    product_id={
                        product?.product_id ||
                        product?.gift_id ||
                        product?.shop_id ||
                        product?.premium_id
                    }
                />
                <Media
                    product_id={
                        product?.product_id ||
                        product?.gift_id ||
                        product?.shop_id ||
                        product?.premium_id
                    }

                    onViewAll={onViewAllMedia}
                />
                <Features />
                <WhyChoose />
            </div>
        </>
    );

}

export default DetailsData;