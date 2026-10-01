import { useEffect, useState } from "react";
import { API } from "../../services/api";
import "./Notification.css";

function Notification({ onClose }) {

    const [redeemed, setRedeemed] = useState(false);
    const [reqUserId, setReqUserId] = useState(0);
    const [requesterName, setRequesterName] = useState("");

    const [notifications, setNotifications] = useState([]);
    const [loadingNotifs, setLoadingNotifs] = useState(true);
    const [expandedId, setExpandedId] = useState(null); // 👈 naya

    /* ============================================
       FETCH — rewards row (redeem wala)
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
       FETCH — heepit_notification list
       ============================================ */
    useEffect(() => {

        async function loadNotifications() {
            try {

                const res = await fetch(
                    `${API}/api/user/notification/all`
                );
                const data = await res.json();

                if (data.success) {
                    setNotifications(data.data || []);
                }

            } catch (err) {
                console.log(err);
            } finally {
                setLoadingNotifs(false);
            }
        }

        loadNotifications();

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

    /* ============================================
       ITEM CLICK — toggle expand
       ============================================ */
    const handleItemClick = (id, e) => {
        e.stopPropagation(); // box ke andar ka click, overlay tak na jaye
        setExpandedId(prev => (prev === id ? null : id));
    };

    /* ============================================
       BOX KE ANDAR CLICK — sirf expand collapse
       ============================================ */
    const handleBoxClick = (e) => {
        e.stopPropagation();
        // agar kisi expanded item ke bahar click hua to collapse
        setExpandedId(null);
    };

    return (

        <div
            className="hd-notif-overlay"
            onClick={onClose}
        >

            <div
                className="hd-notif-box"
                onClick={handleBoxClick}
            >

                <div className="hd-notif-header">

                    <h3>Notifications</h3>

                    <div className="hd-notif-header-right">

                        <div className="hd-notif-count-badge">
                            <span className="hd-notif-count-label">Total</span>
                            <span className="hd-notif-count-value">
                                {notifications.length}
                            </span>
                        </div>

                        <button
                            className="hd-notif-close"
                            onClick={onClose}
                        >
                            ✕
                        </button>

                    </div>

                </div>

                {/* ============================================
                   REDEEM SECTION — pinned
                   ============================================ */}
                {(reqUserId > 0) && (
                    <div className="hd-notif-pinned">

                        {!redeemed && (
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

                        {redeemed && (
                            <div className="hd-notif-line">
                                Your promo code was used by{" "}
                                <strong>{requesterName || "User"}</strong>
                            </div>
                        )}

                    </div>
                )}

                {/* ============================================
                   NOTIFICATION LIST — scroll yahan
                   ============================================ */}
                <div className="hd-notif-list-wrap">

                    {loadingNotifs && (
                        <div className="hd-notif-empty">
                            <p>Loading...</p>
                        </div>
                    )}

                    {!loadingNotifs && notifications.length > 0 && (
                        <div className="hd-notif-list">
                            {notifications.map((item) => {
                                const isExpanded = expandedId === item.id;

                                return (
                                    <div
                                        key={item.id}
                                        className={`hd-notif-item ${item.status ? "active" : "inactive"} ${isExpanded ? "expanded" : ""}`}
                                        onClick={(e) => handleItemClick(item.id, e)}
                                    >
                                        <div className="hd-notif-item-text">
                                            {item.notification}
                                        </div>
                                        <div className="hd-notif-item-time">
                                            {new Date(item.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {!loadingNotifs && notifications.length === 0 && reqUserId === 0 && (
                        <div className="hd-notif-empty">
                            <span>🔕</span>
                            <p>No Notifications</p>
                        </div>
                    )}

                </div>

            </div>

        </div>

    );

}

export default Notification;