import { useState } from "react";
import {
    FiUser,
    FiPhone,
    FiArrowRight,
    FiCheck,
    FiLoader,
    FiAlertCircle,
    FiCheckCircle,
    FiXCircle
} from "react-icons/fi";

import "../../styles/Register.css";
import { API } from "../../services/api";


function Register({
    setPage,
    setAuthMode
}) {

    const [fullName, setFullName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);

    const [checkingStep, setCheckingStep] = useState("");
    const [isSendingOtp, setIsSendingOtp] = useState(false);

    const [nameVerified, setNameVerified] = useState(false);
    const [mobileVerified, setMobileVerified] = useState(false);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: ""
    });


    /* ================================
       NAME VALIDATION
    ================================= */

    const trimmedName = fullName.trim();

    const hasValidLength =
        trimmedName.length >= 2 &&
        trimmedName.length <= 20;

    const hasValidCharacters =
        /^[A-Za-z. ]+$/.test(fullName);

    const hasLetters =
        /[A-Za-z]/.test(fullName);

    const nameValid =
        hasValidLength &&
        hasValidCharacters &&
        hasLetters;


    /* ================================
       TOAST
    ================================= */

    const showToast = (message, type = "success") => {

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


    const wait = (time) =>
        new Promise(resolve =>
            setTimeout(resolve, time)
        );


    /* ================================
       INPUT HANDLERS
    ================================= */

    const handleNameChange = (e) => {

        let value = e.target.value;

        /* Maximum 20 characters */
        value = value.slice(0, 20);

        /*
           Allow:
           A-Z
           a-z
           spaces
           .
        */

        value = value.replace(
            /[^A-Za-z. ]/g,
            ""
        );

        setFullName(value);

        /* Reset verification on edit */

        setNameVerified(false);
        setMobileVerified(false);

    };


    const handleMobileChange = (e) => {

        const value = e.target.value
            .replace(/\D/g, "")
            .slice(0, 10);

        setMobileNumber(value);

        setMobileVerified(false);

    };


    /* ================================
       REGISTER FLOW
    ================================= */

    const handleContinue = async () => {

        if (
            checkingStep ||
            isSendingOtp
        ) {
            return;
        }


        /* NAME VALIDATION */

        if (!nameValid) {
            return;
        }


        if (mobileNumber.length !== 10) {
            return;
        }


        if (!isTermsAccepted) {
            return;
        }


        /* =========================
           STEP 1 — CHECK NAME
        ========================= */

        setCheckingStep("name");

        await wait(1400);

        setCheckingStep("");

        setNameVerified(true);

        await wait(350);


        /* =========================
           STEP 2 — CHECK MOBILE
        ========================= */

        setCheckingStep("mobile");

        await wait(1400);

        setCheckingStep("");

        setMobileVerified(true);

        await wait(350);


        /* =========================
           STEP 3 — SENDING OTP
        ========================= */

        setIsSendingOtp(true);


        try {

            const response = await fetch(

                `${API}/api/auth/register`,

                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        full_name: trimmedName,

                        mobile_number: mobileNumber

                    })

                }

            );


            const data = await response.json();


            /* Keep animation visible */

            await wait(1800);


            setIsSendingOtp(false);


            /* ERROR */

            if (!data.success) {

                showToast(
                    data.message ||
                    "Unable to create account.",
                    "error"
                );

                setTimeout(
                    hideToast,
                    3000
                );

                return;

            }


            /* SUCCESS */

            setAuthMode("register");


            localStorage.setItem(
                "mobile_number",
                mobileNumber
            );


            showToast(
                "OTP sent successfully!",
                "success"
            );


            await wait(1500);


            hideToast();

            setPage("otp");


        }

        catch (err) {

            console.error(err);

            setIsSendingOtp(false);

            showToast(
                "Server connection failed.",
                "error"
            );

            setTimeout(
                hideToast,
                3000
            );

        }

    };


    /* ================================
       BUTTON VALIDATION
    ================================= */

    const isFormValid =
        nameValid &&
        mobileNumber.length === 10 &&
        isTermsAccepted;


    const isBusy =
        checkingStep ||
        isSendingOtp;


    return (

        <div className="rg-container">


            {/* =====================
                TOAST
            ====================== */}

            {toast.show && (

                <div
                    className={`rg-toast rg-toast-${toast.type}`}
                >

                    <div className="rg-toast-icon">

                        {toast.type === "success"
                            ? <FiCheckCircle />
                            : <FiXCircle />
                        }

                    </div>

                    <span className="rg-toast-message">
                        {toast.message}
                    </span>

                </div>

            )}


            {/* =====================
                MAIN ORB
            ====================== */}

            <div
                className={`rg-orb ${
                    isSendingOtp
                        ? "rg-orb-sending"
                        : ""
                }`}
            >


                {/* SENDING OVERLAY */}

                {isSendingOtp && (

                    <div className="rg-sending-overlay">

                        <FiLoader />

                        <span>
                            SENDING OTP...
                        </span>

                        <small>
                            Securing your account
                        </small>

                    </div>

                )}


                <div className="rg-content">


                    {/* WELCOME */}

                    <div className="rg-welcome-badge">

                        <span className="rg-welcome-dot"></span>

                        Welcome to <b>HEEPIT</b>

                    </div>


                    {/* BRAND */}

                    <div className="rg-brand">

                        <h1 className="rg-heading">
                            Create Account
                        </h1>

                        <p className="rg-subtitle">
                            Join us and start your journey
                        </p>

                    </div>


                    {/* FORM */}

                    <div className="rg-form">


                        {/* FULL NAME */}

                        <div className="rg-field">

                            <label className="rg-label">
                                Full Name
                            </label>


                            <div
                                className={`rg-input-box
                                    ${
                                        checkingStep === "name"
                                            ? "rg-field-checking"
                                            : ""
                                    }
                                    ${
                                        nameVerified
                                            ? "rg-field-verified"
                                            : ""
                                    }
                                `}
                            >

                                <FiUser className="rg-input-icon" />


                                <input
                                    type="text"
                                    className="rg-input"
                                    placeholder="Enter your name"
                                    value={fullName}
                                    maxLength={20}
                                    disabled={isBusy}
                                    onChange={handleNameChange}
                                />


                                {checkingStep === "name" && (
                                    <FiLoader className="rg-field-loader" />
                                )}


                                {nameVerified &&
                                    checkingStep !== "name" && (

                                    <FiCheck className="rg-field-tick" />

                                )}

                            </div>


                            {/* NAME RULES */}

                            <div className="rg-name-rules">

                                <div
                                    className={
                                        trimmedName.length > 20
                                            ? "rg-rule-error"
                                            : ""
                                    }
                                >
                                    <FiAlertCircle />
                                    Maximum 20 characters
                                </div>


                                <div
                                    className={
                                        fullName &&
                                        !hasValidCharacters
                                            ? "rg-rule-error"
                                            : ""
                                    }
                                >
                                    <FiAlertCircle />
                                    Only letters and "." allowed
                                </div>


                                <div
                                    className={
                                        fullName &&
                                        !hasLetters
                                            ? "rg-rule-error"
                                            : ""
                                    }
                                >
                                    <FiAlertCircle />
                                    Name must contain letters
                                </div>

                            </div>

                        </div>


                        {/* MOBILE NUMBER */}

                        <div className="rg-field">

                            <label className="rg-label">
                                Mobile Number
                            </label>


                            <div
                                className={`rg-phone-box
                                    ${
                                        checkingStep === "mobile"
                                            ? "rg-field-checking"
                                            : ""
                                    }
                                    ${
                                        mobileVerified
                                            ? "rg-field-verified"
                                            : ""
                                    }
                                `}
                            >

                                <FiPhone className="rg-input-icon" />


                                <span className="rg-country">
                                    +91
                                </span>


                                <input
                                    type="tel"
                                    className="rg-phone-input"
                                    placeholder="Enter mobile number"
                                    maxLength={10}
                                    value={mobileNumber}
                                    disabled={isBusy}
                                    onChange={handleMobileChange}
                                />


                                {checkingStep === "mobile" && (

                                    <FiLoader className="rg-field-loader" />

                                )}


                                {mobileVerified &&
                                    checkingStep !== "mobile" && (

                                    <FiCheck className="rg-field-tick" />

                                )}

                            </div>

                        </div>


                        {/* TERMS */}

                        <div className="rg-terms">

                            <label className="rg-checkbox-wrapper">

                                <input
                                    type="checkbox"
                                    checked={isTermsAccepted}
                                    disabled={isBusy}
                                    onChange={(e) =>
                                        setIsTermsAccepted(
                                            e.target.checked
                                        )
                                    }
                                />

                                <span className="rg-custom-checkbox"></span>

                                <span className="rg-terms-text">
                                    I agree with the
                                </span>

                            </label>


                            <button
                                type="button"
                                className="rg-terms-link"
                                disabled={isBusy}
                                onClick={() =>
                                    setPage("terms")
                                }
                            >
                                Terms & Conditions
                            </button>

                        </div>


                        {/* CONTINUE */}

                        <button
                            className={`rg-btn ${
                                isFormValid && !isBusy
                                    ? "rg-btn-active"
                                    : "rg-btn-disabled"
                            }`}
                            onClick={handleContinue}
                            disabled={!isFormValid || isBusy}
                        >

                            <span>

                                {checkingStep === "name"
                                    ? "CHECKING NAME..."
                                    : checkingStep === "mobile"
                                    ? "CHECKING NUMBER..."
                                    : isSendingOtp
                                    ? "SENDING OTP..."
                                    : "CONTINUE"
                                }

                            </span>


                            {!isBusy && (
                                <FiArrowRight className="rg-btn-arrow" />
                            )}

                        </button>


                    </div>


                    {/* LOGIN */}

                    <div className="rg-footer">

                        <span>
                            Already have an account?
                        </span>

                        <button
                            type="button"
                            className="rg-login-btn"
                            disabled={isBusy}
                            onClick={() =>
                                setPage("login")
                            }
                        >
                            Login
                        </button>

                    </div>


                </div>

            </div>

        </div>

    );

}


export default Register;