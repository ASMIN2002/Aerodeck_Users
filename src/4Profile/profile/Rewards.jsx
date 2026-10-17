import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../profilestyles/Rewards.css";
import { API } from "../../services/api";

const BOX_COUNT = 6;
const RESET_DELAY = 2800;
const CONGRATS_DELAY = 2500;
const SCRATCH_DELAY = 900;

const HELP_ROWS = [
    { num: 1, text: "30% chance — 1 point" },
    { num: 2, text: "25% chance — 2 points" },
    { num: 3, text: "20% chance — 3 points" },
    { num: 4, text: "12% chance — 4 points" },
    { num: 5, text: "8% chance — 5 points" },
    { num: 6, text: "5% chance — 6 points" },
];

const TERMS = [
    <>Chances are earned only when your order is <strong> above ₹250</strong> —<strong> 1 chance for every ₹250</strong>.</>,
    <><strong>Every 10 points</strong> converts to <strong>₹1</strong> (100 points = ₹10).</>,
    <>You can redeem only when you have a <strong>minimum of 100 points</strong>.</>,
    <><strong>Every referral</strong> gives you <strong>40 points</strong>.</>,
    <><strong>New users</strong> get <strong>10 points free</strong>.</>,
    <>Chances are <strong>activated only after</strong> your <strong>return date is completed</strong> — until then, <strong>stay happy</strong> 😊</>,
];

function getSessionToken() {
    return localStorage.getItem("session_token");
}

function generateBoxes() {
    const values = Array.from({ length: BOX_COUNT }, (_, i) => i + 1);
    for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
    }
    return values;
}

function ScratchBox({ number, onReveal, disabled }) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [isScratching, setIsScratching] = useState(false);

    const handleTouch = () => {
        if (isRevealed || isScratching || disabled) return;
        setIsScratching(true);
        setTimeout(() => {
            setIsRevealed(true);
            onReveal(number);
        }, SCRATCH_DELAY);
    };

    return (
        <div
            className={`scratch-box ${isRevealed ? "revealed" : ""} ${isScratching ? "scratching" : ""}`}
            onClick={handleTouch}
            onTouchStart={handleTouch}
        >
            <div className="scratch-number-layer">
                <span className="scratch-number">{number}</span>
            </div>
            {!isRevealed && (
                <div className="scratch-cover">
                    <div className="scratch-cover-text">SCRATCH</div>
                </div>
            )}
        </div>
    );
}

function Rewards({ setProfilePage }) {
    const navigate = useNavigate();

    const [hypoPoints, setHypoPoints] = useState(0);
    const [count, setCount] = useState(0);

    const [boxes, setBoxes] = useState([]);
    const [revealed, setRevealed] = useState({});
    const [showCongrats, setShowCongrats] = useState(null);
    const [showHelp, setShowHelp] = useState(false);
    const [resetKey, setResetKey] = useState(0);

    const helpBoxRef = useRef(null);

    useEffect(() => {
        const sessionToken = getSessionToken();
        if (!sessionToken) return;

        fetch(`${API}/api/user/rewards?session_token=${sessionToken}`)
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
        setBoxes(generateBoxes());
    }, []);

    useEffect(() => {
        if (!showHelp) return;

        function handleClickOutside(e) {
            if (helpBoxRef.current && !helpBoxRef.current.contains(e.target)) {
                setShowHelp(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [showHelp]);

    useEffect(() => {
        if (Object.keys(revealed).length === 0) return;
        const timer = setTimeout(() => {
            setRevealed({});
            setBoxes(generateBoxes());
            setResetKey((k) => k + 1);
        }, RESET_DELAY);
        return () => clearTimeout(timer);
    }, [revealed]);

    const handleScratch = async (index, number) => {
        if (revealed[index]) return;
        if (count <= 0) return;
        if (Object.keys(revealed).length > 0) return;

        const pointsToAdd = Number(number) || 0;
        setRevealed({ [index]: true });

        try {
            const sessionToken = getSessionToken();
            const res = await fetch(`${API}/api/user/rewards/scratch`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_token: sessionToken,
                    number: pointsToAdd,
                }),
            });
            const data = await res.json();
            if (!data.success) return;

            setHypoPoints(data.total_points);
            setCount(data.remaining_count);
            setShowCongrats({ number, points: pointsToAdd });
            setTimeout(() => setShowCongrats(null), CONGRATS_DELAY);
        } catch (err) {
            console.error("Scratch error:", err.message);
        }
    };

    const handleBack = () => {
        setProfilePage("profile");
        navigate(-1);
    };

    const handleTabClick = (tab) => {
        if (tab === "rewards") return;
        setProfilePage("demoredeem");
    };

    return (
        <div className="my-rewards">
            <div className="my-rewards-header">
                <button className="my-rewards-back" onClick={handleBack}>←</button>
                <h2>HYPO REWARD</h2>
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
                <div className="rewards-topbar">
                    <div className="rewards-stat">
                        <span className="rewards-label">Chances</span>
                        <span className="rewards-value chances">{count}</span>
                    </div>

                    <div className="rewards-stat right">
                        <span className="rewards-label">Points</span>
                        <span className="rewards-value points">{hypoPoints}</span>
                        <button
                            className="rewards-help-btn"
                            onClick={() => setShowHelp(!showHelp)}
                        >
                            ?
                        </button>
                    </div>
                </div>

                {showHelp && (
                    <div className="rewards-help-box" ref={helpBoxRef}>
                        <div className="rewards-help-title">🎯 Reward Chances</div>
                        {HELP_ROWS.map((row) => (
                            <div className="rewards-help-row" key={row.num}>
                                <span className="help-num">{row.num}</span>
                                <span>{row.text}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="scratch-notice">
                    <span className="notice-dot" />
                    Just touch to scratch
                </div>

                <div className={`scratch-card ${count <= 0 ? "locked" : ""}`}>
                    <div className="scratch-grid">
                        {boxes.map((num, index) => (
                            <ScratchBox
                                key={`${resetKey}-${index}`}
                                number={num}
                                disabled={count <= 0 || Object.keys(revealed).length > 0}
                                onReveal={() => handleScratch(index, num)}
                            />
                        ))}
                    </div>

                    {count <= 0 && (
                        <div className="scratch-locked-overlay">
                            <div className="lock-content">
                                <span className="lock-icon">🔒</span>
                                <span className="lock-text">No Chances Left</span>
                                <span className="lock-sub">Shop more to earn chances</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="rewards-terms">
                    <div className="rewards-terms-title">
                        <span className="terms-icon">ℹ️</span>
                        <span>Reward Rules</span>
                    </div>

                    <div className="rewards-terms-list">
                        {TERMS.map((term, i) => (
                            <div className="terms-item" key={i}>
                                <span className="terms-dot" />
                                <span>{term}</span>
                            </div>
                        ))}
                    </div>

                    <div className="rewards-terms-footer">
                        Thank you for using <strong>HEEPIT</strong> ❤️
                    </div>
                </div>

                {showCongrats && (
                    <div className="rewards-congrats">
                        <div className="rewards-congrats-inner">
                            <div className="rewards-congrats-emoji">🎉</div>
                            <h3>Congratulations!</h3>
                            <p className="rewards-congrats-points">+{showCongrats.points}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Rewards;