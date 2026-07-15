import { useEffect, useState } from "react";
import { API } from "../../services/api";
import ShopCard from "./ShopCard";
import Toast from "../Toast/Toast";
import "./Shop.css";
const userId = 7;

function Shop({

    setCartCount,

    onOpenDetails

}) {

    const [shops, setShops] = useState([]);
    const [likedShops, setLikedShops] = useState(new Set());
    const [savedShops, setSavedShops] = useState(new Set());
    const [cartProducts, setCartProducts] = useState([]);

    const [toast, setToast] = useState({

        show: false,

        message: "",

        type: "success"

    });

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

    useEffect(() => {
        loadShops();
        loadLikes();
        loadWishlist();
        loadCart();

    }, []);

    const loadShops = async () => {

        try {

            const response = await fetch(`${API}/api/user/shop`);

            const data = await response.json();

            if (data.success) {

                setShops(data.data);

            }

        }

        catch (err) {

            console.log(err);

        }

    };

    const loadLikes = async () => {

        try {

            const response = await fetch(

                `${API}/api/user/likes?user_id=7`

            );

            const data = await response.json();

            if (data.success) {

                setLikedShops(

                    new Set(

                        data.data.map(item => String(item.product_id))

                    )

                );

            }

        }

        catch (err) {

            console.log(err);

        }

    };

    const loadWishlist = async () => {

        try {

            const response = await fetch(

                `${API}/api/user/wishlist?user_id=7`

            );

            const data = await response.json();

            if (data.success) {

                setSavedShops(

                    new Set(

                        data.data.map(item => String(item.product_id))

                    )

                );

            }

        }

        catch (err) {

            console.log(err);

        }

    };

    const loadCart = async () => {

        try {

            const response = await fetch(

                `${API}/api/user/cart?user_id=7`

            );

            const data = await response.json();

            if (data.success) {

                const updatedCart = data.data.map(item => ({
                    ...item,
                    product_id: String(item.product_id)
                }));

                setCartProducts(updatedCart);

                setCartCount(updatedCart.length);

            }

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleLike = async (shopId) => {

        shopId = String(shopId);

        try {

            if (likedShops.has(shopId)) {

                const response = await fetch(

                    `${API}/api/user/likes/${shopId}`,

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

                const updatedLiked = new Set(likedShops);

                updatedLiked.delete(shopId);

                setLikedShops(updatedLiked);

                setShops(prev =>

                    prev.map(shop =>

                        String(shop.shop_id) === String(shopId)

                            ? {

                                ...shop,

                                shop_total_likes: Math.max(

                                    (shop.shop_total_likes || 0) - 1,

                                    0

                                )

                            }

                            : shop

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

                            product_id: shopId

                        })

                    }

                );

                const data = await response.json();

                if (!data.success) return;

                const updatedLiked = new Set(likedShops);

                updatedLiked.add(shopId);

                setLikedShops(updatedLiked);

                setShops(prev =>

                    prev.map(shop =>

                        String(shop.shop_id) === String(shopId)

                            ? {

                                ...shop,

                                shop_total_likes:

                                    (shop.shop_total_likes || 0) + 1

                            }

                            : shop

                    )

                );

                showToast("Shop Liked", "success");

            }

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleSave = async (shopId) => {

        shopId = String(shopId);

        try {

            if (savedShops.has(shopId)) {

                const response = await fetch(

                    `${API}/api/user/wishlist/${shopId}`,

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

                const updatedSaved = new Set(savedShops);

                updatedSaved.delete(shopId);

                setSavedShops(updatedSaved);

                setShops(prev =>

                    prev.map(shop =>

                        String(shop.shop_id) === shopId

                            ? {

                                ...shop,

                                shop_total_saves: Math.max(

                                    (shop.shop_total_saves || 0) - 1,

                                    0

                                )

                            }

                            : shop

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

                            product_id: shopId

                        })

                    }

                );

                const data = await response.json();

                if (!data.success) return;

                const updatedSaved = new Set(savedShops);

                updatedSaved.add(shopId);

                setSavedShops(updatedSaved);

                setShops(prev =>

                    prev.map(shop =>

                        String(shop.shop_id) === shopId

                            ? {

                                ...shop,

                                shop_total_saves:

                                    (shop.shop_total_saves || 0) + 1

                            }

                            : shop

                    )

                );

                showToast("Saved to Wishlist", "success");

            }

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleAddToCart = async (shopId) => {

        try {

            shopId = String(shopId);

            const exists = cartProducts.some(

                item => String(item.product_id) === shopId

            );

            if (exists) {

                showToast("Already In Cart", "info");

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

                        product_id: shopId,

                        quantity: 1

                    })

                }

            );

            const data = await response.json();

            if (!data.success) return;

            const updatedCart = [

                ...cartProducts,

                {

                    product_id: shopId,

                    quantity: 1

                }

            ];

            setCartProducts(updatedCart);

            setCartCount(updatedCart.length);

            showToast("Shop Added To Cart", "success");

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleIncreaseQuantity = async (shopId) => {

        shopId = String(shopId);

        try {

            const cartItem = cartProducts.find(

                item => String(item.product_id) === shopId

            );

            if (!cartItem) return;

            const newQuantity = cartItem.quantity + 1;

            const shop = shops.find(

                item => String(item.shop_id) === shopId

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

                        product_id: shopId,

                        quantity: newQuantity

                    })

                }

            );

            const data = await response.json();

            if (!data.success) return;

            setCartProducts(prev =>

                prev.map(item =>

                    String(item.product_id) === shopId

                        ? {

                            ...item,

                            quantity: newQuantity

                        }

                        : item

                )

            );

            showToast(

                `Added 1 Shop\n${shop.shop_name}\nTotal Quantity : ${newQuantity}`,

                "success"

            );

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleDecreaseQuantity = async (shopId) => {

        shopId = String(shopId);

        try {

            const cartItem = cartProducts.find(

                item => String(item.product_id) === shopId

            );

            if (!cartItem) return;

            // Minimum 1 pe Remove
            if (cartItem.quantity <= 1) {

                const response = await fetch(

                    `${API}/api/user/cart/${shopId}`,

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

                const shop = shops.find(

                    item => String(item.shop_id) === shopId

                );

                const updatedCart = cartProducts.filter(

                    item => String(item.product_id) !== shopId

                );

                setCartProducts(updatedCart);

                setCartCount(updatedCart.length);

                showToast(

                    `Removed From Cart\n${shop.shop_name}`,

                    "info"

                );

                return;

            }

            const newQuantity = cartItem.quantity - 1;

            const shop = shops.find(

                item => String(item.shop_id) === shopId

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

                        product_id: shopId,

                        quantity: newQuantity

                    })

                }

            );

            const data = await response.json();

            if (!data.success) return;

            setCartProducts(prev =>

                prev.map(item =>

                    String(item.product_id) === shopId

                        ? {

                            ...item,

                            quantity: newQuantity

                        }

                        : item

                )

            );

            showToast(

                `Removed 1 Shop\n${shop.shop_name}\nTotal Quantity : ${newQuantity}`,

                "info"

            );

        }

        catch (err) {

            console.log(err);

        }

    };

    return (

        <div className="gf-page">

            <section className="gf-section">

                <div className="gf-grid">

                    {

                        shops.map((shop) => (
                            <ShopCard

                                key={shop.shop_id}

                                shop={shop}

                                isLiked={likedShops.has(String(shop.shop_id))}

                                isSaved={savedShops.has(String(shop.shop_id))}

                                isAddedToCart={
                                    cartProducts.some(
                                        item => String(item.product_id) === String(shop.shop_id)
                                    )
                                }

                                cartQuantity={
                                    cartProducts.find(
                                        item => String(item.product_id) === String(shop.shop_id)
                                    )?.quantity || 0
                                }

                                onLike={handleLike}

                                onSave={handleSave}

                                onAddToCart={handleAddToCart}

                                onIncreaseQuantity={handleIncreaseQuantity}

                                onDecreaseQuantity={handleDecreaseQuantity}

                                onOpenDetails={() =>
                                    onOpenDetails(shop, "shop")
                                }

                            />

                        ))

                    }

                </div>

            </section>

            <Toast

                show={toast.show}

                message={toast.message}

                type={toast.type}

            />

        </div>

    );

}

export default Shop;