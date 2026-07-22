import "./MyPayments.css";

function MyPayments({

    setProfilePage

}) {

    const payments = [

        {
            id: 1,
            title: "Wedding Invitation Card",
            amount: 1499,
            method: "UPI",
            status: "Paid",
            date: "20 Jul 2026"
        },

        {
            id: 2,
            title: "Birthday Invitation Card",
            amount: 499,
            method: "Credit Card",
            status: "Paid",
            date: "18 Jul 2026"
        },

        {
            id: 3,
            title: "Anniversary Card",
            amount: 799,
            method: "Cash on Delivery",
            status: "Pending",
            date: "22 Jul 2026"
        }

    ];

    return (

        <div className="mypayments">

            <div className="payments-header">

                <button
                    className="payments-back"
                    onClick={() => setProfilePage("profile")}
                >
                    ←
                </button>

                <h2>
                    My Payments
                </h2>

            </div>

            {

                payments.length === 0 ?

                <div className="payments-empty">

                    💳

                    <h3>
                        No Payments Found
                    </h3>

                    <p>
                        Your payment history will appear here.
                    </p>

                </div>

                :

                payments.map((payment) => (

                    <div
                        className="payment-card"
                        key={payment.id}
                    >

                        <div className="payment-top">

                            <h3>

                                {payment.title}

                            </h3>

                            <span

                                className={`payment-status ${payment.status.toLowerCase()}`}

                            >

                                {payment.status}

                            </span>

                        </div>

                        <p>

                            Payment Method : {payment.method}

                        </p>

                        <p>

                            Date : {payment.date}

                        </p>

                        <h2>

                            ₹ {payment.amount}

                        </h2>

                    </div>

                ))

            }

        </div>

    );

}

export default MyPayments;