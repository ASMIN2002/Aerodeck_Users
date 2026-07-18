import "../DetailsDataStyle/DetailsData.css";

import Description from "./Description";
import PreviewVideo from "./PreviewVideo";
import Features from "./Features";
import Information from "./Information";
import Reviews from "./Reviews";
import RelatedProducts from "./RelatedProducts";
import WhyChoose from "./WhyChoose";
import Footer from "./Footer";
import ProductSummary from "./ProductSummary";

function DetailsData({

    product,

    isLiked,
    isSaved,
    cartQuantity,

    onLike,
    onSave,

    onIncreaseCart,
    onDecreaseCart,

    onBuyNow

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

                    onBuyNow={onBuyNow}

                />
                <Description product={product} />
                <PreviewVideo />
                <Features />
                <Information />
                <Reviews />
                <RelatedProducts />
                <WhyChoose />
                <Footer />
            </div>
        </>
    );

}

export default DetailsData;