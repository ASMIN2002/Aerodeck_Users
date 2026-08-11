function ChatForm({
    chatId,
    productId,
    brideName,
    setBrideName,
    groomName,
    setGroomName,
    fatherName,
    setFatherName,
    motherName,
    setMotherName,
    address,
    setAddress,
    additionalDetails,
    setAdditionalDetails,
    onSubmit,
    onCancelOrder,
    cancelled,
    onCancelBack,
    onConfirmCancel
}) {

    const isComplete =
        brideName.trim() &&
        groomName.trim() &&
        fatherName.trim() &&
        motherName.trim() &&
        address.trim();

    return (

        <div className="user-chat-details-box">

            <div className="user-chat-system-message">
                Please provide the required details for your card.
            </div>

            <div className="user-chat-detail-field">
                <label>Bride Name</label>

                <input
                    type="text"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    placeholder="Enter bride name"
                />
            </div>

            <div className="user-chat-detail-field">
                <label>Groom Name</label>

                <input
                    type="text"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    placeholder="Enter groom name"
                />
            </div>

            <div className="user-chat-detail-field">
                <label>Father's Name</label>

                <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="Enter father's name"
                />
            </div>

            <div className="user-chat-detail-field">
                <label>Mother's Name</label>

                <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="Enter mother's name"
                />
            </div>

            <div className="user-chat-detail-field">
                <label>Address</label>

                <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter address"
                />
            </div>

            <div className="user-chat-detail-field">
                <label>Additional Details</label>

                <textarea
                    value={additionalDetails}
                    onChange={(e) =>
                        setAdditionalDetails(e.target.value)
                    }
                    placeholder="Any other details"
                />
            </div>

            <button
                className="user-chat-confirm-btn"
                disabled={!isComplete}
                onClick={onSubmit}
            >
                Confirm Details
            </button>
            <button
                className="user-chat-cancel-btn"
                onClick={onCancelOrder}
            >
                Cancel Order
            </button>
            {cancelled && (
                <div className="user-chat-cancel-confirm">

                    <div className="user-chat-system-message">
                        Are you sure you want to cancel this order?
                    </div>

                    <div className="user-chat-action-buttons">

                        <button
                            className="user-chat-cancel-btn"
                            onClick={onCancelBack}
                        >
                            Cancel
                        </button>

                        <button
                            className="user-chat-confirm-btn"
                            onClick={onConfirmCancel}
                        >
                            Confirm Cancel
                        </button>

                    </div>

                </div>
            )}

        </div>

    );
}

export default ChatForm;