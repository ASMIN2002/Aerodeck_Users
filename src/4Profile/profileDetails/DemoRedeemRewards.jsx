import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import "../profileDetailsStyle/DemoRedeemRewards.css";
import { API } from "../../services/api";
const BOX_COUNT = 6;
const COUNTDOWN_HOURS = 24;
const RESET_DELAY = 2800;
const CONGRATS_DELAY = 2500;
const FAKE_LOADING_DELAY = 1800;
const MSG_DURATION = 2500;
const SCRATCH_DELAY = 900;

function getSessionToken() {
    return localStorage.getItem("session_token");
}

function maskEmail(email) {
    if (!email || !email.includes("@")) return email || "";
    const [local, domain] = email.split("@");
    const visibleCount = Math.max(1, Math.floor(local.length / 2));
    const starsCount = local.length - visibleCount;
    return `${local.slice(0, visibleCount)}${"*".repeat(starsCount)}@${domain}`;
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

function DemoRedeemRewards({ setProfilePage }) {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("demo");

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

    useEffect(() => {
        const sessionToken = getSessionToken();
        if (!sessionToken) return;

        fetch(`${API}/api/user/rewards?session_token=${sessionToken}`)
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
        setDemoBoxes(generateBoxes());
    }, []);

    useEffect(() => {
        if (usedOwnerId <= 0 || usedRedeemed === 1 || !usedUpdatedAt) {
            setCountdown("");
            return;
        }

        const expiry =
            new Date(usedUpdatedAt).getTime() + COUNTDOWN_HOURS * 60 * 60 * 1000;

        const tick = () => {
            const diff = expiry - Date.now();
            if (diff <= 0) {
                setCountdown("Expired");
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

    useEffect(() => {
        if (Object.keys(demoRevealed).length === 0) return;
        const timer = setTimeout(() => {
            setDemoRevealed({});
            setDemoBoxes(generateBoxes());
            setDemoResetKey((k) => k + 1);
        }, RESET_DELAY);
        return () => clearTimeout(timer);
    }, [demoRevealed]);

    const handleDemoScratch = (index, number) => {
        if (demoRevealed[index]) return;
        if (Object.keys(demoRevealed).length > 0) return;

        const pointsToAdd = Number(number) || 0;
        setDemoRevealed({ [index]: true });
        setDemoPoints((prev) => prev + pointsToAdd);
        setDemoShowCongrats({ number, points: pointsToAdd });
        setTimeout(() => setDemoShowCongrats(null), CONGRATS_DELAY);
    };

    const handleSendRequest = async () => {
        if (!promoInput.trim()) {
            setSendMsg("Enter a promo code.");
            setSendMsgType("error");
            setTimeout(() => setSendMsg(""), MSG_DURATION);
            return;
        }

        setIsChecking(true);
        setSendMsg("");
        setSendMsgType("");

        try {
            const sessionToken = getSessionToken();

            await new Promise((resolve) => setTimeout(resolve, FAKE_LOADING_DELAY));

            const res = await fetch(`${API}/api/user/rewards/redeem/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_token: sessionToken,
                    promo_code: promoInput.trim(),
                }),
            });
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

    const handleBack = () => {
        setProfilePage("profile");
        navigate(-1);
    };

    const handleTabClick = (tab) => {
        if (tab === "rewards") {
            setProfilePage("rewards");
            return;
        }
        setActiveTab(tab);
    };

    return (
        <div className={`my-rewards ${activeTab === "demo" ? "demo-mode" : ""}`}>
            <div className="my-rewards-header">
                <button className="my-rewards-back" onClick={handleBack}>←</button>
                <h2>HYPO REWARD</h2>
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
                            This is just for <strong>entertainment</strong>. Points earned
                            here are <strong>not saved</strong> to your real HYPO account.
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
                            <div className="redeem-approved-box">
                                <div className="redeem-approved-icon">🎉</div>
                                <p className="redeem-approved-text">
                                    <strong>{maskEmail(usedOwnerEmail)}</strong> approved your
                                    request.
                                    <br />
                                    You Got 10 Hypo Points Flat.
                                </p>
                                <p className="redeem-approved-footer">
                                    Thank you for using HEEPIT ❤️
                                </p>
                            </div>
                        ) : (
                            <div className="redeem-pending-box">
                                <div className="redeem-pending-icon">⏳</div>
                                <h3 className="redeem-pending-title">
                                    You used the promocode of
                                </h3>
                                <p className="redeem-pending-email">
                                    {maskEmail(usedOwnerEmail)}
                                </p>
                                <p className="redeem-pending-text">Waiting for response...</p>
                                {countdown && (
                                    <div className="redeem-countdown">{countdown}</div>
                                )}
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
                                    <>
                                        <span className="btn-spinner" />
                                        Checking...
                                    </>
                                ) : (
                                    "Send Request"
                                )}
                            </button>
                            {sendMsg && <p className={`redeem-msg ${sendMsgType}`}>{sendMsg}</p>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default DemoRedeemRewards;