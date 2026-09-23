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

    /* ✅ Split function — "Label~Value" → ["Label", "Value"] */
    const splitField = (field) => {
        if (!field) return ["-", "-"];

        const parts = String(field).split("~");

        if (parts.length < 2) return [field.trim(), "-"];

        return [
            parts[0].trim(),
            parts.slice(1).join("~").trim()
        ];
    };

    /* ✅ Split all fields */
    const [categoryLabel, categoryValue] = splitField(productDetail?.category);
    const [materialLabel, materialValue] = splitField(productDetail?.material);
    const [sizeLabel, sizeValue] = splitField(productDetail?.size);
    const [printingLabel, printingValue] = splitField(productDetail?.printing);

    return (

        <div className="dt-information">

            {/* ✅ Category */}
            <div className="dt-info-row">
                <span>{categoryLabel}</span>
                <span>{categoryValue}</span>
            </div>

            {/* ✅ Material */}
            <div className="dt-info-row">
                <span>{materialLabel}</span>
                <span>{materialValue}</span>
            </div>

            {/* ✅ Size */}
            <div className="dt-info-row">
                <span>{sizeLabel}</span>
                <span>{sizeValue}</span>
            </div>

            {/* ✅ Delivery On — same */}
            <div className="dt-info-row">
                <span>Delivery On</span>
                <span className="delidate">
                    {getDeliveryDate(productDetail?.delivery)}

                    {(productDetail?.return_days == null ||
                        Number(productDetail?.return_days) === 0) && (
                            <span className="open-box"> (Open Box)</span>
                        )}
                </span>
            </div>

            {/* ✅ Printing / Status */}
            <div className="dt-info-row">
                <span>{printingLabel}</span>
                <span>{printingValue}</span>
            </div>

            {/* ✅ Return Policy — same */}
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