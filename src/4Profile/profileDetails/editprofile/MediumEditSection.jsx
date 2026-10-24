import { useState, useEffect } from "react";
import { API } from "../../../services/api";
import "./MediumEditSection.css";

const MESSAGE_DURATION = 3000;
const NAME_MIN_LENGTH = 3;
const PHONE_LENGTH = 10;
const NAME_REGEX = /^[A-Za-z ]+$/;
const NAME_INPUT_REGEX = /^[A-Za-z ]*$/;

const getSession = () => localStorage.getItem("session_token");

const updateUserField = (endpoint, field, value) =>
    fetch(`${API}/api/user/${endpoint}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_token: getSession(), [field]: value }),
    }).then((r) => r.json());

const INITIAL_PHONE = {
    whatsapp: { input: "", showBox: false, saving: false },
    mobile: { input: "", showBox: false, saving: false },
};

function MediumEditSection({ profile, setProfile }) {
    const [fullName, setFullName] = useState("");
    const [originalName, setOriginalName] = useState("");
    const [phone, setPhone] = useState(INITIAL_PHONE);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const isWhatsappVerified = Number(profile?.is_whatsapp_verified) === 1;
    const isMobileVerified = Number(profile?.is_mobile_verified) === 1;
    const isEmailVerified = Number(profile?.is_email_verified) === 1;
    const hasWhatsappNumber = !!profile?.whatsapp_number;
    const hasMobileNumber = !!profile?.mobile_number;

    useEffect(() => {
        const name = profile?.full_name === "HEEPIT USER" ? "" : profile?.full_name || "";
        setFullName(name);
        setOriginalName(name);
    }, [profile]);

    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => { setMessage(""); setMessageType(""); }, MESSAGE_DURATION);
        return () => clearTimeout(timer);
    }, [message]);

    const showMessage = (text, type) => { setMessage(text); setMessageType(type); };
    const updatePhone = (type, updates) => setPhone((p) => ({ ...p, [type]: { ...p[type], ...updates } }));

    const handleSaveName = async () => {
        const cleanName = fullName.trim();
        if (!cleanName) return showMessage("Please enter your name.", "error");
        if (!NAME_REGEX.test(cleanName)) return showMessage("Name can contain letters only.", "error");
        if (cleanName.length < NAME_MIN_LENGTH) return showMessage(`Name must be at least ${NAME_MIN_LENGTH} letters.`, "error");
        if (cleanName === originalName.trim()) return;

        try {
            const data = await updateUserField("update-name", "full_name", cleanName);
            if (data.success) {
                setProfile(data.user);
                setFullName(data.user.full_name);
                setOriginalName(data.user.full_name);
                showMessage("Name updated successfully.", "success");
            } else {
                showMessage(data.message || "Failed to update name.", "error");
            }
        } catch (err) {
            console.error("Name update error:", err.message);
            showMessage("Server Error.", "error");
        }
    };

    const handleSavePhone = async (type) => {
        const isWhatsapp = type === "whatsapp";
        const label = isWhatsapp ? "WhatsApp" : "Mobile";
        const current = phone[type];
        const cleanNumber = current.input.replace(/\D/g, "");

        if (cleanNumber.length !== PHONE_LENGTH) {
            return showMessage(`${label} number must be ${PHONE_LENGTH} digits.`, "error");
        }

        updatePhone(type, { saving: true });
        setMessage(""); setMessageType("");

        try {
            const data = await updateUserField(
                isWhatsapp ? "update-whatsapp" : "update-mobile",
                isWhatsapp ? "whatsapp_number" : "mobile_number",
                cleanNumber
            );

            if (data.success) {
                setProfile(data.user);
                updatePhone(type, { input: "", showBox: false });
                showMessage(
                    isWhatsapp
                        ? "WhatsApp number saved. Please send the verification message."
                        : "Mobile number saved. Please pick up the verification call.",
                    "success"
                );
            } else {
                showMessage(data.message || `Failed to save ${label} number.`, "error");
            }
        } catch (err) {
            console.error(`${label} update error:`, err.message);
            showMessage("Server Error.", "error");
        } finally {
            updatePhone(type, { saving: false });
        }
    };

    const renderPhoneField = (type) => {
        const isWhatsapp = type === "whatsapp";
        const isVerified = isWhatsapp ? isWhatsappVerified : isMobileVerified;
        const hasNumber = isWhatsapp ? hasWhatsappNumber : hasMobileNumber;
        const current = phone[type];
        const label = isWhatsapp ? "WhatsApp Number" : "Mobile Number";
        const placeholder = `Enter 10 digit ${isWhatsapp ? "WhatsApp" : "mobile"} number`;
        const verifyMsg = isWhatsapp
            ? "As soon as you got a message from WhatsApp, reply VERIFY for verification."
            : "As soon as you got a call from us, press VERIFY for verification.";
        const profileNumber = isWhatsapp ? profile?.whatsapp_number : profile?.mobile_number;

        return (
            <div className="medium-field" key={type}>
                <label>{label}</label>

                {isVerified ? (
                    <div className="mobile-box">
                        <span className="mobile-number">+91 {profileNumber}</span>
                        <span className="verified">Verified</span>
                    </div>
                ) : current.showBox || !hasNumber ? (
                    <div className="email-input-row">
                        <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={PHONE_LENGTH}
                            value={current.input}
                            onChange={(e) => updatePhone(type, { input: e.target.value.replace(/\D/g, "") })}
                            placeholder={placeholder}
                            disabled={current.saving}
                        />
                        <button
                            className="send-otp-btn"
                            onClick={() => handleSavePhone(type)}
                            disabled={current.input.length !== PHONE_LENGTH || current.saving}
                        >
                            {current.saving ? "SAVING..." : "VERIFY"}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mobile-box">
                            <span className="mobile-number">+91 {profileNumber}</span>
                            <button className="change-number-btn" onClick={() => updatePhone(type, { showBox: true, input: "" })}>
                                CHANGE
                            </button>
                        </div>
                        <div className="verify-instruction">{verifyMsg}</div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="medium-edit-card">
            {message && <div className={`email-message ${messageType}`}>{message}</div>}

            <div className="medium-field">
                <label>Full Name</label>
                <div className="name-input-wrapper">
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => { if (NAME_INPUT_REGEX.test(e.target.value)) setFullName(e.target.value); }}
                        placeholder="Set your name"
                    />
                    {fullName.trim() !== originalName.trim() && (
                        <button
                            className="save-name-btn"
                            onClick={handleSaveName}
                            disabled={!fullName.trim() || fullName.trim().length < NAME_MIN_LENGTH}
                        >
                            Save
                        </button>
                    )}
                </div>
            </div>

            <div className="medium-field">
                <label>Email Address</label>
                <div className="mobile-box">
                    <span className="mobile-number">{profile?.email || "NOT SET"}</span>
                    {isEmailVerified && <span className="verified">Verified</span>}
                </div>
            </div>

            {renderPhoneField("whatsapp")}
            {renderPhoneField("mobile")}
        </div>
    );
}

export default MediumEditSection;