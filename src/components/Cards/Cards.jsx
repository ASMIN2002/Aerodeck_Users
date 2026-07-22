import { useEffect, useState } from "react";
import "./Cards.css";
import ProductCard from "../ProductCard/ProductCard";
import Toast from "../Toast/Toast";
import { API } from "../../services/api";


function Cards({

    setCartCount,

    onOpenDetails

}) {

    const userId =
        JSON.parse(localStorage.getItem("user"))?.user_id;

    const [products, setProducts] = useState([]);
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

    const handleSave = async (productId) => {

        productId = String(productId);

        try {

            if (savedProducts.has(productId)) {

                const response = await fetch(

                    `${API}/api/user/wishlist/${productId}`,

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

                updatedSaved.delete(productId);

                setSavedProducts(updatedSaved);

                setProducts(prev =>

                    prev.map(product =>

                        String(product.product_id) === String(productId)

                            ? {

                                ...product,

                                product_total_saves: Math.max(

                                    (product.product_total_saves || 0) - 1,

                                    0

                                )

                            }

                            : product

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

                            product_id: productId

                        })

                    }

                );

                const data = await response.json();

                if (!data.success) return;

                const updatedSaved = new Set(savedProducts);

                updatedSaved.add(productId);

                setSavedProducts(updatedSaved);

                setProducts(prev =>

                    prev.map(product =>

                        String(product.product_id) === String(productId)

                            ? {

                                ...product,

                                product_total_saves:

                                    (product.product_total_saves || 0) + 1

                            }

                            : product

                    )

                );

                showToast("Saved to Wishlist", "success");

            }

        }

        catch (err) {

            console.log(err);

        }

    };
    const handleLike = async (productId) => {
        productId = String(productId);

        try {

            if (likedProducts.has(productId)) {

                const response = await fetch(

                    `${API}/api/user/likes/${productId}`,

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

                updatedLiked.delete(productId);

                setLikedProducts(updatedLiked);

                setProducts(prev =>

                    prev.map(product =>

                        String(product.product_id) === String(productId)

                            ? {

                                ...product,

                                product_total_likes: Math.max(

                                    (product.product_total_likes || 0) - 1,

                                    0

                                )

                            }

                            : product

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

                            product_id: productId

                        })

                    }

                );

                const data = await response.json();

                if (!data.success) return;

                const updatedLiked = new Set(likedProducts);

                updatedLiked.add(productId);

                setLikedProducts(updatedLiked);

                setProducts(prev =>

                    prev.map(product =>

                        String(product.product_id) === String(productId)

                            ? {

                                ...product,

                                product_total_likes:

                                    (product.product_total_likes || 0) + 1

                            }

                            : product

                    )

                );

                showToast("Product Liked", "success");

            }

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleAddToCart = async (productId) => {

        try {

            productId = String(productId);

            const exists = cartProducts.some(

                item => String(item.product_id) === productId

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

                        product_id: productId,

                        quantity: 50

                    })

                }

            );

            const data = await response.json();

            if (!data.success) return;

            const updatedCart = [

                ...cartProducts,

                {

                    product_id: productId,

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

    const handleIncreaseQuantity = async (productId) => {

        productId = String(productId);

        try {

            const cartItem = cartProducts.find(

                item => String(item.product_id) === String(productId)

            );
            if (!cartItem) return;

            const newQuantity = cartItem.quantity + 1;
            const product = products.find(

                item => String(item.product_id) === String(productId)

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

                        product_id: productId,

                        quantity: newQuantity

                    })

                }

            );

            const data = await response.json();

            if (!data.success) return;

            setCartProducts(prev =>

                prev.map(item =>

                    String(item.product_id) === String(productId)

                        ? {

                            ...item,

                            quantity: newQuantity

                        }

                        : item

                )

            );

            showToast(

                `Added 1 Card\n${product.product_name}\nTotal Quantity : ${newQuantity}`,

                "success"

            );

        }

        catch (err) {

            console.log(err);

        }

    };
    const handleDecreaseQuantity = async (productId) => {

        productId = String(productId);

        try {
            const cartItem = cartProducts.find(

                item => String(item.product_id) === String(productId)

            );

            if (!cartItem) return;

            // Minimum quantity pe remove from cart
            if (cartItem.quantity <= 50) {

                const response = await fetch(

                    `${API}/api/user/cart/${productId}`,

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
                const product = products.find(

                    item => String(item.product_id) === String(productId)

                );

                const updatedCart = cartProducts.filter(

                    item => String(item.product_id) !== String(productId)

                );

                setCartProducts(updatedCart);

                setCartCount(updatedCart.length);

                showToast(

                    `Removed From Cart\n${product.product_name}`,

                    "info"

                );

                return;

            }

            const newQuantity = cartItem.quantity - 1;
            const product = products.find(

                item => String(item.product_id) === String(productId)

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

                        product_id: productId,

                        quantity: newQuantity

                    })

                }

            );

            const data = await response.json();

            if (!data.success) return;

            setCartProducts(prev =>

                prev.map(item =>

                    String(item.product_id) === String(productId)

                        ? {

                            ...item,

                            quantity: newQuantity

                        }

                        : item

                )

            );
            showToast(

                `Removed 1 Card\n${product.product_name}\nTotal Quantity : ${newQuantity}`,

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

                const response = await fetch(`${API}/api/user/products`);

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

                const response = await fetch(
                    `${API}/api/user/wishlist?user_id=${userId}`
                );

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
                const response = await fetch(
                    `${API}/api/user/likes?user_id=${userId}`
                );

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

    }, [userId]);
    
    return (


        <section className="cds-section">

            <h2 className="cds-title">

                Cards

            </h2>

            <div className="cds-grid">

                {
                    products.map((product) => (

                        <ProductCard
                            key={product.product_id}
                            product={product}
                            isSaved={savedProducts.has(String(product.product_id))}
                            isLiked={likedProducts.has(String(product.product_id))}
                            isAddedToCart={
                                cartProducts.some(

                                    item => String(item.product_id) === String(product.product_id)

                                )
                            }
                            cartQuantity={
                                cartProducts.find(

                                    item => String(item.product_id) === String(product.product_id)

                                )?.quantity || 0
                            }
                            onSave={handleSave}
                            onLike={handleLike}
                            onAddToCart={handleAddToCart}
                            onIncreaseQuantity={handleIncreaseQuantity}
                            onDecreaseQuantity={handleDecreaseQuantity}

                            onOpenDetails={() =>
                                onOpenDetails(product, "card")
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

export default Cards;