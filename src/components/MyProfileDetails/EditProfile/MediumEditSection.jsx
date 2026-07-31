import "./MediumEditSection.css";
import { useState, useEffect } from "react";
import { API } from "../../../services/api";

function MediumEditSection({ user, setUser }) {

    const [fullName, setFullName] = useState("");
    
    useEffect(() => {
        setFullName(user?.full_name || "");
    }, [user]);

    const handleSaveName = async () => {

        try {

            const response = await fetch(
                `${API}/api/user/update-name`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        session_token: localStorage.getItem("session_token"),
                        full_name: fullName
                    })
                }
            );

            const data = await response.json();

            if (data.success) {
                setUser(data.user);
                alert("Name updated successfully.");
            } else {
                alert(data.message);
            }

        } catch (err) {

            console.error(err);
            alert("Server Error");

        }

    };

    return (

        <div className="medium-edit-card">

            {/* Full Name */}

            <div className="medium-field">

                <label>
                    Full Name
                </label>

                <div className="name-input-wrapper">

                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                    />

                    <button
                        onClick={handleSaveName}
                    >
                        Save
                    </button>

                </div>

            </div>


            {/* Login Mobile */}

            <div className="medium-field">

                <label>
                    Login Mobile Number
                </label>

                <div className="mobile-box">

                    <span className="mobile-number">
                        +91 {user?.mobile_number}
                    </span>

                    <span className="verified">
                        Verified
                    </span>

                </div>

            </div>

        </div>

    );

}

export default MediumEditSection;