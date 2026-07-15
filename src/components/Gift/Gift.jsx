import { useEffect, useState } from "react";
import { API } from "../../services/api";
import GiftCard from "./GiftCard";
import Toast from "../Toast/Toast";
import "./Gift.css";
const userId = 7;

function Gift({

    setCartCount,

    onOpenDetails

}) {

    const [gifts, setGifts] = useState([]);
    const [likedGifts, setLikedGifts] = useState(new Set());
    const [savedGifts, setSavedGifts] = useState(new Set());
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
        loadGifts();
        loadLikes();
        loadWishlist();
        loadCart();

    }, []);

    const loadGifts = async () => {

        try {

            const response = await fetch(`${API}/api/user/gifts`);

            const data = await response.json();

            if (data.success) {

                setGifts(data.data);

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

                setLikedGifts(

                    new Set(

                        data.data.map(item => item.product_id)

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

                setSavedGifts(

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

    const handleLike = async (giftId) => {

        try {

            if (likedGifts.has(giftId)) {

                const response = await fetch(

                    `${API}/api/user/likes/${giftId}`,

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

                const updatedLiked = new Set(likedGifts);

                updatedLiked.delete(giftId);

                setLikedGifts(updatedLiked);

                setGifts(prev =>

                    prev.map(gift =>

                        gift.gift_id === giftId

                            ? {

                                ...gift,

                                gift_total_likes: Math.max(

                                    (gift.gift_total_likes || 0) - 1,

                                    0

                                )

                            }

                            : gift

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

                            product_id: giftId

                        })

                    }

                );

                const data = await response.json();

                if (!data.success) return;

                const updatedLiked = new Set(likedGifts);

                updatedLiked.add(giftId);

                setLikedGifts(updatedLiked);

                setGifts(prev =>

                    prev.map(gift =>

                        gift.gift_id === giftId

                            ? {

                                ...gift,

                                gift_total_likes:

                                    (gift.gift_total_likes || 0) + 1

                            }

                            : gift

                    )

                );

                showToast("Gift Liked", "success");

            }

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleSave = async (giftId) => {

        giftId = String(giftId);

        try {

            if (savedGifts.has(giftId)) {

                const response = await fetch(

                    `${API}/api/user/wishlist/${giftId}`,

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

                const updatedSaved = new Set(savedGifts);

                updatedSaved.delete(giftId);

                setSavedGifts(updatedSaved);

                setGifts(prev =>

                    prev.map(gift =>

                        String(gift.gift_id) === giftId

                            ? {

                                ...gift,

                                gift_total_saves: Math.max(

                                    (gift.gift_total_saves || 0) - 1,

                                    0

                                )

                            }

                            : gift

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

                            product_id: giftId

                        })

                    }

                );

                const data = await response.json();

                if (!data.success) return;

                const updatedSaved = new Set(savedGifts);

                updatedSaved.add(giftId);

                setSavedGifts(updatedSaved);

                setGifts(prev =>

                    prev.map(gift =>

                        String(gift.gift_id) === giftId

                            ? {

                                ...gift,

                                gift_total_saves:

                                    (gift.gift_total_saves || 0) + 1

                            }

                            : gift

                    )

                );

                showToast("Saved to Wishlist", "success");

            }

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleAddToCart = async (giftId) => {

        try {

            giftId = String(giftId);

            const exists = cartProducts.some(

                item => String(item.product_id) === giftId

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

                        product_id: giftId,

                        quantity: 1

                    })

                }

            );

            const data = await response.json();

            if (!data.success) return;

            const updatedCart = [

                ...cartProducts,

                {

                    product_id: giftId,

                    quantity: 1

                }

            ];

            setCartProducts(updatedCart);

            setCartCount(updatedCart.length);

            showToast("Gift Added To Cart", "success");

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleIncreaseQuantity = async (giftId) => {

        giftId = String(giftId);

        try {

            const cartItem = cartProducts.find(

                item => String(item.product_id) === giftId

            );

            if (!cartItem) return;

            const newQuantity = cartItem.quantity + 1;

            const gift = gifts.find(

                item => String(item.gift_id) === giftId

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

                        product_id: giftId,

                        quantity: newQuantity

                    })

                }

            );

            const data = await response.json();

            if (!data.success) return;

            setCartProducts(prev =>

                prev.map(item =>

                    String(item.product_id) === giftId

                        ? {

                            ...item,

                            quantity: newQuantity

                        }

                        : item

                )

            );

            showToast(

                `Added 1 Gift\n${gift.gift_name}\nTotal Quantity : ${newQuantity}`,

                "success"

            );

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleDecreaseQuantity = async (giftId) => {

        giftId = String(giftId);

        try {

            const cartItem = cartProducts.find(

                item => String(item.product_id) === giftId

            );

            if (!cartItem) return;

            // Minimum 1 pe Remove
            if (cartItem.quantity <= 1) {

                const response = await fetch(

                    `${API}/api/user/cart/${giftId}`,

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

                const gift = gifts.find(

                    item => String(item.gift_id) === giftId

                );

                const updatedCart = cartProducts.filter(

                    item => String(item.product_id) !== giftId

                );

                setCartProducts(updatedCart);

                setCartCount(updatedCart.length);

                showToast(

                    `Removed From Cart\n${gift.gift_name}`,

                    "info"

                );

                return;

            }

            const newQuantity = cartItem.quantity - 1;

            const gift = gifts.find(

                item => String(item.gift_id) === giftId

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

                        product_id: giftId,

                        quantity: newQuantity

                    })

                }

            );

            const data = await response.json();

            if (!data.success) return;

            setCartProducts(prev =>

                prev.map(item =>

                    String(item.product_id) === giftId

                        ? {

                            ...item,

                            quantity: newQuantity

                        }

                        : item

                )

            );

            showToast(

                `Removed 1 Gift\n${gift.gift_name}\nTotal Quantity : ${newQuantity}`,

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

                        gifts.map((gift) => (
                            <GiftCard

                                key={gift.gift_id}

                                gift={gift}

                                isLiked={likedGifts.has(gift.gift_id)}

                                isSaved={savedGifts.has(String(gift.gift_id))}

                                isAddedToCart={
                                    cartProducts.some(
                                        item => String(item.product_id) === String(gift.gift_id)
                                    )
                                }

                                cartQuantity={
                                    cartProducts.find(
                                        item => String(item.product_id) === String(gift.gift_id)
                                    )?.quantity || 0
                                }

                                onLike={handleLike}

                                onSave={handleSave}

                                onAddToCart={handleAddToCart}

                                onIncreaseQuantity={handleIncreaseQuantity}

                                onDecreaseQuantity={handleDecreaseQuantity}

                                onOpenDetails={() =>
                                    onOpenDetails(gift, "gift")
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

export default Gift;