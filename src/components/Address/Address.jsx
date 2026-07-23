import "./Address.css";
import { useEffect, useState } from "react";
import { API } from "../../services/api";

function Address({
    setProfilePage,
    setSelectedBottomTab
}) {

    const [primaryAddress, setPrimaryAddress] = useState(null);
    useEffect(() => {
        fetchPrimaryAddress();
    }, []);
    const fetchPrimaryAddress = async () => {

        try {

            const user = JSON.parse(localStorage.getItem("user"));

            const response = await fetch(
                `${API}/api/user/address/${user.user_id}`
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

        <div className="ad-container">
            <button
                className="ad-button"
                type="button"
                onClick={() => {
                    setSelectedBottomTab("Profile");
                    setProfilePage("address");
                }}
            >
                <span className="ad-icon">
                    📍
                </span>

                {
                    primaryAddress ? (

                        <span className="ad-text">

                            {primaryAddress.city},
                            {" "}
                            {primaryAddress.state},
                            {" "}
                            {primaryAddress.area_street},
                            {" "}
                            {primaryAddress.house_flat}

                        </span>

                    ) : (

                        <span className="ad-text ad-no-address">

                            Choose the Primary address for delivery

                        </span>

                    )
                }

                <span className="ad-arrow">
                    ›
                </span>

            </button>

        </div>

    );

}

export default Address;