function ChatDemo({
    onOrder,
    onCancel
}) {

    return (

        <div className="user-chat-demo-box">

            <div className="user-chat-system-message">
                Your card demo is ready.
            </div>

            <div className="user-chat-demo-images">
                {/* Demo images yahan baad mein aayengi */}
            </div>

            <div className="user-chat-action-buttons">

                <button
                    className="user-chat-confirm-btn"
                    onClick={onOrder}
                >
                    Order
                </button>

                <button
                    className="user-chat-cancel-btn"
                    onClick={onCancel}
                >
                    Cancel
                </button>

            </div>

        </div>

    );

}

export default ChatDemo;