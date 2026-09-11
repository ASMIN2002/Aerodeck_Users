import "../DetailsDataStyle/Information.css";

function Information({ productDetail }) {
    const getDeliveryDate = (days) => {
        if (!days) return "-";
        const date = new Date();
        date.setDate(date.getDate() + Number(days));
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    return (

        <div className="dt-information">
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
                <span>Delivery On</span>

                <span className="delidate">
                    {getDeliveryDate(productDetail?.delivery)}

                    {(productDetail?.return_days == null ||
                        Number(productDetail.return_days) === 0) && (
                            <span className="open-box"> (Open Box)</span>
                        )}
                </span>
            </div>
            <div className="dt-info-row">
                <span>Delivery Status</span>
                <span>{productDetail?.printing || "-"}</span>
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