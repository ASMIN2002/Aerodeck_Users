import { useState } from "react";
import "../../styles/Register.css";
import { API } from "../../services/api";

function Register({ setPage, setAuthMode }) {

    const [fullName, setFullName] = useState("");

    const [mobileNumber, setMobileNumber] = useState("");

    const handleContinue = async () => {

        if (!fullName.trim()) {

            alert("Please enter your full name.");

            return;

        }

        if (mobileNumber.length !== 10) {

            alert("Please enter a valid mobile number.");

            return;

        }

        try {

            const response = await fetch(

                `${API}/api/auth/register`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        full_name: fullName,

                        mobile_number: mobileNumber

                    })

                }

            );

            const data = await response.json();
          

            if (!data.success) {

                alert(data.message);

                return;

            }

            setAuthMode("register");

            localStorage.setItem(
                "mobile_number",
                mobileNumber
            );

            setPage("otp");

        }

        catch (err) {

            console.error(err);

            alert("Server connection failed.");

        }

    };

    return (

        <div className="rg-container">

            <div className="rg-content">

                <div className="rg-brand">

                    <div className="rg-logo">
                        AD
                    </div>

                    <h1 className="rg-heading">
                        Create Account
                    </h1>

                    <p className="rg-subtitle">
                        Join AERODECK in a few seconds
                    </p>

                </div>

                <div className="rg-form">

                    <div className="rg-field">

                        <label className="rg-label">
                            Full Name
                        </label>

                        <input
                            type="text"
                            className="rg-input"
                            placeholder="Enter Full Name"
                            value={fullName}
                            onChange={(e) =>
                                setFullName(
                                    e.target.value.replace(/[^A-Za-z ]/g, "")
                                )
                            }
                        />

                    </div>

                    <div className="rg-field">

                        <label className="rg-label">
                            Mobile Number
                        </label>

                        <div className="rg-phone-box">

                            <span className="rg-country">
                                +91
                            </span>

                            <input
                                type="tel"
                                className="rg-phone-input"
                                placeholder="Enter Mobile Number"
                                maxLength={10}
                                value={mobileNumber}
                                onChange={(e) =>
                                    setMobileNumber(
                                        e.target.value.replace(/\D/g, "")
                                    )
                                }
                            />

                        </div>

                    </div>

                    <button
                        className="rg-btn"
                        onClick={handleContinue}
                    >
                        Continue
                    </button>

                </div>

                <div className="rg-footer">

                    <span>
                        Already have an account?
                    </span>

                    <button
                        className="rg-login-btn"
                        onClick={() => setPage("login")}
                    >
                        Login
                    </button>

                </div>

            </div>

        </div>

    );

}

export default Register;