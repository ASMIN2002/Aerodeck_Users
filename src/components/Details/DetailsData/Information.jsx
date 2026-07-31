import "../DetailsDataStyle/Information.css";

function Information({ productDetail }) {

    return (

        <div className="dt-information">

            <h3>Product Information</h3>

            <div className="dt-info-row">
                <span>Category</span>
                <span>{productDetail?.category || "-"}</span>
            </div>

            <div className="dt-info-row">
                <span>Material</span>
                <span>{productDetail?.material || "-"}</span>
            </div>

            <div className="dt-info-row">
                <span>Size</span>
                <span>{productDetail?.size || "-"}</span>
            </div>

            <div className="dt-info-row">
                <span>Printing</span>
                <span>{productDetail?.printing || "-"}</span>
            </div>

            <div className="dt-info-row">
                <span>Delivery</span>
                <span>{productDetail?.delivery || "-"}</span>
            </div>

            <div className="dt-info-row">
                <span>Return Policy</span>
                <span>
                    {productDetail?.return_days != null
                        ? `${productDetail.return_days} Days`
                        : "-"}
                </span>
            </div>

        </div>

    );

}

export default Information;