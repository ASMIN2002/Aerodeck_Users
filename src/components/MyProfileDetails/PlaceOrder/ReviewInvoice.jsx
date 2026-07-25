// import "./ReviewInvoice.css";

function ReviewInvoice({ setProfilePage, backPage }) {

    return (

        <div className="invoice-container">

            <button
                onClick={() => setProfilePage("productorder")}
            >
                ←
            </button>
            <div className="invoice-header">

                <h1>AERODECK</h1>

                <p>Premium Cards • Gifts • Shop</p>

            </div>

            <div className="invoice-info">

                <div>
                    <strong>GSTIN</strong>
                    <span>21ABCDE1234F1Z5</span>
                </div>

                <div>
                    <strong>Invoice No</strong>
                    <span>INV-202600001</span>
                </div>

                <div>
                    <strong>Order Date</strong>
                    <span>24 Aug 2026</span>
                </div>

            </div>

            <div className="invoice-address">

                <h3>Bill To</h3>

                <p>Asmin Kuldeep Jena</p>

                <p>Balasore, Odisha</p>

                <p>756001</p>

                <p>+91 9876543210</p>

            </div>

            <div className="invoice-items">

                <h3>Items</h3>

            </div>

        </div>

    );

}

export default ReviewInvoice;