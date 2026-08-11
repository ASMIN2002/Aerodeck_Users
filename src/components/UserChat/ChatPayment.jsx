function ChatPayment({
    onPay80,
    onPayFull,
    onSeeDemo,
    onCancel
}) {

    return (

        <div className="user-chat-payment-box">

            <div className="user-chat-system-message">
                Please choose your payment option.
            </div>

            <button
                className="user-chat-payment-btn"
                onClick={onPay80}
            >
                Pay 80% Now — Rest 20% on Delivery
            </button>

            <button
                className="user-chat-payment-btn"
                onClick={onPayFull}
            >
                Pay Full Amount
            </button>

            <button
                className="user-chat-payment-btn"
                onClick={onSeeDemo}
            >
                See Demo
            </button>

            <button
                className="user-chat-cancel-btn"
                onClick={onCancel}
            >
                Cancel
            </button>

        </div>

    );

}

export default ChatPayment;