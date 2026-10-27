import { useMemo, memo } from "react";
import "../detailStyle/Information.css";

function getDeliveryDate(days) {
    if (!days) return "-";
    const num = Number(days);
    if (isNaN(num)) return "-";
    const date = new Date();
    date.setDate(date.getDate() + num);
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function splitField(field) {
    if (!field) return ["-", "-"];
    const clean = String(field).split("@")[0].trim();
    const parts = clean.split("~");
    if (parts.length < 2) return [clean, "-"];
    return [parts[0].trim(), parts.slice(1).join("~").trim()];
}

function Information({ productDetail }) {
    const rows = useMemo(() => {
        const material = splitField(productDetail?.material);
        const size = splitField(productDetail?.size);
        const printing = splitField(productDetail?.printing);

        return [
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
    }, [productDetail?.material, productDetail?.size, productDetail?.printing, productDetail?.delivery, productDetail?.return_days]);

    const isOpenBox =
        productDetail?.return_days == null ||
        Number(productDetail?.return_days) === 0;

    return (
        <div className="dt-information">
            {rows.map((row, index) => (
                <div className="dt-info-row" key={`${row.label}-${index}`}>
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

export default memo(Information);