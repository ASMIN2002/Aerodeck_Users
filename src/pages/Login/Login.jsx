import { useState } from "react";
import {
    FiPhone,
    FiCheckCircle,
    FiXCircle,
    FiLoader
} from "react-icons/fi";

import "../../styles/Login.css";
import { API } from "../../services/api";


function Login({
    setPage,
    setAuthMode
}) {

    const [mobileNumber, setMobileNumber] = useState("");

    const [isChecking, setIsChecking] =
        useState(false);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: ""
    });


    const showToast = (
        message,
        type = "success"
    ) => {

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

    const handleContinue = async () => {

        if (mobileNumber.length !== 10 || isChecking) {
            return;
        }

        setIsChecking(true);
        hideToast();

        try {

            const response = await fetch(
                `${API}/api/auth/login`,
                {
                    method: "POST",
                    credentials: "include",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        mobile_number: mobileNumber
                    })
                }
            );


            // Response pehle read karo
            const data = await response.json();


            // Checking animation minimum 2 seconds
            await new Promise(resolve =>
                setTimeout(resolve, 2000)
            );


            setIsChecking(false);


            /* ACCOUNT NOT FOUND */

            if (!data.success) {

                showToast(
                    data.message || "Account does not exist.",
                    "error"
                );

                setTimeout(() => {
                    hideToast();
                }, 3000);

                return;
            }


            /* SUCCESS */

            setAuthMode("login");

            localStorage.setItem(
                "mobile_number",
                mobileNumber
            );


            showToast(
                "OTP sent successfully!",
                "success"
            );


            // Success toast ko visible rehne do
            await new Promise(resolve =>
                setTimeout(resolve, 1800)
            );


            hideToast();

            // OTP PAGE
            setPage("otp");

        }

        catch (err) {

            console.error(err);

            setIsChecking(false);

            showToast(
                "Server connection failed.",
                "error"
            );

            setTimeout(() => {
                hideToast();
            }, 3000);

        }

    };


    return (

        <div className="lg-container">


            {/* TOAST */}

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


            {/* LOGIN BOX */}

            <div className="lg-orb">

                <div className="lg-content">


                    <div className="lg-brand">

                        <h1>
                            HEEPIT LOGIN
                        </h1>

                        <p className="lg-subtitle">
                            Sign in to your account
                        </p>

                    </div>


                    <div className="lg-form">


                        <label className="lg-label">
                            Mobile Number
                        </label>


                        {/* PHONE INPUT */}

                        <div
                            className={`lg-phone-box ${isChecking
                                    ? "lg-phone-checking"
                                    : ""
                                }`}
                        >

                            <FiPhone
                                className={`lg-input-icon ${isChecking
                                        ? "lg-phone-icon-checking"
                                        : ""
                                    }`}
                            />


                            <span className="lg-country">
                                +91
                            </span>


                            <input
                                type="tel"
                                className="lg-input"
                                placeholder="Enter mobile number"
                                maxLength={10}
                                value={mobileNumber}
                                disabled={isChecking}
                                onChange={(e) =>
                                    setMobileNumber(
                                        e.target.value.replace(
                                            /\D/g,
                                            ""
                                        )
                                    )
                                }
                            />

                        </div>


                        {/* CHECKING STATUS */}

                        {isChecking && (

                            <div className="lg-checking-status">

                                <FiLoader />

                                <span>
                                    CHECKING ACCOUNT...
                                </span>

                            </div>

                        )}


                        {/* CONTINUE */}

                        <button
                            className={`lg-btn ${mobileNumber.length === 10 &&
                                    !isChecking
                                    ? "lg-btn-active"
                                    : "lg-btn-disabled"
                                }`}

                            onClick={handleContinue}

                            disabled={
                                mobileNumber.length !== 10 ||
                                isChecking
                            }
                        >

                            {isChecking
                                ? "CHECKING..."
                                : "CONTINUE"
                            }

                        </button>


                        <div className="lg-register">

                            <span className="lg-register-text">
                                Don't have an account?
                            </span>

                            <button
                                type="button"
                                className="lg-register-btn"
                                disabled={isChecking}
                                onClick={() =>
                                    setPage("register")
                                }
                            >
                                Sign up
                            </button>

                        </div>


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