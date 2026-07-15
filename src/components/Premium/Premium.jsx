import { useEffect, useState } from "react";
import "./Premium.css";
import PremiumCard from "./PremiumCard";
import Toast from "../Toast/Toast";
import { API } from "../../services/api";
const userId = 7;

function Premium({

    setCartCount,

    onOpenDetails

}) {

    const [premium, setProducts] = useState([]);
    const [savedProducts, setSavedProducts] = useState(new Set());
    const [likedProducts, setLikedProducts] = useState(new Set());
    const [cartProducts, setCartProducts] = useState([]);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const showToast = (message, type = "success") => {

        setToast({

            show: true,

            message,

            type

        });

        setTimeout(() => {

            setToast({

                show: false,

                message: "",

                type

            });

        }, 2000);

    };

    const handleSave = async (premiumId) => {

        premiumId = String(premiumId);

        try {

            if (savedProducts.has(premiumId)) {

                const response = await fetch(

                    `${API}/api/user/wishlist/${premiumId}`,

                    {

                        method: "DELETE",

                        headers: {

                            "Content-Type": "application/json"

                        },

                        body: JSON.stringify({

                            user_id: userId

                        })

                    }

                );

                const data = await response.json();

                if (!data.success) return;

                const updatedSaved = new Set(savedProducts);

                updatedSaved.delete(premiumId);

                setSavedProducts(updatedSaved);

                setProducts(prev =>

                    prev.map(premium =>

                        String(premium.premium_id) === String(premiumId)

                            ? {

                                ...premium,

                                premium_total_saves: Math.max(

                                    (premium.premium_total_saves || 0) - 1,

                                    0

                                )

                            }

                            : premium

                    )

                );

                showToast("Removed from Wishlist", "info");

            }

            else {

                const response = await fetch(

                    `${API}/api/user/wishlist`,

                    {

                        method: "POST",

                        headers: {

                            "Content-Type": "application/json"

                        },

                        body: JSON.stringify({

                            user_id: userId,

                            product_id: premiumId

                        })

                    }

                );

                const data = await response.json();

                if (!data.success) return;

                const updatedSaved = new Set(savedProducts);

                updatedSaved.add(premiumId);

                setSavedProducts(updatedSaved);

                setProducts(prev =>

                    prev.map(premium =>

                        String(premium.premium_id) === String(premiumId)

                            ? {

                                ...premium,

                                premium_total_saves:

                                    (premium.premium_total_saves || 0) + 1

                            }

                            : premium

                    )

                );

                showToast("Saved to Wishlist", "success");

            }

        }

        catch (err) {

            console.log(err);

        }

    };
    const handleLike = async (premiumId) => {
        premiumId = String(premiumId);

        try {

            if (likedProducts.has(premiumId)) {

                const response = await fetch(

                    `${API}/api/user/likes/${premiumId}`,

                    {

                        method: "DELETE",

                        headers: {

                            "Content-Type": "application/json"

                        },

                        body: JSON.stringify({

                            user_id: userId

                        })

                    }

                );

                const data = await response.json();

                if (!data.success) return;

                const updatedLiked = new Set(likedProducts);

                updatedLiked.delete(premiumId);

                setLikedProducts(updatedLiked);

                setProducts(prev =>

                    prev.map(premium =>

                        String(premium.premium_id) === String(premiumId)

                            ? {

                                ...premium,

                                premium_total_likes: Math.max(

                                    (premium.premium_total_likes || 0) - 1,

                                    0

                                )

                            }

                            : premium

                    )

                );

                showToast("Like Removed", "info");

            }

            else {

                const response = await fetch(

                    `${API}/api/user/likes`,

                    {

                        method: "POST",

                        headers: {

                            "Content-Type": "application/json"

                        },

                        body: JSON.stringify({

                            user_id: userId,

                            product_id: premiumId

                        })

                    }

                );

                const data = await response.json();

                if (!data.success) return;

                const updatedLiked = new Set(likedProducts);

                updatedLiked.add(premiumId);

                setLikedProducts(updatedLiked);

                setProducts(prev =>

                    prev.map(premium =>

                        String(premium.premium_id) === String(premiumId)

                            ? {

                                ...premium,

                                premium_total_likes:

                                    (premium.premium_total_likes || 0) + 1

                            }

                            : premium

                    )

                );

                showToast("Product Liked", "success");

            }

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleAddToCart = async (premiumId) => {

        try {

            premiumId = String(premiumId);

            const exists = cartProducts.some(
                item => String(item.product_id) === String(premiumId)
            );

            if (exists) {

                showToast("Already in Cart", "info");

                return;

            }

            const response = await fetch(

                `${API}/api/user/cart`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        user_id: userId,

                        product_id: premiumId,

                        quantity: 50

                    })

                }

            );

            const data = await response.json();

            if (!data.success) return;

            const updatedCart = [

                ...cartProducts,

                {

                    product_id: premiumId,

                    quantity: 50

                }

            ];

            setCartProducts(updatedCart);

            setCartCount(updatedCart.length);

            showToast("Added To Cart", "success");

        }

        catch (err) {

            console.log(err);

        }

    };
    const handleIncreaseQuantity = async (premiumId) => {

        premiumId = String(premiumId);

        try {

            const cartItem = cartProducts.find(

                item => String(item.product_id) === String(premiumId)

            );

            if (!cartItem) return;

            const newQuantity = cartItem.quantity + 1;

            const premiumItem = premium.find(

                item => String(item.premium_id) === String(premiumId)

            );

            const response = await fetch(

                `${API}/api/user/cart`,

                {

                    method: "PUT",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        user_id: userId,

                        product_id: premiumId,

                        quantity: newQuantity

                    })

                }

            );

            const data = await response.json();

            if (!data.success) return;

            setCartProducts(prev =>

                prev.map(item =>

                    String(item.product_id) === String(premiumId)

                        ? {

                            ...item,

                            quantity: newQuantity

                        }

                        : item

                )

            );

            showToast(

                `Added 1 Card\n${premiumItem.premium_name}\nTotal Quantity : ${newQuantity}`,

                "success"

            );

        }

        catch (err) {

            console.log(err);

        }

    };
    const handleDecreaseQuantity = async (premiumId) => {

        premiumId = String(premiumId);

        try {

            const cartItem = cartProducts.find(

                item => String(item.product_id) === String(premiumId)

            );

            if (!cartItem) return;

            // Minimum quantity pe remove from cart
            if (cartItem.quantity <= 50) {

                const response = await fetch(

                    `${API}/api/user/cart/${premiumId}`,

                    {

                        method: "DELETE",

                        headers: {

                            "Content-Type": "application/json"

                        },

                        body: JSON.stringify({

                            user_id: userId

                        })

                    }

                );

                const data = await response.json();

                if (!data.success) return;

                const premiumItem = premium.find(

                    item => String(item.premium_id) === String(premiumId)

                );

                const updatedCart = cartProducts.filter(

                    item => String(item.product_id) !== String(premiumId)

                );

                setCartProducts(updatedCart);

                setCartCount(updatedCart.length);

                showToast(

                    `Removed From Cart\n${premiumItem.premium_name}`,

                    "info"

                );

                return;

            }

            const newQuantity = cartItem.quantity - 1;

            const premiumItem = premium.find(

                item => String(item.premium_id) === String(premiumId)

            );

            const response = await fetch(

                `${API}/api/user/cart`,

                {

                    method: "PUT",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        user_id: userId,

                        product_id: premiumId,

                        quantity: newQuantity

                    })

                }

            );

            const data = await response.json();

            if (!data.success) return;

            setCartProducts(prev =>

                prev.map(item =>

                    String(item.product_id) === String(premiumId)

                        ? {

                            ...item,

                            quantity: newQuantity

                        }

                        : item

                )

            );

            showToast(

                `Removed 1 Card\n${premiumItem.premium_name}\nTotal Quantity : ${newQuantity}`,

                "info"

            );

        }

        catch (err) {

            console.log(err);

        }

    };
    useEffect(() => {

        async function loadProducts() {

            try {

                const response = await fetch(`${API}/api/user/premium`);

                const data = await response.json();

                if (data.success) {

                    setProducts(data.data);

                }

            }

            catch (err) {

                console.log(err);

            }

        }

        async function loadWishlist() {

            try {

                const response = await fetch(`${API}/api/user/wishlist?user_id=7`);

                const data = await response.json();

                if (data.success) {

                    setSavedProducts(

                        new Set(

                            data.data.map(item => String(item.product_id))

                        )

                    );

                }

            }

            catch (err) {

                console.log(err);

            }

        }

        async function loadLikes() {

            try {

                const response = await fetch(`${API}/api/user/likes?user_id=7`);

                const data = await response.json();

                if (data.success) {

                    setLikedProducts(

                        new Set(

                            data.data.map(item => item.product_id)

                        )

                    );

                }

            }

            catch (err) {

                console.log(err);

            }

        }
        async function loadCart() {

            try {

                const response = await fetch(`${API}/api/user/cart?user_id=${userId}`);

                const data = await response.json();
                console.log(data.data);

                if (data.success) {

                    setCartProducts(data.data);
                    setCartCount(data.data.length);

                }

            }

            catch (err) {

                console.log(err);

            }

        }

        loadProducts();
        loadWishlist();
        loadLikes();
        loadCart();

    }, []);

    return (


        <section className="cds-section">

            <h2 className="cds-title">

                Premium

            </h2>

            <div className="cds-grid">

                {
                    premium.map((premium) => (

                        <PremiumCard

                            key={premium.premium_id}

                            premium={premium}

                            isLiked={likedProducts.has(String(premium.premium_id))}

                            isSaved={savedProducts.has(String(premium.premium_id))}

                            isAddedToCart={
                                cartProducts.some(
                                    item => String(item.product_id) === String(premium.premium_id)
                                )
                            }

                            cartQuantity={
                                cartProducts.find(
                                    item => String(item.product_id) === String(premium.premium_id)
                                )?.quantity || 0
                            }

                            onLike={handleLike}

                            onSave={handleSave}

                            onAddToCart={handleAddToCart}

                            onIncreaseQuantity={handleIncreaseQuantity}

                            onDecreaseQuantity={handleDecreaseQuantity}

                            onOpenDetails={() =>
                                onOpenDetails(premium, "premium")
                            }

                        />

                    ))
                }

            </div>
            <Toast

                show={toast.show}

                message={toast.message}

                type={toast.type}

            />

        </section>

    );

}

export default Premium;