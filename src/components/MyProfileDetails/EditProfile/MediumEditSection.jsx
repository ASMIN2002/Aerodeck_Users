import "./MediumEditSection.css";
import { useState, useEffect } from "react";
import { API } from "../../../services/api";

const MESSAGE_DURATION = 3000;
const NAV_DELAY = 500;
const NAME_MIN_LENGTH = 3;
const PHONE_LENGTH = 10;

const NAME_REGEX = /^[A-Za-z ]+$/;
const NAME_INPUT_REGEX = /^[A-Za-z ]*$/;

function getSessionToken() {
    return localStorage.getItem("session_token");
}

async function updateUserField(endpoint, field, value) {
    const res = await fetch(`${API}/api/user/${endpoint}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            session_token: getSessionToken(),
            [field]: value,
        }),
    });
    return res.json();
}

function MediumEditSection({ profile, setProfile, navigateWithLoading }) {
    const [fullName, setFullName] = useState("");
    const [originalName, setOriginalName] = useState("");
    const [whatsappInput, setWhatsappInput] = useState("");
    const [mobileInput, setMobileInput] = useState("");
    const [showWhatsappBox, setShowWhatsappBox] = useState(false);
    const [showMobileBox, setShowMobileBox] = useState(false);
    const [savingWhatsapp, setSavingWhatsapp] = useState(false);
    const [savingMobile, setSavingMobile] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const isWhatsappVerified = Number(profile?.is_whatsapp_verified) === 1;
    const isMobileVerified = Number(profile?.is_mobile_verified) === 1;
    const isEmailVerified = Number(profile?.is_email_verified) === 1;

    const hasWhatsappNumber = !!profile?.whatsapp_number;
    const hasMobileNumber = !!profile?.mobile_number;

    useEffect(() => {
        let name = profile?.full_name || "";
        if (name === "HEEPIT USER") name = "";

        setFullName(name);
        setOriginalName(name);
    }, [profile]);

    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, MESSAGE_DURATION);
        return () => clearTimeout(timer);
    }, [message]);

    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
    };

    const handleSaveName = async () => {
        const cleanName = fullName.trim();

        if (!cleanName) return showMessage("Please enter your name.", "error");
        if (!NAME_REGEX.test(cleanName))
            return showMessage("Name can contain letters only.", "error");
        if (cleanName.length < NAME_MIN_LENGTH)
            return showMessage(`Name must be at least ${NAME_MIN_LENGTH} letters.`, "error");
        if (cleanName === originalName.trim()) return;

        try {
            const data = await updateUserField("update-name", "full_name", cleanName);

            if (data.success) {
                navigateWithLoading(
                    () => {
                        setProfile(data.user);
                        setFullName(data.user.full_name);
                        setOriginalName(data.user.full_name);
                        showMessage("Name updated successfully.", "success");
                    },
                    "Updating Name...",
                    NAV_DELAY
                );
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
        const input = isWhatsapp ? whatsappInput : mobileInput;
        const setInput = isWhatsapp ? setWhatsappInput : setMobileInput;
        const setSaving = isWhatsapp ? setSavingWhatsapp : setSavingMobile;
        const setShowBox = isWhatsapp ? setShowWhatsappBox : setShowMobileBox;
        const label = isWhatsapp ? "WhatsApp" : "Mobile";

        const cleanNumber = input.replace(/\D/g, "");

        if (cleanNumber.length !== PHONE_LENGTH) {
            showMessage(`${label} number must be ${PHONE_LENGTH} digits.`, "error");
            return;
        }

        setSaving(true);
        setMessage("");
        setMessageType("");

        try {
            const endpoint = isWhatsapp ? "update-whatsapp" : "update-mobile";
            const field = isWhatsapp ? "whatsapp_number" : "mobile_number";

            const data = await updateUserField(endpoint, field, cleanNumber);

            if (data.success) {
                const successMsg = isWhatsapp
                    ? "WhatsApp number saved. Please send the verification message."
                    : "Mobile number saved. Please pick up the verification call.";

                navigateWithLoading(
                    () => {
                        setProfile(data.user);
                        setInput("");
                        setShowBox(false);
                        showMessage(successMsg, "success");
                    },
                    `Saving ${label}...`,
                    NAV_DELAY
                );
            } else {
                showMessage(
                    data.message || `Failed to save ${label} number.`,
                    "error"
                );
            }
        } catch (err) {
            console.error(`${label} update error:`, err.message);
            showMessage("Server Error.", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleChangeWhatsapp = () => {
        setShowWhatsappBox(true);
        setWhatsappInput("");
    };

    const handleChangeMobile = () => {
        setShowMobileBox(true);
        setMobileInput("");
    };

    const renderPhoneField = (type) => {
        const isWhatsapp = type === "whatsapp";
        const isVerified = isWhatsapp ? isWhatsappVerified : isMobileVerified;
        const hasNumber = isWhatsapp ? hasWhatsappNumber : hasMobileNumber;
        const input = isWhatsapp ? whatsappInput : mobileInput;
        const setInput = isWhatsapp ? setWhatsappInput : setMobileInput;
        const showBox = isWhatsapp ? showWhatsappBox : showMobileBox;
        const saving = isWhatsapp ? savingWhatsapp : savingMobile;
        const profileNumber = isWhatsapp
            ? profile?.whatsapp_number
            : profile?.mobile_number;
        const onChange = isWhatsapp ? handleChangeWhatsapp : handleChangeMobile;

        const label = isWhatsapp ? "WhatsApp Number" : "Mobile Number";
        const placeholder = `Enter 10 digit ${isWhatsapp ? "WhatsApp" : "mobile"} number`;
        const verifyMsg = isWhatsapp
            ? "As soon as you got a message from WhatsApp, reply VERIFY for verification."
            : "As soon as you got a call from us, press VERIFY for verification.";

        return (
            <div className="medium-field">
                <label>{label}</label>

                {isVerified ? (
                    <div className="mobile-box">
                        <span className="mobile-number">+91 {profileNumber}</span>
                        <span className="verified">Verified</span>
                    </div>
                ) : showBox || !hasNumber ? (
                    <div className="email-input-row">
                        <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={PHONE_LENGTH}
                            value={input}
                            onChange={(e) =>
                                setInput(e.target.value.replace(/\D/g, ""))
                            }
                            placeholder={placeholder}
                            disabled={saving}
                        />
                        <button
                            className="send-otp-btn"
                            onClick={() => handleSavePhone(type)}
                            disabled={input.length !== PHONE_LENGTH || saving}
                        >
                            {saving ? "SAVING..." : "VERIFY"}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mobile-box">
                            <span className="mobile-number">+91 {profileNumber}</span>
                            <button
                                className="change-number-btn"
                                onClick={onChange}
                            >
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
            {message && (
                <div className={`email-message ${messageType}`}>{message}</div>
            )}

            <div className="medium-field">
                <label>Full Name</label>

                <div className="name-input-wrapper">
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                            if (NAME_INPUT_REGEX.test(e.target.value)) {
                                setFullName(e.target.value);
                            }
                        }}
                        placeholder="Set your name"
                    />

                    {fullName.trim() !== originalName.trim() && (
                        <button
                            className="save-name-btn"
                            onClick={handleSaveName}
                            disabled={
                                !fullName.trim() ||
                                fullName.trim().length < NAME_MIN_LENGTH
                            }
                        >
                            Save
                        </button>
                    )}
                </div>
            </div>

            <div className="medium-field">
                <label>Email Address</label>
                <div className="mobile-box">
                    <span className="mobile-number">
                        {profile?.email || "NOT SET"}
                    </span>
                    {isEmailVerified && <span className="verified">Verified</span>}
                </div>
            </div>

            {renderPhoneField("whatsapp")}
            {renderPhoneField("mobile")}
        </div>
    );
}

export default MediumEditSection;