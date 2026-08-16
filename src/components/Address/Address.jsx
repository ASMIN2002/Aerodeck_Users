import "./Address.css";
import { useEffect, useState } from "react";
import { API } from "../../services/api";

function Address({
    setProfilePage,
    setSelectedBottomTab,
    navigateWithLoading
}) {
    const [primaryAddress, setPrimaryAddress] = useState(null);
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

        <div className="ad-container">
            <button
                className="ad-button"
                type="button"
                onClick={() => {

                    navigateWithLoading(
                        () => {

                            setSelectedBottomTab("Profile");
                            setProfilePage("address");

                        },
                        "Loading Addresses...",
                        1000
                    );

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