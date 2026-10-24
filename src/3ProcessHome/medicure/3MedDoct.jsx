import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBriefcase, FiUser, FiClock } from "react-icons/fi";
import { FaUserMd } from "react-icons/fa";
import "./3MedDoct.css";
import { API } from "../../services/api";

const getSessionUser = () => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); }
    catch { return {}; }
};

const formatDate = (d) =>
    d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: true }) : "N/A";

const getRemainingTime = (createdAt) => {
    if (!createdAt) return "0:00";
    let diff = Date.now() - new Date(createdAt).getTime();
    if (diff > 19800000) diff -= 19800000;
    const remaining = 300 - Math.floor(diff / 1000);
    if (remaining <= 0) return "0:00";
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
};

function MedDoct() {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [myBookings, setMyBookings] = useState({});
    const [, setTick] = useState(0);

    const user = getSessionUser();
    const user_id = user?.user_id;

    useEffect(() => {
        const load = async () => {
            try {
                const docRes = await fetch(`${API}/api/user/doctor`).then((r) => r.json());
                if (docRes.success) setDoctors(docRes.data || []);

                if (user_id) {
                    const bookRes = await fetch(`${API}/api/user/doctor/my-bookings/${user_id}`).then((r) => r.json());
                    if (bookRes.success) {
                        const map = {};
                        bookRes.data.forEach((b) => {
                            map[String(b.doctor_id)] = {
                                time: b.time,
                                is_booked: Number(b.is_booked),
                                created_at: b.created_at,
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
        load();
    }, [user_id]);

    useEffect(() => {
        const hasProcessing = Object.values(myBookings).some((b) => b.is_booked === 0);
        if (!hasProcessing) return;
        const timer = setInterval(() => setTick((n) => n + 1), 1000);
        return () => clearInterval(timer);
    }, [myBookings]);

    const handleBookNow = (doctor) => navigate(`/medicure/book/${doctor.doctor_id}`, { state: { doctor } });

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
                fees: doctor.booking_price,
            },
        });
    };

    if (loading) {
        return <section className="med-doct"><p className="med-data-loading">Loading doctors...</p></section>;
    }

    return (
        <section className="med-doct">
            <h2 className="med-doct-title">Doctors</h2>

            {doctors.length === 0 ? (
                <p className="med-data-empty">No doctors available.</p>
            ) : (
                <div className="med-doct-grid">
                    {doctors.map((doctor) => {
                        const booking = myBookings[String(doctor.doctor_id)];
                        const isConfirmed = booking?.is_booked === 1;
                        const isProcessing = booking?.is_booked === 0;

                        return (
                            <div key={doctor.doctor_id} className="med-doct-card">
                                <div className="med-doct-image">
                                    {doctor.profile_image ? (
                                        <img src={doctor.profile_image} alt={doctor.doctor_name} loading="lazy" />
                                    ) : (
                                        <FaUserMd className="med-doct-fallback" />
                                    )}
                                </div>

                                <div className="med-doct-body">
                                    <div className="med-doct-top">
                                        <h3 className="med-doct-name">{doctor.doctor_name}</h3>
                                        <span className="med-doct-price">₹{doctor.booking_price || 0}</span>
                                    </div>
                                    <p className="med-doct-specialist">{doctor.specialization || "General Physician"}</p>

                                    <div className="med-doct-info">
                                        <span className="med-doct-exp"><FiBriefcase /> {doctor.experience || "N/A"}</span>
                                        <span className="med-doct-seat"><FiUser /> {doctor.seat || 0} seats</span>
                                    </div>

                                    <p className="med-doct-time"><FiClock /> {formatDate(doctor.starting_at)}</p>

                                    {booking ? (
                                        isConfirmed ? (
                                            <button type="button" className="med-doct-book-btn booked" onClick={() => handleViewTicket(doctor)}>
                                                View Ticket
                                            </button>
                                        ) : isProcessing ? (
                                            <button type="button" className="med-doct-book-btn processing" disabled>
                                                Processing... {getRemainingTime(booking.created_at)}
                                            </button>
                                        ) : null
                                    ) : (
                                        <button type="button" className="med-doct-book-btn" onClick={handleBookNow.bind(null, doctor)}>
                                            Book Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default MedDoct;