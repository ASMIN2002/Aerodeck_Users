import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiArrowLeft, FiGift, FiClock, FiCheckCircle, FiZap,
    FiStar, FiSend, FiLoader,
} from "react-icons/fi";
import { API } from "../../services/api";
import "./DemoRedeemRewards.css";

const BOX_COUNT = 6;
const COUNTDOWN_HOURS = 24;
const RESET_DELAY = 2200;
const CONGRATS_DELAY = 2200;
const MSG_DURATION = 2500;
const SCRATCH_ANIM = 1200;

const getSession = () => localStorage.getItem("session_token");

const maskEmail = (email) => {
    if (!email?.includes("@")) return email || "";
    const [local, domain] = email.split("@");
    const visible = Math.max(1, Math.floor(local.length / 2));
    return `${local.slice(0, visible)}${"*".repeat(local.length - visible)}@${domain}`;
};

const generateBoxes = () => {
    const values = Array.from({ length: BOX_COUNT }, (_, i) => i + 1);
    for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
    }
    return values;
};

const formatCountdown = (ms) => {
    if (ms <= 0) return "Expired";
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

function ScratchBox({ number, onScratch, disabled }) {
    return (
        <button
            type="button"
            className="scratch-box demo-scratch-box"
            onClick={() => onScratch(number)}
            disabled={disabled}
            aria-label={`Scratch box ${number}`}
        >
            <div className="scratch-cover">
                <div className="scratch-cover-shine" />
                <div className="scratch-cover-text">
                    <FiGift />
                    <span>SCRATCH</span>
                </div>
            </div>
        </button>
    );
}

function ScratchModal({ number, onComplete }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const start = Date.now();
        const interval = setInterval(() => {
            const p = Math.min(100, ((Date.now() - start) / SCRATCH_ANIM) * 100);
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setTimeout(onComplete, 900);
            }
        }, 30);
        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="scratch-modal-overlay">
            <div className="scratch-modal-card">
                <div className="scratch-modal-inner demo-modal-inner">
                    <div className="scratch-reveal-number">
                        <FiStar className="scratch-reveal-star" />
                        <span className="scratch-reveal-value">{number}</span>
                        <span className="scratch-reveal-label">points</span>
                    </div>
                    {progress < 100 && (
                        <div className="scratch-modal-cover demo-modal-cover" style={{ width: `${100 - progress}%` }}>
                            <div className="scratch-modal-cover-shine" />
                            <div className="scratch-modal-cover-text">
                                <FiGift />
                                <span>Scratching...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function DemoRedeemRewards({ setProfilePage }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("demo");

    const [demoBoxes, setDemoBoxes] = useState(generateBoxes);
    const [activeScratch, setActiveScratch] = useState(null);
    const [isDemoScratching, setIsDemoScratching] = useState(false);
    const [demoPoints, setDemoPoints] = useState(0);
    const [demoShowCongrats, setDemoShowCongrats] = useState(null);
    const [demoResetKey, setDemoResetKey] = useState(0);

    const [promoInput, setPromoInput] = useState("");
    const [sendMsg, setSendMsg] = useState("");
    const [sendMsgType, setSendMsgType] = useState("");
    const [isChecking, setIsChecking] = useState(false);

    const [usedOwnerId, setUsedOwnerId] = useState(0);
    const [usedOwnerEmail, setUsedOwnerEmail] = useState("");
    const [usedUpdatedAt, setUsedUpdatedAt] = useState(null);
    const [usedRedeemed, setUsedRedeemed] = useState(0);
    const [countdown, setCountdown] = useState("");

    useEffect(() => {
        const token = getSession();
        if (!token) return;
        fetch(`${API}/api/user/rewards?session_token=${token}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.success && data.data) {
                    setUsedOwnerId(data.data.used_owner_id || 0);
                    setUsedOwnerEmail(data.data.used_owner_email || "");
                    setUsedUpdatedAt(data.data.used_updated_at || null);
                    setUsedRedeemed(data.data.used_redeemed || 0);
                }
            })
            .catch((err) => console.error("Rewards load error:", err.message));
    }, []);

    useEffect(() => {
        if (usedOwnerId <= 0 || usedRedeemed === 1 || !usedUpdatedAt) {
            setCountdown("");
            return;
        }
        const expiry = new Date(usedUpdatedAt).getTime() + COUNTDOWN_HOURS * 3600000;
        const tick = () => setCountdown(formatCountdown(expiry - Date.now()));
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [usedOwnerId, usedRedeemed, usedUpdatedAt]);

    const handleDemoScratch = (number) => {
        if (isDemoScratching) return;
        setIsDemoScratching(true);
        setActiveScratch({ number });
    };

    const handleScratchComplete = () => {
        setDemoPoints((prev) => prev + activeScratch.number);
        setDemoShowCongrats({ points: activeScratch.number });
        setActiveScratch(null);
        setTimeout(() => {
            setDemoShowCongrats(null);
            setDemoBoxes(generateBoxes());
            setDemoResetKey((k) => k + 1);
            setIsDemoScratching(false);
        }, CONGRATS_DELAY);
    };

    const handleSendRequest = async () => {
        if (!promoInput.trim()) {
            setSendMsg("Enter a promo code.");
            setSendMsgType("error");
            return setTimeout(() => setSendMsg(""), MSG_DURATION);
        }

        setIsChecking(true);
        setSendMsg("");
        setSendMsgType("");

        try {
            const token = getSession();
            const data = await fetch(`${API}/api/user/rewards/redeem/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: token, promo_code: promoInput.trim() }),
            }).then((r) => r.json());

            if (data.success) {
                setPromoInput("");
                const rewardData = await fetch(`${API}/api/user/rewards?session_token=${token}`).then((r) => r.json());
                if (rewardData.success && rewardData.data) {
                    setUsedOwnerId(rewardData.data.used_owner_id || 0);
                    setUsedOwnerEmail(rewardData.data.used_owner_email || "");
                    setUsedUpdatedAt(rewardData.data.used_updated_at || null);
                    setUsedRedeemed(rewardData.data.used_redeemed || 0);
                }
            } else {
                setSendMsg(data.message || "Failed");
                setSendMsgType("error");
                setTimeout(() => setSendMsg(""), MSG_DURATION);
            }
        } catch (err) {
            console.error("Send request error:", err.message);
            setSendMsg("Failed to send request.");
            setSendMsgType("error");
            setTimeout(() => setSendMsg(""), MSG_DURATION);
        } finally {
            setIsChecking(false);
        }
    };

    const handleBack = () => { setProfilePage("profile"); navigate(-1); };
    const handleTabClick = (tab) => {
        if (tab === "rewards") { setProfilePage("rewards"); return; }
        setActiveTab(tab);
    };

    return (
        <div className={`my-rewards ${activeTab === "demo" ? "demo-mode" : ""}`}>
            <div className="my-rewards-header">
                <button className="my-rewards-back" onClick={handleBack} aria-label="Back">
                    <FiArrowLeft />
                </button>
                <h2 className="my-rewards-title">HYPO Reward</h2>
            </div>

            <div className="my-rewards-tabs">
                {["rewards", "demo", "redeem"].map((tab) => (
                    <button
                        key={tab}
                        className={`my-rewards-tab ${activeTab === tab ? "active" : ""}`}
                        onClick={() => handleTabClick(tab)}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>

            {activeTab === "demo" && (
                <div className="demo-section">
                    <div className="demo-stats-card">
                        <span className="demo-stats-icon"><FiZap /></span>
                        <div className="demo-stats-info">
                            <span className="demo-stats-label">Demo Points</span>
                            <span className="demo-stats-value">{demoPoints}</span>
                        </div>
                    </div>

                    <div className="scratch-notice demo-notice">
                        <span className="notice-dot" />
                        <span>Tap any box — auto scratch & reveal!</span>
                    </div>

                    <div className="scratch-card demo-scratch">
                        <div className="scratch-grid">
                            {demoBoxes.map((num, index) => (
                                <ScratchBox
                                    key={`${demoResetKey}-${index}`}
                                    number={num}
                                    disabled={isDemoScratching}
                                    onScratch={handleDemoScratch}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="demo-notice-box">
                        <div className="demo-notice-title">
                            <FiGift className="demo-notice-icon" />
                            <span>Demo Mode</span>
                        </div>
                        <p>
                            This is just for <strong>entertainment</strong>. Points earned here are <strong>not saved</strong> to your real HYPO account.
                        </p>
                        <div className="demo-notice-footer">
                            Thank you for using <strong>HEEPIT</strong>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "redeem" && (
                <div className="redeem-section">
                    {usedOwnerId > 0 ? (
                        usedRedeemed === 1 ? (
                            <div className="redeem-approved-box">
                                <div className="redeem-approved-icon"><FiCheckCircle /></div>
                                <p className="redeem-approved-text">
                                    <strong>{maskEmail(usedOwnerEmail)}</strong> approved your request.
                                    <br />You got 10 HYPO Points flat.
                                </p>
                                <p className="redeem-approved-footer">Thank you for using HEEPIT</p>
                            </div>
                        ) : (
                            <div className="redeem-pending-box">
                                <div className="redeem-pending-icon"><FiClock /></div>
                                <h3 className="redeem-pending-title">You used the promo code of</h3>
                                <p className="redeem-pending-email">{maskEmail(usedOwnerEmail)}</p>
                                <p className="redeem-pending-text">Waiting for response...</p>
                                {countdown && <div className="redeem-countdown">{countdown}</div>}
                            </div>
                        )
                    ) : (
                        <div className="redeem-input-box">
                            <label className="redeem-label">Enter Promo Code</label>
                            <input
                                type="text"
                                className="redeem-input"
                                placeholder="HE0001HY"
                                value={promoInput}
                                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                                maxLength={10}
                                disabled={isChecking}
                            />
                            <button
                                className={`redeem-send-btn ${isChecking ? "checking" : ""}`}
                                onClick={handleSendRequest}
                                disabled={isChecking}
                            >
                                {isChecking ? (
                                    <><FiLoader className="btn-spin" /> Checking...</>
                                ) : (
                                    <><FiSend /> Send Request</>
                                )}
                            </button>
                            {sendMsg && <p className={`redeem-msg ${sendMsgType}`}>{sendMsg}</p>}
                        </div>
                    )}
                </div>
            )}

            {activeScratch && (
                <ScratchModal
                    number={activeScratch.number}
                    onComplete={handleScratchComplete}
                />
            )}

            {demoShowCongrats && (
                <div className="rewards-congrats demo-congrats">
                    <div className="rewards-congrats-inner">
                        <div className="rewards-congrats-emoji"><FiCheckCircle /></div>
                        <h3>Nice!</h3>
                        <p className="rewards-congrats-points">+{demoShowCongrats.points}</p>
                        <span className="rewards-congrats-sub">demo points added</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DemoRedeemRewards;