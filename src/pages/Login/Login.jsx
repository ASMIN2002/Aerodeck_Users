import { useState } from "react";
import "../../styles/Login.css";
import { API } from "../../services/api";

function Login({
    setPage,
    setAuthMode
}) {
    const [mobileNumber, setMobileNumber] = useState("");
    const handleContinue = async () => {
        if (mobileNumber.length !== 10) {
            alert("Please enter a valid mobile number.");
            return;
        }
        try {
            const response = await fetch(
                `${API}/api/auth/login`,
                {
                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        mobile_number: mobileNumber

                    })

                }

            );

            const data = await response.json();
            if (data.success) {

                alert(`AERODECK Demo OTP\n\n${data.demoOtp}`);

            }

            if (!data.success) {

                alert(data.message);

                return;

            }

            setAuthMode("login");

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

        <div className="lg-container">

            <div className="lg-content">

                <div className="lg-brand">

                    <div className="lg-logo">
                        AD
                    </div>

                    <p className="lg-subtitle">
                        Welcome to AERODECK
                    </p>

                </div>

                <div className="lg-form">

                    <label className="lg-label">
                        Mobile Number
                    </label>

                    <div className="lg-phone-box">

                        <span className="lg-country">
                            +91
                        </span>

                        <input

                            type="tel"

                            className="lg-input"

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

                    <button

                        className="lg-btn"

                        onClick={handleContinue}

                    >
                        Continue
                    </button>

                    <div className="lg-register">

                        <span className="lg-register-text">
                            Don't have an account?
                        </span>

                        <button

                            type="button"

                            className="lg-register-btn"

                            onClick={() => setPage("register")}

                        >
                            Register
                        </button>

                    </div>

                </div>

                <div className="lg-footer">

                    <p>

                        By continuing, you agree to our

                        Terms & Privacy Policy.

                    </p>

                </div>

            </div>

        </div>

    );

}

export default Login;