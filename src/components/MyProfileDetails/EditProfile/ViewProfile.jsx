import "./ViewProfile.css";
import AerodeckDP from "../../../assets/AerodeckDP.png";

function ViewProfile({
    profile,
    setProfilePage
}) {
    return (

        <div className="viewprofile">

            <div className="view-header">

                <button
                    className="view-back"
                    onClick={() => setProfilePage("profile")}
                >
                    ←
                </button>

                <h2>
                    My Profile
                </h2>

            </div>

            <div className="view-card">

                <img
                    src={profile?.profile_image}
                    alt="Profile"
                    className="view-image"
                />

                <h3>
                    {profile?.full_name || "profile"}
                </h3>

                <div className="view-info">

                    <div className="view-row">
                        <span>Name</span>
                        <p>{profile?.full_name || "-"}</p>
                    </div>

                    <div className="view-row">
                        <span>Mobile</span>
                        <p>
                            {profile?.mobile_number
                                ? `******${profile.mobile_number.slice(-4)}`
                                : "-"}
                        </p>
                    </div>

                </div>

            </div>

            <div className="view-actions">

                <button
                    className="edit-btn"
                    onClick={() => setProfilePage("editprofile")}
                >
                    Edit Profile
                </button>
            </div>

        </div>

    );

}

export default ViewProfile;