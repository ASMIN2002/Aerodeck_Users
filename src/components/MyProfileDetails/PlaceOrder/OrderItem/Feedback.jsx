import "./Feedback.css";

function Feedback() {

    return (

        <div className="feedback-section">

            <h3>Send Feedback</h3>

            <p className="feedback-note">
                You can send feedback only once. Once submitted, it cannot be edited or sent again.
            </p>

            <textarea
                className="feedback-input"
                placeholder="Share your feedback..."
                maxLength={500}
            />

            <button className="feedback-btn">
                Send Feedback
            </button>

        </div>

    );

}

export default Feedback;