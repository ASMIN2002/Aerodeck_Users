import "./MyAddresses.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/Loading/Loading";
import { FiArrowLeft } from "react-icons/fi";
import { API } from "../../../services/api";

const MAX_ADDRESSES = 4;
const MESSAGE_DURATION = 3000;
const NAV_DELAY = 500;

function getSessionToken() {
    return localStorage.getItem("session_token");
}

function MyAddresses({ setProfilePage, selectedAddress, navigateWithLoading }) {
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [settingPrimary, setSettingPrimary] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [deleteAddressId, setDeleteAddressId] = useState(null);
    const [deletingAddress, setDeletingAddress] = useState(false);

    const menuRef = useRef(null);

    const fetchAddresses = async () => {
        try {
            const res = await fetch(
                `${API}/api/user/address?session_token=${getSessionToken()}`
            );
            const data = await res.json();
            if (data.success) setAddresses(data.data);
        } catch (err) {
            console.error("Address fetch error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();

        const message = sessionStorage.getItem("addressSuccessMessage");
        if (message) {
            setSuccessMessage(message);
            sessionStorage.removeItem("addressSuccessMessage");
            setTimeout(() => setSuccessMessage(""), MESSAGE_DURATION);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setActiveMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSetPrimary = async (address_id) => {
        setSettingPrimary(true);
        try {
            const res = await fetch(
                `${API}/api/user/address/primary/${address_id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_token: getSessionToken() }),
                }
            );
            const data = await res.json();

            if (data.success) {
                setActiveMenu(null);
                await fetchAddresses();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Set primary error:", err.message);
            alert("Server Error");
        } finally {
            setSettingPrimary(false);
        }
    };

    const handleDeleteAddress = async (address_id) => {
        setDeleteAddressId(null);
        setDeletingAddress(true);

        try {
            const res = await fetch(`${API}/api/user/address/${address_id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: getSessionToken() }),
            });
            const data = await res.json();

            if (data.success) {
                setActiveMenu(null);
                await fetchAddresses();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Delete address error:", err.message);
            alert("Server Error");
        } finally {
            setDeletingAddress(false);
        }
    };

    const handleMenuToggle = (id) => {
        setActiveMenu(activeMenu === id ? null : id);
    };

    const handleAddAddress = () => {
        navigateWithLoading(
            () => {
                setProfilePage("addaddress");
                navigate("/profile/address/addaddress");
            },
            "Loading...",
            NAV_DELAY
        );
    };

    const handleEditAddress = (item) => {
        localStorage.setItem("editAddress", JSON.stringify(item));
        setActiveMenu(null);

        navigateWithLoading(
            () => {
                setProfilePage("editaddress");
                navigate("/profile/address/editaddress");
            },
            "Loading Edit Address...",
            NAV_DELAY
        );
    };

    if (loading) {
        return <div className="address-page">Loading...</div>;
    }

    return (
        <>
            {settingPrimary && (
                <Loading manual={true} text="Setting Primary Address..." />
            )}
            {deletingAddress && (
                <Loading manual={true} text="Deleting Address..." />
            )}

            <div className="address-page">
                {successMessage && (
                    <div className="address-success-message">{successMessage}</div>
                )}

                <div className="address-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>

                    <div>
                        <h2>My Addresses</h2>
                        {addresses.length >= MAX_ADDRESSES && (
                            <p>Maximum {MAX_ADDRESSES} addresses are allowed</p>
                        )}
                    </div>

                    <button
                        className="add-btn"
                        disabled={addresses.length >= MAX_ADDRESSES}
                        onClick={handleAddAddress}
                    >
                        + Add
                    </button>
                </div>

                {addresses.length === 0 && (
                    <div className="empty-address">No saved addresses</div>
                )}

                {addresses.map((item) => {
                    const isPrimary = item.is_primary === 1;
                    const isSelected =
                        selectedAddress?.address_id === item.address_id;

                    return (
                        <div
                            className={`address-card ${isSelected ? "selected" : ""}`}
                            key={item.address_id}
                        >
                            <div className="address-top">
                                <div>
                                    <h3>{item.address_type}</h3>
                                    {isPrimary && (
                                        <span className="primary-badge">PRIMARY</span>
                                    )}
                                </div>

                                <button
                                    className="menu-btn"
                                    onClick={() => handleMenuToggle(item.address_id)}
                                >
                                    ⋮
                                </button>

                                {activeMenu === item.address_id && (
                                    <div className="address-menu" ref={menuRef}>
                                        {!isPrimary && (
                                            <button
                                                onClick={() =>
                                                    handleSetPrimary(item.address_id)
                                                }
                                            >
                                                Set as Primary
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleEditAddress(item)}
                                        >
                                            Edit Address
                                        </button>

                                        {!isPrimary && (
                                            <button
                                                className="delete-btn"
                                                onClick={() => {
                                                    setDeleteAddressId(item.address_id);
                                                    setActiveMenu(null);
                                                }}
                                            >
                                                Delete Address
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="namnum">
                                <h4>{item.full_name}</h4>
                                <p>+91 {item.mobile_number}</p>
                            </div>

                            <p>
                                {item.house_flat}, {item.area_street}, {item.landmark},{" "}
                                {item.city}, {item.state} - {item.pincode}
                            </p>
                        </div>
                    );
                })}
            </div>

            {deleteAddressId && (
                <div
                    className="delete-confirm-overlay"
                    onClick={() => setDeleteAddressId(null)}
                >
                    <div
                        className="delete-confirm-box"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Want to delete this address?</h3>
                        <p>This action cannot be undone.</p>

                        <div className="delete-confirm-actions">
                            <button
                                type="button"
                                onClick={() => setDeleteAddressId(null)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="confirm-delete-btn"
                                onClick={() => handleDeleteAddress(deleteAddressId)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default MyAddresses;