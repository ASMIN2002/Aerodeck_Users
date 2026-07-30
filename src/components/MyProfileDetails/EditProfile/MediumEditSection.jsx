import "./MediumEditSection.css";

function MediumEditSection({ user }) {

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
                        defaultValue={user?.full_name || ""}
                        placeholder="Enter your full name"
                    />

                    <button>
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