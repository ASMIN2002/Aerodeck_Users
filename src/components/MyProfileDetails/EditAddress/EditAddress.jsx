import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "./EditAddress.css";
import { API } from "../../../services/api";
import Loading from "../../../components/Loading/Loading";

function EditAddress({ setProfilePage }) {
    const navigate = useNavigate();

    const sessionToken = localStorage.getItem("session_token");

    const [formData, setFormData] = useState({
        address_id: "",
        session_token: sessionToken,
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
        address_type: "Home"
    });

    const [originalData, setOriginalData] = useState(null);
    const [areas, setAreas] = useState([]);
    const [loadingPin, setLoadingPin] = useState(false);
    const [savingAddress, setSavingAddress] = useState(false);
    const [isChanged, setIsChanged] = useState(false);

    const fetchPincode = async (pin) => {

        if (pin.length !== 6) return;

        try {

            setLoadingPin(true);

            const response = await fetch(
                `${API}/api/user/address/pincode/${pin}`
            );

            const data = await response.json();
            console.log(data.location);

            if (data.success) {

                setFormData(prev => ({
                    ...prev,
                    pincode: pin,
                    city: data.location.city,
                    state: data.location.state,
                    country: data.location.country
                }));

                /* 🔥 originalData bhi mirror karo */
                setOriginalData(orig => {
                    if (!orig) return orig;
                    return {
                        ...orig,
                        pincode: pin,
                        city: data.location.city,
                        state: data.location.state,
                        country: data.location.country
                    };
                });

                setAreas(data.areas);

            }

        } catch (error) {

            console.error(error);

        } finally {

            setLoadingPin(false);

        }

    };

    useEffect(() => {

        const savedAddress = localStorage.getItem("editAddress");

        if (savedAddress) {

            const data = JSON.parse(savedAddress);

            const initial = {
                ...data,
                session_token: sessionToken
            };

            setFormData(initial);
            setOriginalData(initial);
            setIsChanged(false);

            fetchPincode(data.pincode);

        }

    }, []);

    useEffect(() => {

        if (!originalData) return;
        if (loadingPin) return;

        const fieldsToCompare = [
            "full_name",
            "mobile_number",
            "house_flat",
            "area_street",
            "landmark",
            "city",
            "state",
            "pincode",
            "country",
            "address_type"
        ];

        const changed = fieldsToCompare.some(
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

            const response = await fetch(

                `${API}/api/user/address/${formData.address_id}`,

                {

                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(formData)

                }

            );

            const data = await response.json();

            if (data.success) {

                setSavingAddress(false);

                localStorage.removeItem("editAddress");

                sessionStorage.setItem(
                    "addressSuccessMessage",
                    "Address updated successfully."
                );

                setProfilePage("address");
                navigate("/profile/address", { replace: true });

            } else {

                setSavingAddress(false);

                alert(data.message);

            }

        } catch (error) {

            setSavingAddress(false);

            console.error(error);

        }

    };

    /* 🔥 Back button handler */
    const handleBack = () => {
        setProfilePage("address");
        navigate(-1);
    };

    if (!formData.address_id) {
        return <h2>Loading...</h2>;
    }

    return (

        <div className="heep-edit-addr-page">
            {
                savingAddress && (
                    <Loading
                        manual={true}
                        text="Updating Address..."
                    />
                )
            }

            <div className="heep-edit-addr-header">

                <button
                    className="heep-edit-addr-back-btn"
                    onClick={handleBack}
                >
                    <FiArrowLeft />
                </button>

                <h2 className="heep-edit-addr-title">
                    Edit Address
                </h2>

            </div>

            <form
                className="heep-edit-addr-form"
                onSubmit={handleSubmit}
            >

                <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.full_name || ""}
                    onChange={(e) =>
                        setFormData(prev => ({
                            ...prev,
                            full_name: e.target.value
                        }))
                    }
                />

                <input
                    type="tel"
                    placeholder="Mobile Number"
                    maxLength={10}
                    value={formData.mobile_number || ""}
                    onChange={(e) =>
                        setFormData(prev => ({
                            ...prev,
                            mobile_number: e.target.value.replace(/\D/g, "")
                        }))
                    }
                />

                <input
                    type="text"
                    placeholder="House / Flat / Building"
                    value={formData.house_flat || ""}
                    onChange={(e) =>
                        setFormData(prev => ({
                            ...prev,
                            house_flat: e.target.value
                        }))
                    }
                />

                <select
                    value={formData.area_street || ""}
                    onChange={(e) =>
                        setFormData(prev => ({
                            ...prev,
                            area_street: e.target.value
                        }))
                    }
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
                    onChange={(e) =>
                        setFormData(prev => ({
                            ...prev,
                            landmark: e.target.value
                        }))
                    }
                />
                <input
                    type="text"
                    placeholder="PIN Code"
                    maxLength={6}
                    value={formData.pincode || ""}
                    onChange={(e) => {

                        const pin = e.target.value.replace(/\D/g, "");

                        setFormData(prev => ({
                            ...prev,
                            pincode: pin
                        }));

                        if (pin.length === 6) {
                            fetchPincode(pin);
                        }

                    }}
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

                    <label>
                        <input
                            type="radio"
                            name="type"
                            value="Home"
                            checked={(formData.address_type || "Home") === "Home"}
                            onChange={(e) =>
                                setFormData(prev => ({
                                    ...prev,
                                    address_type: e.target.value
                                }))
                            }
                        />
                        🏠 Home
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="type"
                            value="Work"
                            checked={formData.address_type === "Work"}
                            onChange={(e) =>
                                setFormData(prev => ({
                                    ...prev,
                                    address_type: e.target.value
                                }))
                            }
                        />
                        🏢 Work
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="type"
                            value="Other"
                            checked={formData.address_type === "Other"}
                            onChange={(e) =>
                                setFormData(prev => ({
                                    ...prev,
                                    address_type: e.target.value
                                }))
                            }
                        />
                        📍 Other
                    </label>

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