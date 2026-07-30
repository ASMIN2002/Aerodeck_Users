import { useState } from "react";
import "./MainEditSection.css";

function MainEditSection() {

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

                    <span>+91 9876543210</span>

                    <div className="contact-right">

                        <span className="verified">
                            Verified
                        </span>

                        <button
                            onClick={() => {
                                setEditCalling(!editCalling);
                                setOtpCalling(false);
                            }}
                        >
                            Edit
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
                                onClick={()=>{
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

                    <span>+91 9876543210</span>

                    <div className="contact-right">

                        <span className="verified">
                            Verified
                        </span>

                        <button
                            onClick={()=>{
                                setEditWhatsapp(!editWhatsapp);
                                setOtpWhatsapp(false);
                            }}
                        >
                            Edit
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
                                onClick={()=>{
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

                    <span>demo@gmail.com</span>

                    <div className="contact-right">

                        <span className="verified">
                            Verified
                        </span>

                        <button
                            onClick={()=>{
                                setEditEmail(!editEmail);
                                setOtpEmail(false);
                            }}
                        >
                            Edit
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
                                onClick={()=>{
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