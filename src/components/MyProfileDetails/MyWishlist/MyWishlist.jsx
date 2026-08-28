import "./MyWishlist.css";
import { useEffect, useState } from "react";
import { API } from "../../../services/api";

function MyWishlist({
    setProfilePage,
    onOpenDetails
}) {

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const sessionToken = localStorage.getItem("session_token");

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {

        try {

            const res = await fetch(
                `${API}/api/user/wishlist?session_token=${sessionToken}`
            );

            const data = await res.json();
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
                    session_token: sessionToken
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
                        key={
                            item.product_id ||
                            item.gift_id ||
                            item.shop_id ||
                            item.premium_id
                        }
                    >

                        <img
                            src={
                                item.product_image1 ||
                                item.gift_image1 ||
                                item.shop_image1 ||
                                item.premium_image1
                            }
                            alt={
                                item.product_name ||
                                item.gift_name ||
                                item.shop_name ||
                                item.premium_name
                            }
                        />

                        <div className="wishlist-info">

                            <h3>{
                                item.product_name ||
                                item.gift_name ||
                                item.shop_name ||
                                item.premium_name
                            }</h3>

                            <p>
                                ⭐ {
                                    item.product_rating ||
                                    item.gift_rating ||
                                    item.shop_rating ||
                                    item.premium_rating
                                }
                            </p>
                            <div className="detwish">

                                <p className="wishlist-stats">
                                    ❤️ {
                                        item.product_total_likes ||
                                        item.gift_total_likes ||
                                        item.shop_total_likes ||
                                        item.premium_total_likes
                                    } &nbsp;&nbsp; 🔖{
                                        item.product_total_saves ||
                                        item.gift_total_saves ||
                                        item.shop_total_saves ||
                                        item.premium_total_saves
                                    }
                                </p>

                                <h4>
                                    ₹ {
                                        item.product_price ||
                                        item.gift_price ||
                                        item.shop_price ||
                                        item.premium_price
                                    }
                                </h4>
                            </div>

                        </div>

                        <div className="wishlist-actions">

                            <button
                                className="wishlist-view"
                                onClick={() => {

                                    const type =
                                        item.product_id ? "products" :
                                            item.gift_id ? "gifts" :
                                                item.shop_id ? "shop" :
                                                    item.premium_id ? "premium" :
                                                        "";

                                    onOpenDetails(item, type);
                                }}
                            >
                                View
                            </button>

                            <button
                                className="wishlist-remove"
                                onClick={() =>
                                    handleRemove(
                                        item.product_id ||
                                        item.gift_id ||
                                        item.shop_id ||
                                        item.premium_id
                                    )
                                }
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