import { useEffect, useState } from "react";
import { API } from "../../services/api";
import "./Notification.css";

function Notification({ onClose }) {

    const [redeemed, setRedeemed] = useState(false);
    const [reqUserId, setReqUserId] = useState(0);
    const [requesterName, setRequesterName] = useState("");

    /* ============================================
       FETCH — meri row ka data
       ============================================ */
    useEffect(() => {

        async function loadData() {

            try {

                const sessionToken = localStorage.getItem("session_token");

                const res = await fetch(
                    `${API}/api/user/rewards?session_token=${sessionToken}`
                );
                const data = await res.json();

                if (data.success && data.data) {

                    const myReqUserId = data.data.req_userid || 0;
                    const isRedeemed = data.data.redeemed === 1;

                    setReqUserId(myReqUserId);
                    setRedeemed(isRedeemed);

                    /* Requester name fetch */
                    if (myReqUserId > 0) {
                        try {
                            const userRes = await fetch(`${API}/api/users`);
                            const usersData = await userRes.json();

                            if (usersData.success) {
                                const found = usersData.data.find(
                                    u => String(u.user_id) === String(myReqUserId)
                                );
                                if (found) {
                                    setRequesterName(found.full_name || "User");
                                }
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }

                }

            } catch (err) {
                console.log(err);
            }

        }

        loadData();

    }, []);

    /* ============================================
       ACCEPT / IGNORE
       ============================================ */
    const handleRedeemAction = async (action) => {

        try {

            const sessionToken = localStorage.getItem("session_token");

            const res = await fetch(
                `${API}/api/user/rewards/redeem/handle`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        session_token: sessionToken,
                        action: action
                    })
                }
            );

            const data = await res.json();

            if (data.success) {
                onClose();
            }

        } catch (err) {
            console.error(err);
        }

    };

    return (

        <div
            className="hd-notif-overlay"
            onClick={onClose}
        >

            <div
                className="hd-notif-box"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="hd-notif-header">
                    <h3>Notifications</h3>
                    <button
                        className="hd-notif-close"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {/* ============================================
                   CASE 1: req_userid > 0 AND redeemed = 0
                   → Accept / Ignore
                   ============================================ */}
                {reqUserId > 0 && !redeemed && (

                    <div className="hd-notif-action-box">

                        <div className="hd-notif-message">
                            <strong>{requesterName || "Someone"}</strong>
                            {" "}wants to redeem your promo code.
                        </div>

                        <div className="hd-notif-actions">

                            <button
                                className="hd-notif-accept"
                                onClick={() => handleRedeemAction("APPROVED")}
                            >
                                ✓ Accept
                            </button>

                            <button
                                className="hd-notif-ignore"
                                onClick={() => handleRedeemAction("REJECTED")}
                            >
                                ✕ Ignore
                            </button>

                        </div>

                    </div>

                )}

                {/* ============================================
                   CASE 2: req_userid > 0 AND redeemed = 1
                   → Simple message
                   ============================================ */}
                {reqUserId > 0 && redeemed && (

                    <div className="hd-notif-line">
                        Your promo code was used by{" "}
                        <strong>{requesterName || "User"}</strong>
                    </div>

                )}

                {/* ============================================
                   CASE 3: req_userid = 0
                   → No Notifications
                   ============================================ */}
                {reqUserId === 0 && (

                    <div className="hd-notif-empty">
                        <span>🔕</span>
                        <p>No Notifications</p>
                    </div>

                )}

            </div>

        </div>

    );

}

export default Notification;