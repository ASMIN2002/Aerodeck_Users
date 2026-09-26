import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Rewards.css";
import { API } from "../../../services/api";

const SCRATCH_NUMBERS = [1, 2, 3, 4, 5, "Better Luck"];

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

    /* Redeem */
    const [promoInput, setPromoInput] = useState("");
    const [sendMsg, setSendMsg] = useState("");
    const [sendMsgType, setSendMsgType] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [reqUserId, setReqUserId] = useState(0);
    const [redeemed, setRedeemed] = useState(false);

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
                    setReqUserId(data.data.req_userid || 0);
                    setRedeemed(data.data.redeemed === 1);
                }

            } catch (err) {
                console.error(err);
            }

        }

        loadRewards();

    }, []);

    /* ============================================
       GENERATE BOXES
       ============================================ */
    const generateBoxes = () => {
        return [...SCRATCH_NUMBERS]
            .sort(() => Math.random() - 0.5)
            .slice(0, 6);
    };

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
       RESET AFTER SCRATCH
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

        const pointsToAdd =
            typeof number === "number" ? number : 0;

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

        const pointsToAdd =
            typeof number === "number" ? number : 0;

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

                /* Reload rewards */
                const rewardRes = await fetch(
                    `${API}/api/user/rewards?session_token=${sessionToken}`
                );
                const rewardData = await rewardRes.json();

                if (rewardData.success && rewardData.data) {
                    setReqUserId(rewardData.data.req_userid || 0);
                    setRedeemed(rewardData.data.redeemed === 1);
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

            {/* HEADER */}
            <div className="my-rewards-header">
                <button className="my-rewards-back" onClick={handleBack}>
                    ←
                </button>
                <h2>HYPO REWARD</h2>
            </div>

            {/* TABS */}
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

            {/* ============================================
                REWARDS TAB
               ============================================ */}
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
                                <span>1 point</span>
                            </div>
                            <div className="rewards-help-row">
                                <span className="help-num">2</span>
                                <span>2 points</span>
                            </div>
                            <div className="rewards-help-row">
                                <span className="help-num">3</span>
                                <span>3 points</span>
                            </div>
                            <div className="rewards-help-row">
                                <span className="help-num">4</span>
                                <span>4 points</span>
                            </div>
                            <div className="rewards-help-row">
                                <span className="help-num">5</span>
                                <span>5 points</span>
                            </div>
                            <div className="rewards-help-row">
                                <span className="help-num">😢</span>
                                <span>Better luck</span>
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
                                    <strong>Every 100 points</strong> converts to <strong>₹1</strong>.
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
                                    <strong>Every referral</strong> gives you <strong>40 points</strong>.
                                </span>
                            </div>

                            <div className="terms-item">
                                <span className="terms-dot" />
                                <span>
                                    <strong>New users</strong> get <strong>10 points free</strong>.
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
                                <div className="rewards-congrats-emoji">
                                    {typeof showCongrats.number === "number" ? "🎉" : "😢"}
                                </div>
                                <h3>
                                    {typeof showCongrats.number === "number"
                                        ? "Congratulations!"
                                        : "Better Luck Next Time!"}
                                </h3>
                                {showCongrats.points > 0 && (
                                    <p className="rewards-congrats-points">
                                        +{showCongrats.points}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                </div>

            )}

            {/* ============================================
                DEMO TAB
               ============================================ */}
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
                                <div className="rewards-congrats-emoji">
                                    {typeof demoShowCongrats.number === "number" ? "🎉" : "😢"}
                                </div>
                                <h3>
                                    {typeof demoShowCongrats.number === "number"
                                        ? "Nice!"
                                        : "Better Luck!"}
                                </h3>
                                {demoShowCongrats.points > 0 && (
                                    <p className="rewards-congrats-points">
                                        +{demoShowCongrats.points}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                </div>

            )}

            {/* ============================================
                REDEEM TAB
               ============================================ */}
            {activeTab === "redeem" && (

                <div className="redeem-section">

                    {reqUserId > 0 && redeemed ? (

                        /* ============================================
                           ALREADY REDEEMED
                           ============================================ */
                        <div className="redeem-redeemed-box">
                            <div className="redeem-redeemed-icon">🎉</div>

                            <h3 className="redeem-redeemed-title">
                                Already Redeemed
                            </h3>

                            <p className="redeem-redeemed-text">
                                You got <strong>10 HYPO Points</strong>
                            </p>

                            <p className="redeem-redeemed-footer">
                                Congratulations! 🎊
                            </p>
                        </div>

                    ) : (

                        /* ============================================
                           INPUT BOX
                           ============================================ */
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