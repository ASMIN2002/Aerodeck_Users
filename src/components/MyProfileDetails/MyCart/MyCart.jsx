import "./MyCart.css";
import { useState } from "react";

function MyCart({

    setProfilePage,

    onOpenDetails

}) {

    const [cart] = useState([

        {
            id: 1,
            name: "Wedding Invitation Card",
            price: 499,
            quantity: 2,
            image: "https://via.placeholder.com/120"
        },

        {
            id: 2,
            name: "Birthday Invitation Card",
            price: 299,
            quantity: 1,
            image: "https://via.placeholder.com/120"
        }

    ]);

    return (

        <div className="mycart">

            <div className="cart-header">

                <button
                    className="cart-back"
                    onClick={() => setProfilePage("profile")}
                >
                    ←
                </button>

                <h2>
                    My Cart
                </h2>

            </div>

            {

                cart.length === 0 &&

                <div className="cart-empty">

                    🛒

                    <h3>
                        Your Cart is Empty
                    </h3>

                    <p>
                        Add your favourite cards here.
                    </p>

                </div>

            }

            {

                cart.map((item) => (

                    <div
                        className="cart-card"
                        key={item.id}
                    >

                        <img
                            src={item.image}
                            alt={item.name}
                        />

                        <div className="cart-info">

                            <h3>

                                {item.name}

                            </h3>

                            <h4>

                                ₹ {item.price}

                            </h4>

                            <p>

                                Quantity : {item.quantity}

                            </p>

                            <button
                                onClick={() => onOpenDetails(item, "cart")}
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

export default MyCart;