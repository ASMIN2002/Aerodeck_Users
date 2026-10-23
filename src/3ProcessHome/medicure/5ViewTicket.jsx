import { useLocation, useNavigate } from "react-router-dom";
import "./5ViewTicket.css";

function ViewTicket() {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;

    if (!data) {
        return (
            <div className="viewticket-page">
                <p>Ticket data not found.</p>
                <button onClick={() => navigate("/medicure")}>Go Back</button>
            </div>
        );
    }

    const ticketId = `#${data.user_id}$${data.doctor_id}#HEEPIT`;

    return (
        <div className="viewticket-page">
            <div className="viewticket-header">
                <button className="viewticket-back" onClick={() => navigate(-1)}>←</button>
                <h2>Appointment Ticket</h2>
            </div>

            <div className="ticket-card">
                <div className="ticket-top">
                    <span className="ticket-label">Ticket ID</span>
                    <h3 className="ticket-id">{ticketId}</h3>
                </div>

                <div className="ticket-divider" />

                <div className="ticket-info">
                    <div className="ticket-row">
                        <span>Patient Name</span>
                        <strong>{data.user_name}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>Doctor Name</span>
                        <strong>{data.doctor_name}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>Specialization</span>
                        <strong>{data.specialization || "General"}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>Time</span>
                        <strong>{new Date(data.time).toLocaleString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit", hour12: true
                        })}</strong>
                    </div>
                    <div className="ticket-row">
                        <span>Fees</span>
                        <strong>₹{data.fees}</strong>
                    </div>
                </div>

                <div className="ticket-divider" />

                <div className="ticket-footer">
                    <p>Clinic Contact: +91 9583282886</p>
                </div>
            </div>
        </div>
    );
}

export default ViewTicket;