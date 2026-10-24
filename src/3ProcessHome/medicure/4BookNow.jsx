import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiClock, FiUser, FiPhone, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import { FaUserMd } from "react-icons/fa";
import toast from "react-hot-toast";
import "./4BookNow.css";
import { API } from "../../services/api";

const SLOT_HOLD_SECONDS = 300;
const CLINIC_PHONE = "+91 9583282886";

const formatCountdown = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
};

const getSession = () => localStorage.getItem("session_token");

function BookNow() {
    const location = useLocation();
    const navigate = useNavigate();
    const doctor = location.state?.doctor;

    const sessionToken = getSession();
    const [userDetails, setUserDetails] = useState(null);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [myBooking, setMyBooking] = useState(null);

    // 👇 REFRESH FUNCTION
    const fetchData = useCallback(async () => {
        if (!doctor || !userDetails?.user_id) return;
        setLoading(true);
        try {
            const bookData = await fetch(`${API}/api/user/doctor/my-bookings/${userDetails.user_id}`).then((r) => r.json());
            if (bookData.success && bookData.data.length > 0) {
                const existing = bookData.data.find((b) => Number(b.doctor_id) === Number(doctor.doctor_id));
                if (existing) {
                    setMyBooking(existing);
                    if (Number(existing.is_booked) === 0) {
                        const remaining = SLOT_HOLD_SECONDS - Math.floor((Date.now() - new Date(existing.created_at).getTime()) / 1000);
                        if (remaining > 0) {
                            setIsProcessing(true);
                            setTimeLeft(remaining);
                        } else {
                            setMyBooking(null);
                            setIsProcessing(false);
                        }
                    } else {
                        setIsProcessing(false);
                    }
                }
            }

            const data = await fetch(`${API}/api/user/doctor/${doctor.doctor_id}/slots`).then((r) => r.json());
            if (data.success) setSlots(data.slots || []);
        } catch (err) {
            console.error("Data fetch error:", err.message);
        } finally {
            setLoading(false);
        }
    }, [doctor, userDetails?.user_id]);

    useEffect(() => {
        if (!doctor || !sessionToken) return;
        fetch(`${API}/api/user/details?session_token=${sessionToken}`)
            .then((r) => r.json())
            .then((data) => { if (data.success && data.data) setUserDetails(data.data); })
            .catch((err) => console.error(err));
    }, [doctor, sessionToken]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (!isProcessing || timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
        return () => clearInterval(timer);
    }, [isProcessing, timeLeft]);

    useEffect(() => {
        if (timeLeft === 0 && isProcessing) {
            setIsProcessing(false);
            setMyBooking(null);
            fetchData(); // Slots refresh after time is over
        }
    }, [timeLeft, isProcessing, fetchData]);

    const handleBookClick = () => {
        if (!selectedSlot) return toast.error("Please select a time slot.");
        if (!userDetails?.full_name || userDetails.is_mobile_verified !== 1) {
            return toast.error("Please verify your mobile number first.");
        }
        setShowConfirm(true);
    };

    const handleConfirmBooking = async () => {
        setShowConfirm(false);
        try {
            const data = await fetch(`${API}/api/user/doctor/book`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userDetails.user_id,
                    doctor_id: doctor.doctor_id,
                    time: selectedSlot,
                }),
            }).then((r) => r.json());

            if (data.success) {
                window.open(data.whatsapp_url, "_blank");
                setMyBooking({ time: selectedSlot, is_booked: 0, created_at: new Date().toISOString() });
                setIsProcessing(true);
                setTimeLeft(SLOT_HOLD_SECONDS);
                toast.success("Slot reserved for 5 minutes.");
            } else {
                toast.error(data.message || "Booking failed");
            }
        } catch {
            toast.error("Server Error");
        }
    };

    const handleRefresh = () => {
        fetchData();
        toast.success("Refreshed!");
    };

    if (!doctor) {
        return (
            <div className="booknow-page">
                <div className="booknow-empty">
                    <p>Doctor data not found.</p>
                    <button className="booknow-empty-btn" onClick={() => navigate("/medicure")}>Go Back</button>
                </div>
            </div>
        );
    }

    const isConfirmed = myBooking && Number(myBooking.is_booked) === 1;
    const showBookingForm = !isProcessing && !isConfirmed;

    return (
        <div className="booknow-page">
            <div className="booknow-header">
                <button className="booknow-back" onClick={() => navigate(-1)} aria-label="Back">
                    <FiArrowLeft />
                </button>
                <h2>Book Appointment</h2>
                {/* 👇 REFRESH BUTTON */}
                <button className="booknow-refresh-btn" onClick={handleRefresh} aria-label="Refresh">
                    <FiRefreshCw />
                </button>
            </div>

            <div className="booknow-doctor-info">
                <div className="booknow-doc-image">
                    {doctor.profile_image ? (
                        <img src={doctor.profile_image} alt={doctor.doctor_name} loading="lazy" />
                    ) : (
                        <FaUserMd className="booknow-doc-fallback" />
                    )}
                </div>
                <div className="booknow-doc-details">
                    <h3>{doctor.doctor_name}</h3>
                    <p className="booknow-doc-spec">{doctor.specialization || "General Physician"}</p>
                    <p className="booknow-doc-fee">₹{doctor.booking_price || 0}</p>
                </div>
            </div>

            {isProcessing && myBooking && !myBooking.is_booked && (
                <div className="booknow-processing">
                    <FiClock className="booknow-processing-icon" />
                    <h3>Confirm on WhatsApp</h3>
                    <p>Your slot is reserved. Please confirm on WhatsApp to complete booking.</p>
                    <div className="booknow-countdown">Time left: <strong>{formatCountdown(timeLeft)}</strong></div>
                </div>
            )}

            {isConfirmed && (
                <div className="booknow-confirmed">
                    <FiCheckCircle className="booknow-confirmed-icon" />
                    <h3>Booked Confirmed</h3>
                    <p>Your appointment is confirmed.</p>
                    <p className="booknow-confirmed-phone">Clinic: {CLINIC_PHONE}</p>
                </div>
            )}

            {showBookingForm && (
                <>
                    <div className="booknow-user-info">
                        <h4>Patient Details</h4>
                        <div className="booknow-info-row">
                            <FiUser className="booknow-info-icon" />
                            <span>{userDetails?.full_name || "Loading..."}</span>
                        </div>
                        <div className="booknow-info-row">
                            <FiPhone className="booknow-info-icon" />
                            <span>{userDetails?.mobile_number || "Loading..."}</span>
                        </div>
                    </div>

                    <h3 className="booknow-slot-title">Select Time Slot</h3>

                    {loading ? (
                        <p className="booknow-slot-loading">Loading slots...</p>
                    ) : slots.length === 0 ? (
                        <div className="booknow-clinic-msg">
                            <h3>Doctor in Clinic</h3>
                        </div>
                    ) : (
                        <div className="booknow-slot-grid">
                            {slots.map((slot, idx) => {
                                const isDisabled = slot.isPast || slot.isBooked || slot.isProcessing;
                                let label = slot.displayTime;
                                if (slot.isProcessing) label = `${slot.displayTime} (In Waiting)`;
                                else if (slot.isBooked) label = `${slot.displayTime} (Booked)`;

                                return (
                                    <button
                                        key={idx}
                                        className={`booknow-slot-btn ${isDisabled ? "disabled" : ""} ${selectedSlot === slot.time ? "selected" : ""}`}
                                        disabled={isDisabled}
                                        onClick={() => setSelectedSlot(slot.time)}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {slots.length > 0 && (
                        <button className="booknow-confirm-btn" onClick={handleBookClick} disabled={!selectedSlot}>
                            Book Now
                        </button>
                    )}
                </>
            )}

            {showConfirm && (
                <div className="booknow-modal-overlay" onClick={() => setShowConfirm(false)}>
                    <div className="booknow-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Confirm booking?</h3>
                        <p>You will be redirected to WhatsApp.</p>
                        <div className="booknow-modal-actions">
                            <button className="booknow-modal-cancel" onClick={() => setShowConfirm(false)}>Cancel</button>
                            <button className="booknow-modal-confirm" onClick={handleConfirmBooking}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookNow;