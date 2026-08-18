import "./MediumEditSection.css";
import { useState, useEffect } from "react";
import { API } from "../../../services/api";

function MediumEditSection({
    profile,
    setProfile,
    navigateWithLoading
}) {

    const [fullName, setFullName] = useState("");
    const [originalName, setOriginalName] = useState("");
    const [email, setEmail] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [otp, setOtp] = useState("");
    const [showEmailBox, setShowEmailBox] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const handleSendEmailOtp = async () => {
        const cleanEmail = emailInput.trim().toLowerCase();
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
            setMessage("Please enter a valid email address.");
            setMessageType("error");
            return;
        }
        setSendingOtp(true);
        setMessage("");
        setMessageType("");
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

                        email: cleanEmail
                    })
                }
            );
            const data = await response.json();
            if (data.success) {
                navigateWithLoading(
                    () => {
                        setOtpSent(true);
                        setMessage("OTP sent successfully.");
                        setMessageType("success");
                        setTimeout(() => {
                            setMessage("");
                            setMessageType("");
                        }, 3000);
                    },
                    "Sending OTP...",
                    500
                );
            } else {
                setMessage(
                    data.message ||
                    "Failed to send OTP."
                );
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

    useEffect(() => {

        const name = profile?.full_name || "";

        setFullName(name);
        setOriginalName(name);
        setEmail(profile?.email || "");

    }, [profile]);

    const handleSaveName = async () => {

        const cleanName = fullName.trim();



        if (!cleanName) {
            setMessage("Please enter your name.");
            setMessageType("error");
            return;
        }
        if (!/^[A-Za-z ]+$/.test(cleanName)) {
            setMessage("Name can contain letters only.");
            setMessageType("error");
            return;
        }
        if (cleanName.length < 3) {
            setMessage("Name must be at least 3 letters.");
            setMessageType("error");
            return;
        }

        // Name unchanged
        if (cleanName === originalName.trim()) {
            return;
        }

        try {

            const response = await fetch(
                `${API}/api/user/update-name`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        session_token:
                            localStorage.getItem("session_token"),
                        full_name: cleanName
                    })
                }
            );

            const data = await response.json();

            if (data.success) {

                navigateWithLoading(
                    () => {

                        setProfile(data.user);

                        setFullName(data.user.full_name);
                        setOriginalName(data.user.full_name);

                        setMessage("Name updated successfully.");
                        setMessageType("success");

                        setTimeout(() => {
                            setMessage("");
                            setMessageType("");
                        }, 3000);

                    },
                    "Updating Name...",
                    500
                );

            } else {

                setMessage(
                    data.message || "Failed to update name."
                );

                setMessageType("error");

            }

        } catch (err) {

            console.error(err);

            setMessage("Server Error.");
            setMessageType("error");

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

                navigateWithLoading(
                    () => {

                        setProfile(data.user);
                        setEmail(data.user.email);
                        setEmailInput("");
                        setOtp("");

                        setShowEmailBox(false);
                        setOtpSent(false);

                        setMessage("OTP verified successfully.");
                        setMessageType("success");

                        setTimeout(() => {
                            setMessage("");
                            setMessageType("");
                        }, 3000);

                    },
                    "Verifying OTP...",
                    500
                );

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
                        onChange={(e) => {
                            const value = e.target.value;

                            if (/^[A-Za-z ]*$/.test(value)) {
                                setFullName(value);
                            }
                        }}
                        placeholder="Enter your full name"
                    />

                    {fullName.trim() !== originalName.trim() && (
                        <button
                            className="save-name-btn"
                            onClick={handleSaveName}
                            disabled={
                                !fullName.trim() ||
                                fullName.trim().length < 3
                            }
                        >
                            Save
                        </button>
                    )}

                </div>

            </div>


            {/* =========================
                LOGIN MOBILE
            ========================= */}

            <div className="medium-field">

                <label>
                    Mobile Number
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

                                    {!sendingOtp && !otpSent && (
                                        <button
                                            className="send-otp-btn"
                                            onClick={handleSendEmailOtp}
                                            disabled={verifyingOtp}
                                        >
                                            SEND OTP
                                        </button>
                                    )}

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
                                            VERIFY
                                        </button>

                                    </div>

                                )}

                            </div>

                        )}

                    </>

                )}

            </div>

        </div>

    );

}

export default MediumEditSection;