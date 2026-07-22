import { useEffect, useState } from "react";
import "./EditAddress.css";

function EditAddress({ setProfilePage }) {

    const [address, setAddress] = useState(null);

    useEffect(() => {

        const savedAddress = localStorage.getItem("editAddress");

        if (savedAddress) {

            setAddress(JSON.parse(savedAddress));

        }

    }, []);

    if (!address) {

        return <h2>Loading...</h2>;

    }

    return (

        <div>

            <button
                onClick={() => setProfilePage("address")}
            >
                Back
            </button>

            <h2>Edit Address</h2>

            <p>{address.full_name}</p>

            <p>{address.mobile_number}</p>

            <p>{address.house_flat}</p>

        </div>

    );

}

export default EditAddress;