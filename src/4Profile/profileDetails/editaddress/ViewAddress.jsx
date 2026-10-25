import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiArrowUp,
    FiHome, FiBriefcase, FiMapPin, FiStar, FiUser, FiPhone,
} from "react-icons/fi";
import { API } from "../../../services/api";
import Toast from "../../../1hook/hooks/Toast";
import "./ViewAddress.css";

const MAX_ADDRESSES = 4;
const TOAST_DURATION = 3000;

const getSession = () => localStorage.getItem("session_token");

const TYPE_ICONS = { Home: FiHome, Work: FiBriefcase, Other: FiMapPin };

function ViewAddress({ setProfilePage }) {
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [deleteAddressId, setDeleteAddressId] = useState(null);
    const [primaryAddressId, setPrimaryAddressId] = useState(null);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type }), TOAST_DURATION);
    };

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
            sessionStorage.removeItem("addressSuccessMessage");
            showToast(message, "success");
        }
    }, []);

    const handleBack = () => {
        setProfilePage("profile");
        navigate(-1);
    };
    
    const handleAddAddress = () => {
        if (addresses.length >= MAX_ADDRESSES) return;
        setProfilePage("addaddress");
        navigate("/profile/viewaddress/addaddress");
    };

    const handleEditAddress = (item) => {
        localStorage.setItem("editAddress", JSON.stringify(item));
        setProfilePage("editaddress");
        navigate("/profile/viewaddress/editaddress");
    };

    const handleDeleteAddress = async () => {
        if (!deleteAddressId) return;
        try {
            const data = await fetch(`${API}/api/user/address/${deleteAddressId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: getSession() }),
            }).then((r) => r.json());

            if (data.success) {
                setDeleteAddressId(null);
                showToast("Address deleted successfully.", "success");
                fetchAddresses();
            } else {
                showToast(data.message || "Failed to delete", "error");
            }
        } catch (err) {
            console.error("Delete error:", err.message);
            showToast("Server Error", "error");
        }
    };

    const handleSetPrimary = async () => {
        if (!primaryAddressId) return;
        try {
            const data = await fetch(`${API}/api/user/address/primary/${primaryAddressId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: getSession() }),
            }).then((r) => r.json());

            if (data.success) {
                setPrimaryAddressId(null);
                showToast("Address set as primary.", "success");
                fetchAddresses();
            } else {
                showToast(data.message || "Failed to set primary", "error");
            }
        } catch (err) {
            console.error("Set primary error:", err.message);
            showToast("Server Error", "error");
        }
    };

    const emptySlots = MAX_ADDRESSES - addresses.length;

    return (
        <>
            <div className="va-page">
                <div className="va-header">
                    <button className="va-back" onClick={handleBack} aria-label="Back">
                        <FiArrowLeft />
                    </button>
                    <h2 className="va-title">My Addresses</h2>
                    <span className="va-count">{addresses.length}/{MAX_ADDRESSES}</span>
                </div>

                {addresses.length === 0 && (
                    <div className="va-empty-state">
                        <FiMapPin className="va-empty-icon" />
                        <h3>No saved addresses</h3>
                        <p>Add your first address to get started</p>
                    </div>
                )}

                <div className="va-grid">
                    {addresses.map((item) => {
                        const isPrimary = item.is_primary === 1;
                        const TypeIcon = TYPE_ICONS[item.address_type] || FiMapPin;

                        return (
                            <div className={`va-card ${isPrimary ? "primary" : ""}`} key={item.address_id}>
                                <div className="va-card-top">
                                    <div className="va-card-type">
                                        <span className="va-type-icon"><TypeIcon /></span>
                                        <h3 className="va-type-name">{item.address_type}</h3>
                                        {isPrimary && (
                                            <span className="va-primary-badge">
                                                <FiStar /> PRIMARY
                                            </span>
                                        )}
                                    </div>

                                    <div className="va-card-actions">
                                        {!isPrimary && (
                                            <button className="va-icon-btn primary" onClick={() => setPrimaryAddressId(item.address_id)} aria-label="Set as Primary">
                                                <FiArrowUp />
                                            </button>
                                        )}
                                        <button className="va-icon-btn edit" onClick={() => handleEditAddress(item)} aria-label="Edit">
                                            <FiEdit2 />
                                        </button>
                                        {!isPrimary && (
                                            <button className="va-icon-btn delete" onClick={() => setDeleteAddressId(item.address_id)} aria-label="Delete">
                                                <FiTrash2 />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="va-namnum">
                                    <h4><FiUser /> {item.full_name}</h4>
                                    <p><FiPhone /> +91 {item.mobile_number}</p>
                                </div>

                                <p className="va-address-line">
                                    <FiMapPin /> {[item.house_flat, item.area_street, item.landmark, item.city, item.state, item.pincode].filter(Boolean).join(", ")}
                                </p>
                            </div>
                        );
                    })}

                    {emptySlots > 0 && Array.from({ length: emptySlots }).map((_, i) => (
                        <button key={`empty-${i}`} className="va-empty-slot" onClick={handleAddAddress} aria-label="Add Address">
                            <FiPlus className="va-plus-icon" />
                            <span>Add Address</span>
                        </button>
                    ))}
                </div>
            </div>

            {deleteAddressId && (
                <div className="va-delete-overlay" onClick={() => setDeleteAddressId(null)}>
                    <div className="va-delete-box" onClick={(e) => e.stopPropagation()}>
                        <div className="va-modal-icon delete-icon"><FiTrash2 /></div>
                        <h3>Delete this address?</h3>
                        <p>This action cannot be undone.</p>
                        <div className="va-delete-actions">
                            <button type="button" className="va-cancel-btn" onClick={() => setDeleteAddressId(null)}>Cancel</button>
                            <button type="button" className="va-confirm-delete-btn" onClick={handleDeleteAddress}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {primaryAddressId && (
                <div className="va-delete-overlay" onClick={() => setPrimaryAddressId(null)}>
                    <div className="va-delete-box" onClick={(e) => e.stopPropagation()}>
                        <div className="va-modal-icon primary-icon"><FiArrowUp /></div>
                        <h3>Make this address primary?</h3>
                        <p>Your future orders will be delivered here.</p>
                        <div className="va-delete-actions">
                            <button type="button" className="va-cancel-btn" onClick={() => setPrimaryAddressId(null)}>Cancel</button>
                            <button type="button" className="va-confirm-primary-btn" onClick={handleSetPrimary}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            <Toast show={toast.show} message={toast.message} type={toast.type} />
        </>
    );
}

export default ViewAddress;