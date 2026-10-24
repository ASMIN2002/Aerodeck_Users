import { useEffect, useState } from "react";
import { API } from "../../services/api";
import "../hooksstyle/Notification.css";

const ACTIVE_STATUS = 1;
const APPROVED = "APPROVED";
const REJECTED = "REJECTED";

const maskEmail = (email) => {
    if (!email?.includes("@")) return email || "";
    const [local, domain] = email.split("@");
    const visible = Math.max(1, Math.floor(local.length / 2));
    return `${local.slice(0, visible)}${"*".repeat(local.length - visible)}@${domain}`;
};

const getSession = () => localStorage.getItem("session_token");

function Notification({ onClose, onRedeemHandled }) {
    const [rewards, setRewards] = useState({ reqUserId: 0, redeemed: false, requesterEmail: "", usedOwnerId: 0, usedOwnerEmail: "", usedRedeemed: 0 });
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const loadRewards = async () => {
            try {
                const res = await fetch(`${API}/api/user/rewards?session_token=${getSession()}`);
                const { success, data } = await res.json();
                if (success && data) {
                    setRewards({
                        reqUserId: data.req_userid || 0,
                        redeemed: data.redeemed === 1,
                        requesterEmail: data.requester_email || "",
                        usedOwnerId: data.used_owner_id || 0,
                        usedOwnerEmail: data.used_owner_email || "",
                        usedRedeemed: data.used_redeemed || 0,
                    });
                }
            } catch (err) { console.error(err); }
        };

        const loadNotifications = async () => {
            try {
                const res = await fetch(`${API}/api/user/notification/all`);
                const { success, data } = await res.json();
                if (success) setNotifications((data || []).filter((n) => Number(n.status) === ACTIVE_STATUS));
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };

        loadRewards();
        loadNotifications();
    }, []);

    const handleRedeemAction = async (action) => {
        try {
            const res = await fetch(`${API}/api/user/rewards/redeem/handle`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: getSession(), action }),
            });
            const { success } = await res.json();
            if (success) { onRedeemHandled?.(); onClose(); }
        } catch (err) { console.error(err); }
    };

    const toggleExpand = (id, e) => { e.stopPropagation(); setExpandedId((prev) => (prev === id ? null : id)); };

    const { reqUserId, redeemed, requesterEmail, usedOwnerId, usedOwnerEmail, usedRedeemed } = rewards;
    const isEmpty = !loading && !notifications.length && !reqUserId && !usedOwnerId;

    return (
        <div className="hd-notif-page">
            <div className="hd-notif-bg" aria-hidden="true">
                <span className="hd-notif-blob hd-notif-blob-1" />
                <span className="hd-notif-blob hd-notif-blob-2" />
                <span className="hd-notif-blob hd-notif-blob-3" />
            </div>

            <div className="hd-notif-page-inner">
                <div className="hd-notif-header">
                    <h3>Notifications</h3>
                    <div className="hd-notif-header-right">
                        <div className="hd-notif-count-badge">
                            <span className="hd-notif-count-label">Total</span>
                            <span className="hd-notif-count-value">{notifications.length}</span>
                        </div>
                        <button className="hd-notif-close" onClick={onClose}>✕</button>
                    </div>
                </div>

                {reqUserId > 0 && (
                    <div className="hd-notif-pinned">
                        {!redeemed ? (
                            <div className="hd-notif-action-box">
                                <div className="hd-notif-message">
                                    <strong>{requesterEmail ? maskEmail(requesterEmail) : "Someone"}</strong> wants to redeem your promo code.
                                </div>
                                <div className="hd-notif-actions">
                                    <button className="hd-notif-accept" onClick={() => handleRedeemAction(APPROVED)}>✓ Accept</button>
                                    <button className="hd-notif-ignore" onClick={() => handleRedeemAction(REJECTED)}>✕ Ignore</button>
                                </div>
                            </div>
                        ) : (
                            <div className="hd-notif-line">
                                Your promo code was used by <strong>{requesterEmail ? maskEmail(requesterEmail) : "User"}</strong>
                                <br />You Got 40 hypo points flat.
                            </div>
                        )}
                    </div>
                )}

                {usedOwnerId > 0 && (
                    <div className="hd-notif-pinned hd-notif-pinned-used">
                        {usedRedeemed === 1 ? (
                            <div className="hd-notif-line hd-notif-line-approved">
                                <strong>{maskEmail(usedOwnerEmail)}</strong> approved your request. You got 10 HYPO Points Flat.
                            </div>
                        ) : (
                            <div className="hd-notif-line">
                                You used the promocode of <strong>{maskEmail(usedOwnerEmail)}</strong> — Waiting for response...
                            </div>
                        )}
                    </div>
                )}

                <div className="hd-notif-list-wrap">
                    {loading && <div className="hd-notif-empty"><p>Loading...</p></div>}

                    {!loading && notifications.length > 0 && (
                        <div className="hd-notif-list">
                            {notifications.map(({ id, notification, created_at }) => (
                                <div
                                    key={id}
                                    className={`hd-notif-item active ${expandedId === id ? "expanded" : ""}`}
                                    onClick={(e) => toggleExpand(id, e)}
                                >
                                    <div className="hd-notif-item-text">{notification}</div>
                                    <div className="hd-notif-item-time">{new Date(created_at).toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {isEmpty && (
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