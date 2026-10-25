import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiArrowLeft, FiHelpCircle, FiGift, FiZap, FiTarget, FiInfo,
    FiLock, FiAward, FiStar, FiHeart, FiX, FiCheckCircle,
} from "react-icons/fi";
import { API } from "../../services/api";
import "../profilestyles/Rewards.css";

const BOX_COUNT = 6;
const RESET_DELAY = 2200;
const CONGRATS_DELAY = 2200;
const SCRATCH_ANIM = 1200;

const HELP_ROWS = [
    { num: 1, chance: "30%", points: 1 },
    { num: 2, chance: "25%", points: 2 },
    { num: 3, chance: "20%", points: 3 },
    { num: 4, chance: "12%", points: 4 },
    { num: 5, chance: "8%", points: 5 },
    { num: 6, chance: "5%", points: 6 },
];

const TERMS = [
    <>Chances are earned only when your order is <strong>above ₹250</strong> — <strong>1 chance for every ₹250</strong>.</>,
    <><strong>Every 10 points</strong> converts to <strong>₹1</strong> (100 points = ₹10).</>,
    <>Redeem only when you have a <strong>minimum of 100 points</strong>.</>,
    <><strong>Every referral</strong> gives you <strong>40 points</strong>.</>,
    <><strong>New users</strong> get <strong>10 points free</strong>.</>,
    <>Chances are <strong>activated only after</strong> your <strong>return date is completed</strong>.</>,
];

const getSession = () => localStorage.getItem("session_token");

const generateBoxes = () => {
    const v = Array.from({ length: BOX_COUNT }, (_, i) => i + 1);
    for (let i = v.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [v[i], v[j]] = [v[j], v[i]];
    }
    return v;
};

