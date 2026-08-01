import "../DetailsDataStyle/DetailsData.css";

import PreviewVideo from "./PreviewVideo";
import Features from "./Features";
import Information from "./Information";
import Reviews from "./Reviews";
import RelatedProducts from "./RelatedProducts";
import WhyChoose from "./WhyChoose";
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

    onOpenDetails,
    onViewAll

}) {

    return (
        <>
            <div className="dt-data">
                <ProductSummary
                    product={product}
                    isLiked={isLiked}
                    isSaved={isSaved}
                    cartQuantity={cartQuantity}

                    onLike={onLike}
                    onSave={onSave}

                    onIncreaseCart={onIncreaseCart}
                    onDecreaseCart={onDecreaseCart}

                />
                <PreviewVideo video_link={productDetail?.video_link} />
                <Features />
                <Information productDetail={productDetail} />
                <Reviews />
                <RelatedProducts
                    product={product}
                    onOpenDetails={onOpenDetails}
                    onViewAll={onViewAll}
                />
                <WhyChoose />
            </div>
        </>
    );

}

export default DetailsData;