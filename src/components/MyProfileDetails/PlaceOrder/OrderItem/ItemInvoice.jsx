import "./ItemInvoice.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { API } from "../../../../services/api";
import { useEffect, useState } from "react";


function ItemInvoice({
    setProfilePage,
    order_id,
    product_id
}) {

    const [invoice, setInvoice] = useState(null);

    useEffect(() => {

        const fetchInvoice = async () => {

            try {

                const res = await fetch(
                    `${API}/api/user/invoice/${order_id}/${product_id}`
                );

                console.log(order_id, product_id);
                const data = await res.json();
                console.log("Invoice API Response:", data);
                console.log(`${API}/api/user/invoice/${order_id}/${product_id}`);

                if (data.success) {

                    setInvoice(data.data);

                }

            } catch (err) {

                console.error(err);

            }

        };

        if (order_id && product_id) {

            fetchInvoice();

        }

    }, [order_id, product_id]);

    const generatePDF = async () => {

        const element = document.getElementById("invoice-pdf");

        const canvas = await html2canvas(element, {
            scale: 1.5,
            useCORS: true,
            scrollY: -window.scrollY,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(
            imgData,
            "PNG",
            0,
            0,
            pageWidth,
            pageHeight
        );

        return pdf;

    };
    const downloadPDF = async () => {

        const pdf = await generatePDF();

        pdf.save(
            `AERODECK_${invoice.invoice_number}.pdf`
        );

    };
    const sharePDF = async () => {

        try {

            const pdf = await generatePDF();

            const blob = pdf.output("blob");

            const file = new File(
                [blob],
                `AERODECK_${invoice.invoice_number}.pdf`,
                {
                    type: "application/pdf"
                }
            );

            if (
                navigator.canShare &&
                navigator.canShare({ files: [file] })
            ) {

                await navigator.share({

                    title: "AERODECK Invoice",

                    text: "Invoice",

                    files: [file]

                });

            } else {

                alert("Sharing is not supported on this device.");

            }

        } catch (err) {

            console.error(err);

        }

    };

    if (!invoice) {

        return <div className="invoice-loading">
            Loading Invoice...
        </div>;

    }


    return (

        <div className="invoice-page">

            {/* Toolbar - Not Included in PDF */}

            <div className="invoice-toolbar">

                <button
                    className="invoice-back-btn"
                    onClick={() => setProfilePage("order-details")}
                >
                    ← Back
                </button>

                <div className="invoice-actions">
                    <button
                        className="download-btn"
                        onClick={downloadPDF}
                    >
                        Download PDF
                    </button>

                    <button
                        className="share-btn"
                        onClick={sharePDF}
                    >
                        Share PDF
                    </button>

                </div>

            </div>

            {/* Invoice Paper */}

            <div
                id="invoice-pdf"
                className="invoice-paper"
            >

                {/* Header */}

                <div className="invoice-top">

                    <h1>AERODECK</h1>

                    <p>Premium Gifts • Shop • Cards</p>

                    <h2>TAX INVOICE / RETAIL INVOICE</h2>
                </div>

                {/* Invoice Information */}

                <div className="invoice-info">

                    <div className="info-left">

                        <p>
                            <strong>Invoice No :</strong>
                            <span>{invoice.invoice_number}</span>
                        </p>

                        <p>
                            <strong>Order No :</strong>
                            <span>{invoice.order_number}</span>
                        </p>

                        <p>
                            <strong>Order Date :</strong>
                            <span>{invoice.order_date}</span>
                        </p>

                        <p>
                            <strong>Invoice Date :</strong>
                            <span>{invoice.invoice_date}</span>
                        </p>

                        <p>
                            <strong>Delivery Date :</strong>
                            <span>{invoice.delivery_date}</span>
                        </p>

                    </div>

                    <div className="info-right">

                        <p>
                            <strong>Order Status :</strong>

                            <span className={`status status-${(invoice.order_status || "").toLowerCase()}`}>
                                {invoice.order_status}
                            </span>

                        </p>

                        <p>
                            <strong>Payment Status :</strong>

                            <span className={`status status-${(invoice.payment_status || "").toLowerCase()}`}>
                                {invoice.payment_status}
                            </span>

                        </p>

                        <p>
                            <strong>Payment Method :</strong>

                            <span>{invoice.payment_method}</span>

                        </p>

                    </div>

                </div>

                {/* Seller & Customer */}

                <div className="invoice-address">

                    <div className="seller-box">

                        <h3>Sold By</h3>

                        <p><strong>AERODECK</strong></p>

                        <p>Premium Gifts • Shop • Cards</p>

                        <p>Balasore, Odisha</p>

                        <p>GSTIN : {invoice.gstin_number}</p>

                        <p>Email : support@aerodeck.in</p>

                    </div>

                    <div className="buyer-box">

                        <h3>Bill To</h3>

                        <p><strong>{invoice.full_name}</strong></p>

                        <p>{invoice.mobile_number}</p>

                        <p>
                            {invoice.house_flat}, {invoice.area_street}
                        </p>

                        {invoice.landmark && (
                            <p>{invoice.landmark}</p>
                        )}

                        <p>
                            {invoice.city}, {invoice.state} - {invoice.pincode}
                        </p>

                        <p>{invoice.address_type}</p>

                    </div>

                </div>

                {/* Product */}
                <div className="invoice-product">

                    <h3>Product Details</h3>

                    <table className="invoice-table">

                        <thead>

                            <tr>

                                <th>Product</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>GST</th>
                                <th>Total</th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr>

                                <td>

                                    <strong>{invoice.product_name}</strong>

                                    <br />

                                    <small>{invoice.product_id}</small>

                                </td>

                                <td>{invoice.quantity}</td>

                                <td>₹{invoice.unit_price}</td>

                                <td>

                                    ₹{invoice.gst_amount}

                                    <br />

                                    <small>
                                        ({invoice.gst_percentage}%)
                                    </small>

                                </td>

                                <td>₹{invoice.total_amount}</td>

                            </tr>

                        </tbody>

                    </table>

                </div>
                {/* Payment */}

                <div className="invoice-summary">

                    <h3>Payment Summary</h3>

                    <p>

                        <span>Total Amount</span>

                        <strong>₹{invoice.total_amount}</strong>

                    </p>

                    <p>

                        <span>Paid</span>

                        <strong>

                            ₹{

                                invoice.payment_status === "PARTIAL"
                                    ? invoice.advance_amount
                                    : invoice.total_amount

                            }

                        </strong>

                    </p>

                    <p>

                        <span>Remaining</span>

                        <strong>

                            ₹{

                                invoice.payment_status === "PARTIAL"
                                    ? invoice.remaining_amount
                                    : 0

                            }

                        </strong>

                    </p>

                </div>

                {/* Footer */}

                <div className="invoice-footer">

                    <p>Thank you for shopping with AERODECK.</p>


                </div>

            </div>

        </div>

    );

}

export default ItemInvoice;