import "./MyWishlist.css";
import { useState } from "react";

function MyWishlist({

    setProfilePage,

    onOpenDetails

}) {

    const [wishlist] = useState([

        {
            id: 1,
            name: "Wedding Invitation Card",
            price: 499,
            rating: 4.8,
            image: "https://via.placeholder.com/120"
        },

        {
            id: 2,
            name: "Birthday Invitation Card",
            price: 299,
            rating: 4.5,
            image: "https://via.placeholder.com/120"
        }

    ]);

    return (

        <div className="mywishlist">

            <div className="wishlist-header">

                <button
                    className="wishlist-back"
                    onClick={() => setProfilePage("profile")}
                >
                    ←
                </button>

                <h2>
                    My Wishlist
                </h2>

            </div>

            {

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
                        key={item.id}
                    >

                        <img
                            src={item.image}
                            alt={item.name}
                        />

                        <div className="wishlist-info">

                            <h3>

                                {item.name}

                            </h3>

                            <p>

                                ⭐ {item.rating}

                            </p>

                            <h4>

                                ₹ {item.price}

                            </h4>

                            <button
                                onClick={() => onOpenDetails(item, "wishlist")}
                            >
                                View Product
                            </button>

                        </div>

                    </div>

                ))

            }

        </div>

    );

}

export default MyWishlist;