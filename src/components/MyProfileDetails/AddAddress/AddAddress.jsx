import { useState } from "react";
import "./AddAddress.css";
import { FiArrowLeft } from "react-icons/fi";
import Toast from "../../../components/Toast/Toast";
import { API } from "../../../services/api";

function AddAddress({ setProfilePage }) {

    const sessionToken = localStorage.getItem("session_token");

    const [formData, setFormData] = useState({

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
    const [areas, setAreas] = useState([]);
    const [loadingPin, setLoadingPin] = useState(false);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success"
    });

    const showToast = (message, type = "success") => {

        setToast({
            show: true,
            message,
            type
        });

        setTimeout(() => {

            setToast({
                show: false,
                message: "",
                type
            });

        }, 3000);

    };
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
                    country: data.location.country,
                    area_street: ""
                }));

                setAreas(data.areas);



            }

        } catch (error) {

            console.error(error);

        } finally {

            setLoadingPin(false);

        }

    };

    const handleCurrentLocation = () => {

        if (!navigator.geolocation) {

            showToast("Geolocation is not supported.", "error");
            return;

        }

        navigator.geolocation.getCurrentPosition(

            async ({ coords }) => {

                try {

                    const { latitude, longitude } = coords;

                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                    );

                    const data = await response.json();

                    const address = data.address || {};

                    const pin = address.postcode || "";

                    setFormData(prev => ({
                        ...prev,
                        latitude,
                        longitude,
                        pincode: pin,
                        city: address.city || address.town || address.village || "",
                        state: address.state || "",
                        country: address.country || ""
                    }));

                    if (pin.length === 6) {
                        fetchPincode(pin);
                    }

                    showToast("Current location detected.");

                } catch {

                    showToast("Unable to fetch location.", "error");

                }

            },

            () => {

                showToast("Location permission denied.", "error");

            },

            {
                enableHighAccuracy: true,
                timeout: 10000
            }

        );

    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.full_name.trim()) {
            showToast("Please enter Full Name.", "error");
            return;
        }

        if (!formData.mobile_number.trim()) {
            showToast("Please enter Mobile Number.", "error");
            return;
        }

        if (!/^\d{10}$/.test(formData.mobile_number)) {
            showToast("Please enter a valid 10-digit Mobile Number.", "error");
            return;
        }

        if (!formData.pincode.trim()) {
            showToast("Please enter PIN Code.", "error");
            return;
        }

        if (!formData.state.trim()) {
            showToast("Please enter a valid PIN Code.", "error");
            return;
        }

        if (!formData.city.trim()) {
            showToast("Please enter a valid PIN Code.", "error");
            return;
        }

        if (!formData.area_street.trim()) {
            showToast("Please select Area / Post Office.", "error");
            return;
        }

        if (!formData.house_flat.trim()) {
            showToast("Please enter House / Flat No.", "error");
            return;
        }

        if (!formData.address_type.trim()) {
            showToast("Please select Address Type.", "error");
            return;
        }

        e.preventDefault();

        try {

            const response = await fetch(
                `${API}/api/user/address`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (data.success) {

                alert("Address Added Successfully");

                console.log(data);

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <div className="add-address">

            <div className="add-address-header">

                <button
                    className="back-btn"
                    onClick={() => setProfilePage("address")}
                >
                    <FiArrowLeft />
                </button>
                <button
                    type="button"
                    className="current-location-btn"
                    onClick={handleCurrentLocation}
                >
                    📍 Set Current Location
                </button>

                <h2>Add Address</h2>

            </div>

            <form
                className="address-form"
                onSubmit={handleSubmit}
            >

                <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.full_name}
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
                    value={formData.mobile_number}
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
                    value={formData.house_flat}
                    onChange={(e) =>
                        setFormData(prev => ({
                            ...prev,
                            house_flat: e.target.value
                        }))
                    }
                />
                <input
                    type="text"
                    placeholder="PIN Code"
                    maxLength={6}
                    value={formData.pincode}
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
                />

                <select
                    value={formData.area_street}
                    onChange={(e) =>
                        setFormData(prev => ({
                            ...prev,
                            area_street: e.target.value
                        }))
                    }
                >

                    <option value="">
                        Select Area
                    </option>

                    {areas.map((area, index) => (

                        <option
                            key={index}
                            value={area}
                        >
                            {area}
                        </option>

                    ))}

                </select>

                <input
                    type="text"
                    placeholder="Landmark (Optional)"
                    value={formData.landmark}
                    onChange={(e) =>
                        setFormData(prev => ({
                            ...prev,
                            landmark: e.target.value
                        }))
                    }
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


                <div className="address-type">

                    <label>
                        <input
                            type="radio"
                            name="type"
                            value="Home"
                            checked={formData.address_type === "Home"}
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
                    className="save-address-btn"
                >
                    Save Address
                </button>

            </form>
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
            />
        </div>

    );


}

export default AddAddress;