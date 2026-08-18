import "./ViewProfile.css";
import NODP from "../../../assets/NODP.png";

function ViewProfile({
    profile,
    setProfilePage,
    navigateWithLoading
}) {
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
                                    ? `#63717847${String(profile.user_id).padStart(4, "0")}USER`
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
                        <p>{profile?.full_name || "-"}</p>
                    </div>


                    <div className="view-row">
                        <span>Mobile</span>
                        <p>
                            {profile?.mobile_number || "-"}
                        </p>
                    </div>

                    <div className="view-row">
                        <span>Email</span>
                        <p className={profile?.email ? "email-set" : "email-not-set"}>
                            {profile?.email || "NOT SET"}
                        </p>
                    </div>
                    <div className="view-row">
                        <span>Joined</span>
                        <p>
                            {formatJoinedDate(profile?.created_at)}
                        </p>
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