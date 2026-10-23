import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./4BookNow.css";
import { API } from "../../services/api";
import toast from "react-hot-toast";

function BookNow() {
    const location = useLocation();
    const navigate = useNavigate();
    const doctor = location.state?.doctor;

    const sessionToken = localStorage.getItem("session_token");
    const [userDetails, setUserDetails] = useState(null);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const [isProcessing, setIsProcessing] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [myBooking, setMyBooking] = useState(null);

    useEffect(() => {
        if (!doctor || !sessionToken) return;

        fetch(`${API}/api/user/details?session_token=${sessionToken}`)
            .then(r => r.json())
            .then(data => {
                if (data.success && data.data) setUserDetails(data.data);
            })
            .catch(err => console.error(err));
    }, [doctor, sessionToken]);

    const fetchData = async () => {
        if (!doctor || !userDetails?.user_id) return;

        try {
            // 1. Check User Booking
            const bookRes = await fetch(`${API}/api/user/doctor/my-bookings/${userDetails.user_id}`);
            const bookData = await bookRes.json();

            if (bookData.success && bookData.data.length > 0) {
                // Doctor ID match karte waqt Number() use karo
                const existing = bookData.data.find(b => Number(b.doctor_id) === Number(doctor.doctor_id));

                if (existing) {
                    setMyBooking(existing);

                    // is_booked 0 (Processing) hai kya?
                    if (Number(existing.is_booked) === 0) {
                        const createdTime = new Date(existing.created_at).getTime();
                        const now = new Date().getTime();
                        const elapsedSeconds = Math.floor((now - createdTime) / 1000);
                        const remaining = 300 - elapsedSeconds;

                        if (remaining > 0) {
                            setIsProcessing(true);
                            setTimeLeft(remaining);
                        } else {
                            // 5 min ho gaye, booking clear karo
                            setMyBooking(null);
                            setIsProcessing(false);
                        }
                    }
                }
            }

            // 2. Fetch Slots
            const res = await fetch(`${API}/api/user/doctor/${doctor.doctor_id}/slots`);
            const data = await res.json();
            if (data.success) setSlots(data.slots || []);
        } catch (err) {
            console.error("Data fetch error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [doctor, userDetails?.user_id]);

    useEffect(() => {
        let timer;
        if (isProcessing && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && isProcessing) {
            setIsProcessing(false);
            setMyBooking(null);
            fetchData(); // Refresh slots after 5 mins
        }
        return () => clearInterval(timer);
    }, [isProcessing, timeLeft]);

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
            const res = await fetch(`${API}/api/user/doctor/book`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userDetails.user_id,
                    doctor_id: doctor.doctor_id,
                    time: selectedSlot,
                }),
            });

            const data = await res.json();
            if (data.success) {
                window.open(data.whatsapp_url, "_blank");
                setMyBooking({ time: selectedSlot, is_booked: 0, created_at: new Date().toISOString() });
                setIsProcessing(true);
                setTimeLeft(300);
                toast.success("Slot reserved for 5 minutes.");
            } else {
                toast.error(data.message || "Booking failed");
            }
        } catch (err) {
            toast.error("Server Error");
        }
    };

    const formatCountdown = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    if (!doctor) {
        return (
            <div className="booknow-page">
                <p>Doctor data not found.</p>
                <button onClick={() => navigate("/medicure")}>Go Back</button>
            </div>
        );
    }

    return (
        <div className="booknow-page">
            <div className="booknow-header">
                <button className="booknow-back" onClick={() => navigate(-1)}>←</button>
                <h2>Book Appointment</h2>
            </div>

            <div className="booknow-doctor-info">
                <div className="booknow-doc-image">
                    {doctor.profile_image ? <img src={doctor.profile_image} alt="Doctor" /> : <span>👨‍⚕️</span>}
                </div>
                <div className="booknow-doc-details">
                    <h3>{doctor.doctor_name}</h3>
                    <p>{doctor.specialization}</p>
                    <p className="doc-fee">Fee: ₹{doctor.booking_price}</p>
                </div>
            </div>

            {isProcessing && myBooking && !myBooking.is_booked && (
                <div className="processing-box">
                    <h2>On Waiting...</h2>
                    <p>Your booking is processing. Please confirm on WhatsApp.</p>
                    <div className="countdown">Time left: {formatCountdown(timeLeft)}</div>
                </div>
            )}

            {myBooking && myBooking.is_booked === 1 && (
                <div className="clinic-status" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                    <h2 style={{ color: "#15803d" }}>Booked Confirmed</h2>
                    <p style={{ color: "#166534" }}>Your appointment is confirmed.</p>
                    <p style={{ color: "#166534", marginTop: "10px", fontWeight: "bold" }}>Clinic Contact: +91 9583282886</p>
                </div>
            )}

            {!isProcessing && (!myBooking || myBooking.is_booked === 1) && (
                <>
                    <div className="booknow-user-info">
                        <h4>Patient Details</h4>
                        <p><strong>Name:</strong> {userDetails?.full_name || "Loading..."}</p>
                        <p><strong>Mobile:</strong> {userDetails?.mobile_number || "Loading..."}</p>
                    </div>

                    <h3 className="slot-title">Select Time Slot</h3>
                    {loading ? (
                        <p className="slot-loading">Loading slots...</p>
                    ) : slots.length === 0 ? (
                        <div className="clinic-status"><h2>Doctor in Clinic</h2></div>
                    ) : (
                        <div className="slot-grid">
                            {slots.map((slot, idx) => {
                                let isDisabled = slot.isPast || slot.isBooked || slot.isProcessing;
                                let label = slot.displayTime;

                                if (slot.isProcessing) {
                                    label = `${slot.displayTime} (In Waiting)`;
                                } else if (slot.isBooked) {
                                    label = `${slot.displayTime} (Already Booked)`;
                                }

                                return (
                                    <button
                                        key={idx}
                                        className={`slot-btn ${isDisabled ? "disabled" : ""} ${selectedSlot === slot.time ? "selected" : ""}`}
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
                <div className="medicine-modal-overlay">
                    <div className="medicine-delete-box">
                        <h3>Want to confirm booking?</h3>
                        <p>You will be redirected to WhatsApp.</p>
                        <div className="medicine-delete-actions">
                            <button onClick={() => setShowConfirm(false)}>Cancel</button>
                            <button className="medicine-confirm-delete" onClick={handleConfirmBooking}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookNow;