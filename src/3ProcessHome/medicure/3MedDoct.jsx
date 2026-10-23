import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./3MedDoct.css";
import { API } from "../../services/api";

function MedDoct() {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [myBookings, setMyBookings] = useState({});
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [now, setNow] = useState(Date.now());

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const user_id = user?.user_id;

    useEffect(() => {
        const fetchDoctorsAndBookings = async () => {
            try {
                const docRes = await fetch(`${API}/api/user/doctor`);
                const docData = await docRes.json();
                if (docData.success) setDoctors(docData.data || []);

                if (user_id) {
                    const bookRes = await fetch(`${API}/api/user/doctor/my-bookings/${user_id}`);
                    const bookData = await bookRes.json();

                    if (bookData.success) {
                        const map = {};
                        bookData.data.forEach(b => {
                            // 👇 Yahan String() add kiya
                            map[String(b.doctor_id)] = {
                                time: b.time,
                                is_booked: Number(b.is_booked), // 👈 Number() add kiya
                                created_at: b.created_at
                            };
                        });
                        setMyBookings(map);
                    }
                }
            } catch (err) {
                console.error("Data fetch error:", err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctorsAndBookings();
    }, [user_id]);

    useEffect(() => {
        const hasProcessing = Object.values(myBookings).some(b => b.is_booked === 0);
        let timer;
        if (hasProcessing) {
            timer = setInterval(() => setNow(Date.now()), 1000);
        }
        return () => clearInterval(timer);
    }, [myBookings]);

    const handleBookNow = (doctor) => {
        navigate(`/medicure/book/${doctor.doctor_id}`, { state: { doctor } });
    };

    const handleViewTicket = (doctor) => {
        const booking = myBookings[String(doctor.doctor_id)];
        navigate(`/medicure/ticket/${doctor.doctor_id}`, {
            state: {
                user_id: user.user_id,
                user_name: user.full_name || "Unknown User",
                doctor_id: doctor.doctor_id,
                doctor_name: doctor.doctor_name,
                specialization: doctor.specialization,
                time: booking.time,
                fees: doctor.booking_price
            }
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const d = new Date(dateString);
        return d.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };
    const getRemainingTime = (created_at) => {
        if (!created_at) return "0:00";

        const createdTime = new Date(created_at).getTime();
        const currentNow = Date.now();

        let diff = currentNow - createdTime;

        if (diff > 19800000) {
            diff = diff - 19800000;
        }

        const elapsed = Math.floor(diff / 1000);
        const remaining = 300 - elapsed;

        if (remaining <= 0) return "0:00";

        const m = Math.floor(remaining / 60);
        const s = remaining % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };
    if (loading) {
        return (
            <section className="med-doct">
                <p className="med-data-loading">Loading doctors...</p>
            </section>
        );
    }

    return (
        <section className="med-doct">
            <h2 className="med-doct-title">Doctors</h2>

            {doctors.length === 0 ? (
                <p className="med-data-empty">No doctors available.</p>
            ) : (
                <div className="med-doct-grid">
                    {doctors.map((doctor) => {
                        const booking = myBookings[String(doctor.doctor_id)]; // 👈 String() add kiya
                        const isConfirmed = booking && booking.is_booked === 1;
                        const isProcessing = booking && booking.is_booked === 0;

                        return (
                            <div key={doctor.doctor_id} className="med-doct-card">
                                <div className="med-doct-image">
                                    {doctor.profile_image ? (
                                        <img src={doctor.profile_image} alt={doctor.doctor_name} />
                                    ) : (
                                        <span className="med-doct-fallback">👨‍⚕️</span>
                                    )}
                                </div>

                                <div className="med-doct-body">
                                    <h3 className="med-doct-name">{doctor.doctor_name}</h3>
                                    <p className="med-doct-specialist">
                                        {doctor.specialization || "General Physician"}
                                    </p>

                                    <div className="med-doct-info">
                                        <span className="med-doct-exp">
                                            💼 {doctor.experience || "N/A"} Exp
                                        </span>
                                        <span className="med-doct-seat">
                                            🪑 {doctor.seat || 0} Seats Left
                                        </span>
                                        <span className="med-doct-price">
                                            ₹{doctor.booking_price || 0}
                                        </span>
                                    </div>

                                    <p className="med-doct-time">
                                        🕐 {formatDate(doctor.starting_at)}
                                    </p>

                                    {booking ? (
                                        isConfirmed ? (
                                            <button
                                                className="med-doct-book-btn booked"
                                                onClick={() => handleViewTicket(doctor)}
                                            >
                                                View Ticket
                                            </button>
                                        ) : (
                                            <button className="med-doct-book-btn processing">
                                                Processing... {getRemainingTime(booking.created_at)}
                                            </button>
                                        )
                                    ) : (
                                        <button
                                            className="med-doct-book-btn"
                                            onClick={() => handleBookNow(doctor)}
                                        >
                                            Book Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedTicket && (
                <div className="medicine-modal-overlay" onClick={() => setSelectedTicket(null)}>
                    <div className="medicine-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "350px" }}>
                        <div className="medicine-modal-header">
                            <h3>Appointment Ticket</h3>
                            <button className="medicine-modal-close" onClick={() => setSelectedTicket(null)}>✕</button>
                        </div>
                        <div className="ticket-body">
                            <div className="ticket-row">
                                <span>Patient Name</span>
                                <strong>{selectedTicket.user_name}</strong>
                            </div>
                            <div className="ticket-row">
                                <span>Doctor Name</span>
                                <strong>{selectedTicket.doctor_name}</strong>
                            </div>
                            <div className="ticket-row">
                                <span>Time</span>
                                <strong>{new Date(selectedTicket.time).toLocaleString("en-IN", {
                                    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: true
                                })}</strong>
                            </div>
                            <div className="ticket-row">
                                <span>Fees</span>
                                <strong>₹{selectedTicket.fees}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default MedDoct;