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
        const loadAll = async () => {
            try {
                const [rewardsRes, notifRes] = await Promise.all([
                    fetch(`${API}/api/user/rewards?session_token=${getSession()}`),
                    fetch(`${API}/api/user/notification/all`)
                ]);

                const rewardsJson = await rewardsRes.json();
                const notifJson = await notifRes.json();

                if (rewardsJson.success && rewardsJson.data) {
                    const data = rewardsJson.data;
                    setRewards({
                        reqUserId: data.req_userid || 0,
                        redeemed: data.redeemed === 1,
                        requesterEmail: data.requester_email || "",
                        usedOwnerId: data.used_owner_id || 0,
                        usedOwnerEmail: data.used_owner_email || "",
                        usedRedeemed: data.used_redeemed || 0,
                    });
                }

                if (notifJson.success) {
                    setNotifications((notifJson.data || []).filter((n) => Number(n.status) === ACTIVE_STATUS));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadAll();
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
                        <button className="hd-notif-close" onClick={onClose} aria-label="Close">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className="hd-notif-pinned hd-notif-pinned-skeleton" aria-hidden="true">
                        <div className="hd-notif-skel-line" />
                        <div className="hd-notif-skel-line short" />
                    </div>
                )}

                {!loading && reqUserId > 0 && (
                    <div className="hd-notif-pinned">
                        {!redeemed ? (
                            <div className="hd-notif-action-box">
                                <div className="hd-notif-message">
                                    <strong>{requesterEmail ? maskEmail(requesterEmail) : "Someone"}</strong> wants to redeem your promo code.
                                </div>
                                <div className="hd-notif-actions">
                                    <button className="hd-notif-accept" onClick={() => handleRedeemAction(APPROVED)}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        <span>Accept</span>
                                    </button>
                                    <button className="hd-notif-ignore" onClick={() => handleRedeemAction(REJECTED)}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                        <span>Ignore</span>
                                    </button>
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

                {!loading && usedOwnerId > 0 && (
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
                    {loading && (
                        <div className="hd-notif-list">
                            <div className="hd-notif-item hd-notif-item-skeleton"><div className="hd-notif-skel-line" /><div className="hd-notif-skel-line short" /></div>
                            <div className="hd-notif-item hd-notif-item-skeleton"><div className="hd-notif-skel-line" /><div className="hd-notif-skel-line short" /></div>
                            <div className="hd-notif-item hd-notif-item-skeleton"><div className="hd-notif-skel-line" /><div className="hd-notif-skel-line short" /></div>
                        </div>
                    )}

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
                            <span>
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            </span>
                            <p>No Notifications</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Notification;