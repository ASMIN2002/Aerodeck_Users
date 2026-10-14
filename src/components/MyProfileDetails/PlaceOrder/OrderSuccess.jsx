import { useEffect, useRef, useState, useMemo } from "react";
import "./OrderSuccess.css";

const PROCESSING_STEPS = [
    "Verifying order details",
    "Verifying Your Address",
    "Reserving your items",
    "Preparing dispatch",
];

const STEP_DELAYS = [600, 1400, 2200, 3000];
const FINAL_DELAY = 3800;
const AUDIO_DELAY = 300;
const AUDIO_VOLUME = 0.7;

const FIREWORK_COLORS = [
    "#a29bfe",
    "#ff2d55",
    "#00cec9",
    "#fdcb6e",
    "#fd79a8",
    "#74b9ff",
];

function generateOrderId() {
    return "AD" + Math.floor(100000 + Math.random() * 900000);
}

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function OrderSuccess({ setProfilePage }) {
    const [stage, setStage] = useState("processing");
    const [currentStep, setCurrentStep] = useState(0);
    const audioRef = useRef(null);

    const orderId = useMemo(() => generateOrderId(), []);

    useEffect(() => {
        const timers = STEP_DELAYS.map((delay, i) =>
            setTimeout(() => setCurrentStep(i + 1), delay)
        );

        const finalTimer = setTimeout(() => setStage("success"), FINAL_DELAY);

        return () => {
            timers.forEach(clearTimeout);
            clearTimeout(finalTimer);
        };
    }, []);

    useEffect(() => {
        if (stage !== "success") return;

        const soundTimer = setTimeout(() => {
            const audio = audioRef.current;
            if (!audio) return;

            audio.volume = AUDIO_VOLUME;
            audio.currentTime = 0;
            audio.play().catch((err) => {
                console.error("Audio play blocked:", err.message);
            });
        }, AUDIO_DELAY);

        return () => clearTimeout(soundTimer);
    }, [stage]);

    if (stage === "processing") {
        return (
            <div className="order-success-page processing-page">
                <div className="processing-loader">
                    <div className="loader-ring" />
                    <div className="loader-ring" />
                    <div className="loader-ring" />
                    <div className="loader-icon">📦</div>
                </div>

                <h1 className="processing-title">Placing Your Order</h1>
                <p className="processing-subtitle">
                    Please wait while we confirm your order...
                </p>

                <div className="processing-steps">
                    {PROCESSING_STEPS.map((step, i) => {
                        const cls =
                            i < currentStep
                                ? "step-done"
                                : i === currentStep
                                    ? "step-active"
                                    : "";

                        return (
                            <div
                                key={i}
                                className={`processing-step ${cls}`}
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className="step-icon">
                                    {i < currentStep
                                        ? "✓"
                                        : i === currentStep
                                            ? "•"
                                            : ""}
                                </div>
                                <span>{step}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="processing-bar">
                    <div
                        className="processing-bar-fill"
                        style={{
                            width: `${(currentStep / PROCESSING_STEPS.length) * 100}%`,
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="order-success-page success-page">
            <audio ref={audioRef} src="/sounds/success.mp3" preload="auto" />

            <div className="fireworks-bg">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="firework"
                        style={{
                            "--x": `${15 + i * 15}%`,
                            "--y": `${10 + (i % 3) * 20}%`,
                            "--delay": `${i * 0.4}s`,
                            "--color": FIREWORK_COLORS[i],
                        }}
                    >
                        {[...Array(12)].map((_, j) => (
                            <span
                                key={j}
                                className="firework-particle"
                                style={{
                                    "--angle": `${j * 30}deg`,
                                    "--distance": `${60 + Math.random() * 40}px`,
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>

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
                            "--sway": `${randomBetween(-20, 20)}px`,
                        }}
                    />
                ))}
            </div>

            <div className="balloons-bg">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className={`balloon balloon-${i % 4}`}
                        style={{
                            "--x": `${5 + i * 12}%`,
                            "--delay": `${i * 0.6}s`,
                            "--duration": `${6 + Math.random() * 2}s`,
                            "--sway": `${randomBetween(-20, 20)}`,
                        }}
                    >
                        🎈
                    </div>
                ))}
            </div>

            <div className="sparkle-burst">
                {[...Array(24)].map((_, i) => (
                    <span
                        key={i}
                        className="sparkle-star"
                        style={{
                            "--angle": `${i * 15}deg`,
                            "--distance": `${100 + Math.random() * 50}px`,
                            "--delay": `${1 + i * 0.05}s`,
                        }}
                    />
                ))}
            </div>

            <div className="success-circle">
                <svg viewBox="0 0 52 52" className="success-check-svg">
                    <circle className="check-circle" cx="26" cy="26" r="24" fill="none" />
                    <path className="check-path" fill="none" d="M14 27 L22 35 L38 18" />
                </svg>
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

            <h1 className="success-title">🎉 Order Placed Successfully! 🎉</h1>
            <p className="success-subtitle">
                Thank you for shopping with HEEPPIT.
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