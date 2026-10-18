import "../detailStyle/Information.css";

const INFO_ROWS = [
    { labelKey: "material", valueKey: "material", field: "material" },
    { labelKey: "size", valueKey: "size", field: "size" },
    { labelKey: "printing", valueKey: "printing", field: "printing" },
];

function getDeliveryDate(days) {
    if (!days) return "-";
    const date = new Date();
    date.setDate(date.getDate() + Number(days));
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function splitField(field) {
    if (!field) return ["-", "-"];
    const parts = String(field).split("~");
    if (parts.length < 2) return [field.trim(), "-"];
    return [parts[0].trim(), parts.slice(1).join("~").trim()];
}

function Information({ productDetail }) {
    const material = splitField(productDetail?.material);
    const size = splitField(productDetail?.size);
    const printing = splitField(productDetail?.printing);

    const rows = [
        { label: material[0], value: material[1] },
        { label: size[0], value: size[1] },
        {
            label: "Delivery On",
            value: getDeliveryDate(productDetail?.delivery),
            isDelivery: true,
        },
        { label: printing[0], value: printing[1] },
        {
            label: "Return Policy",
            value:
                productDetail?.return_days != null
                    ? `${productDetail.return_days} Days`
                    : "-",
        },
    ];

    const isOpenBox =
        productDetail?.return_days == null ||
        Number(productDetail?.return_days) === 0;

    return (
        <div className="dt-information">
            {rows.map((row, index) => (
                <div className="dt-info-row" key={index}>
                    <span>{row.label}</span>
                    <span className={row.isDelivery ? "delidate" : ""}>
                        {row.value}
                        {row.isDelivery && isOpenBox && (
                            <span className="open-box"> (Open Box)</span>
                        )}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default Information;