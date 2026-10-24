import { useEffect, useRef, useState, useMemo } from "react";
import { FiCheck, FiPackage, FiArrowLeft, FiShoppingBag } from "react-icons/fi";
import "../placeorderstyle/OrderSuccess.css";

const STEPS = ["Verifying details", "Verifying address", "Reserving items", "Preparing dispatch"];
const STEP_DELAYS = [600, 1400, 2200, 3000];
const FINAL_DELAY = 3800;
const AUDIO_DELAY = 300;
const AUDIO_VOLUME = 0.7;

const FIREWORK_COLORS = ["#a29bfe", "#ff2d55", "#00cec9", "#fdcb6e", "#fd79a8", "#74b9ff"];
const CONFETTI_COLORS = ["#ff2d55", "#a29bfe", "#00cec9", "#fdcb6e", "#fd79a8", "#74b9ff", "#55efc4", "#fab1a0"];

const generateOrderId = () => "AD" + Math.floor(100000 + Math.random() * 900000);
const randomBetween = (min, max) => min + Math.random() * (max - min);

function OrderSuccess({ setProfilePage }) {
    const [stage, setStage] = useState("processing");
    const [currentStep, setCurrentStep] = useState(0);
    const audioRef = useRef(null);
    const orderId = useMemo(generateOrderId, []);

    useEffect(() => {
        const timers = STEP_DELAYS.map((delay, i) => setTimeout(() => setCurrentStep(i + 1), delay));
        const finalTimer = setTimeout(() => setStage("success"), FINAL_DELAY);
        return () => { timers.forEach(clearTimeout); clearTimeout(finalTimer); };
    }, []);

    useEffect(() => {
        if (stage !== "success") return;
        const timer = setTimeout(() => {
            const audio = audioRef.current;
            if (!audio) return;
            audio.volume = AUDIO_VOLUME;
            audio.currentTime = 0;
            audio.play().catch((err) => console.error("Audio blocked:", err.message));
        }, AUDIO_DELAY);
        return () => clearTimeout(timer);
    }, [stage]);

    if (stage === "processing") {
        return (
            <div className="osp-page osp-processing">
                <div className="osp-loader">
                    <div className="osp-ring" />
                    <div className="osp-ring" />
                    <div className="osp-ring" />
                    <div className="osp-loader-icon"><FiPackage /></div>
                </div>

                <h1 className="osp-processing-title">Placing Your Order</h1>
                <p className="osp-processing-subtitle">Please wait while we confirm your order...</p>

                <div className="osp-steps">
                    {STEPS.map((step, i) => {
                        const state = i < currentStep ? "done" : i === currentStep ? "active" : "";
                        return (
                            <div key={i} className={`osp-step ${state}`} style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="osp-step-icon">
                                    {i < currentStep ? <FiCheck /> : i === currentStep ? <span className="osp-step-dot" /> : null}
                                </div>
                                <span>{step}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="osp-bar">
                    <div className="osp-bar-fill" style={{ width: `${(currentStep / STEPS.length) * 100}%` }} />
                </div>
            </div>
        );
    }

    return (
        <div className="osp-page osp-success">
            <audio ref={audioRef} src="/sounds/success.mp3" preload="auto" />

            <div className="osp-fireworks">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="osp-firework" style={{ "--x": `${15 + i * 15}%`, "--y": `${10 + (i % 3) * 20}%`, "--delay": `${i * 0.4}s`, "--color": FIREWORK_COLORS[i] }}>
                        {Array.from({ length: 12 }).map((_, j) => (
                            <span key={j} className="osp-firework-particle" style={{ "--angle": `${j * 30}deg`, "--distance": `${60 + Math.random() * 40}px` }} />
                        ))}
                    </div>
                ))}
            </div>

            <div className="osp-confetti">
                {Array.from({ length: 80 }).map((_, i) => (
                    <span key={i} className="osp-confetti-piece" style={{ "--x": `${Math.random() * 100}%`, "--delay": `${Math.random() * 3}s`, "--duration": `${3 + Math.random() * 3}s`, "--rotate": `${Math.random() * 720}deg`, "--sway": `${randomBetween(-20, 20)}px`, "--color": CONFETTI_COLORS[i % CONFETTI_COLORS.length], "--w": `${4 + Math.random() * 4}px`, "--h": `${6 + Math.random() * 6}px` }} />
                ))}
            </div>

            <div className="osp-balloons">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="osp-balloon" style={{ "--x": `${5 + i * 12}%`, "--delay": `${i * 0.6}s`, "--duration": `${6 + Math.random() * 2}s`, "--sway": `${randomBetween(-20, 20)}px`, "--color": CONFETTI_COLORS[i % CONFETTI_COLORS.length] }}>
                        <div className="osp-balloon-body" />
                        <div className="osp-balloon-string" />
                    </div>
                ))}
            </div>

            <div className="osp-sparkles">
                {Array.from({ length: 24 }).map((_, i) => (
                    <span key={i} className="osp-sparkle" style={{ "--angle": `${i * 15}deg`, "--distance": `${100 + Math.random() * 50}px`, "--delay": `${1 + i * 0.05}s` }} />
                ))}
            </div>

            <div className="osp-circle">
                <div className="osp-circle-glow" />
                <svg viewBox="0 0 52 52" className="osp-check-svg">
                    <circle className="osp-check-circle" cx="26" cy="26" r="24" fill="none" />
                    <path className="osp-check-path" fill="none" d="M14 27 L22 35 L38 18" />
                </svg>
                <div className="osp-rays">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <span key={i} className="osp-ray" style={{ "--angle": `${i * 30}deg` }} />
                    ))}
                </div>
            </div>

            <h1 className="osp-title">Order Placed Successfully!</h1>
            <p className="osp-subtitle">
                Thank you for shopping with <strong>HEEPIT</strong>.
                <br />
                Your order has been received.
            </p>

            <div className="osp-card">
                <div className="osp-card-row">
                    <span>Order ID</span>
                    <strong>{orderId}</strong>
                </div>
                <div className="osp-card-divider" />
                <div className="osp-card-row">
                    <span>Payment</span>
                    <strong className="osp-paid">COD</strong>
                </div>
                <div className="osp-card-divider" />
                <div className="osp-card-row">
                    <span>Estimated Delivery</span>
                    <strong>5 – 7 Days</strong>
                </div>
            </div>

            <div className="osp-actions">
                <button className="osp-btn-primary" onClick={() => setProfilePage("orders")}>
                    <FiShoppingBag /> View My Orders
                </button>
                <button className="osp-btn-secondary" onClick={() => setProfilePage("profile")}>
                    <FiArrowLeft /> Back to Profile
                </button>
            </div>
        </div>
    );
}

export default OrderSuccess;