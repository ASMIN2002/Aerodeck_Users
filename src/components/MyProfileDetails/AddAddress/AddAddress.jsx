import { useState } from "react";
import "./AddAddress.css";
import { FiArrowLeft } from "react-icons/fi";
import MapPicker from "../../../components/Map/MapPicker";

import { API } from "../../../services/api";

function AddAddress({ setProfilePage }) {

    const [formData, setFormData] = useState({
        user_id: 7,
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
    const [mapCenter, setMapCenter] = useState([20.2961, 85.8245]);

    const fetchPincode = async (pin) => {

        if (pin.length !== 6) return;

        try {

            setLoadingPin(true);

            const response = await fetch(
                `${API}/api/user/address/pincode/${pin}`
            );

            const data = await response.json();

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
                setMapCenter([
                    data.location.latitude,
                    data.location.longitude
                ]);

            }

        } catch (error) {

            console.error(error);

        } finally {

            setLoadingPin(false);

        }

    };
    const handleSubmit = async (e) => {

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

                <h2>Add Address</h2>

            </div>
            <MapPicker center={mapCenter} />

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

        </div>

    );

}

export default AddAddress;