import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiShield,
    FiArrowRight,
    FiX,
    FiArrowLeft
} from "react-icons/fi";

import "../../styles/Otp.css";
import { API } from "../../services/api";


function Otp({
    setPage,
    setUser,
    setLoginUser,
    authMode
}) {

    const navigate = useNavigate();

    const [otp, setOtp] = useState(
        Array(6).fill("")
    );

    const [isVerifying, setIsVerifying] =
        useState(false);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "error"
    });
    const showToast = (message, type = "error") => {

        setToast({
            show: true,
            message,
            type
        });

        setTimeout(() => {
            setToast(prev => ({
                ...prev,
                show: false
            }));
        }, 3500);

    };

    const inputRefs = useRef([]);

    const mobileNumber =
        localStorage.getItem("mobile_number");


    const handleOtpChange = (value, index) => {

        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];

        newOtp[index] = value;

        setOtp(newOtp);


        if (value && index < 5) {

            inputRefs.current[index + 1]?.focus();

        }

    };


    const handleKeyDown = (e, index) => {

        if (
            e.key === "Backspace" &&
            !otp[index] &&
            index > 0
        ) {

            inputRefs.current[index - 1]?.focus();

        }

    };


    const otpValue = otp.join("");

    const isOtpValid =
        otpValue.length === 6;


    const handleVerify = async () => {

        if (!isOtpValid || isVerifying) {
            return;
        }


        /* START ANIMATION */

        setIsVerifying(true);


        try {

            const url =
                authMode === "register"
                    ? `${API}/api/auth/verify-register-otp`
                    : `${API}/api/auth/verify-login-otp`;


            /*
             API CALL + MINIMUM ANIMATION TIME
            */

            const [response] = await Promise.all([

                fetch(
                    url,
                    {
                        method: "POST",

                        credentials: "include",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            mobile_number:
                                mobileNumber,

                            otp: otpValue
                        })
                    }
                ),

                /*
                 Minimum animation visibility
                */

                new Promise(resolve =>
                    setTimeout(resolve, 3500)
                )

            ]);


            const data =
                await response.json();


            console.log(data);


            if (!data.success) {

                setIsVerifying(false);

                showToast(data.message || "Verification failed.");

                return;

            }


            setUser(data.user);


            localStorage.setItem(
                "session_token",
                data.session_token
            );


            navigate(
                "/home/shop",
                {
                    replace: true
                }
            );

        }

        catch (err) {

            console.error(err);

            setIsVerifying(false);

            showToast("Server connection failed.");

        }

    };


    const handleCancel = () => {

        if (isVerifying) return;

        setPage("login");

    };


    return (
        <>

            <div className="otp-container">

                <div className="otp-orb">

                    <div className="otp-content">


                        {/* ICON */}

                        <div className="otp-icon-wrap">

                            <FiShield />

                        </div>


                        {/* TITLE */}

                        <div className="otp-brand">

                            <h1>
                                Verify your identity
                            </h1>

                            <p>
                                We've sent a verification code to
                            </p>

                            <strong>
                                +91 {mobileNumber}
                            </strong>

                        </div>


                        {/* LABEL */}

                        <div className="otp-label">
                            Enter verification code
                        </div>


                        {/* OTP BOXES */}

                        <div
                            className={`otp-boxes ${isVerifying
                                ? "otp-boxes-verifying"
                                : ""
                                }`}
                        >

                            {otp.map((digit, index) => (

                                <input
                                    key={index}

                                    ref={(el) =>
                                        inputRefs.current[index] = el
                                    }

                                    type="text"

                                    inputMode="numeric"

                                    maxLength="1"

                                    value={digit}

                                    disabled={isVerifying}

                                    onChange={(e) =>
                                        handleOtpChange(
                                            e.target.value,
                                            index
                                        )
                                    }

                                    onKeyDown={(e) =>
                                        handleKeyDown(
                                            e,
                                            index
                                        )
                                    }

                                    className={`otp-digit-input ${isVerifying
                                        ? "otp-verifying-digit"
                                        : ""
                                        }`}
                                />

                            ))}

                        </div>


                        {/* VERIFY BUTTON */}

                        <button
                            type="button"

                            className={`otp-btn ${isOtpValid
                                ? "otp-btn-active"
                                : "otp-btn-disabled"
                                } ${isVerifying
                                    ? "otp-processing"
                                    : ""
                                }`}

                            onClick={handleVerify}

                            disabled={
                                !isOtpValid ||
                                isVerifying
                            }
                        >

                            {isVerifying ? (

                                <>
                                    <span>
                                        VERIFYING
                                    </span>

                                    <span className="otp-loading-dots">
                                        <i></i>
                                        <i></i>
                                        <i></i>
                                    </span>
                                </>

                            ) : (

                                <>
                                    <span>
                                        VERIFY OTP
                                    </span>

                                    <FiArrowRight />
                                </>

                            )}

                        </button>


                        {/* CANCEL */}

                        <button
                            type="button"

                            className="otp-cancel-btn"

                            onClick={handleCancel}

                            disabled={isVerifying}
                        >

                            <FiArrowLeft />

                            Return to Login

                        </button>


                        {/* SECURITY */}

                        <p className="otp-security-text">

                            <FiShield />

                            Your verification is secure

                        </p>


                    </div>

                </div>

            </div>
            {
                toast.show && (
                    <div className={`otp-toast otp-toast-${toast.type}`}>
                        <span className="otp-toast-icon">!</span>

                        <span className="otp-toast-message">
                            {toast.message}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setToast(prev => ({
                                    ...prev,
                                    show: false
                                }))
                            }
                        >
                            ×
                        </button>
                    </div>
                )
            }
        </>

    );

}


export default Otp;