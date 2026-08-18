import "./MediumEditSection.css";
import { useState, useEffect } from "react";
import { API } from "../../../services/api";

function MediumEditSection({ profile, setProfile }) {

    const [fullName, setFullName] = useState("");

    // Email states
    const [email, setEmail] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [otp, setOtp] = useState("");

    const [showEmailBox, setShowEmailBox] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    useEffect(() => {

        setFullName(profile?.full_name || "");
        setEmail(profile?.email || "");

    }, [profile]);


    // ===============================
    // SAVE NAME
    // ===============================

    const handleSaveName = async () => {

        try {

            const response = await fetch(
                `${API}/api/user/update-name`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        session_token: localStorage.getItem("session_token"),
                        full_name: fullName
                    })
                }
            );

            const data = await response.json();

            if (data.success) {

                setProfile(data.user);

                alert("Name updated successfully.");

            } else {

                alert(data.message);

            }

        } catch (err) {

            console.error(err);
            alert("Server Error");

        }

    };


    // ===============================
    // SEND EMAIL OTP
    // ===============================

    const handleSendEmailOtp = async () => {

        if (!emailInput.trim()) {

            setMessage("Please enter a valid email address.");
            setMessageType("error");

            return;
        }

        setSendingOtp(true);

        try {

            const response = await fetch(
                `${API}/api/user/send-email-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        session_token:
                            localStorage.getItem("session_token"),

                        email: emailInput.trim()
                    })
                }
            );

            const data = await response.json();

            if (data.success) {

                setOtpSent(true);

                setMessage("OTP sent successfully.");
                setMessageType("success");

            } else {

                setMessage(data.message || "Failed to send OTP.");
                setMessageType("error");

            }

        } catch (err) {

            console.error(err);

            setMessage("Server Error.");
            setMessageType("error");

        } finally {

            setSendingOtp(false);

        }

    };


    // ===============================
    // VERIFY EMAIL OTP
    // ===============================

    const handleVerifyEmailOtp = async () => {

        if (!otp.trim()) {

            setMessage("Please enter OTP.");
            setMessageType("error");

            return;
        }

        setVerifyingOtp(true);

        setMessage("");
        setMessageType("");

        try {

            const response = await fetch(
                `${API}/api/user/verify-email-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        session_token:
                            localStorage.getItem("session_token"),

                        email: emailInput.trim(),

                        otp: otp.trim()
                    })
                }
            );

            const data = await response.json();

            if (data.success) {

                setProfile(data.user);

                setEmail(data.user.email);

                setEmailInput("");
                setOtp("");

                setShowEmailBox(false);
                setOtpSent(false);

                setMessage("Email verified successfully.");
                setMessageType("success");

            } else {

                setMessage(data.message || "Invalid OTP.");
                setMessageType("error");

            }

        } catch (err) {

            console.error(err);

            setMessage("Server Error.");
            setMessageType("error");

        } finally {

            setVerifyingOtp(false);

        }

    };


    return (

        <div className="medium-edit-card">


            {/* =========================
                TOP MESSAGE
            ========================= */}

            {message && (

                <div
                    className={`email-message ${messageType}`}
                >
                    {message}
                </div>

            )}


            {/* =========================
                FULL NAME
            ========================= */}

            <div className="medium-field">

                <label>
                    Full Name
                </label>

                <div className="name-input-wrapper">

                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) =>
                            setFullName(e.target.value)
                        }
                        placeholder="Enter your full name"
                    />

                    <button
                        onClick={handleSaveName}
                    >
                        Save
                    </button>

                </div>

            </div>


            {/* =========================
                LOGIN MOBILE
            ========================= */}

            <div className="medium-field">

                <label>
                    Login Mobile Number
                </label>

                <div className="mobile-box">

                    <span className="mobile-number">
                        +91 {profile?.mobile_number}
                    </span>

                    <span className="verified">
                        Verified
                    </span>

                </div>

            </div>


            {/* =========================
                EMAIL
            ========================= */}

            <div className="medium-field">

                <label>
                    Email Address
                </label>


                {/* EMAIL ALREADY VERIFIED */}

                {profile?.email &&
                    Number(profile?.is_email_verified) === 1 ? (

                    <div className="mobile-box">

                        <span className="mobile-number">
                            {profile.email}
                        </span>

                        <span className="verified">
                            Verified
                        </span>

                    </div>

                ) : (

                    <>
                        {/* ADD BUTTON */}

                        {!showEmailBox && (

                            <div className="email-add-box">

                                <span className="email-not-set">
                                    NOT SET
                                </span>

                                <button
                                    className="email-add-btn"
                                    onClick={() => {
                                        setShowEmailBox(true);
                                        setMessage("");
                                    }}
                                >
                                    ADD
                                </button>

                            </div>

                        )}


                        {/* EMAIL INPUT */}

                        {showEmailBox && (

                            <div className="email-verification-box">

                                <div className="email-input-row">

                                    <input
                                        type="email"
                                        value={emailInput}
                                        onChange={(e) =>
                                            setEmailInput(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter email address"
                                        disabled={
                                            sendingOtp ||
                                            verifyingOtp
                                        }
                                    />

                                    <button
                                        className="send-otp-btn"
                                        onClick={
                                            handleSendEmailOtp
                                        }
                                        disabled={
                                            sendingOtp ||
                                            verifyingOtp
                                        }
                                    >
                                        {sendingOtp
                                            ? "Sending..."
                                            : "SEND OTP"}
                                    </button>

                                </div>


                                {/* OTP BOX */}

                                {otpSent && (

                                    <div className="otp-verification-row">

                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength="6"
                                            value={otp}
                                            onChange={(e) =>
                                                setOtp(
                                                    e.target.value
                                                        .replace(
                                                            /\D/g,
                                                            ""
                                                        )
                                                )
                                            }
                                            placeholder="Enter OTP"
                                            disabled={
                                                verifyingOtp
                                            }
                                        />

                                        <button
                                            className="verify-email-btn"
                                            onClick={
                                                handleVerifyEmailOtp
                                            }
                                            disabled={
                                                otp.length !== 6 ||
                                                verifyingOtp
                                            }
                                        >
                                            {verifyingOtp
                                                ? "VERIFYING..."
                                                : "VERIFY"}
                                        </button>

                                    </div>

                                )}

                            </div>

                        )}

                    </>

                )}

            </div>


            {/* =========================
                VERIFYING OVERLAY
            ========================= */}

            {verifyingOtp && (

                <div className="email-verifying-overlay">

                    <div className="email-verifying-box">

                        <div className="email-spinner"></div>

                        <h3>
                            Verifying Email
                        </h3>

                        <p>
                            Please wait...
                        </p>

                    </div>

                </div>

            )}

        </div>

    );

}

export default MediumEditSection;