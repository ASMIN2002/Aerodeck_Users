import "./MyAddresses.css";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";

function MyAddresses({ setProfilePage }) {

    const [addresses] = useState([
        {
            id: 1,
            type: "Home",
            name: "Asmin Kuldeep Jena",
            mobile: "9876543210",
            address: "Near Railway Station, Balasore, Odisha - 756001",
            primary: true
        },
        {
            id: 2,
            type: "Office",
            name: "Asmin Kuldeep Jena",
            mobile: "9876543210",
            address: "Industrial Area, Balasore, Odisha - 756001",
            primary: false
        }
    ]);

    const handleMenu = (id) => {

        console.log("Menu :", id);

        // Open Address Menu

    };

    return (

        <div className="address-page">

            <div className="address-header">

                <button
                    className="back-btn"
                    onClick={() => setProfilePage("profile")}
                >
                    <FiArrowLeft />
                </button>

                <h2>
                    My Addresses
                </h2>

                <button
                    className="add-btn"
                    disabled={addresses.length >= 4}
                    onClick={() => setProfilePage("addaddress")}
                >
                    + Add
                </button>

            </div>

            {
                addresses.length === 0 &&

                <div className="empty-address">

                    No saved addresses

                </div>
            }

            {
                addresses.map((item) => (

                    <div
                        className="address-card"
                        key={item.id}
                    >

                        <div className="address-top">

                            <div>

                                <h3>
                                    {item.type}
                                </h3>

                                {
                                    item.primary &&

                                    <span className="primary-badge">
                                        PRIMARY
                                    </span>
                                }

                            </div>

                            <button
                                className="menu-btn"
                                onClick={() => handleMenu(item.id)}
                            >
                                ⋮
                            </button>

                        </div>

                        <h4>
                            {item.name}
                        </h4>

                        <p>
                            +91 {item.mobile}
                        </p>

                        <p>
                            {item.address}
                        </p>

                    </div>

                ))
            }

        </div>

    );

}

export default MyAddresses;