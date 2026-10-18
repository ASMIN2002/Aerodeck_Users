import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddEdit.css";
import { FiArrowLeft } from "react-icons/fi";
import Toast from "../../../components/Toast/Toast";
import Loading from "../../../components/Loading/Loading";
import { API } from "../../../services/api";

const TOAST_DURATION = 3000;
const PIN_LENGTH = 6;
const MOBILE_LENGTH = 10;

const ADDRESS_TYPES = [
    { value: "Home", label: "🏠 Home" },
    { value: "Work", label: "🏢 Work" },
    { value: "Other", label: "📍 Other" },
];

function getSessionToken() {
    return localStorage.getItem("session_token");
}

function AddAddress({ setProfilePage }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        session_token: getSessionToken(),
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
    });

    const [areas, setAreas] = useState([]);
    const [loadingPin, setLoadingPin] = useState(false);
    const [deliveryAvailable, setDeliveryAvailable] = useState(true);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [savingAddress, setSavingAddress] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(
            () => setToast({ show: false, message: "", type }),
            TOAST_DURATION
        );
    };

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const updateFields = (updates) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    const fetchPincode = async (pin) => {
        if (pin.length !== PIN_LENGTH) return;

        try {
            setLoadingPin(true);

            const res = await fetch(`${API}/api/user/address/pincode/${pin}`);
            const data = await res.json();

            if (data.success) {
                setDeliveryAvailable(true);
                updateFields({
                    pincode: pin,
                    city: data.location.city,
                    state: data.location.state,
                    country: data.location.country,
                    area_street: "",
                });
                setAreas(data.areas);
            } else {
                setDeliveryAvailable(false);
                setAreas([]);
                updateFields({
                    city: "",
                    state: "",
                    country: "",
                    area_street: "",
                });
                showToast(
                    data.message || "Delivery only available inside Balasore.",
                    "error"
                );
            }
        } catch (err) {
            console.error("Pincode fetch error:", err.message);
        } finally {
            setLoadingPin(false);
        }
    };

    const handleCurrentLocation = () => {
        setLoadingLocation(true);

        if (!navigator.geolocation) {
            setLoadingLocation(false);
            showToast("Geolocation is not supported.", "error");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    const { latitude, longitude } = coords;

                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await res.json();
                    const address = data.address || {};
                    const pin = address.postcode || "";

                    updateFields({
                        latitude,
                        longitude,
                        pincode: pin,
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
        const {
            full_name,
            mobile_number,
            pincode,
            state,
            city,
            area_street,
            house_flat,
            address_type,
        } = formData;

        if (!full_name.trim()) return "Please enter Full Name.";
        if (!mobile_number.trim()) return "Please enter Mobile Number.";
        if (!/^\d{10}$/.test(mobile_number))
            return "Please enter a valid 10-digit Mobile Number.";
        if (!pincode.trim()) return "Please enter PIN Code.";
        if (!deliveryAvailable) return "Delivery only available inside Balasore.";
        if (!state.trim()) return "Please enter a valid PIN Code.";
        if (!city.trim()) return "Please enter a valid PIN Code.";
        if (!area_street.trim()) return "Please select Area / Post Office.";
        if (!house_flat.trim()) return "Please enter House / Flat No.";
        if (!address_type.trim()) return "Please select Address Type.";

        return null;
    };

    const handlePincodeChange = (e) => {
        const pin = e.target.value.replace(/\D/g, "");

        setFormData((prev) => ({
            ...prev,
            pincode: pin,
            ...(pin.length < PIN_LENGTH && {
                city: "",
                state: "",
                country: "",
                area_street: "",
            }),
        }));

        if (pin.length < PIN_LENGTH) {
            setAreas([]);
            setDeliveryAvailable(true);
        }

        if (pin.length === PIN_LENGTH) fetchPincode(pin);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const error = validateForm();
        if (error) {
            showToast(error, "error");
            return;
        }

        setSavingAddress(true);

        try {
            const res = await fetch(`${API}/api/user/address`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (data.success) {
                sessionStorage.setItem(
                    "addressSuccessMessage",
                    "Address added successfully."
                );
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

    const handleBack = () => {
        setProfilePage("viewaddress");
        navigate("/profile/viewaddress");
    };
    
    return (
        <>
            {loadingLocation && (
                <Loading manual={true} text="Detecting Location..." />
            )}
            {savingAddress && (
                <Loading manual={true} text="Saving Address..." />
            )}

            <div className="heep-add-addr-page">
                <div className="heep-add-addr-header">
                    <button
                        className="heep-add-addr-back-btn"
                        onClick={handleBack}
                    >
                        <FiArrowLeft />
                    </button>

                    <button
                        type="button"
                        className="heep-add-addr-location-btn"
                        onClick={handleCurrentLocation}
                    >
                        📍 Set Current Location
                    </button>

                    <h2>Add Address</h2>
                </div>

                <form className="heep-add-addr-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.full_name}
                        onChange={(e) => updateField("full_name", e.target.value)}
                    />

                    <input
                        type="tel"
                        placeholder="Mobile Number"
                        maxLength={MOBILE_LENGTH}
                        value={formData.mobile_number}
                        onChange={(e) =>
                            updateField(
                                "mobile_number",
                                e.target.value.replace(/\D/g, "")
                            )
                        }
                    />

                    <input
                        type="text"
                        placeholder="House / Flat / Building"
                        value={formData.house_flat}
                        onChange={(e) => updateField("house_flat", e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="PIN Code"
                        maxLength={PIN_LENGTH}
                        value={formData.pincode}
                        onChange={handlePincodeChange}
                    />

                    <select
                        value={formData.area_street}
                        onChange={(e) => updateField("area_street", e.target.value)}
                        disabled={areas.length === 0}
                        className={
                            areas.length === 0 ? "heep-add-addr-empty-select" : ""
                        }
                    >
                        <option value="">
                            {areas.length === 0
                                ? "First add the pincode..."
                                : "Select Area"}
                        </option>
                        {areas.map((area) => (
                            <option key={`${formData.pincode}-${area}`} value={area}>
                                {area}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Landmark (Optional)"
                        value={formData.landmark}
                        onChange={(e) => updateField("landmark", e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        readOnly
                    />

                    <input
                        type="text"
                        placeholder="State"
                        value={formData.state}
                        readOnly
                    />

                    <input
                        type="text"
                        placeholder="Country"
                        value={formData.country}
                        readOnly
                    />

                    <div className="heep-add-addr-type">
                        {ADDRESS_TYPES.map((type) => (
                            <label key={type.value}>
                                <input
                                    type="radio"
                                    name="type"
                                    value={type.value}
                                    checked={formData.address_type === type.value}
                                    onChange={(e) =>
                                        updateField("address_type", e.target.value)
                                    }
                                />
                                {type.label}
                            </label>
                        ))}
                    </div>

                    <button type="submit" className="heep-add-addr-save-btn">
                        Save Address
                    </button>
                </form>

                <Toast
                    show={toast.show}
                    message={toast.message}
                    type={toast.type}
                />
            </div>
        </>
    );
}

export default AddAddress;