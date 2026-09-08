import "./Address.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiCreditCard } from "react-icons/fi";
import { API } from "../../services/api";

function Address({
    setProfilePage,
    setSelectedBottomTab
}) {
    const navigate = useNavigate();

    const [primaryAddress, setPrimaryAddress] = useState(null);
    const [showComingSoon, setShowComingSoon] = useState(false);
    useEffect(() => {
        fetchPrimaryAddress();
    }, []);
    const fetchPrimaryAddress = async () => {

        try {

            const sessionToken = localStorage.getItem("session_token");

            const response = await fetch(
                `${API}/api/user/address?session_token=${sessionToken}`
            );
            const data = await response.json();

            if (data.success) {

                const primary = data.data.find(
                    address => address.is_primary === 1
                );

                setPrimaryAddress(primary || null);

            }

        } catch (error) {

            console.error(error);

        }

    };

    return (
        < div className="ad-container" >
            <button
                className="ad-button"
                type="button"
                onClick={() => {
                    setSelectedBottomTab("Profile");
                    setProfilePage("address");
                    navigate("/profile/address");
                }}
            >
                <FiMapPin className="ad-icon" />

                {primaryAddress ? (
                    <span className="ad-text">
                        {primaryAddress.city},{" "}
                        {primaryAddress.state},{" "}
                        {primaryAddress.area_street},{" "}
                        {primaryAddress.house_flat}
                    </span>
                ) : (
                    <span className="ad-text ad-no-address">
                        Choose the Primary address for delivery
                    </span>
                )}

                <span className="ad-arrow">›</span>
            </button>
            <button
                className="ad-money-box"
                type="button"
                onClick={() => {
                    setShowComingSoon(true);

                    setTimeout(() => {
                        setShowComingSoon(false);
                    }, 2500);
                }}
            >
                <FiCreditCard className="money-icon" />
                <span className="money-amount">₹0</span>
            </button>
            {
                showComingSoon && (
                    <div className="ad-coming-toast">
                        HYPO Coming Soon
                    </div>
                )
            }
        </div >


    );

}

export default Address;