import { useState } from "react";
import "../../styles/Otp.css";
import { API } from "../../services/api";

function Otp({
    setPage,
    setUser,
    authMode
}) {

    const [otp, setOtp] = useState("");

    const mobileNumber =
        localStorage.getItem("mobile_number");

    const handleVerify = async () => {

        if (otp.length !== 6) {

            alert("Please enter a valid OTP.");

            return;

        }

        try {

            const url =
                authMode === "register"
                    ? `${API}/api/auth/verify-register-otp`
                    : `${API}/api/auth/verify-login-otp`;

            const response = await fetch(

                url,

                {

                    method: "POST",

                    credentials: "include",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        mobile_number: mobileNumber,

                        otp

                    })

                }

            );
            const data = await response.json();

            if (!data.success) {

                alert(data.message);

                return;

            }

            setUser(data.user);

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            localStorage.setItem(
                "user_id",
                data.user.user_id
            );

            localStorage.setItem(
                "user_name",
                data.user.full_name
            );

            localStorage.setItem(
                "mobile_number",
                data.user.mobile_number
            );

            setPage("home");

        }

        catch (err) {

            console.error(err);

            alert("Server connection failed.");

        }

    };

    return (

        <div className="otp-container">

            <div className="otp-content">

                <h2>
                    Verify OTP
                </h2>

                <p>
                    OTP sent to
                </p>

                <strong>
                    +91 {mobileNumber}
                </strong>

                <input

                    type="text"

                    className="otp-input"

                    placeholder="Enter 6 Digit OTP"

                    maxLength={6}

                    value={otp}

                    onChange={(e) =>
                        setOtp(
                            e.target.value.replace(/\D/g, "")
                        )
                    }

                />

                <button

                    className="otp-btn"

                    onClick={handleVerify}

                >
                    Verify OTP
                </button>

            </div>

        </div>

    );

}

export default Otp;