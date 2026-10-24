import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPlus, FiMoreVertical, FiEdit2, FiTrash2, FiStar, FiMapPin, FiHome, FiBriefcase } from "react-icons/fi";
import { API } from "../../services/api";
import "../profilestyles/Addresses.css";

const MAX_ADDRESSES = 4;
const MESSAGE_DURATION = 3000;

const getSession = () => localStorage.getItem("session_token");

const getTypeIcon = (type) => {
    const t = String(type || "").toLowerCase();
    if (t.includes("home")) return FiHome;
    if (t.includes("work") || t.includes("office")) return FiBriefcase;
    return FiMapPin;
};

function MyAddresses({ setProfilePage, selectedAddress }) {
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [activeMenu, setActiveMenu] = useState(null);
    const [deleteAddressId, setDeleteAddressId] = useState(null);
    const menuRef = useRef(null);

    const fetchAddresses = () => {
        fetch(`${API}/api/user/address?session_token=${getSession()}`)
            .then((r) => r.json())
            .then((data) => { if (data.success) setAddresses(data.data || []); })
            .catch((err) => console.error("Address fetch error:", err.message));
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
            if (menuRef.current && !menuRef.current.contains(e.target)) setActiveMenu(null);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSetPrimary = async (address_id) => {
        try {
            const data = await fetch(`${API}/api/user/address/primary/${address_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: getSession() }),
            }).then((r) => r.json());

            if (data.success) { setActiveMenu(null); fetchAddresses(); }
            else alert(data.message);
        } catch (err) {
            console.error("Set primary error:", err.message);
            alert("Server Error");
        }
    };

    const handleDeleteAddress = async (address_id) => {
        setDeleteAddressId(null);
        try {
            const data = await fetch(`${API}/api/user/address/${address_id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: getSession() }),
            }).then((r) => r.json());

            if (data.success) { setActiveMenu(null); fetchAddresses(); }
            else alert(data.message);
        } catch (err) {
            console.error("Delete address error:", err.message);
            alert("Server Error");
        }
    };

    const handleAddAddress = () => {
        setProfilePage("addaddress");
        navigate("/profile/address/addaddress");
    };

    const handleEditAddress = (item) => {
        localStorage.setItem("editAddress", JSON.stringify(item));
        setActiveMenu(null);
        setProfilePage("editaddress");
        navigate("/profile/address/editaddress");
    };

    return (
        <>
            <div className="address-page">
                {successMessage && <div className="address-success-message">{successMessage}</div>}

                <div className="address-header">
                    <button className="back-btn" onClick={() => navigate(-1)} aria-label="Back">
                        <FiArrowLeft />
                    </button>
                    <div className="address-header-info">
                        <h2>My Addresses</h2>
                        <p>{addresses.length}/{MAX_ADDRESSES} saved</p>
                    </div>
                    <button
                        className="add-btn"
                        disabled={addresses.length >= MAX_ADDRESSES}
                        onClick={handleAddAddress}
                        aria-label="Add Address"
                    >
                        <FiPlus /> Add
                    </button>
                </div>

                {addresses.length === 0 ? (
                    <div className="empty-address">
                        <FiMapPin className="empty-address-icon" />
                        <h3>No saved addresses</h3>
                        <p>Add an address to get started</p>
                    </div>
                ) : (
                    <div className="address-list">
                        {addresses.map((item) => {
                            const isPrimary = item.is_primary === 1;
                            const isSelected = selectedAddress?.address_id === item.address_id;
                            const TypeIcon = getTypeIcon(item.address_type);

                            return (
                                <div className={`address-card ${isSelected ? "selected" : ""} ${isPrimary ? "primary" : ""}`} key={item.address_id}>
                                    <div className="address-card-header">
                                        <div className="address-type-wrap">
                                            <span className="address-type-icon"><TypeIcon /></span>
                                            <h3 className="address-type-name">{item.address_type || "Address"}</h3>
                                            {isPrimary && (
                                                <span className="primary-badge"><FiStar /> PRIMARY</span>
                                            )}
                                        </div>

                                        <div className="address-menu-wrap">
                                            <button
                                                className="menu-btn"
                                                onClick={() => setActiveMenu(activeMenu === item.address_id ? null : item.address_id)}
                                                aria-label="Options"
                                            >
                                                <FiMoreVertical />
                                            </button>

                                            {activeMenu === item.address_id && (
                                                <div className="address-menu" ref={menuRef}>
                                                    {!isPrimary && (
                                                        <button onClick={() => handleSetPrimary(item.address_id)}>
                                                            <FiStar /> Set as Primary
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleEditAddress(item)}>
                                                        <FiEdit2 /> Edit Address
                                                    </button>
                                                    {!isPrimary && (
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => { setDeleteAddressId(item.address_id); setActiveMenu(null); }}
                                                        >
                                                            <FiTrash2 /> Delete Address
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="address-name-row">
                                        <h4>{item.full_name}</h4>
                                        <p>+91 {item.mobile_number}</p>
                                    </div>

                                    <p className="address-full">
                                        {[item.house_flat, item.area_street, item.landmark, item.city, item.state, item.pincode].filter(Boolean).join(", ")}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {deleteAddressId && (
                <div className="delete-confirm-overlay" onClick={() => setDeleteAddressId(null)}>
                    <div className="delete-confirm-box" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-icon-wrap"><FiTrash2 /></div>
                        <h3>Delete this address?</h3>
                        <p>This action cannot be undone.</p>
                        <div className="delete-confirm-actions">
                            <button type="button" className="cancel-btn" onClick={() => setDeleteAddressId(null)}>Cancel</button>
                            <button type="button" className="confirm-delete-btn" onClick={() => handleDeleteAddress(deleteAddressId)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default MyAddresses;