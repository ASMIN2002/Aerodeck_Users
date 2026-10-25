import { useState } from "react";
import { FiMessageSquare, FiSend, FiCheckCircle } from "react-icons/fi";
import "../orderitemstyle/Feedback.css";

const MAX_LENGTH = 500;

function Feedback() {
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (!message.trim()) return;
        setSubmitted(true);
        setMessage("");
    };

    if (submitted) {
        return (
            <div className="feedback-section">
                <div className="feedback-success">
                    <FiCheckCircle className="feedback-success-icon" />
                    <h3>Feedback Sent</h3>
                    <p>Thank you for your valuable feedback.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="feedback-section">
            <div className="feedback-header">
                <span className="feedback-header-icon"><FiMessageSquare /></span>
                <h3 className="feedback-title">Send Feedback</h3>
            </div>

            <p className="feedback-note">
                You can send feedback only once. Once submitted, it cannot be edited or sent again.
            </p>

            <textarea
                className="feedback-input"
                placeholder="Share your feedback..."
                maxLength={MAX_LENGTH}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <div className="feedback-counter">{message.length}/{MAX_LENGTH}</div>

            <button
                type="button"
                className="feedback-btn"
                onClick={handleSubmit}
                disabled={!message.trim()}
            >
                <FiSend /> Send Feedback
            </button>
        </div>
    );
}

export default Feedback;