import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiMessageCircle, FiGift, FiCalendar, FiEdit, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import { API } from "../../../services/api";
import NODP from "../../../assets/NODP.png";
import "./ViewProfile.css";

function ViewProfile({ profile, setProfilePage, navigateWithLoading }) {
    const navigate = useNavigate();
    const [promoCode, setPromoCode] = useState(null);
    const [isRedeemed, setIsRedeemed] = useState(false);
    const [loadingPromo, setLoadingPromo] = useState(true);

    useEffect(() => {
        const sessionToken = localStorage.getItem("session_token");
        fetch(`${API}/api/user/rewards?session_token=${sessionToken}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.success && data.data) {
                    setPromoCode(data.data.promo_code || null);
                    setIsRedeemed(Number(data.data.redeemed) === 1);
                }
            })
            .catch((err) => console.error(err))
            .finally(() => setLoadingPromo(false));
    }, []);

    const formatJoinedDate = (date) => {
        if (!date) return "NOT SET";
        const d = new Date(date);
        if (isNaN(d.getTime())) return "NOT SET";
        return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
    };

    const displayName = profile?.full_name && profile.full_name !== "HEEPIT USER" ? profile.full_name : "NOT SET";
    const displayEmail = profile?.email || "NOT SET";
    const mobileHasNumber = !!profile?.mobile_number;
    const mobileIsVerified = Number(profile?.is_mobile_verified) === 1;
    const whatsappHasNumber = !!profile?.whatsapp_number;
    const whatsappIsVerified = Number(profile?.is_whatsapp_verified) === 1;

    const getUserCode = () => profile?.user_id ? `#63717847${String(profile.user_id).padStart(4, "0")}HEEPIT` : "NOT SET";
    const initials = displayName !== "NOT SET" ? displayName.charAt(0).toUpperCase() : "?";

    const rows = [
        { Icon: FiUser, label: "Name", value: displayName },
        { Icon: FiMail, label: "Email", value: displayEmail },
        {
            Icon: FiPhone, label: "Mobile", status: mobileIsVerified && mobileHasNumber ? "ok" : mobileHasNumber ? "pending" : "no",
            value: mobileIsVerified && mobileHasNumber ? profile.mobile_number : null,
        },
        {
            Icon: FiMessageCircle, label: "WhatsApp", status: whatsappIsVerified && whatsappHasNumber ? "ok" : whatsappHasNumber ? "pending" : "no",
            value: whatsappIsVerified && whatsappHasNumber ? profile.whatsapp_number : null,
        },
        { Icon: FiCalendar, label: "Joined", value: formatJoinedDate(profile?.created_at) },
    ];

    return (
        <div className="viewprofile">
            <div className="view-card">
                <div className="view-header">
                    <button
                        className="view-back"
                        onClick={() => navigateWithLoading(() => { setProfilePage("profile"); navigate("/profile", { replace: true }); }, "Loading Profile...", 10)}
                        aria-label="Back"
                    >
                        <FiArrowLeft />
                    </button>

                    <div className="view-header-center">
                        <div className="view-image-wrapper">
                            {profile?.profile_image ? (
                                <img src={profile.profile_image} alt="Profile" className="view-image" loading="lazy" />
                            ) : (
                                <div className="view-image view-initials">{initials}</div>
                            )}
                        </div>
                        <span className="view-user-code">{getUserCode()}</span>
                        <button
                            className="view-edit-btn"
                            onClick={() => navigateWithLoading(() => { setProfilePage("editprofile"); navigate("/profile/viewprofile/editprofile"); }, "Loading Edit Profile...", 500)}
                        >
                            <FiEdit /> Edit Profile
                        </button>
                    </div>
                </div>

                <div className="view-info">
                    {rows.map(({ Icon, label, value, status }) => (
                        <div className="view-row" key={label}>
                            <div className="view-row-left">
                                <span className="view-row-icon"><Icon /></span>
                                <span className="view-row-label">{label}</span>
                            </div>
                            <div className={`view-row-value ${status ? `view-status-${status}` : ""}`}>
                                {status === "ok" && <FiCheckCircle className="view-status-icon" />}
                                {status === "pending" && <FiClock className="view-status-icon" />}
                                {status === "no" && <FiXCircle className="view-status-icon" />}
                                <span>{value || (status === "pending" ? "Processing" : status === "no" ? "Not Verified" : "—")}</span>
                            </div>
                        </div>
                    ))}

                    <div className="view-row view-row-promo">
                        <div className="view-row-left">
                            <span className="view-row-icon"><FiGift /></span>
                            <span className="view-row-label">Promo Code</span>
                        </div>
                        <div className="view-row-value">
                            {loadingPromo ? (
                                <span className="view-promo-loading">...</span>
                            ) : !promoCode ? (
                                <span className="view-promo-na">N/A</span>
                            ) : (
                                <div className="view-promo-wrap">
                                    <span className="view-promo-code">{promoCode}</span>
                                    {isRedeemed && <span className="view-promo-badge">REDEEMED</span>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewProfile;