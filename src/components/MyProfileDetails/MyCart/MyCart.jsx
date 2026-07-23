import { useEffect, useState } from "react";
import { API } from "../../../services/api";
// import "./MyCart.css";

const MyCart = () => {

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const user_id = localStorage.getItem("user_id");


    useEffect(() => {
        getCart();
    }, []);



    const getCart = async () => {

        try {

            const response = await fetch(
                `${API}/api/user/cart/${user_id}`
            );

            const data = await response.json();

            if(data.success){
                setCartItems(data.cart);
            }


        } catch(error){

            console.log("Cart Error:", error);

        } finally {

            setLoading(false);

        }

    };



    const totalAmount = cartItems.reduce(
        (total, item) =>
            total + (item.product_price * item.quantity),
        0
    );



    if(loading){

        return (
            <div className="cart-loading">
                Loading Cart...
            </div>
        )

    }



    return (

        <div className="my-cart-page">


            <h2>
                My Cart
            </h2>



            {
                cartItems.length === 0 ?

                (
                    <div className="empty-cart">
                        Your cart is empty
                    </div>
                )


                :

                (

                    <>

                    <div className="cart-products">


                    {
                        cartItems.map((item)=>(


                            <div 
                            className="cart-product-card"
                            key={item.cart_id}
                            >


                                <img
                                src={item.product_image1}
                                alt={item.product_name}
                                />


                                <div className="cart-product-info">


                                    <h3>
                                        {item.product_name}
                                    </h3>


                                    <p>
                                        {item.product_category}
                                    </p>


                                    <h4>
                                        ₹{item.product_price}
                                    </h4>


                                    <div className="quantity-box">

                                        <button>
                                            -
                                        </button>


                                        <span>
                                            {item.quantity}
                                        </span>


                                        <button>
                                            +
                                        </button>

                                    </div>


                                </div>


                            </div>


                        ))
                    }


                    </div>



                    <div className="cart-summary">


                        <h3>
                            Total ₹{totalAmount}
                        </h3>


                        <button>
                            Checkout
                        </button>


                    </div>


                    </>

                )

            }


        </div>

    )

}


export default MyCart;