import "./Profile.css";
import AerodeckDP from "../../assets/AerodeckDP.png";

function Profile({
    user,
    setUser,
    setPage,
    onLogout,
    setProfilePage
}) {
    const demoUser = {
        name: "Asmin Kuldeep Jena",
        mobile: "9876543210"
    };

    return (

        <div className="profile">

            <div className="profile-header">

                <img
                    src={user?.profile_image || AerodeckDP}
                    alt="Profile"
                    className="profile-image"
                />

                <h2>{user.full_name}</h2>

                <p>{user.mobile_number}</p>

                <button className="edit-profile-btn"
                    onClick={() => setProfilePage("editprofile")}
                >
                    Edit Profile
                </button>

            </div>

            <div className="profile-menu">

                <div
                    className="profile-item"
                    onClick={() => setProfilePage("address")}
                >
                    <span>📍</span>
                    <span>My Addresses</span>
                </div>

                <div
                    className="profile-item"
                    onClick={() => setProfilePage("wishlist")}
                >
                    <span>❤️</span>
                    <span>Wishlist</span>
                </div>

                <div
                    className="profile-item"
                    onClick={() => setProfilePage("cart")}
                >
                    <span>🛒</span>
                    <span>My Cart</span>
                </div>
                <div
                    className="profile-item"
                    onClick={() => setProfilePage("orders")}
                >
                    <span>📦</span>
                    <span>My Orders</span>
                </div>
                <div
                    className="profile-item"
                    onClick={() => setProfilePage("rewards")}
                >
                    <span>🎁</span>
                    <span>My Rewards</span>
                </div>

                <div
                    className="profile-item"
                    onClick={() => setProfilePage("help")}
                >
                    <span>❓</span>
                    <span>Help & Support</span>
                </div>

                <div
                    className="profile-item"
                    onClick={() => setProfilePage("about")}
                >
                    <span>ℹ️</span>
                    <span>About AERODECK</span>
                </div>

            </div>

            <button className="logout-btn"
                onClick={() => {

                    console.log("Logout Clicked");

                    onLogout();

                }}
            >
                Logout
            </button>

            <p className="profile-version">
                AERODECK v1.0.0
            </p>

        </div>

    );

}

export default Profile;