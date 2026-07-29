import "./MyWishlist.css";
import { useEffect, useState } from "react";
import { API } from "../../../services/api";

function MyWishlist({
    setProfilePage,
    onOpenDetails
}) {

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {

        try {

            const res = await fetch(
                `${API}/api/user/wishlist?user_id=${user.user_id}`
            );

            const data = await res.json();

            console.log(data.data);

            if (data.success) {
                setWishlist(data.data || []);
            }

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    const handleRemove = async (productId) => {

        try {

            await fetch(`${API}/api/user/wishlist/${productId}`, {

                method: "DELETE",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    user_id: user.user_id
                })

            });

            fetchWishlist();

        }

        catch (err) {

            console.error(err);

        }

    };

    return (

        <div className="mywishlist">

            <div className="wishlist-header">

                <button
                    className="wishlist-back"
                    onClick={() => setProfilePage("profile")}
                >
                    ←
                </button>

                <h2>My Wishlist</h2>

            </div>

            {
                loading &&
                <p>Loading...</p>
            }

            {
                !loading &&
                wishlist.length === 0 &&

                <div className="wishlist-empty">

                    ❤️

                    <h3>No Wishlist Found</h3>

                    <p>Your favourite cards will appear here.</p>

                </div>

            }

            {

                wishlist.map((item) => (

                    <div
                        className="wishlist-card"
                        key={item.product_id}
                    >

                        <img
                            src={item.image}
                            alt={item.name}
                        />

                        <div className="wishlist-info">

                            <h3>{item.name}</h3>

                            <p>
                                ⭐ {item.rating}
                            </p>

                            <p className="wishlist-stats">
                                ❤️ {item.likes} &nbsp;&nbsp; 🔖 {item.saves}
                            </p>

                            <h4>
                                ₹ {item.price}
                            </h4>

                        </div>

                        <div className="wishlist-actions">

                            <button
                                className="wishlist-view"
                                onClick={() => onOpenDetails(item.product_id)}
                            >
                                View
                            </button>

                            <button
                                className="wishlist-remove"
                                onClick={() => handleRemove(item.product_id)}
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                ))
            }

        </div>

    );

}

export default MyWishlist;