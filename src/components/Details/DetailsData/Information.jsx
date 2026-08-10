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
                <span>Printing</span>
                <span>{productDetail?.printing || "-"}</span>
            </div>

            <div className="dt-info-row">
                <span>Delivery On</span>

                <span className="delidate">
                   {getDeliveryDate(productDetail?.delivery)}
                </span>
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