import "../processstyle/Address.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import { FaCoins } from "react-icons/fa";
import { API } from "../../services/api";

const getSession = () => localStorage.getItem("session_token");

const fetchJSON = async (url) => {
    const res = await fetch(url);
    return res.json();
};

function Address({ setProfilePage, setSelectedBottomTab }) {
    const navigate = useNavigate();
    const [primaryAddress, setPrimaryAddress] = useState(null);
    const [hypoPoints, setHypoPoints] = useState(0);

    useEffect(() => {
        const session = getSession();

        Promise.all([
            fetchJSON(`${API}/api/user/address?session_token=${session}`),
            fetchJSON(`${API}/api/user/rewards?session_token=${session}`),
        ])
            .then(([addr, rewards]) => {
                if (addr.success) {
                    setPrimaryAddress(addr.data.find((a) => a.is_primary === 1) || null);
                }
                if (rewards.success && rewards.data) {
                    setHypoPoints(rewards.data.hypo_points || 0);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    const goto = (page, path) => {
        setSelectedBottomTab("Profile");
        setProfilePage(page);
        navigate(path);
    };

    const addressLabel = primaryAddress
        ? [primaryAddress.area_street, primaryAddress.house_flat, primaryAddress.city, primaryAddress.state, primaryAddress.full_name, primaryAddress.address_type].filter(Boolean).join(", ")
        : null;

    return (
        <div className="ad-container">
            <button className="ad-button" type="button" onClick={() => goto("viewaddress", "/profile/viewaddress")}>
                <FiMapPin className="ad-icon" />
                {addressLabel ? (
                    <span className="ad-text">{addressLabel}</span>
                ) : (
                    <span className="ad-text ad-no-address">Choose the Primary address for delivery</span>
                )}
                <span className="ad-arrow">›</span>
            </button>

            <button className="ad-money-box" type="button" onClick={() => goto("rewards", "/profile/rewards")}>
                <div className="money-icon-circle">
                    <FaCoins className="money-icon" />
                </div>
                <span className="money-amount">{hypoPoints}</span>
            </button>
        </div>
    );
}

export default Address;