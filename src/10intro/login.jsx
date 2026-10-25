import { useState } from "react";
import { FiMail, FiCheckCircle, FiXCircle, FiLoader, FiArrowLeft, FiKey } from "react-icons/fi";
import { API } from "../services/api";
import "./login.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOAST_DURATION = 3000;

const getSession = () => localStorage.getItem("session_token");

function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), TOAST_DURATION);
    };

    const handleSendOtp = async () => {
        const cleanEmail = email.trim().toLowerCase();
        if (!EMAIL_REGEX.test(cleanEmail)) return showToast("Please enter a valid email.", "error");

        setIsSending(true);
        try {
            const data = await fetch(`${API}/api/auth/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: cleanEmail }),
            }).then((r) => r.json());

            if (!data.success) return showToast(data.message || "Failed to send OTP.", "error");

            setOtpSent(true);
            showToast("OTP sent to your email.", "success");
        } catch (err) {
            console.error("Send OTP error:", err.message);
            showToast("Server connection failed.", "error");
        } finally {
            setIsSending(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) return showToast("Please enter 6 digit OTP.", "error");

        setIsVerifying(true);
        try {
            const data = await fetch(`${API}/api/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim() }),
            }).then((r) => r.json());

            if (!data.success) return showToast(data.message || "Invalid OTP.", "error");

            localStorage.setItem("session_token", data.session_token);
            localStorage.setItem("user", JSON.stringify(data.user));
            showToast("Login successful!", "success");

            if (onLoginSuccess) {
                try { await onLoginSuccess(); } catch (cbErr) { console.error(cbErr.message); }
            }

            setTimeout(() => { setToast({ show: false, message: "", type: "" }); window.location.reload(); }, 800);
        } catch (err) {
            console.error("Verify OTP error:", err.message);
            showToast("Server connection failed.", "error");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleChangeEmail = () => { setOtp(""); setOtpSent(false); };

    const canSendOtp = EMAIL_REGEX.test(email.trim()) && !isSending;
    const canVerify = otp.length === 6 && !isVerifying;

    return (
        <div className="lg-container">
            {toast.show && (
                <div className={`login-toast login-toast-${toast.type}`}>
                    {toast.type === "success" ? <FiCheckCircle /> : <FiXCircle />}
                    <span>{toast.message}</span>
                </div>
            )}

            <div className="lg-orb">
                <div className="lg-content">
                    <div className="lg-brand">
                        <h1>Welcome to HEEPIT</h1>
                        <p className="lg-subtitle">{otpSent ? "Enter the OTP sent to your email" : "Enter your email to continue"}</p>
                    </div>

                    <div className="lg-form">
                        <label className="lg-label">Email Address</label>
                        <div className="lg-input-wrap">
                            <FiMail className="lg-input-icon" />
                            <input
                                type="email"
                                className="lg-input"
                                placeholder="Enter your email"
                                value={email}
                                disabled={isSending || isVerifying || otpSent}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter" && canSendOtp && !otpSent) handleSendOtp(); }}
                            />
                        </div>

                        {!otpSent && (
                            <button
                                type="button"
                                className={`lg-btn ${canSendOtp ? "lg-btn-active" : "lg-btn-disabled"}`}
                                onClick={handleSendOtp}
                                disabled={!canSendOtp}
                            >
                                {isSending ? <><FiLoader className="lg-spin" /> Sending OTP...</> : "Send OTP"}
                            </button>
                        )}

                        {otpSent && (
                            <>
                                <label className="lg-label">Enter OTP</label>
                                <div className="lg-input-wrap">
                                    <FiKey className="lg-input-icon" />
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        className="lg-input lg-input-otp"
                                        placeholder="6-digit OTP"
                                        value={otp}
                                        disabled={isVerifying}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                        onKeyDown={(e) => { if (e.key === "Enter" && canVerify) handleVerifyOtp(); }}
                                    />
                                </div>

                                <button
                                    type="button"
                                    className={`lg-btn ${canVerify ? "lg-btn-active" : "lg-btn-disabled"}`}
                                    onClick={handleVerifyOtp}
                                    disabled={!canVerify}
                                >
                                    {isVerifying ? <><FiLoader className="lg-spin" /> Verifying...</> : "Verify & Login"}
                                </button>

                                <button type="button" className="lg-change-btn" onClick={handleChangeEmail} disabled={isVerifying}>
                                    <FiArrowLeft /> Change email
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="lg-footer">
                <p>By continuing, you agree to our<br />Terms & Privacy Policy.</p>
            </div>
        </div>
    );
}

export default Login;