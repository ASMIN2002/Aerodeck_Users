import "./MyAddresses.css";
import { useEffect, useRef, useState } from "react";
import Loading from "../../../components/Loading/Loading";
import { FiArrowLeft } from "react-icons/fi";
import { API } from "../../../services/api";

function MyAddresses({
    setProfilePage,
    selectedAddress,
    setSelectedAddress,
    navigateWithLoading
}) {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [settingPrimary, setSettingPrimary] = useState(false);
    const sessionToken = localStorage.getItem("session_token");
    const [activeMenu, setActiveMenu] = useState(null);
    const menuRef = useRef(null);
    useEffect(() => { fetchAddresses(); }, []);
    const fetchAddresses = async () => {
        try {
            const response = await fetch(
                `${API}/api/user/address?session_token=${sessionToken}`
            );
            const data = await response.json();
            if (data.success) {
                setAddresses(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const handleSetPrimary = async (address_id) => {
        setSettingPrimary(true);
        try {
            const response = await fetch(
                `${API}/api/user/address/primary/${address_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        session_token: sessionToken
                    })
                }
            );

            const data = await response.json();
            if (data.success) {
                setActiveMenu(null);
                await fetchAddresses();
                setSettingPrimary(false);
            } else {
                setSettingPrimary(false);
                alert(data.message);
            }
        } catch (err) {
            setSettingPrimary(false);
            console.error(err);
            alert("Server Error");
        }
    };
    const handleDeleteAddress = async (address_id) => {
        try {
            const response = await fetch(
                `${API}/api/user/address/${address_id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        session_token: sessionToken
                    })
                }
            );
            const data = await response.json();
            if (data.success) {
                setActiveMenu(null);
                fetchAddresses();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Server Error");
        }
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setActiveMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);
    const handleMenu = (id) => {
        setActiveMenu(activeMenu === id ? null : id);
    };
    if (loading) {
        return (
            <div className="address-page">
                Loading...
            </div>
        );
    }
    return (

        <>

            {
                settingPrimary && (
                    <Loading
                        manual={true}
                        text="Setting Primary Address..."
                    />
                )
            }

            <div className="address-page">
                <div className="address-header">
                    <button
                        className="back-btn"
                        onClick={() => setProfilePage("profile")}
                    >
                        <FiArrowLeft />
                    </button>
                    <div>
                        <h2>
                            My Addresses
                        </h2>
                        {
                            addresses.length >= 4 && (
                                <p>
                                    Maximum 4 addresses are allowed
                                </p>
                            )
                        }
                    </div>
                    <button
                        className="add-btn"
                        disabled={addresses.length >= 4}
                        onClick={() => {

                            navigateWithLoading(
                                () => {
                                    setProfilePage("addaddress");
                                },
                                "Loading...",
                                500
                            );

                        }}
                    >
                        + Add
                    </button>
                </div>
                {
                    addresses.length === 0 &&
                    <div className="empty-address">
                        No saved addresses
                    </div>
                }
                {
                    addresses.map((item) => (
                        <div
                            className={`address-card ${selectedAddress?.address_id === item.address_id ? "selected" : ""
                                }`}
                            key={item.address_id}
                        >
                            <div className="address-top">
                                <div>
                                    <h3>
                                        {item.address_type}
                                    </h3>
                                    {
                                        item.is_primary === 1 &&
                                        <span className="primary-badge">
                                            PRIMARY
                                        </span>
                                    }
                                </div>
                                <button
                                    className="menu-btn"
                                    onClick={() => handleMenu(item.address_id)}
                                >
                                    ⋮
                                </button>
                                {
                                    activeMenu === item.address_id && (
                                        <div
                                            className="address-menu"
                                            ref={menuRef}
                                        >
                                            {
                                                item.is_primary !== 1 && (
                                                    <button
                                                        onClick={() => handleSetPrimary(item.address_id)}
                                                    >
                                                        Set as Primary
                                                    </button>
                                                )
                                            }
                                            <button
                                                onClick={() => {

                                                    localStorage.setItem(
                                                        "editAddress",
                                                        JSON.stringify(item)
                                                    );

                                                    setActiveMenu(null);

                                                    navigateWithLoading(
                                                        () => {
                                                            setProfilePage("editaddress");
                                                        },
                                                        "Loading Edit Address...",
                                                        500
                                                    );

                                                }}
                                            >
                                                Edit Address
                                            </button>
                                            {
                                                item.is_primary !== 1 && (
                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => handleDeleteAddress(item.address_id)}
                                                    >
                                                        Delete Address
                                                    </button>

                                                )
                                            }
                                        </div>
                                    )
                                }
                            </div>
                            <div className="namnum">
                                <h4>
                                    {item.full_name}
                                </h4>
                                <p>
                                    +91 {item.mobile_number}
                                </p>
                            </div>
                            <p>
                                {item.house_flat}, {item.area_street}, {item.landmark}, {item.city}, {item.state} - {item.pincode}
                            </p>
                        </div>
                    ))
                }
            </div>
        </>
    );
}
export default MyAddresses;