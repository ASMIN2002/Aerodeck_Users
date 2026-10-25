import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHome, FiBriefcase, FiMapPin, FiUser, FiPhone, FiMap } from "react-icons/fi";
import { API } from "../../../services/api";
import "./AddEdit.css";

const ADDRESS_TYPES = [
    { value: "Home", label: "Home", Icon: FiHome },
    { value: "Work", label: "Work", Icon: FiBriefcase },
    { value: "Other", label: "Other", Icon: FiMapPin },
];

const COMPARE_FIELDS = ["full_name", "mobile_number", "house_flat", "area_street", "landmark", "city", "state", "pincode", "country", "address_type"];
const PIN_LENGTH = 6;
const MOBILE_LENGTH = 10;

const getSession = () => localStorage.getItem("session_token");

function EditAddress({ setProfilePage }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        address_id: "", full_name: "", mobile_number: "", house_flat: "", area_street: "",
        landmark: "", city: "", state: "", pincode: "", country: "",
        latitude: null, longitude: null, address_type: "Home",
    });
    const [originalData, setOriginalData] = useState(null);
    const [areas, setAreas] = useState([]);
    const [loadingPin, setLoadingPin] = useState(false);
    const [savingAddress, setSavingAddress] = useState(false);
    const [isChanged, setIsChanged] = useState(false);

    const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

    const fetchPincode = async (pin) => {
        if (pin.length !== PIN_LENGTH) return;
        setLoadingPin(true);

        try {
            const data = await fetch(`${API}/api/user/address/pincode/${pin}`).then((r) => r.json());

            if (data.success) {
                const updates = { pincode: pin, city: data.location.city, state: data.location.state, country: data.location.country };
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
        const saved = localStorage.getItem("editAddress");
        if (!saved) return;
        const data = JSON.parse(saved);
        const initial = { ...data, session_token: getSession() };
        setFormData(initial);
        setOriginalData(initial);
        setIsChanged(false);
        fetchPincode(data.pincode);
    }, []);

    useEffect(() => {
        if (!originalData || loadingPin) return;
        const changed = COMPARE_FIELDS.some(
            (key) => String(formData[key] ?? "").trim() !== String(originalData[key] ?? "").trim()
        );
        setIsChanged(changed);
    }, [formData, originalData, loadingPin]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isChanged) return;
        setSavingAddress(true);

        try {
            const data = await fetch(`${API}/api/user/address/${formData.address_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, session_token: getSession() }),
            }).then((r) => r.json());

            if (data.success) {
                localStorage.removeItem("editAddress");
                sessionStorage.setItem("addressSuccessMessage", "Address updated successfully.");
                setProfilePage("viewaddress");
                navigate("/profile/viewaddress", { replace: true });
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Update address error:", err.message);
        } finally {
            setSavingAddress(false);
        }
    };

    const handleBack = () => { setProfilePage("viewaddress"); navigate("/profile/viewaddress"); };

    const handlePincodeChange = (e) => {
        const pin = e.target.value.replace(/\D/g, "");
        updateField("pincode", pin);
        if (pin.length === PIN_LENGTH) fetchPincode(pin);
    };

    if (!formData.address_id) return null;

    return (
        <div className="heep-edit-addr-page">
            <div className="heep-edit-addr-header">
                <button type="button" className="heep-edit-addr-back-btn" onClick={handleBack} aria-label="Back">
                    <FiArrowLeft />
                </button>
                <h2 className="heep-edit-addr-title">Edit Address</h2>
            </div>

            <form className="heep-edit-addr-form" onSubmit={handleSubmit}>
                <div className="heep-add-addr-section">
                    <h3 className="heep-add-addr-section-title">Contact Details</h3>

                    <div className="heep-add-addr-input-wrap">
                        <FiUser className="heep-add-addr-input-icon" />
                        <input type="text" placeholder="Full Name" value={formData.full_name || ""} onChange={(e) => updateField("full_name", e.target.value)} />
                    </div>

                    <div className="heep-add-addr-input-wrap">
                        <FiPhone className="heep-add-addr-input-icon" />
                        <input type="tel" placeholder="Mobile Number" maxLength={MOBILE_LENGTH} value={formData.mobile_number || ""} onChange={(e) => updateField("mobile_number", e.target.value.replace(/\D/g, ""))} />
                    </div>
                </div>

                <div className="heep-add-addr-section">
                    <h3 className="heep-add-addr-section-title">Address Details</h3>

                    <div className="heep-add-addr-input-wrap">
                        <FiHome className="heep-add-addr-input-icon" />
                        <input type="text" placeholder="House / Flat / Building" value={formData.house_flat || ""} onChange={(e) => updateField("house_flat", e.target.value)} />
                    </div>

                    <div className="heep-add-addr-input-wrap">
                        <FiMapPin className="heep-add-addr-input-icon" />
                        <input type="text" placeholder="PIN Code" maxLength={PIN_LENGTH} value={formData.pincode || ""} onChange={handlePincodeChange} readOnly />
                    </div>

                    {loadingPin && <div className="heep-add-addr-loading">Fetching area...</div>}

                    <select className="heep-add-addr-select" value={formData.area_street || ""} onChange={(e) => updateField("area_street", e.target.value)}>
                        <option value="">Select Area / Post Office</option>
                        {areas.map((area, i) => <option key={i} value={area}>{area}</option>)}
                    </select>

                    <div className="heep-add-addr-input-wrap">
                        <FiMap className="heep-add-addr-input-icon" />
                        <input type="text" placeholder="Landmark (Optional)" value={formData.landmark || ""} onChange={(e) => updateField("landmark", e.target.value)} />
                    </div>

                    <div className="heep-add-addr-row">
                        <input type="text" placeholder="City" value={formData.city || ""} readOnly />
                        <input type="text" placeholder="State" value={formData.state || ""} readOnly />
                    </div>

                    <input type="text" placeholder="Country" value={formData.country || ""} readOnly style={{ padding: "11px 12px", background: "var(--bg)", border: "1.5px solid var(--bd)", borderRadius: "9px", color: "var(--fg2)", fontSize: "12px", outline: "none" }} />
                </div>

                <div className="heep-add-addr-section">
                    <h3 className="heep-add-addr-section-title">Address Type</h3>
                    <div className="heep-add-addr-type">
                        {ADDRESS_TYPES.map(({ value, label, Icon }) => (
                            <label key={value} className={`heep-add-addr-type-option ${(formData.address_type || "Home") === value ? "active" : ""}`}>
                                <input type="radio" name="type" value={value} checked={(formData.address_type || "Home") === value} onChange={(e) => updateField("address_type", e.target.value)} hidden />
                                <Icon />
                                <span>{label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button type="submit" className="heep-edit-addr-save-btn" disabled={!isChanged || savingAddress}>
                    {savingAddress ? "Updating..." : "Update Address"}
                </button>
            </form>
        </div>
    );
}

export default EditAddress;