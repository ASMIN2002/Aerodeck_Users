import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiHome, FiBriefcase, FiNavigation, FiUser, FiPhone, FiMap } from "react-icons/fi";
import Toast from "../../../1hook/hooks/Toast";
import { API } from "../../../services/api";
import "./AddEdit.css";

const TOAST_DURATION = 3000;
const PIN_LENGTH = 6;
const MOBILE_LENGTH = 10;

const ADDRESS_TYPES = [
    { value: "Home", label: "Home", Icon: FiHome },
    { value: "Work", label: "Work", Icon: FiBriefcase },
    { value: "Other", label: "Other", Icon: FiMapPin },
];

const getSession = () => localStorage.getItem("session_token");

const EMPTY_FORM = {
    full_name: "",
    mobile_number: "",
    house_flat: "",
    area_street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    latitude: null,
    longitude: null,
    address_type: "Home",
};

function AddAddress({ setProfilePage }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [areas, setAreas] = useState([]);
    const [deliveryAvailable, setDeliveryAvailable] = useState(true);
    const [loadingPin, setLoadingPin] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [savingAddress, setSavingAddress] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type }), TOAST_DURATION);
    };

    const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
    const updateFields = (updates) => setFormData((prev) => ({ ...prev, ...updates }));

    const fetchPincode = async (pin) => {
        if (pin.length !== PIN_LENGTH) return;
        setLoadingPin(true);

        try {
            const data = await fetch(`${API}/api/user/address/pincode/${pin}`).then((r) => r.json());

            if (data.success) {
                setDeliveryAvailable(true);
                updateFields({ pincode: pin, city: data.location.city, state: data.location.state, country: data.location.country, area_street: "" });
                setAreas(data.areas);
            } else {
                setDeliveryAvailable(false);
                setAreas([]);
                updateFields({ city: "", state: "", country: "", area_street: "" });
                showToast(data.message || "Delivery only available inside Balasore.", "error");
            }
        } catch (err) {
            console.error("Pincode fetch error:", err.message);
        } finally {
            setLoadingPin(false);
        }
    };

    const handleCurrentLocation = () => {
        if (!navigator.geolocation) return showToast("Geolocation is not supported.", "error");

        setLoadingLocation(true);

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    const { latitude, longitude } = coords;
                    const data = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`).then((r) => r.json());
                    const address = data.address || {};
                    const pin = address.postcode || "";

                    updateFields({
                        latitude, longitude, pincode: pin,
                        city: address.city || address.town || address.village || "",
                        state: address.state || "",
                        country: address.country || "",
                    });

                    if (pin.length === PIN_LENGTH) fetchPincode(pin);
                    showToast("Current location detected.");
                } catch (err) {
                    console.error("Reverse geocode error:", err.message);
                    showToast("Unable to fetch location.", "error");
                } finally {
                    setLoadingLocation(false);
                }
            },
            () => {
                setLoadingLocation(false);
                showToast("Location permission denied.", "error");
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const validateForm = () => {
        const { full_name, mobile_number, pincode, state, city, area_street, house_flat, address_type } = formData;
        if (!full_name.trim()) return "Please enter full name.";
        if (!mobile_number.trim()) return "Please enter mobile number.";
        if (!/^\d{10}$/.test(mobile_number)) return "Please enter a valid 10-digit mobile number.";
        if (!pincode.trim()) return "Please enter PIN code.";
        if (!deliveryAvailable) return "Delivery only available inside Balasore.";
        if (!state.trim() || !city.trim()) return "Please enter a valid PIN code.";
        if (!area_street.trim()) return "Please select area / post office.";
        if (!house_flat.trim()) return "Please enter house / flat no.";
        if (!address_type.trim()) return "Please select address type.";
        return null;
    };

    const handlePincodeChange = (e) => {
        const pin = e.target.value.replace(/\D/g, "");
        setFormData((prev) => ({
            ...prev, pincode: pin,
            ...(pin.length < PIN_LENGTH && { city: "", state: "", country: "", area_street: "" }),
        }));

        if (pin.length < PIN_LENGTH) { setAreas([]); setDeliveryAvailable(true); }
        if (pin.length === PIN_LENGTH) fetchPincode(pin);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = validateForm();
        if (error) return showToast(error, "error");

        setSavingAddress(true);
        try {
            const data = await fetch(`${API}/api/user/address`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, session_token: getSession() }),
            }).then((r) => r.json());

            if (data.success) {
                sessionStorage.setItem("addressSuccessMessage", "Address added successfully.");
                setProfilePage("viewaddress");
                navigate("/profile/viewaddress", { replace: true });
            } else {
                showToast(data.message, "error");
            }
        } catch (err) {
            console.error("Save address error:", err.message);
            showToast("Unable to save address.", "error");
        } finally {
            setSavingAddress(false);
        }
    };

    const handleBack = () => { setProfilePage("viewaddress"); navigate("/profile/viewaddress"); };

    return (
        <>
            <div className="heep-add-addr-page">
                <div className="heep-add-addr-header">
                    <button type="button" className="heep-add-addr-back-btn" onClick={handleBack} aria-label="Back">
                        <FiArrowLeft />
                    </button>
                    <h2 className="heep-add-addr-title">Add Address</h2>
                    <button type="button" className="heep-add-addr-location-btn" onClick={handleCurrentLocation} disabled={loadingLocation}>
                        {loadingLocation ? "Locating..." : <><FiNavigation /> Location</>}
                    </button>
                </div>

                <form className="heep-add-addr-form" onSubmit={handleSubmit}>
                    <div className="heep-add-addr-section">
                        <h3 className="heep-add-addr-section-title">Contact Details</h3>

                        <div className="heep-add-addr-input-wrap">
                            <FiUser className="heep-add-addr-input-icon" />
                            <input type="text" placeholder="Full Name" value={formData.full_name} onChange={(e) => updateField("full_name", e.target.value)} />
                        </div>

                        <div className="heep-add-addr-input-wrap">
                            <FiPhone className="heep-add-addr-input-icon" />
                            <input type="tel" placeholder="Mobile Number" maxLength={MOBILE_LENGTH} value={formData.mobile_number} onChange={(e) => updateField("mobile_number", e.target.value.replace(/\D/g, ""))} />
                        </div>
                    </div>

                    <div className="heep-add-addr-section">
                        <h3 className="heep-add-addr-section-title">Address Details</h3>

                        <div className="heep-add-addr-input-wrap">
                            <FiHome className="heep-add-addr-input-icon" />
                            <input type="text" placeholder="House / Flat / Building" value={formData.house_flat} onChange={(e) => updateField("house_flat", e.target.value)} />
                        </div>

                        <div className="heep-add-addr-input-wrap">
                            <FiMapPin className="heep-add-addr-input-icon" />
                            <input type="text" placeholder="PIN Code" maxLength={PIN_LENGTH} value={formData.pincode} onChange={handlePincodeChange} />
                        </div>

                        {loadingPin && <div className="heep-add-addr-loading">Fetching area...</div>}

                        <select value={formData.area_street} onChange={(e) => updateField("area_street", e.target.value)} disabled={areas.length === 0} className={`heep-add-addr-select ${areas.length === 0 ? "disabled" : ""}`}>
                            <option value="">{areas.length === 0 ? "Enter PIN code first..." : "Select Area / Post Office"}</option>
                            {areas.map((area) => <option key={`${formData.pincode}-${area}`} value={area}>{area}</option>)}
                        </select>

                        <div className="heep-add-addr-input-wrap">
                            <FiMap className="heep-add-addr-input-icon" />
                            <input type="text" placeholder="Landmark (Optional)" value={formData.landmark} onChange={(e) => updateField("landmark", e.target.value)} />
                        </div>

                        <div className="heep-add-addr-row">
                            <input type="text" placeholder="City" value={formData.city} readOnly />
                            <input type="text" placeholder="State" value={formData.state} readOnly />
                        </div>

                        <input type="text" placeholder="Country" value={formData.country} readOnly />
                    </div>

                    <div className="heep-add-addr-section">
                        <h3 className="heep-add-addr-section-title">Address Type</h3>
                        <div className="heep-add-addr-type">
                            {ADDRESS_TYPES.map(({ value, label, Icon }) => (
                                <label key={value} className={`heep-add-addr-type-option ${formData.address_type === value ? "active" : ""}`}>
                                    <input type="radio" name="type" value={value} checked={formData.address_type === value} onChange={(e) => updateField("address_type", e.target.value)} hidden />
                                    <Icon />
                                    <span>{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="heep-add-addr-save-btn" disabled={savingAddress}>
                        {savingAddress ? "Saving..." : "Save Address"}
                    </button>
                </form>

                <Toast show={toast.show} message={toast.message} type={toast.type} />
            </div>
        </>
    );
}

export default AddAddress;