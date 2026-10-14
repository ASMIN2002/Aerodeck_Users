import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "./EditAddress.css";
import { API } from "../../../services/api";
import Loading from "../../../components/Loading/Loading";

const ADDRESS_TYPES = [
    { value: "Home", label: "🏠 Home" },
    { value: "Work", label: "🏢 Work" },
    { value: "Other", label: "📍 Other" },
];

const COMPARE_FIELDS = [
    "full_name",
    "mobile_number",
    "house_flat",
    "area_street",
    "landmark",
    "city",
    "state",
    "pincode",
    "country",
    "address_type",
];

function getSessionToken() {
    return localStorage.getItem("session_token");
}

function EditAddress({ setProfilePage }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        address_id: "",
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

    const [originalData, setOriginalData] = useState(null);
    const [areas, setAreas] = useState([]);
    const [loadingPin, setLoadingPin] = useState(false);
    const [savingAddress, setSavingAddress] = useState(false);
    const [isChanged, setIsChanged] = useState(false);

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const fetchPincode = async (pin) => {
        if (pin.length !== 6) return;

        try {
            setLoadingPin(true);

            const res = await fetch(`${API}/api/user/address/pincode/${pin}`);
            const data = await res.json();

            if (data.success) {
                const updates = {
                    pincode: pin,
                    city: data.location.city,
                    state: data.location.state,
                    country: data.location.country,
                };

                setFormData((prev) => ({ ...prev, ...updates }));
                setOriginalData((orig) => (orig ? { ...orig, ...updates } : orig));
                setAreas(data.areas);
            }
        } catch (err) {
            console.error("Pincode fetch error:", err.message);
        } finally {
            setLoadingPin(false);
        }
    };

    useEffect(() => {
        const savedAddress = localStorage.getItem("editAddress");
        if (!savedAddress) return;

        const data = JSON.parse(savedAddress);
        const initial = { ...data, session_token: getSessionToken() };

        setFormData(initial);
        setOriginalData(initial);
        setIsChanged(false);

        fetchPincode(data.pincode);
    }, []);

    useEffect(() => {
        if (!originalData || loadingPin) return;

        const changed = COMPARE_FIELDS.some(
            (key) =>
                String(formData[key] ?? "").trim() !==
                String(originalData[key] ?? "").trim()
        );

        setIsChanged(changed);
    }, [formData, originalData, loadingPin]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isChanged) return;

        setSavingAddress(true);

        try {
            const res = await fetch(
                `${API}/api/user/address/${formData.address_id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );
            const data = await res.json();

            if (data.success) {
                localStorage.removeItem("editAddress");
                sessionStorage.setItem(
                    "addressSuccessMessage",
                    "Address updated successfully."
                );
                setProfilePage("address");
                navigate("/profile/address", { replace: true });
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Update address error:", err.message);
        } finally {
            setSavingAddress(false);
        }
    };

    const handleBack = () => {
        setProfilePage("address");
        navigate(-1);
    };

    const handlePincodeChange = (e) => {
        const pin = e.target.value.replace(/\D/g, "");
        updateField("pincode", pin);

        if (pin.length === 6) fetchPincode(pin);
    };

    if (!formData.address_id) return <h2>Loading...</h2>;

    return (
        <div className="heep-edit-addr-page">
            {savingAddress && (
                <Loading manual={true} text="Updating Address..." />
            )}

            <div className="heep-edit-addr-header">
                <button className="heep-edit-addr-back-btn" onClick={handleBack}>
                    <FiArrowLeft />
                </button>
                <h2 className="heep-edit-addr-title">Edit Address</h2>
            </div>

            <form className="heep-edit-addr-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.full_name || ""}
                    onChange={(e) => updateField("full_name", e.target.value)}
                />

                <input
                    type="tel"
                    placeholder="Mobile Number"
                    maxLength={10}
                    value={formData.mobile_number || ""}
                    onChange={(e) =>
                        updateField("mobile_number", e.target.value.replace(/\D/g, ""))
                    }
                />

                <input
                    type="text"
                    placeholder="House / Flat / Building"
                    value={formData.house_flat || ""}
                    onChange={(e) => updateField("house_flat", e.target.value)}
                />

                <select
                    value={formData.area_street || ""}
                    onChange={(e) => updateField("area_street", e.target.value)}
                >
                    <option value="">Select Area</option>
                    {areas.map((area, index) => (
                        <option key={index} value={area}>
                            {area}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Landmark (Optional)"
                    value={formData.landmark || ""}
                    onChange={(e) => updateField("landmark", e.target.value)}
                />

                <input
                    type="text"
                    placeholder="PIN Code"
                    maxLength={6}
                    value={formData.pincode || ""}
                    onChange={handlePincodeChange}
                    readOnly
                />

                <input
                    type="text"
                    placeholder="City"
                    value={formData.city || ""}
                    readOnly
                />

                <input
                    type="text"
                    placeholder="State"
                    value={formData.state || ""}
                    readOnly
                />

                <input
                    type="text"
                    placeholder="Country"
                    value={formData.country || ""}
                    readOnly
                />

                <div className="heep-edit-addr-type">
                    {ADDRESS_TYPES.map((type) => (
                        <label key={type.value}>
                            <input
                                type="radio"
                                name="type"
                                value={type.value}
                                checked={
                                    (formData.address_type || "Home") === type.value
                                }
                                onChange={(e) =>
                                    updateField("address_type", e.target.value)
                                }
                            />
                            {type.label}
                        </label>
                    ))}
                </div>

                <button
                    type="submit"
                    className="heep-edit-addr-save-btn"
                    disabled={!isChanged}
                >
                    Update Address
                </button>
            </form>
        </div>
    );
}

export default EditAddress;