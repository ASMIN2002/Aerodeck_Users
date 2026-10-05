import { useState } from "react";
import {
    FiMail,
    FiCheckCircle,
    FiXCircle,
    FiLoader
} from "react-icons/fi";

import "../../styles/Login.css";
import { API } from "../../services/api";


function Login({ setPage, setAuthMode }) {

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: ""
    });


    const showToast = (message, type = "success") => {
        setToast({
            show: true,
            message,
            type
        });
    };


    const hideToast = () => {
        setToast({
            show: false,
            message: "",
            type: ""
        });
    };


    const handleSendOtp = async () => {

        const cleanEmail = email.trim().toLowerCase();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {
            showToast("Please enter a valid email.", "error");
            setTimeout(hideToast, 3000);
            return;
        }

        setIsSending(true);
        hideToast();

        try {

            const response = await fetch(
                `${API}/api/auth/send-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: cleanEmail
                    })
                }
            );

            const data = await response.json();

            setIsSending(false);

            if (!data.success) {
                showToast(
                    data.message || "Failed to send OTP.",
                    "error"
                );
                setTimeout(hideToast, 3000);
                return;
            }

            setOtpSent(true);
            showToast("OTP sent to your email.", "success");
            setTimeout(hideToast, 3000);

        } catch (err) {

            console.error(err);
            setIsSending(false);

            showToast("Server connection failed.", "error");
            setTimeout(hideToast, 3000);
        }
    };


    const handleVerifyOtp = async () => {

        if (otp.length !== 6) {
            showToast("Please enter 6 digit OTP.", "error");
            setTimeout(hideToast, 3000);
            return;
        }

        setIsVerifying(true);
        hideToast();

        try {

            const response = await fetch(
                `${API}/api/auth/verify-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email.trim().toLowerCase(),
                        otp: otp.trim()
                    })
                }
            );

            const data = await response.json();

            setIsVerifying(false);

            if (!data.success) {
                showToast(
                    data.message || "Invalid OTP.",
                    "error"
                );
                setTimeout(hideToast, 3000);
                return;
            }

            localStorage.setItem(
                "session_token",
                data.session_token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            showToast("Login successful!", "success");

            setTimeout(() => {
                hideToast();
                window.location.reload();
            }, 800);

        } catch (err) {

            console.error(err);
            setIsVerifying(false);

            showToast("Server connection failed.", "error");
            setTimeout(hideToast, 3000);
        }
    };


    return (

        <div className="lg-container">

            {toast.show && (
                <div
                    className={`login-toast login-toast-${toast.type}`}
                >
                    <div className="login-toast-status">
                        {toast.type === "success" ? (
                            <FiCheckCircle />
                        ) : (
                            <FiXCircle />
                        )}
                    </div>

                    <span className="login-toast-message">
                        {toast.message}
                    </span>
                </div>
            )}


            <div className="lg-orb">

                <div className="lg-content">

                    <div className="lg-brand">
                        <h1>HEEPIT LOGIN</h1>
                        <p className="lg-subtitle">
                            Sign in with your email
                        </p>
                    </div>


                    <div className="lg-form">

                        <label className="lg-label">
                            Email Address
                        </label>

                        <div className="lg-phone-box">

                            <FiMail className="lg-input-icon" />

                            <input
                                type="email"
                                className="lg-input"
                                placeholder="Enter your email"
                                value={email}
                                disabled={isSending || isVerifying || otpSent}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />

                        </div>


                        {!otpSent && (
                            <button
                                className={`lg-btn ${email.includes("@") && !isSending
                                        ? "lg-btn-active"
                                        : "lg-btn-disabled"
                                    }`}
                                onClick={handleSendOtp}
                                disabled={!email.includes("@") || isSending}
                            >
                                {isSending ? "SENDING OTP..." : "SEND OTP"}
                            </button>
                        )}


                        {otpSent && (
                            <>

                                <label className="lg-label">
                                    Enter OTP
                                </label>

                                <div className="lg-phone-box">

                                    <FiMail className="lg-input-icon" />

                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        className="lg-input"
                                        placeholder="Enter 6 digit OTP"
                                        value={otp}
                                        disabled={isVerifying}
                                        onChange={(e) =>
                                            setOtp(
                                                e.target.value
                                                    .replace(/\D/g, "")
                                            )
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleVerifyOtp();
                                            }
                                        }}
                                    />

                                </div>


                                {isVerifying && (
                                    <div className="lg-checking-status">
                                        <FiLoader />
                                        <span>VERIFYING...</span>
                                    </div>
                                )}


                                <button
                                    className={`lg-btn ${otp.length === 6 && !isVerifying
                                            ? "lg-btn-active"
                                            : "lg-btn-disabled"
                                        }`}
                                    onClick={handleVerifyOtp}
                                    disabled={otp.length !== 6 || isVerifying}
                                >
                                    {isVerifying ? "VERIFYING..." : "VERIFY & LOGIN"}
                                </button>


                                <button
                                    className="lg-register-btn"
                                    onClick={() => {
                                        setOtp("");
                                        setOtpSent(false);
                                    }}
                                    disabled={isVerifying}
                                >
                                    Change email
                                </button>

                            </>
                        )}

                    </div>

                </div>

            </div>


            <div className="lg-footer">
                <p>
                    By continuing, you agree to our
                    <br />
                    Terms & Privacy Policy.
                </p>
            </div>

        </div>
    );
}

export default Login;