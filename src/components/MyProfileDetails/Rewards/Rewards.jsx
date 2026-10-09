import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Rewards.css";
import { API } from "../../../services/api";

/* ============================================
   MASK EMAIL
   ============================================ */
function maskEmail(email) {

    if (!email || !email.includes("@")) return email || "";

    const [local, domain] = email.split("@");

    const visibleCount = Math.max(1, Math.floor(local.length / 2));
    const starsCount = local.length - visibleCount;

    const visible = local.slice(0, visibleCount);
    const stars = "*".repeat(starsCount);

    return `${visible}${stars}@${domain}`;

}

/* ============================================
   SCRATCH BOX
   ============================================ */
function ScratchBox({ number, onReveal, disabled }) {

    const [isRevealed, setIsRevealed] = useState(false);
    const [isScratching, setIsScratching] = useState(false);

    const handleTouch = () => {

        if (isRevealed || isScratching || disabled) return;

        setIsScratching(true);

        setTimeout(() => {
            setIsRevealed(true);
            onReveal(number);
        }, 900);

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

/* ============================================
   GENERATE BOXES
   ============================================ */
function generateBoxes() {

    const values = [1, 2, 3, 4, 5, 6];

    for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
    }

    return values;

}

/* ============================================
   REWARDS PAGE
   ============================================ */
function Rewards({ setProfilePage }) {

    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("rewards");

    const [hypoPoints, setHypoPoints] = useState(0);
    const [count, setCount] = useState(0);

    const [boxes, setBoxes] = useState([]);
    const [revealed, setRevealed] = useState({});
    const [showCongrats, setShowCongrats] = useState(null);
    const [showHelp, setShowHelp] = useState(false);
    const [resetKey, setResetKey] = useState(0);

    const [demoBoxes, setDemoBoxes] = useState([]);
    const [demoRevealed, setDemoRevealed] = useState({});
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

    const helpBoxRef = useRef(null);

    /* ============================================
       FETCH REWARDS
       ============================================ */
    useEffect(() => {

        async function loadRewards() {

            try {

                const sessionToken = localStorage.getItem("session_token");

                const response = await fetch(
                    `${API}/api/user/rewards?session_token=${sessionToken}`
                );
                const data = await response.json();

                if (data.success && data.data) {
                    setHypoPoints(data.data.hypo_points || 0);
                    setCount(data.data.count || 0);
                    setUsedOwnerId(data.data.used_owner_id || 0);
                    setUsedOwnerEmail(data.data.used_owner_email || "");
                    setUsedUpdatedAt(data.data.used_updated_at || null);
                    setUsedRedeemed(data.data.used_redeemed || 0);
                }

            } catch (err) {
                console.error(err);
            }

        }

        loadRewards();

    }, []);

    /* ============================================
       INITIAL BOXES
       ============================================ */
    useEffect(() => {
        setBoxes(generateBoxes());
        setDemoBoxes(generateBoxes());
    }, []);

    /* ============================================
       CLICK OUTSIDE HELP
       ============================================ */
    useEffect(() => {

        function handleClickOutside(e) {
            if (helpBoxRef.current && !helpBoxRef.current.contains(e.target)) {
                setShowHelp(false);
            }
        }

        if (showHelp) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };

    }, [showHelp]);

    /* ============================================
       COUNTDOWN — sirf jab usedRedeemed === 0
       ============================================ */
    useEffect(() => {

        if (usedOwnerId <= 0 || usedRedeemed === 1 || !usedUpdatedAt) {
            setCountdown("");
            return;
        }

        const expiry = new Date(usedUpdatedAt).getTime() + 24 * 60 * 60 * 1000;

        const tick = () => {

            const diff = expiry - Date.now();

            if (diff <= 0) {
                setCountdown("Expired");
                window.location.reload();
                return;
            }

            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);

            setCountdown(
                `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
            );

        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);

    }, [usedOwnerId, usedRedeemed, usedUpdatedAt]);

    /* ============================================
       RESET AFTER SCRATCH — REAL
       ============================================ */
    useEffect(() => {

        if (Object.keys(revealed).length === 0) return;

        const timer = setTimeout(() => {
            setRevealed({});
            setBoxes(generateBoxes());
            setResetKey((k) => k + 1);
        }, 2800);

        return () => clearTimeout(timer);

    }, [revealed]);

    /* ============================================
       RESET AFTER SCRATCH — DEMO
       ============================================ */
    useEffect(() => {

        if (Object.keys(demoRevealed).length === 0) return;

        const timer = setTimeout(() => {
            setDemoRevealed({});
            setDemoBoxes(generateBoxes());
            setDemoResetKey((k) => k + 1);
        }, 2800);

        return () => clearTimeout(timer);

    }, [demoRevealed]);

    /* ============================================
       SCRATCH — REWARDS
       ============================================ */
    const handleScratch = async (index, number) => {

        if (revealed[index]) return;
        if (count <= 0) return;
        if (Object.keys(revealed).length > 0) return;

        const pointsToAdd = Number(number) || 0;

        setRevealed({ [index]: true });

        const sessionToken = localStorage.getItem("session_token");

        try {

            const response = await fetch(
                `${API}/api/user/rewards/scratch`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        session_token: sessionToken,
                        number: pointsToAdd
                    })
                }
            );

            const data = await response.json();

            if (!data.success) return;

            setHypoPoints(data.total_points);
            setCount(data.remaining_count);

            setShowCongrats({ number, points: pointsToAdd });
            setTimeout(() => setShowCongrats(null), 2500);

        } catch (err) {
            console.error(err);
        }

    };

    /* ============================================
       SCRATCH — DEMO
       ============================================ */
    const handleDemoScratch = (index, number) => {

        if (demoRevealed[index]) return;
        if (Object.keys(demoRevealed).length > 0) return;

        const pointsToAdd = Number(number) || 0;

        setDemoRevealed({ [index]: true });
        setDemoPoints((prev) => prev + pointsToAdd);

        setDemoShowCongrats({ number, points: pointsToAdd });
        setTimeout(() => setDemoShowCongrats(null), 2500);

    };

    /* ============================================
       SEND REDEEM REQUEST
       ============================================ */
    const handleSendRequest = async () => {

        if (!promoInput.trim()) {
            setSendMsg("Enter a promo code.");
            setSendMsgType("error");
            setTimeout(() => setSendMsg(""), 2500);
            return;
        }

        setIsChecking(true);
        setSendMsg("");
        setSendMsgType("");

        try {

            const sessionToken = localStorage.getItem("session_token");

            await new Promise(resolve => setTimeout(resolve, 1800));

            const res = await fetch(
                `${API}/api/user/rewards/redeem/send`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        session_token: sessionToken,
                        promo_code: promoInput.trim()
                    })
                }
            );

            const data = await res.json();

            if (data.success) {

                setPromoInput("");

                const rewardRes = await fetch(
                    `${API}/api/user/rewards?session_token=${sessionToken}`
                );
                const rewardData = await rewardRes.json();

                if (rewardData.success && rewardData.data) {
                    setUsedOwnerId(rewardData.data.used_owner_id || 0);
                    setUsedOwnerEmail(rewardData.data.used_owner_email || "");
                    setUsedUpdatedAt(rewardData.data.used_updated_at || null);
                    setUsedRedeemed(rewardData.data.used_redeemed || 0);
                }

            } else {

                setSendMsg(data.message || "Failed");
                setSendMsgType("error");
                setTimeout(() => setSendMsg(""), 3000);

            }

        } catch (err) {
            console.error(err);
            setSendMsg("Failed to send request.");
            setSendMsgType("error");
            setTimeout(() => setSendMsg(""), 3000);
        } finally {
            setIsChecking(false);
        }

    };

    const handleBack = () => {
        setProfilePage("profile");
        navigate(-1);
    };

    return (

        <div className={`my-rewards ${activeTab === "demo" ? "demo-mode" : ""}`}>

            <div className="my-rewards-header">
                <button className="my-rewards-back" onClick={handleBack}>
                    ←
                </button>
                <h2>HYPO REWARD</h2>
            </div>

            <div className="my-rewards-tabs">
                <button
                    className={`my-rewards-tab ${activeTab === "rewards" ? "active" : ""}`}
                    onClick={() => setActiveTab("rewards")}
                >
                    REWARDS
                </button>
                <button
                    className={`my-rewards-tab ${activeTab === "demo" ? "active" : ""}`}
                    onClick={() => setActiveTab("demo")}
                >
                    DEMO
                </button>
                <button
                    className={`my-rewards-tab ${activeTab === "redeem" ? "active" : ""}`}
                    onClick={() => setActiveTab("redeem")}
                >
                    REDEEM
                </button>
            </div>

            {activeTab === "rewards" && (

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
                            <div className="rewards-help-row">
                                <span className="help-num">1</span>
                                <span>30% chance — 1 point</span>
                            </div>
                            <div className="rewards-help-row">
                                <span className="help-num">2</span>
                                <span>25% chance — 2 points</span>
                            </div>
                            <div className="rewards-help-row">
                                <span className="help-num">3</span>
                                <span>20% chance — 3 points</span>
                            </div>
                            <div className="rewards-help-row">
                                <span className="help-num">4</span>
                                <span>12% chance — 4 points</span>
                            </div>
                            <div className="rewards-help-row">
                                <span className="help-num">5</span>
                                <span>8% chance — 5 points</span>
                            </div>
                            <div className="rewards-help-row">
                                <span className="help-num">6</span>
                                <span>5% chance — 6 points</span>
                            </div>
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

                            <div className="terms-item">
                                <span className="terms-dot" />
                                <span>
                                    Chances are earned only when your order is
                                    <strong> above ₹250</strong> —
                                    <strong> 1 chance for every ₹250</strong>.
                                </span>
                            </div>

                            <div className="terms-item">
                                <span className="terms-dot" />
                                <span>
                                    <strong>Every 10 points</strong> converts to
                                    <strong> ₹1</strong> (100 points = ₹10).
                                </span>
                            </div>

                            <div className="terms-item">
                                <span className="terms-dot" />
                                <span>
                                    You can redeem only when you have a
                                    <strong> minimum of 100 points</strong>.
                                </span>
                            </div>

                            <div className="terms-item">
                                <span className="terms-dot" />
                                <span>
                                    <strong>Every referral</strong> gives you
                                    <strong> 40 points</strong>.
                                </span>
                            </div>

                            <div className="terms-item">
                                <span className="terms-dot" />
                                <span>
                                    <strong>New users</strong> get
                                    <strong> 10 points free</strong>.
                                </span>
                            </div>

                            <div className="terms-item">
                                <span className="terms-dot" />
                                <span>
                                    Chances are <strong>activated only after</strong> your
                                    <strong> return date is completed</strong> — until then,
                                    <strong> stay happy</strong> 😊
                                </span>
                            </div>

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
                                <p className="rewards-congrats-points">
                                    +{showCongrats.points}
                                </p>
                            </div>
                        </div>
                    )}

                </div>

            )}

            {activeTab === "demo" && (

                <div className="demo-section">

                    <div className="rewards-topbar">
                        <div className="rewards-stat">
                            <span className="rewards-label">Demo Points</span>
                            <span className="rewards-value demo-points">{demoPoints}</span>
                        </div>
                    </div>

                    <div className="scratch-notice demo-notice">
                        <span className="notice-dot" />
                        Just touch to scratch — Demo
                    </div>

                    <div className="scratch-card demo-scratch">

                        <div className="scratch-grid">
                            {demoBoxes.map((num, index) => (
                                <ScratchBox
                                    key={`${demoResetKey}-${index}`}
                                    number={num}
                                    disabled={Object.keys(demoRevealed).length > 0}
                                    onReveal={() => handleDemoScratch(index, num)}
                                />
                            ))}
                        </div>

                    </div>

                    <div className="demo-notice-box">

                        <div className="demo-notice-title">
                            <span className="demo-notice-icon">🎮</span>
                            <span>Demo Mode</span>
                        </div>

                        <p>
                            This is just for <strong>entertainment</strong>.
                            Points earned here are <strong>not saved</strong> to your
                            real HYPO account.
                        </p>

                        <div className="demo-notice-footer">
                            Thank you for using <strong>HEEPIT</strong> ❤️
                        </div>

                    </div>

                    {demoShowCongrats && (
                        <div className="rewards-congrats demo-congrats">
                            <div className="rewards-congrats-inner">
                                <div className="rewards-congrats-emoji">🎉</div>
                                <h3>Nice!</h3>
                                <p className="rewards-congrats-points">
                                    +{demoShowCongrats.points}
                                </p>
                            </div>
                        </div>
                    )}

                </div>

            )}

            {activeTab === "redeem" && (

                <div className="redeem-section">

                    {usedOwnerId > 0 ? (

                        usedRedeemed === 1 ? (

                            /* ✅ APPROVED */
                            <div className="redeem-approved-box">

                                <div className="redeem-approved-icon">🎉</div>

                                <p className="redeem-approved-text">
                                    <strong>{maskEmail(usedOwnerEmail)}</strong>
                                    {" "}approved your request.<br />
                                    You Got 10 Hypo Points Flat.
                                </p>

                                <p className="redeem-approved-footer">
                                    Thank you for using HEEPIT ❤️
                                </p>

                            </div>

                        ) : (

                            /* ⏳ WAITING */
                            <div className="redeem-pending-box">

                                <div className="redeem-pending-icon">⏳</div>

                                <h3 className="redeem-pending-title">
                                    You used the promocode of
                                </h3>

                                <p className="redeem-pending-email">
                                    {maskEmail(usedOwnerEmail)}
                                </p>

                                <p className="redeem-pending-text">
                                    Waiting for response...
                                </p>

                                {countdown && (
                                    <div className="redeem-countdown">
                                        {countdown}
                                    </div>
                                )}

                            </div>

                        )

                    ) : (

                        /* 📝 INPUT FORM */
                        <div className="redeem-input-box">

                            <label className="redeem-label">
                                Enter Promo Code
                            </label>

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
                                    <>
                                        <span className="btn-spinner" />
                                        Checking...
                                    </>
                                ) : (
                                    "Send Request"
                                )}
                            </button>

                            {sendMsg && (
                                <p className={`redeem-msg ${sendMsgType}`}>
                                    {sendMsg}
                                </p>
                            )}

                        </div>

                    )}

                </div>

            )}

        </div>
    );

}

export default Rewards;