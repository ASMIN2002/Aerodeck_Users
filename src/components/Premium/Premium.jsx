import { useEffect, useState } from "react";
import Loading from "../../components/Loading/Loading";
import PremiumCard from "../Premium/PremiumCard";
import Toast from "../Toast/Toast";
import { API } from "../../services/api";


function Premium({

    setCartCount,

    onOpenDetails,

    search,

    filter

}) {

    const sessionToken = localStorage.getItem("session_token");

    const [premiums, setProducts] = useState([]);
    const [savedProducts, setSavedProducts] = useState(new Set());
    const [likedProducts, setLikedProducts] = useState(new Set());
    const [cartProducts, setCartProducts] = useState([]);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [showLoading, setShowLoading] = useState(true);

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

                            session_token: sessionToken

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

                        String(product.premium_id) === String(productId)

                            ? {

                                ...product,

                                premium_total_saves: Math.max(

                                    (product.premium_total_saves || 0) - 1,

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

                            session_token: sessionToken,

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

                        String(product.premium_id) === String(productId)

                            ? {

                                ...product,

                                premium_total_saves:

                                    (product.premium_total_saves || 0) + 1

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

                            session_token: sessionToken
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

                        String(product.premium_id) === String(productId)

                            ? {

                                ...product,

                                premium_total_likes: Math.max(

                                    (product.premium_total_likes || 0) - 1,

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

                            session_token: sessionToken,

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

                        String(product.premium_id) === String(productId)

                            ? {

                                ...product,

                                premium_total_likes:

                                    (product.premium_total_likes || 0) + 1

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

                        session_token: sessionToken,

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
            const product = premiums.find(

                item => String(item.premium_id) === String(productId)

            );

            const response = await fetch(

                `${API}/api/user/cart`,

                {

                    method: "PUT",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        session_token: sessionToken,

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

                            session_token: sessionToken

                        })

                    }

                );

                const data = await response.json();

                if (!data.success) return;
                const product = premiums.find(

                    item => String(item.premium_id) === String(productId)

                );

                const updatedCart = cartProducts.filter(

                    item => String(item.product_id) !== String(productId)

                );

                setCartProducts(updatedCart);

                setCartCount(updatedCart.length);
                return;

            }

            const newQuantity = cartItem.quantity - 1;
            const product = premiums.find(

                item => String(item.premium_id) === String(productId)

            );
            const response = await fetch(

                `${API}/api/user/cart`,

                {

                    method: "PUT",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        session_token: sessionToken,

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

                const response = await fetch(
                    `${API}/api/user/wishlist?session_token=${sessionToken}`
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
                    `${API}/api/user/likes?session_token=${sessionToken}`
                );

                const data = await response.json();

                if (data.success) {

                    setLikedProducts(

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
        async function loadCart() {

            try {

                const response = await fetch(`${API}/api/user/cart?session_token=${sessionToken}`);

                const data = await response.json();
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

    }, [sessionToken]);

    const filteredPremiums = premiums.filter((premium) => {

        const keyword = search.toLowerCase();

        const matchesSearch =

            !search ||

            premium.premium_name?.toLowerCase().includes(keyword) ||

            premium.premium_category?.toLowerCase().includes(keyword) ||

            premium.premium_description?.toLowerCase().includes(keyword);

        const matchesCategory =

            filter.category === "All" ||

            premium.premium_category === filter.category;

        return matchesSearch && matchesCategory;

    });

    let finalPremiums = [...filteredPremiums];
    if (filter.sort === "low") {

        finalPremiums.sort(

            (a, b) =>

                Number(a.premium_price) -

                Number(b.premium_price)

        );

    }

    if (filter.sort === "high") {

        finalPremiums.sort(

            (a, b) =>

                Number(b.premium_price) -

                Number(a.premium_price)

        );

    }

    if (filter.rating > 0) {

        finalPremiums = finalPremiums.filter(

            premium =>

                Number(premium.premium_rating) >= filter.rating

        );

    }

    if (filter.availableOnly) {

        finalPremiums = finalPremiums.filter(

            premium =>

                Number(premium.premium_status) === 1

        );

    }

    return (
        <>
            <header className="headallp">
                HEEPIT PREMIUM COLLECTIONS
            </header>
            <section className="cds-section">
                {
                    showLoading && (
                        <Loading
                            duration={500}
                            text="Loading Premium Cards..."
                            onComplete={() => setShowLoading(false)}
                        />
                    )
                }
                <div className="cds-grid">

                    {
                        finalPremiums.map((product) => (

                            <PremiumCard
                                key={product.premium_id}
                                product={product}
                                isSaved={savedProducts.has(String(product.premium_id))}
                                isLiked={likedProducts.has(String(product.premium_id))}
                                isAddedToCart={
                                    cartProducts.some(

                                        item => String(item.product_id) === String(product.premium_id)

                                    )
                                }
                                cartQuantity={
                                    cartProducts.find(

                                        item => String(item.product_id) === String(product.premium_id)

                                    )?.quantity || 0
                                }
                                onSave={handleSave}
                                onLike={handleLike}
                                onAddToCart={handleAddToCart}
                                onIncreaseQuantity={handleIncreaseQuantity}
                                onDecreaseQuantity={handleDecreaseQuantity}

                                onOpenDetails={() =>
                                    onOpenDetails(product, "premium")
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
        </>

    );

}

export default Premium;