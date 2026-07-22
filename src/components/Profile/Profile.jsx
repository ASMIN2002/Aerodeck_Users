import "./Profile.css";

function Profile() {

    const user = {
        full_name: "ASMIN KULDEEP JENA",
        mobile_number: "+91 9876543210",
        profile_image: "https://i.pravatar.cc/300"
    };

    return (

        <div className="profile">

            <div className="profile-header">

                <img
                    src={user.profile_image}
                    alt={user.full_name}
                    className="profile-image"
                />

                <h2>{user.full_name}</h2>

                <p>{user.mobile_number}</p>

                <button className="edit-profile-btn">
                    Edit Profile
                </button>

            </div>

            <div className="profile-menu">

                <div className="profile-item">
                    <span>📍</span>
                    <span>My Addresses</span>
                </div>

                <div className="profile-item">
                    <span>❤️</span>
                    <span>Wishlist</span>
                </div>

                <div className="profile-item">
                    <span>🛒</span>
                    <span>My Cart</span>
                </div>

                <div className="profile-item">
                    <span>📦</span>
                    <span>My Orders</span>
                </div>

                <div className="profile-item">
                    <span>💳</span>
                    <span>Payments</span>
                </div>

                <div className="profile-item">
                    <span>🎁</span>
                    <span>Rewards</span>
                </div>

                <div className="profile-item">
                    <span>📞</span>
                    <span>Help & Support</span>
                </div>

                <div className="profile-item">
                    <span>⚙️</span>
                    <span>Settings</span>
                </div>

                <div className="profile-item">
                    <span>ℹ️</span>
                    <span>About AERODECK</span>
                </div>

            </div>

            <button className="logout-btn">
                Logout
            </button>

            <p className="profile-version">
                AERODECK v1.0.0
            </p>

        </div>

    );

}

export default Profile;