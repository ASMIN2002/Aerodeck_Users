import { useState } from "react";
import "./MainEditSection.css";

function MainEditSection({
    user,
    setUser
}) {

    const [editCalling, setEditCalling] = useState(false);
    const [otpCalling, setOtpCalling] = useState(false);

    const [editWhatsapp, setEditWhatsapp] = useState(false);
    const [otpWhatsapp, setOtpWhatsapp] = useState(false);

    const [editEmail, setEditEmail] = useState(false);
    const [otpEmail, setOtpEmail] = useState(false);

    return (

        <div className="main-edit-card">

            {/* ================= CALLING ================= */}

            <div className="contact-item">

                <label>Calling Number</label>

                <div className="contact-box">

                    <span>
                        {
                            user?.calling_number
                                ? `+91 ${user.calling_number}`
                                : "Not Added"
                        }
                    </span>

                    <div className="contact-right">

                        {
                            user?.calling_number && (
                                <span className="verified">
                                    Verified
                                </span>
                            )
                        }

                        <button
                            onClick={() => {
                                setEditCalling(!editCalling);
                                setOtpCalling(false);
                            }}
                        >
                            {
                                user?.calling_number
                                    ? "Edit"
                                    : "Add"
                            }
                        </button>

                    </div>

                </div>

                {
                    editCalling &&

                    <div className="dropdown-box">

                        <div className="input-row">

                            <input
                                placeholder="Enter Calling Number"
                            />

                            <button
                                onClick={() => setOtpCalling(true)}
                            >
                                Send OTP
                            </button>

                            <button
                                onClick={() => {
                                    setEditCalling(false);
                                    setOtpCalling(false);
                                }}
                            >
                                Cancel
                            </button>

                        </div>

                        {
                            otpCalling &&

                            <div className="input-row otp-row">

                                <input
                                    placeholder="Enter OTP"
                                />

                                <button>
                                    Verify
                                </button>

                            </div>

                        }

                    </div>

                }

            </div>

            {/* ================= WHATSAPP ================= */}

            <div className="contact-item">

                <label>WhatsApp Number</label>

                <div className="contact-box">

                    <span>
                        {
                            user?.whatsapp_number
                                ? `+91 ${user.whatsapp_number}`
                                : "Not Added"
                        }
                    </span>

                    <div className="contact-right">

                        {
                            user?.whatsapp_number && (
                                <span className="verified">
                                    Verified
                                </span>
                            )
                        }
                        <button
                            onClick={() => {
                                setEditWhatsapp(!editWhatsapp);
                                setOtpWhatsapp(false);
                            }}
                        >
                            {
                                user?.whatsapp_number
                                    ? "Edit"
                                    : "Add"
                            }
                        </button>

                    </div>

                </div>

                {
                    editWhatsapp &&

                    <div className="dropdown-box">

                        <div className="input-row">

                            <input
                                placeholder="Enter WhatsApp Number"
                            />

                            <button
                                onClick={() => setOtpWhatsapp(true)}
                            >
                                Send OTP
                            </button>

                            <button
                                onClick={() => {
                                    setEditWhatsapp(false);
                                    setOtpWhatsapp(false);
                                }}
                            >
                                Cancel
                            </button>

                        </div>

                        {
                            otpWhatsapp &&

                            <div className="input-row otp-row">

                                <input
                                    placeholder="Enter OTP"
                                />

                                <button>
                                    Verify
                                </button>

                            </div>

                        }

                    </div>

                }

            </div>

            {/* ================= EMAIL ================= */}

            <div className="contact-item">

                <label>Email Address</label>

                <div className="contact-box">

                    <span>
                        {
                            user?.email
                                ? user.email
                                : "Not Added"
                        }
                    </span>

                    <div className="contact-right">
                        {
                            user?.email && (
                                <span className="verified">
                                    Verified
                                </span>
                            )
                        }

                        <button
                            onClick={() => {
                                setEditEmail(!editEmail);
                                setOtpEmail(false);
                            }}
                        >
                            {
                                user?.email
                                    ? "Edit"
                                    : "Add"
                            }
                        </button>

                    </div>

                </div>

                {
                    editEmail &&

                    <div className="dropdown-box">

                        <div className="input-row">

                            <input
                                placeholder="Enter Email Address"
                            />

                            <button
                                onClick={() => setOtpEmail(true)}
                            >
                                Send OTP
                            </button>

                            <button
                                onClick={() => {
                                    setEditEmail(false);
                                    setOtpEmail(false);
                                }}
                            >
                                Cancel
                            </button>

                        </div>

                        {
                            otpEmail &&

                            <div className="input-row otp-row">

                                <input
                                    placeholder="Enter OTP"
                                />

                                <button>
                                    Verify
                                </button>

                            </div>

                        }

                    </div>

                }

            </div>

        </div>

    );

}

export default MainEditSection;