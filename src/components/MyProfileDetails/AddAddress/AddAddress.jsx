import "./AddAddress.css";
import { FiArrowLeft } from "react-icons/fi";

function AddAddress({ setProfilePage }) {

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

            <form className="address-form">

                <input
                    type="text"
                    placeholder="Full Name"
                />

                <input
                    type="tel"
                    placeholder="Mobile Number"
                />

                <input
                    type="text"
                    placeholder="House / Flat / Building"
                />

                <input
                    type="text"
                    placeholder="Area / Street"
                />

                <input
                    type="text"
                    placeholder="Landmark (Optional)"
                />

                <input
                    type="text"
                    placeholder="City"
                />

                <input
                    type="text"
                    placeholder="State"
                />

                <input
                    type="text"
                    placeholder="PIN Code"
                />

                <div className="address-type">

                    <label>
                        <input
                            type="radio"
                            name="type"
                            defaultChecked
                        />
                        Home
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="type"
                        />
                        Work
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="type"
                        />
                        Other
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