import { useEffect, useState } from "react";
import { API } from "../../services/api";
import "./Notification.css";

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

function Notification({ onClose, onRedeemHandled }) {

    /* ============================================
       USER 1 — kisi ne mera promo use kiya
       ============================================ */
    const [redeemed, setRedeemed] = useState(false);
    const [reqUserId, setReqUserId] = useState(0);
    const [requesterEmail, setRequesterEmail] = useState("");

    /* ============================================
       USER 2 — maine kisi ka promo use kiya
       ============================================ */
    const [usedOwnerId, setUsedOwnerId] = useState(0);
    const [usedOwnerEmail, setUsedOwnerEmail] = useState("");
    const [usedRedeemed, setUsedRedeemed] = useState(0);

    const [notifications, setNotifications] = useState([]);
    const [loadingNotifs, setLoadingNotifs] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    /* ============================================
       LOAD REWARDS
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

                    setReqUserId(data.data.req_userid || 0);
                    setRedeemed(data.data.redeemed === 1);
                    setRequesterEmail(data.data.requester_email || "");

                    setUsedOwnerId(data.data.used_owner_id || 0);
                    setUsedOwnerEmail(data.data.used_owner_email || "");
                    setUsedRedeemed(data.data.used_redeemed || 0);

                }

            } catch (err) {
                console.log(err);
            }

        }

        loadData();

    }, []);

    /* ============================================
       LOAD NOTIFICATIONS
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
                if (onRedeemHandled) onRedeemHandled();
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
        e.stopPropagation();
        setExpandedId(prev => (prev === id ? null : id));
    };

    const handleBoxClick = (e) => {
        e.stopPropagation();
        setExpandedId(null);
    };

    return (

        <div className="hd-notif-overlay" onClick={onClose}>

            <div className="hd-notif-box" onClick={handleBoxClick}>

                <div className="hd-notif-header">

                    <h3>Notifications</h3>

                    <div className="hd-notif-header-right">

                        <div className="hd-notif-count-badge">
                            <span className="hd-notif-count-label">Total</span>
                            <span className="hd-notif-count-value">
                                {notifications.length}
                            </span>
                        </div>

                        <button className="hd-notif-close" onClick={onClose}>
                            ✕
                        </button>

                    </div>

                </div>

                {/* ============================================
                   PINNED 1 — kisi ne mera promo use kiya
                   ============================================ */}
                {reqUserId > 0 && (
                    <div className="hd-notif-pinned">

                        {!redeemed && (
                            <div className="hd-notif-action-box">

                                <div className="hd-notif-message">
                                    <strong>
                                        {requesterEmail
                                            ? maskEmail(requesterEmail)
                                            : "Someone"}
                                    </strong>
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
                                Your promo code was used by{" "}, <br /> You Got 40 hypo points flat.
                                <strong>
                                    {requesterEmail
                                        ? maskEmail(requesterEmail)
                                        : "User"}
                                </strong>
                            </div>
                        )}

                    </div>
                )}

                {/* ============================================
                   PINNED 2 — maine kisi ka promo use kiya
                   ============================================ */}
                {usedOwnerId > 0 && (
                    <div className="hd-notif-pinned hd-notif-pinned-used">

                        {usedRedeemed === 1 ? (

                            <div className="hd-notif-line hd-notif-line-approved">
                                <strong>{maskEmail(usedOwnerEmail)}</strong>
                                {" "}approved your request. You got 10 HYPO Points Flat.
                            </div>

                        ) : (

                            <div className="hd-notif-line">
                                You used the promocode of{" "}
                                <strong>{maskEmail(usedOwnerEmail)}</strong>
                                {" "}— Waiting for response...
                            </div>

                        )}

                    </div>
                )}

                {/* ============================================
                   NOTIFICATION LIST
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

                    {!loadingNotifs && notifications.length === 0 && reqUserId === 0 && usedOwnerId === 0 && (
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