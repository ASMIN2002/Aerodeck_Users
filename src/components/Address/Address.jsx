import "./Address.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import { FaBolt } from "react-icons/fa";
import { API } from "../../services/api";

function Address({
    setProfilePage,
    setSelectedBottomTab
}) {
    const navigate = useNavigate();

    const [primaryAddress, setPrimaryAddress] = useState(null);
    const [hypoPoints, setHypoPoints] = useState(0);

    useEffect(() => {
        fetchPrimaryAddress();
        fetchHypoPoints();
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

    const fetchHypoPoints = async () => {

        try {

            const sessionToken = localStorage.getItem("session_token");

            const response = await fetch(
                `${API}/api/user/rewards?session_token=${sessionToken}`
            );
            const data = await response.json();

            if (data.success && data.data) {

                setHypoPoints(data.data.hypo_points || 0);

            }

        } catch (error) {

            console.error(error);

        }

    };

    return (
        <div className="ad-container">

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
                        {primaryAddress.area_street},{" "}
                        {primaryAddress.house_flat},{" "}
                        {primaryAddress.city},{" "}
                        {primaryAddress.state},{" "}
                        {primaryAddress.full_name},{" "}
                        {primaryAddress.address_type},{" "}
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
                    setSelectedBottomTab("Profile");
                    setProfilePage("rewards");
                    navigate("/profile/rewards");
                }}
            >
                <div className="money-icon-circle">
                    <FaBolt className="money-icon" />
                </div>
                <span className="money-amount">{hypoPoints}</span>
            </button>

        </div>
    );

}

export default Address;