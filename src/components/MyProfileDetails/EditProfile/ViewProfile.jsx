import "./ViewProfile.css";
import AerodeckDP from "../../../assets/AerodeckDP.png";

function ViewProfile({

    user,
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
                    src={user?.profile_image}
                    alt="Profile"
                    className="view-image"
                />

                <h3>
                    {user?.full_name || "User"}
                </h3>

                <div className="view-info">

                    <div className="view-row">
                        <span>Name</span>
                        <p>{user?.full_name || "-"}</p>
                    </div>

                    <div className="view-row">
                        <span>Mobile</span>
                        <p>
                            {user?.mobile_number
                                ? `******${user.mobile_number.slice(-4)}`
                                : "-"}
                        </p>
                    </div>

                    <div className="view-row">
                        <span>Calling Number</span>
                        <p className={!user?.calling_number ? "pending" : ""}>
                            {user?.calling_number || "Pending"}
                        </p>
                    </div>

                    <div className="view-row">
                        <span>WhatsApp</span>
                        <p className={!user?.whatsapp_number ? "pending" : ""}>
                            {user?.whatsapp_number || "Pending"}
                        </p>
                    </div>

                    <div className="view-row">
                        <span>Email</span>
                        <p className={!user?.email ? "pending" : ""}>
                            {user?.email || "Pending"}
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

                <button
                    className="delete-btn"
                >
                    Delete Profile
                </button>

            </div>

        </div>

    );

}

export default ViewProfile;