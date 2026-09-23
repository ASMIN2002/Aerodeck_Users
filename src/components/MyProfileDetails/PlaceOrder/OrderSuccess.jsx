import { useEffect, useState } from "react";
import "./OrderSuccess.css";

function OrderSuccess({ setProfilePage }) {

    const [stage, setStage] = useState("processing"); // processing → success
    const [currentStep, setCurrentStep] = useState(0);

    const orderId = "AD" + Math.floor(100000 + Math.random() * 900000);

    // Processing steps with timing
    useEffect(() => {
        const steps = [
            { label: "Verifying order details", delay: 600 },
            { label: "Confirming payment", delay: 1400 },
            { label: "Reserving your items", delay: 2200 },
            { label: "Preparing dispatch", delay: 3000 },
        ];

        const timers = steps.map((step, i) =>
            setTimeout(() => setCurrentStep(i + 1), step.delay)
        );

        const finalTimer = setTimeout(() => {
            setStage("success");
        }, 3800);

        return () => {
            timers.forEach(clearTimeout);
            clearTimeout(finalTimer);
        };
    }, []);

    const steps = [
        "Verifying order details",
        "Confirming payment",
        "Reserving your items",
        "Preparing dispatch",
    ];

    /* ==========================================
       STAGE 1 — PROCESSING
       ========================================== */
    if (stage === "processing") {
        return (
            <div className="order-success-page processing-page">

                <div className="processing-loader">
                    <div className="loader-ring"></div>
                    <div className="loader-ring"></div>
                    <div className="loader-ring"></div>
                    <div className="loader-icon">📦</div>
                </div>

                <h1 className="processing-title">
                    Placing Your Order
                </h1>

                <p className="processing-subtitle">
                    Please wait while we confirm your order...
                </p>

                <div className="processing-steps">
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className={`processing-step ${i < currentStep
                                ? "step-done"
                                : i === currentStep
                                    ? "step-active"
                                    : ""
                                }`}
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <div className="step-icon">
                                {i < currentStep ? "✓" : i === currentStep ? "•" : ""}
                            </div>
                            <span>{step}</span>
                        </div>
                    ))}
                </div>

                <div className="processing-bar">
                    <div
                        className="processing-bar-fill"
                        style={{
                            width: `${(currentStep / steps.length) * 100}%`,
                        }}
                    ></div>
                </div>

            </div>
        );
    }

    return (
        <div className="order-success-page success-page">

            
            <div className="fireworks-bg">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="firework"
                        style={{
                            "--x": `${15 + (i * 15)}%`,
                            "--y": `${10 + (i % 3) * 20}%`,
                            "--delay": `${i * 0.4}s`,
                            "--color": [
                                "#a29bfe", "#ff2d55", "#00cec9",
                                "#fdcb6e", "#fd79a8", "#74b9ff"
                            ][i]
                        }}
                    >
                        {[...Array(12)].map((_, j) => (
                            <span
                                key={j}
                                className="firework-particle"
                                style={{
                                    "--angle": `${j * 30}deg`,
                                    "--distance": `${60 + Math.random() * 40}px`
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* ✅ CONFETTI — Massive blast */}
            <div className="confetti-bg">
                {[...Array(80)].map((_, i) => (
                    <span
                        key={i}
                        className={`confetti confetti-${i % 8}`}
                        style={{
                            "--x": `${Math.random() * 100}%`,
                            "--delay": `${Math.random() * 3}s`,
                            "--duration": `${3 + Math.random() * 3}s`,
                            "--rotate": `${Math.random() * 720}deg`,
                            "--sway": `${Math.random() * 40 - 20}px`
                        }}
                    />
                ))}
            </div>

            {/* ✅ BALLOONS RISING */}
            <div className="balloons-bg">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className={`balloon balloon-${i % 4}`}
                        style={{
                            "--x": `${5 + i * 12}%`,
                            "--delay": `${i * 0.6}s`,
                            "--duration": `${6 + Math.random() * 2}s`,
                            "--sway": `${Math.random() * 40 - 20}`
                        }}
                    >
                        🎈
                    </div>
                ))}
            </div>

            {/* ✅ SPARKLE BURST around checkmark */}
            <div className="sparkle-burst">
                {[...Array(24)].map((_, i) => (
                    <span
                        key={i}
                        className="sparkle-star"
                        style={{
                            "--angle": `${i * 15}deg`,
                            "--distance": `${100 + Math.random() * 50}px`,
                            "--delay": `${1 + i * 0.05}s`
                        }}
                    />
                ))}
            </div>

            {/* ✅ Animated checkmark with GLOW BURST */}
            <div className="success-circle">
                <svg viewBox="0 0 52 52" className="success-check-svg">
                    <circle
                        className="check-circle"
                        cx="26"
                        cy="26"
                        r="24"
                        fill="none"
                    />
                    <path
                        className="check-path"
                        fill="none"
                        d="M14 27 L22 35 L38 18"
                    />
                </svg>

                {/* ✅ Burst rays */}
                <div className="burst-rays">
                    {[...Array(12)].map((_, i) => (
                        <span
                            key={i}
                            className="burst-ray"
                            style={{ "--angle": `${i * 30}deg` }}
                        />
                    ))}
                </div>
            </div>

            <h1 className="success-title">
                🎉 Order Placed Successfully! 🎉
            </h1>

            <p className="success-subtitle">
                Thank you for shopping with HEEPIT.
                <br />
                Your order has been received successfully.
            </p>

            <div className="order-success-card">
                <div className="success-row">
                    <span>Order ID</span>
                    <strong>{orderId}</strong>
                </div>

                <div className="success-row">
                    <span>Payment Status</span>
                    <strong className="paid">COD</strong>
                </div>

                <div className="success-row">
                    <span>Estimated Delivery</span>
                    <strong>5 - 7 Business Days</strong>
                </div>
            </div>

            <div className="success-action">
                <button
                    className="success-btn"
                    onClick={() => setProfilePage("orders")}
                >
                    View My Orders
                </button>

                <button
                    className="back-profile-btn"
                    onClick={() => setProfilePage("profile")}
                >
                    ← Back to Profile
                </button>
            </div>

        </div>
    );
}

export default OrderSuccess;