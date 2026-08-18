import { useEffect, useState } from "react";
import "./Reward.css";
import { API } from "../../../services/api";

function Reward({ setProfilePage }) {

    const UNLOCK_POINTS = 1000;

    const [points, setPoints] = useState(0);
    const [rewardStatus, setRewardStatus] = useState(null);
    const [rewardOrderId, setRewardOrderId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [opening, setOpening] = useState(false);

    const [reward, setReward] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const isUnlocked =
        Number(points) >= UNLOCK_POINTS &&
        Number(rewardStatus) === 1;


    /* =====================================================
       LOAD REWARD
    ===================================================== */

    useEffect(() => {

        async function loadReward() {

            try {

                const sessionToken =
                    localStorage.getItem("session_token");

                if (!sessionToken) {
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    `${API}/api/user/rewards`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            session_token:
                                sessionToken
                        })
                    }
                );

                const data =
                    await response.json();

                if (data.success && data.reward) {

                    setPoints(
                        Number(
                            data.reward.points || 0
                        )
                    );

                    setRewardStatus(
                        data.reward.reward_status
                    );

                    setRewardOrderId(
                        data.reward.order_id || null
                    );

                }

            } catch (error) {

                console.error(
                    "Reward load error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        }

        loadReward();

    }, []);


    /* =====================================================
       OPEN MYSTERY BOX
    ===================================================== */

    async function handleOpenMysteryBox() {

        if (opening) return;

        if (!isUnlocked) {

            return;

        }

        setOpening(true);
        setShowResult(false);
        setReward(null);


        try {

            const sessionToken =
                localStorage.getItem("session_token");


            /*
             IMPORTANT:

             Reward is decided by SERVER.
             Frontend does NOT generate random points.
            */

            const response = await fetch(
                `${API}/api/user/rewards/spin`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        session_token:
                            sessionToken
                    })
                }
            );


            const data =
                await response.json();


            if (!data.success) {

                setOpening(false);

                alert(
                    data.message ||
                    "Unable to open Mystery Box."
                );

                return;

            }


            /*
             EXACT SERVER RESULT
            */

            const wonPoints =
                Number(
                    data.spin_points || 0
                );


            if (!wonPoints) {

                setOpening(false);

                alert(
                    "Invalid reward received."
                );

                return;

            }


            /*
             Keep EXACT same reward
             for final reveal.
            */

            setReward(
                wonPoints
            );


            /*
             Updated total points
            */

            if (data.reward) {

                setPoints(
                    Number(
                        data.reward.points || 0
                    )
                );

                setRewardOrderId(
                    data.reward.order_id ||
                    rewardOrderId
                );

            } else {

                setPoints(
                    prev =>
                        prev + wonPoints
                );

            }


            /*
             Mystery Box animation.
             No number is shown during opening.
            */

            setTimeout(() => {

                setOpening(false);

                setShowResult(true);

                /*
                 Special spin has been consumed.
                */

                setRewardStatus(null);

            }, 3200);


        } catch (error) {

            console.error(
                "Mystery Box error:",
                error
            );

            setOpening(false);

            alert(
                "Something went wrong. Please try again."
            );

        }

    }


    /* =====================================================
       CLOSE RESULT
    ===================================================== */

    function closeResult() {

        setShowResult(false);

    }


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (
            <div className="reward-loading">
                Loading Rewards...
            </div>
        );

    }


    /* =====================================================
       PAGE
    ===================================================== */

    return (

        <div className="reward-page">


            {/* =================================================
               HEADER
            ================================================= */}

            <div className="reward-header">

                <button
                    className="reward-back-btn"
                    onClick={() =>
                        setProfilePage("profile")
                    }
                >
                    ‹
                </button>


                <div className="reward-title">
                    REWARDS
                </div>


                <div className="reward-points-box">

                    <span className="reward-money-icon">
                        ₹
                    </span>

                    <span>
                        {points}
                    </span>

                </div>

            </div>


            {/* =================================================
               PROGRESS
            ================================================= */}

            <div className="mystery-progress">

                <div className="mystery-progress-top">

                    <span>
                        Reward Progress
                    </span>

                    <strong>
                        {Math.min(
                            Number(points),
                            UNLOCK_POINTS
                        )} / {UNLOCK_POINTS}
                    </strong>

                </div>


                <div className="mystery-progress-bar">

                    <div
                        className="mystery-progress-fill"
                        style={{
                            width: `${Math.min(
                                (Number(points) /
                                    UNLOCK_POINTS) *
                                    100,
                                100
                            )}%`
                        }}
                    />

                </div>


                {!isUnlocked && (

                    <p>
                        Earn{" "}
                        {Math.max(
                            UNLOCK_POINTS -
                                Number(points),
                            0
                        )}{" "}
                        more points to unlock.
                    </p>

                )}

            </div>


            {/* =================================================
               MYSTERY BOX
            ================================================= */}

            <div className="mystery-area">


                <div
                    className={
                        `mystery-box-wrapper ${
                            opening
                                ? "mystery-opening"
                                : ""
                        } ${
                            isUnlocked
                                ? "mystery-unlocked"
                                : "mystery-locked"
                        }`
                    }
                >


                    <div className="mystery-glow">
                    </div>


                    <div className="mystery-box">


                        <div className="mystery-box-top">

                            <span>
                                ✦
                            </span>

                        </div>


                        <div className="mystery-box-body">

                            {opening ? (

                                <div className="mystery-opening-content">

                                    <div className="mystery-stars">
                                        ✦
                                    </div>

                                    <div>
                                        OPENING
                                    </div>

                                </div>

                            ) : (

                                <>

                                    <div className="mystery-icon">

                                        {isUnlocked
                                            ? "🎁"
                                            : "🔒"}

                                    </div>


                                    <div className="mystery-question">

                                        {isUnlocked
                                            ? "?"
                                            : "LOCKED"}

                                    </div>

                                </>

                            )}

                        </div>


                        <div className="mystery-box-bottom">

                            <span>
                                ✦
                            </span>

                        </div>


                    </div>

                </div>


                {/* =================================================
                   TEXT
                ================================================= */}

                <div className="mystery-text">

                    {opening ? (

                        <>

                            <h2>
                                Unlocking Mystery...
                            </h2>

                            <p>
                                Your reward is being revealed
                            </p>

                        </>

                    ) : isUnlocked ? (

                        <>

                            <h2>
                                Mystery Box Unlocked
                            </h2>

                            <p>
                                Open your special reward
                            </p>

                        </>

                    ) : (

                        <>

                            <h2>
                                Mystery Box Locked
                            </h2>

                            <p>
                                Complete ₹{UNLOCK_POINTS}
                                points to unlock
                            </p>

                        </>

                    )}

                </div>


                {/* =================================================
                   OPEN BUTTON
                ================================================= */}

                <button
                    className={
                        `mystery-open-btn ${
                            isUnlocked
                                ? "active"
                                : "disabled"
                        }`
                    }
                    disabled={
                        !isUnlocked ||
                        opening
                    }
                    onClick={
                        handleOpenMysteryBox
                    }
                >

                    {opening
                        ? "OPENING..."
                        : isUnlocked
                            ? "OPEN MYSTERY BOX"
                            : "LOCKED"}

                </button>

            </div>


            {/* =================================================
               INFORMATION
            ================================================= */}

            <div className="mystery-info">

                <div className="mystery-info-icon">
                    ✦
                </div>

                <div>

                    <strong>
                        Special Reward
                    </strong>

                    <p>
                        Your Mystery Box contains
                        a special points reward.
                    </p>

                </div>

            </div>


            {/* =================================================
               CONGRATULATIONS
            ================================================= */}

            {showResult && reward !== null && (

                <div className="congratulation-overlay">

                    <div className="congratulation-box">


                        <div className="result-glow">
                        </div>


                        <button
                            className="congratulation-close"
                            onClick={
                                closeResult
                            }
                        >
                            ×
                        </button>


                        <div className="result-box-icon">
                            🎉
                        </div>


                        <p className="result-small-title">
                            MYSTERY BOX OPENED
                        </p>


                        <h2>
                            Congratulations!
                        </h2>


                        <div className="result-points">

                            +{reward}

                        </div>


                        <div className="result-points-label">
                            POINTS
                        </div>


                        <p className="result-message">
                            Your reward has been
                            successfully added.
                        </p>


                        <button
                            className="result-done-btn"
                            onClick={
                                closeResult
                            }
                        >
                            AWESOME
                        </button>

                    </div>

                </div>

            )}

        </div>

    );

}

export default Reward;