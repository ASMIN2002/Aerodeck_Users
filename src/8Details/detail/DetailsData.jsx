import PreviewVideo from "./PreviewVideo";
import Features from "./Features";
import Information from "./Information";
import Reviews from "./Reviews";
import RelatedProducts from "./RelatedProducts";
import WhyChoose from "./WhyChoose";
import Media from "./Media";
import ProductSummary from "./ProductSummary";
import Clothes3D from "./3dClothes";
import "../detailStyle/DetailsData.css";

const getProductId = (p) =>
    p?.product_id || p?.gift_id || p?.shop_id || p?.medicine_id || null;

const parseClothColors = (material) => {
    if (!material || !String(material).includes("@")) return [];
    const afterAt = String(material).split("@")[1] || "";
    return afterAt
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
};

function DetailsData({
    product, productDetail, isLiked, isSaved, cartQuantity,
    onLike, onSave, onIncreaseCart, onDecreaseCart, onBuyNow,
    onOpenDetails, onViewAll, onViewAllMedia,
    selectedColor, onSelectColor, appliedColor, isClothProduct,
}) {
    const productId = getProductId(product);
    const clothColors = parseClothColors(productDetail?.material);

    return (
        <div className="dt-data">
            {isClothProduct && clothColors.length > 0 && (
                <div className="dt-3d-inline">
                    <Clothes3D
                        colors={clothColors}
                        selectedColor={selectedColor}
                        onSelectColor={onSelectColor}
                        appliedColor={appliedColor}
                    />
                </div>
            )}

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
            <RelatedProducts product={product} onOpenDetails={onOpenDetails} onViewAll={onViewAll} />
        </div>
    );
}

export default DetailsData;