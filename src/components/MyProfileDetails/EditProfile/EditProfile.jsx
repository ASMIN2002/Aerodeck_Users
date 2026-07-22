import "./EditProfile.css";
import { useState } from "react";

function EditProfile({

    setProfilePage

}) {

    const [fullName, setFullName] = useState("John Doe");
    const [mobile, setMobile] = useState("9876543210");
    const [email, setEmail] = useState("john@example.com");

    const handleSave = () => {

        alert("Profile Updated Successfully");

    };

    return (

        <div className="editprofile">

            <div className="edit-header">

                <button
                    className="edit-back"
                    onClick={() => setProfilePage("profile")}
                >
                    ←
                </button>

                <h2>
                    Edit Profile
                </h2>

            </div>

            <div className="profile-image">

                <img
                    src="https://via.placeholder.com/120"
                    alt="Profile"
                />

                <button>
                    Change Photo
                </button>

            </div>

            <div className="edit-form">

                <label>
                    Full Name
                </label>

                <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />

                <label>
                    Mobile Number
                </label>

                <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                />

                <label>
                    Email Address
                </label>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button
                    className="save-profile"
                    onClick={handleSave}
                >
                    Save Changes
                </button>

            </div>

        </div>

    );

}

export default EditProfile;