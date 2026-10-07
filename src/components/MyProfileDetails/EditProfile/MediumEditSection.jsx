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
    const [whatsappInput, setWhatsappInput] = useState("");
    const [mobileInput, setMobileInput] = useState("");
    const [showWhatsappBox, setShowWhatsappBox] = useState(false);
    const [showMobileBox, setShowMobileBox] = useState(false);
    const [savingWhatsapp, setSavingWhatsapp] = useState(false);
    const [savingMobile, setSavingMobile] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const isWhatsappVerified =
        Number(profile?.is_whatsapp_verified) === 1;

    const isMobileVerified =
        Number(profile?.is_mobile_verified) === 1;

    const hasWhatsappNumber =
        !!profile?.whatsapp_number;

    const hasMobileNumber =
        !!profile?.mobile_number;

    useEffect(() => {
        let name = profile?.full_name || "";

        if (name === "HEEPIT USER") {
            name = "";
        }

        setFullName(name);
        setOriginalName(name);
        setEmail(profile?.email || "");
    }, [profile]);

    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [message]);

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

    const handleSaveWhatsapp = async () => {

        const cleanNumber = whatsappInput.replace(/\D/g, "");

        if (cleanNumber.length !== 10) {
            setMessage("WhatsApp number must be 10 digits.");
            setMessageType("error");
            return;
        }

        setSavingWhatsapp(true);
        setMessage("");
        setMessageType("");

        try {
            const response = await fetch(
                `${API}/api/user/update-whatsapp`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        session_token:
                            localStorage.getItem("session_token"),
                        whatsapp_number: cleanNumber
                    })
                }
            );

            const data = await response.json();

            if (data.success) {
                navigateWithLoading(
                    () => {
                        setProfile(data.user);
                        setWhatsappInput("");
                        setShowWhatsappBox(false);

                        setMessage("WhatsApp number saved. Please send the verification message.");
                        setMessageType("success");
                    },
                    "Saving WhatsApp...",
                    500
                );
            } else {
                setMessage(
                    data.message || "Failed to save WhatsApp number."
                );
                setMessageType("error");
            }

        } catch (err) {
            console.error(err);
            setMessage("Server Error.");
            setMessageType("error");
        } finally {
            setSavingWhatsapp(false);
        }
    };

    const handleSaveMobile = async () => {

        const cleanNumber = mobileInput.replace(/\D/g, "");

        if (cleanNumber.length !== 10) {
            setMessage("Mobile number must be 10 digits.");
            setMessageType("error");
            return;
        }

        setSavingMobile(true);
        setMessage("");
        setMessageType("");

        try {
            const response = await fetch(
                `${API}/api/user/update-mobile`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        session_token:
                            localStorage.getItem("session_token"),
                        mobile_number: cleanNumber
                    })
                }
            );

            const data = await response.json();

            if (data.success) {
                navigateWithLoading(
                    () => {
                        setProfile(data.user);
                        setMobileInput("");
                        setShowMobileBox(false);

                        setMessage("Mobile number saved. Please pick up the verification call.");
                        setMessageType("success");
                    },
                    "Saving Mobile...",
                    500
                );
            } else {
                setMessage(
                    data.message || "Failed to save mobile number."
                );
                setMessageType("error");
            }

        } catch (err) {
            console.error(err);
            setMessage("Server Error.");
            setMessageType("error");
        } finally {
            setSavingMobile(false);
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

    return (

        <div className="medium-edit-card">

            {message && (
                <div className={`email-message ${messageType}`}>
                    {message}
                </div>
            )}

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
                        placeholder="Set your name"
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

            <div className="medium-field">

                <label>
                    Email Address
                </label>

                <div className="mobile-box">

                    <span className="mobile-number">
                        {profile?.email || "NOT SET"}
                    </span>

                    {Number(profile?.is_email_verified) === 1 && (
                        <span className="verified">
                            Verified
                        </span>
                    )}

                </div>

            </div>

            <div className="medium-field">

                <label>
                    WhatsApp Number
                </label>

                {isWhatsappVerified ? (

                    <div className="mobile-box">

                        <span className="mobile-number">
                            +91 {profile?.whatsapp_number}
                        </span>

                        <span className="verified">
                            Verified
                        </span>

                    </div>

                ) : (showWhatsappBox || !hasWhatsappNumber) ? (

                    <div className="email-input-row">

                        <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            value={whatsappInput}
                            onChange={(e) =>
                                setWhatsappInput(
                                    e.target.value.replace(/\D/g, "")
                                )
                            }
                            placeholder="Enter 10 digit WhatsApp number"
                            disabled={savingWhatsapp}
                        />

                        <button
                            className="send-otp-btn"
                            onClick={handleSaveWhatsapp}
                            disabled={
                                whatsappInput.length !== 10 ||
                                savingWhatsapp
                            }
                        >
                            {savingWhatsapp ? "SAVING..." : "VERIFY"}
                        </button>

                    </div>

                ) : (

                    <>

                        <div className="mobile-box">

                            <span className="mobile-number">
                                +91 {profile?.whatsapp_number}
                            </span>

                            <button
                                className="change-number-btn"
                                onClick={handleChangeWhatsapp}
                            >
                                CHANGE
                            </button>

                        </div>

                        <div className="verify-instruction">
                            As soon as you got a message from WhatsApp,
                            reply <b>VERIFY</b> for verification.
                        </div>

                    </>

                )}

            </div>

            <div className="medium-field">

                <label>
                    Mobile Number
                </label>

                {isMobileVerified ? (

                    <div className="mobile-box">

                        <span className="mobile-number">
                            +91 {profile?.mobile_number}
                        </span>

                        <span className="verified">
                            Verified
                        </span>

                    </div>

                ) : (showMobileBox || !hasMobileNumber) ? (

                    <div className="email-input-row">

                        <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            value={mobileInput}
                            onChange={(e) =>
                                setMobileInput(
                                    e.target.value.replace(/\D/g, "")
                                )
                            }
                            placeholder="Enter 10 digit mobile number"
                            disabled={savingMobile}
                        />

                        <button
                            className="send-otp-btn"
                            onClick={handleSaveMobile}
                            disabled={
                                mobileInput.length !== 10 ||
                                savingMobile
                            }
                        >
                            {savingMobile ? "SAVING..." : "VERIFY"}
                        </button>

                    </div>

                ) : (

                    <>

                        <div className="mobile-box">

                            <span className="mobile-number">
                                +91 {profile?.mobile_number}
                            </span>

                            <button
                                className="change-number-btn"
                                onClick={handleChangeMobile}
                            >
                                CHANGE
                            </button>

                        </div>

                        <div className="verify-instruction">
                            As soon as you got a call from us,
                            press <b>VERIFY</b> for verification.
                        </div>

                    </>

                )}

            </div>

        </div>

    );

}

export default MediumEditSection;