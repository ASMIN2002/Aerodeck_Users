import "./ChatConfirm.css";
function ChatConfirm({
    onConfirm,
    onCancel
}) {

    return (

        <div className="user-chat-action-buttons">

            <button
                className="user-chat-confirm-btn"
                onClick={onConfirm}
            >
                Confirm Order
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

export default ChatConfirm;