import "./MyAddresses.css";
import { useEffect, useRef, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { API } from "../../../services/api";

function MyAddresses({ setProfilePage }) {

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const user_id = localStorage.getItem("user_id");
    const [activeMenu, setActiveMenu] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {

            const response = await fetch(
                `${API}/api/user/address/${user_id}`
            );

            const data = await response.json();

            if (data.success) {
                setAddresses(data.data);
            }

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }
    };
    const handleSetPrimary = async (address_id) => {

        try {

            const response = await fetch(

                `${API}/api/user/address/primary/${address_id}`,

                {

                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        user_id
                    })

                }

            );

            const data = await response.json();

            if (data.success) {

                setActiveMenu(null);

                fetchAddresses();

            } else {

                alert(data.message);

            }

        } catch (err) {

            console.error(err);

            alert("Server Error");

        }

    };
    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setActiveMenu(null);
            }

        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);
    const handleMenu = (id) => {
        setActiveMenu(activeMenu === id ? null : id);
    };

    if (loading) {
        return (
            <div className="address-page">
                Loading...
            </div>
        );
    }

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
                        key={item.address_id}
                    >

                        <div className="address-top">

                            <div>

                                <h3>
                                    {item.address_type}
                                </h3>

                                {
                                    item.is_primary === 1 &&

                                    <span className="primary-badge">
                                        PRIMARY
                                    </span>
                                }

                            </div>

                            <button
                                className="menu-btn"
                                onClick={() => handleMenu(item.address_id)}
                            >
                                ⋮
                            </button>
                            {
                                activeMenu === item.address_id && (

                                    <div
                                        className="address-menu"
                                        ref={menuRef}
                                    >

                                        {
                                            item.is_primary !== 1 && (
                                                <button
                                                    onClick={() => handleSetPrimary(item.address_id)}
                                                >
                                                    Set as Primary
                                                </button>
                                            )
                                        }

                                        <button
                                            onClick={() => {

                                                localStorage.setItem(
                                                    "editAddress",
                                                    JSON.stringify(item)
                                                );

                                                setActiveMenu(null);

                                                setProfilePage("editaddress");

                                            }}
                                        >
                                            Edit Address
                                        </button>

                                        <button className="delete-btn">
                                            Delete Address
                                        </button>

                                    </div>

                                )
                            }

                        </div>

                        <h4>
                            {item.full_name}
                        </h4>

                        <p>
                            +91 {item.mobile_number}
                        </p>

                        <p>
                            {item.house_flat}, {item.area_street}, {item.landmark}, {item.city}, {item.state} - {item.pincode}
                        </p>

                    </div>

                ))
            }

        </div>

    );

}

export default MyAddresses;