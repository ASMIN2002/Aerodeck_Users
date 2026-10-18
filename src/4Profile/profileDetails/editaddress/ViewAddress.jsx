import "./ViewAddress.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiArrowUp } from "react-icons/fi";
import { API } from "../../../services/api";
import Toast from "../../../components/Toast/Toast";

const MAX_ADDRESSES = 4;
const NAV_DELAY = 500;
const TOAST_DURATION = 3000;

function getSessionToken() {
    return localStorage.getItem("session_token");
}

function ViewAddress({ setProfilePage, navigateWithLoading }) {
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteAddressId, setDeleteAddressId] = useState(null);
    const [primaryAddressId, setPrimaryAddressId] = useState(null);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(
            () => setToast({ show: false, message: "", type }),
            TOAST_DURATION
        );
    };

    const fetchAddresses = async () => {
        try {
            const res = await fetch(
                `${API}/api/user/address?session_token=${getSessionToken()}`
            );
            const data = await res.json();
            if (data.success) setAddresses(data.data || []);
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
        navigateWithLoading(
            () => {
                setProfilePage("addaddress");
                navigate("/profile/viewaddress/addaddress");
            },
            "Loading...",
            NAV_DELAY
        );
    };

    const handleEditAddress = (item) => {
        localStorage.setItem("editAddress", JSON.stringify(item));
        navigateWithLoading(
            () => {
                setProfilePage("editaddress");
                navigate("/profile/viewaddress/editaddress");
            },
            "Loading Edit Address...",
            NAV_DELAY
        );
    };

    const handleDeleteAddress = async () => {
        if (!deleteAddressId) return;

        try {
            const res = await fetch(`${API}/api/user/address/${deleteAddressId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: getSessionToken() }),
            });
            const data = await res.json();

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
            const res = await fetch(
                `${API}/api/user/address/primary/${primaryAddressId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_token: getSessionToken() }),
                }
            );
            const data = await res.json();

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

    if (loading) {
        return <div className="va-page">Loading...</div>;
    }

    const emptySlots = MAX_ADDRESSES - addresses.length;

    return (
        <>
            <div className="va-page">
                <div className="va-header">
                    <button className="va-back" onClick={handleBack}>
                        <FiArrowLeft />
                    </button>
                    <h2>My Addresses</h2>
                </div>

                <div className="va-grid">
                    {addresses.map((item) => {
                        const isPrimary = item.is_primary === 1;

                        return (
                            <div
                                className={`va-card ${isPrimary ? "primary" : ""}`}
                                key={item.address_id}
                            >
                                <div className="va-card-top">
                                    <div className="va-card-type">
                                        <h3>{item.address_type}</h3>
                                        {isPrimary && (
                                            <span className="va-primary-badge">
                                                PRIMARY
                                            </span>
                                        )}
                                    </div>

                                    <div className="va-card-actions">
                                        {!isPrimary && (
                                            <button
                                                className="va-icon-btn primary"
                                                onClick={() =>
                                                    setPrimaryAddressId(
                                                        item.address_id
                                                    )
                                                }
                                                aria-label="Set as Primary"
                                            >
                                                <FiArrowUp />
                                            </button>
                                        )}
                                        <button
                                            className="va-icon-btn edit"
                                            onClick={() => handleEditAddress(item)}
                                            aria-label="Edit"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        {!isPrimary && (
                                            <button
                                                className="va-icon-btn delete"
                                                onClick={() =>
                                                    setDeleteAddressId(
                                                        item.address_id
                                                    )
                                                }
                                                aria-label="Delete"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="va-namnum">
                                    <h4>{item.full_name}</h4>
                                    <p>+91 {item.mobile_number}</p>
                                </div>

                                <p className="va-address-line">
                                    {item.house_flat}, {item.area_street},{" "}
                                    {item.landmark}, {item.city}, {item.state} -{" "}
                                    {item.pincode}
                                </p>
                            </div>
                        );
                    })}

                    {Array.from({ length: emptySlots }).map((_, i) => (
                        <button
                            key={`empty-${i}`}
                            className="va-empty-slot"
                            onClick={handleAddAddress}
                            aria-label="Add Address"
                        >
                            <FiPlus className="va-plus-icon" />
                        </button>
                    ))}
                </div>
            </div>

            {deleteAddressId && (
                <div
                    className="va-delete-overlay"
                    onClick={() => setDeleteAddressId(null)}
                >
                    <div
                        className="va-delete-box"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Want to delete this address?</h3>
                        <p>This action cannot be undone.</p>

                        <div className="va-delete-actions">
                            <button
                                type="button"
                                onClick={() => setDeleteAddressId(null)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="va-confirm-delete-btn"
                                onClick={handleDeleteAddress}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {primaryAddressId && (
                <div
                    className="va-delete-overlay"
                    onClick={() => setPrimaryAddressId(null)}
                >
                    <div
                        className="va-delete-box"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Make this address primary?</h3>
                        <p>Your future orders will be delivered here.</p>

                        <div className="va-delete-actions">
                            <button
                                type="button"
                                onClick={() => setPrimaryAddressId(null)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="va-confirm-primary-btn"
                                onClick={handleSetPrimary}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
            />
        </>
    );
}

export default ViewAddress;