function ScratchBox({ number, onScratch, disabled }) {
    return (
        <button
            type="button"
            className="scratch-box"
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

function ScratchModal({ number, points, onComplete }) {
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
                <div className="scratch-modal-inner">
                    <div className="scratch-reveal-number">
                        <FiStar className="scratch-reveal-star" />
                        <span className="scratch-reveal-value">{number}</span>
                        <span className="scratch-reveal-label">points</span>
                    </div>

                    {progress < 100 && (
                        <div className="scratch-modal-cover" style={{ width: `${100 - progress}%` }}>
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

function Rewards({ setProfilePage }) {
    const navigate = useNavigate();
    const [hypoPoints, setHypoPoints] = useState(0);
    const [count, setCount] = useState(0);
    const [boxes, setBoxes] = useState(generateBoxes);
    const [activeScratch, setActiveScratch] = useState(null);
    const [isScratching, setIsScratching] = useState(false);
    const [showCongrats, setShowCongrats] = useState(null);
    const [showHelp, setShowHelp] = useState(false);
    const [resetKey, setResetKey] = useState(0);

    const helpBoxRef = useRef(null);

    useEffect(() => {
        const token = getSession();
        if (!token) return;
        fetch(`${API}/api/user/rewards?session_token=${token}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.success && data.data) {
                    setHypoPoints(data.data.hypo_points || 0);
                    setCount(data.data.count || 0);
                }
            })
            .catch((err) => console.error("Rewards load error:", err.message));
    }, []);

    useEffect(() => {
        if (!showHelp) return;
        const handler = (e) => {
            if (helpBoxRef.current && !helpBoxRef.current.contains(e.target)) setShowHelp(false);
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("touchstart", handler);
        };
    }, [showHelp]);

    const handleScratch = async (number) => {
        if (count <= 0 || isScratching) return;
        setIsScratching(true);
        setActiveScratch({ number, points: number });

        try {
            const data = await fetch(`${API}/api/user/rewards/scratch`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: getSession(), number }),
            }).then((r) => r.json());

            if (data.success) {
                setHypoPoints(data.total_points);
                setCount(data.remaining_count);
            }
        } catch (err) {
            console.error("Scratch error:", err.message);
        }
    };

    const handleScratchComplete = () => {
        setShowCongrats({ points: activeScratch?.points || 0 });
        setActiveScratch(null);
        setTimeout(() => {
            setShowCongrats(null);
            setBoxes(generateBoxes());
            setResetKey((k) => k + 1);
            setIsScratching(false);
        }, CONGRATS_DELAY);
    };

    const handleBack = () => { setProfilePage("profile"); navigate(-1); };
    const handleTabClick = (tab) => { if (tab !== "rewards") setProfilePage("demoredeem"); };

    return (
        <div className="my-rewards">
            <div className="my-rewards-header">
                <button className="my-rewards-back" onClick={handleBack} aria-label="Back">
                    <FiArrowLeft />
                </button>
                <h2 className="my-rewards-title">HYPO Rewards</h2>
            </div>

            <div className="my-rewards-tabs">
                {["rewards", "demo", "redeem"].map((tab) => (
                    <button
                        key={tab}
                        className={`my-rewards-tab ${tab === "rewards" ? "active" : ""}`}
                        onClick={() => handleTabClick(tab)}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="rewards-section">
                <div className="rewards-stats-card">
                    <div className="rewards-stat">
                        <span className="rewards-stat-icon chances"><FiTarget /></span>
                        <div className="rewards-stat-info">
                            <span className="rewards-stat-label">Chances</span>
                            <span className="rewards-stat-value chances">{count}</span>
                        </div>
                    </div>

                    <div className="rewards-stat">
                        <span className="rewards-stat-icon points"><FiAward /></span>
                        <div className="rewards-stat-info">
                            <span className="rewards-stat-label">Points</span>
                            <span className="rewards-stat-value points">{hypoPoints}</span>
                        </div>
                    </div>

                    <button
                        className="rewards-help-btn"
                        onClick={() => setShowHelp(!showHelp)}
                        aria-label="Help"
                    >
                        {showHelp ? <FiX /> : <FiHelpCircle />}
                    </button>
                </div>

                {showHelp && (
                    <div className="rewards-help-box" ref={helpBoxRef}>
                        <div className="rewards-help-title"><FiTarget /> Reward Chances</div>
                        {HELP_ROWS.map((row) => (
                            <div className="rewards-help-row" key={row.num}>
                                <span className="help-num">{row.num}</span>
                                <span className="help-chance">{row.chance}</span>
                                <span className="help-points"><FiStar /> {row.points} pt</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="scratch-notice">
                    <span className="notice-dot" />
                    <span>Tap any box — auto scratch & reveal!</span>
                </div>

                <div className={`scratch-card ${count <= 0 ? "locked" : ""}`}>
                    <div className="scratch-grid">
                        {boxes.map((num, index) => (
                            <ScratchBox
                                key={`${resetKey}-${index}`}
                                number={num}
                                disabled={count <= 0 || isScratching}
                                onScratch={handleScratch}
                            />
                        ))}
                    </div>

                    {count <= 0 && (
                        <div className="scratch-locked-overlay">
                            <div className="lock-content">
                                <FiLock className="lock-icon" />
                                <span className="lock-text">No Chances Left</span>
                                <span className="lock-sub">Shop more to earn chances</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="rewards-terms">
                    <div className="rewards-terms-title"><FiInfo /> Reward Rules</div>
                    <div className="rewards-terms-list">
                        {TERMS.map((term, i) => (
                            <div className="terms-item" key={i}>
                                <span className="terms-dot" />
                                <span>{term}</span>
                            </div>
                        ))}
                    </div>
                    <div className="rewards-terms-footer">
                        Thank you for using <strong>HEEPIT</strong> <FiHeart className="terms-heart" />
                    </div>
                </div>
            </div>

            {activeScratch && (
                <ScratchModal
                    number={activeScratch.number}
                    points={activeScratch.points}
                    onComplete={handleScratchComplete}
                />
            )}

            {showCongrats && (
                <div className="rewards-congrats">
                    <div className="rewards-congrats-inner">
                        <div className="rewards-congrats-emoji"><FiCheckCircle /></div>
                        <h3>Congratulations!</h3>
                        <p className="rewards-congrats-points">+{showCongrats.points}</p>
                        <span className="rewards-congrats-sub">points added</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Rewards;