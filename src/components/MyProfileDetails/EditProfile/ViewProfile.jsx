import "./ViewProfile.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../../services/api";
import NODP from "../../../assets/NODP.png";

function ViewProfile({
    profile,
    setProfilePage,
    navigateWithLoading
}) {
    const navigate = useNavigate();

    const [promoCode, setPromoCode] = useState(null);
    const [isRedeemed, setIsRedeemed] = useState(false);
    const [loadingPromo, setLoadingPromo] = useState(true);

    useEffect(() => {
        async function loadPromo() {
            try {
                const sessionToken = localStorage.getItem("session_token");

                const res = await fetch(
                    `${API}/api/user/rewards?session_token=${sessionToken}`
                );
                const data = await res.json();

                if (data.success && data.data) {
                    setPromoCode(data.data.promo_code || null);
                    setIsRedeemed(Number(data.data.redeemed) === 1);
                } else {
                    setPromoCode(null);
                }

            } catch (err) {
                console.error(err);
                setPromoCode(null);
            } finally {
                setLoadingPromo(false);
            }
        }

        loadPromo();
    }, []);

    function formatJoinedDate(date) {
        if (!date) return "NOT SET";
        const d = new Date(date);
        if (isNaN(d.getTime())) return "NOT SET";
        return d
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            })
            .toUpperCase();
    }

    const displayName =
        profile?.full_name && profile.full_name !== "HEEPIT USER"
            ? profile.full_name
            : "NOT SET";

    const displayEmail =
        profile?.email || "NOT SET";

    const displayMobile =
        Number(profile?.is_mobile_verified) === 1 && profile?.mobile_number
            ? profile.mobile_number
            : "NOT SET";

    const displayWhatsapp =
        Number(profile?.is_whatsapp_verified) === 1 && profile?.whatsapp_number
            ? profile.whatsapp_number
            : "NOT SET";

    return (

        <div className="viewprofile">

            <div className="view-card">

                <div className="headback">
                    <div className="leftheadback">
                        <button
                            className="view-back"
                            onClick={() => {
                                navigateWithLoading(
                                    () => {
                                        setProfilePage("profile");
                                        navigate("/profile", { replace: true });
                                    },
                                    "Loading Profile...",
                                    10
                                );
                            }}
                        >
                            ←
                        </button>
                        <div className="view-row1">
                            <span>User</span>
                            <p>
                                {profile?.user_id
                                    ? `#63717847${String(profile.user_id).padStart(4, "0")}HEEPIT`
                                    : "NOT SET"}
                            </p>
                        </div>
                    </div>
                    <div className="view-image-wrapperdet">
                        <img
                            src={profile?.profile_image || NODP}
                            alt="Profile"
                            className="view-image"
                        />
                    </div>
                </div>

                <div className="view-info">

                    <div className="view-row">
                        <span>Name</span>
                        <p>{displayName}</p>
                    </div>

                    <div className="view-row">
                        <span>Email</span>
                        <p>{displayEmail}</p>
                    </div>

                    <div className="view-row">
                        <span>Mobile</span>
                        <p>{displayMobile}</p>
                    </div>

                    <div className="view-row">
                        <span>WhatsApp</span>
                        <p>{displayWhatsapp}</p>
                    </div>

                    <div className="view-row">
                        <span>Promo Code</span>
                        <p className={`promo-row ${!promoCode ? "promo-na" : isRedeemed ? "promo-redeemed" : "promo-active"}`}>
                            {loadingPromo ? (
                                "..."
                            ) : !promoCode ? (
                                "N/A"
                            ) : (
                                <>
                                    <span className="promo-code-value">
                                        {promoCode}
                                    </span>
                                    {isRedeemed && (
                                        <span className="promo-badge">
                                            REDEEMED
                                        </span>
                                    )}
                                </>
                            )}
                        </p>
                    </div>

                    <div className="view-row">
                        <span>Joined</span>
                        <p>{formatJoinedDate(profile?.created_at)}</p>
                    </div>

                </div>

            </div>

            <div className="view-actions">

                <button
                    className="edit-btn"
                    onClick={() => {
                        navigateWithLoading(
                            () => {
                                setProfilePage("editprofile");
                                navigate("/profile/viewprofile/editprofile");
                            },
                            "Loading Edit Profile...",
                            500
                        );
                    }}
                >
                    Edit Profile
                </button>
            </div>

        </div>

    );

}

export default ViewProfile;