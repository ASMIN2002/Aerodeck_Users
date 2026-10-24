import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { FaUserMd } from "react-icons/fa";
import "./5ViewTicket.css";

const CLINIC_PHONE = "+91 9583282886";

const formatDateTime = (d) =>
    d ? new Date(d).toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true
    }) : "N/A";

function ViewTicket() {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;

    if (!data) {
        return (
            <div className="viewticket-page">
                <div className="viewticket-empty">
                    <p>Ticket data not found.</p>
                    <button className="viewticket-empty-btn" onClick={() => navigate("/medicure")}>Go Back</button>
                </div>
            </div>
        );
    }

    const ticketId = `#${data.user_id}$${data.doctor_id}#HEEPIT`;

    return (
        <div className="viewticket-page">
            <div className="viewticket-header">
                <button className="viewticket-back" onClick={() => navigate(-1)} aria-label="Back">
                    <FiArrowLeft />
                </button>
                <h2>Appointment Ticket</h2>
            </div>

            <div className="viewticket-card">
                <div className="viewticket-card-top">
                    <div className="viewticket-confirmed-badge">
                        <FiCheckCircle /> Confirmed
                    </div>
                    <div className="viewticket-id-wrap">
                        <span className="viewticket-id-label">Ticket ID</span>
                        <h3 className="viewticket-id">{ticketId}</h3>
                    </div>
                    <FaUserMd className="viewticket-watermark" />
                </div>

                <div className="viewticket-divider" />

                <div className="viewticket-info">
                    <div className="viewticket-row">
                        <span className="viewticket-row-label">Patient</span>
                        <strong className="viewticket-row-value">{data.user_name}</strong>
                    </div>
                    <div className="viewticket-row">
                        <span className="viewticket-row-label">Doctor</span>
                        <strong className="viewticket-row-value">{data.doctor_name}</strong>
                    </div>
                    <div className="viewticket-row">
                        <span className="viewticket-row-label">Specialization</span>
                        <strong className="viewticket-row-value">{data.specialization || "General"}</strong>
                    </div>
                    <div className="viewticket-row">
                        <span className="viewticket-row-label">Time</span>
                        <strong className="viewticket-row-value">{formatDateTime(data.time)}</strong>
                    </div>
                    <div className="viewticket-row">
                        <span className="viewticket-row-label">Fees</span>
                        <strong className="viewticket-row-value viewticket-fee">₹{data.fees}</strong>
                    </div>
                </div>

                <div className="viewticket-divider viewticket-divider-dashed" />

                <div className="viewticket-footer">
                    <span className="viewticket-footer-label">Clinic Contact</span>
                    <a href={`tel:${CLINIC_PHONE.replace(/\s/g, "")}`} className="viewticket-phone">{CLINIC_PHONE}</a>
                </div>
            </div>
        </div>
    );
}

export default ViewTicket;