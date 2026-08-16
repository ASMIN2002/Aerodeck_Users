import { useEffect, useState, useMemo, useRef } from "react";
import Loading from "../../components/Loading/Loading";
import ShopCard from "../Shop/ShopCard";
import Toast from "../Toast/Toast";
import { API } from "../../services/api";
import ShopHome from "./ShopHome";
import AllShops from "./AllShops";
import ShopCategory from "./ShopCategory";

function Shop({
    user,
    setCartCount,
    onOpenDetails,
    search,
    filter,
    shopCategoryPage,
    setShopCategoryPage,
    selectedShopCategory,
    setSelectedShopCategory,
    setSuggestionData
}) {

    const sessionToken = localStorage.getItem("session_token");

    const [shops, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allShopsPage, setAllShopsPage] = useState(false);
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

                        String(product.shop_id) === String(productId)

                            ? {

                                ...product,

                                shop_total_saves: Math.max(

                                    (product.shop_total_saves || 0) - 1,

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

                        String(product.shop_id) === String(productId)

                            ? {

                                ...product,

                                shop_total_saves:

                                    (product.shop_total_saves || 0) + 1

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

                        String(product.shop_id) === String(productId)

                            ? {

                                ...product,

                                shop_total_likes: Math.max(

                                    (product.shop_total_likes || 0) - 1,

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

                        String(product.shop_id) === String(productId)

                            ? {

                                ...product,

                                shop_total_likes:

                                    (product.shop_total_likes || 0) + 1

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

                item => String(item.product_id) === String(productId)

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

                        quantity: 1

                    })

                }

            );

            const data = await response.json();

            if (!data.success) return;

            const updatedCart = [

                ...cartProducts,

                {

                    product_id: productId,

                    quantity: 1

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
            const product = shops.find(

                item => String(item.shop_id) === String(productId)

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
            if (cartItem.quantity <= 1) {

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
                const product = shops.find(
                    item => String(item.shop_id) === String(productId)
                );

                const updatedCart = cartProducts.filter(
                    item => String(item.product_id) !== String(productId)
                );

                setCartProducts(updatedCart);

                setCartCount(updatedCart.length);
                return;

            }

            const newQuantity = cartItem.quantity - 1;
            const product = shops.find(

                item => String(item.shop_id) === String(productId)

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

                const response = await fetch(`${API}/api/user/shop`);

                const data = await response.json();
                if (data.success) {

                    setProducts(data.data);
                    setSuggestionData(data.data);

                    setCategories([
                        ...new Set(
                            data.data
                                .map(item => item.shop_category)
                                .filter(Boolean)
                        )
                    ]);

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

    const filteredShops = shops.filter((shop) => {

        const keyword = search.toLowerCase();

        const matchesSearch =
            !search ||
            shop.shop_name?.toLowerCase().includes(keyword) ||
            shop.shop_description?.toLowerCase().includes(keyword) ||
            shop.shop_category?.toLowerCase().includes(keyword);

        return matchesSearch;

    });

    let finalShops = [...filteredShops];
    if (filter.sort === "low") {

        finalShops.sort(

            (a, b) =>

                Number(a.shop_price) -

                Number(b.shop_price)

        );

    }

    if (filter.sort === "high") {

        finalShops.sort(

            (a, b) =>

                Number(b.shop_price) -

                Number(a.shop_price)

        );

    }

    if (filter.rating > 0) {

        finalShops = finalShops.filter(

            shop =>

                Number(shop.shop_rating) >= filter.rating

        );

    }

    if (filter.availableOnly) {

        finalShops = finalShops.filter(

            shop =>

                Number(shop.shop_status) === 1

        );

    }
    const [searchSuggestions, setSearchSuggestions] = useState([]);

    useEffect(() => {

        if (!search.trim()) {
            setSearchSuggestions([]);
            return;
        }

        const keyword = search.toLowerCase().trim();

        const names = shops
            .filter(shop =>
                shop.shop_name?.toLowerCase().includes(keyword)
            )
            .map(shop => ({
                type: "shop",
                value: shop.shop_name
            }));

        const categories = [
            ...new Set(
                shops
                    .filter(shop =>
                        shop.shop_category
                            ?.toLowerCase()
                            .includes(keyword)
                    )
                    .map(shop => shop.shop_category)
                    .filter(Boolean)
            )
        ].map(category => ({
            type: "category",
            value: category
        }));

        const combined = [
            ...names,
            ...categories
        ];

        const unique = combined.filter(
            (item, index, self) =>
                index === self.findIndex(
                    x =>
                        x.value.toLowerCase() ===
                        item.value.toLowerCase()
                )
        );

        setSearchSuggestions(
            unique.slice(0, 6)
        );

    }, [search, shops]);
    const [activeOfferIndex, setActiveOfferIndex] = useState(0);

    const suggestedShops = useMemo(() => {

        const good = shops.filter(
            shop => Number(shop.shop_rating || 0) > 3.5
        );

        const medium = shops.filter(
            shop => {
                const rating = Number(shop.shop_rating || 0);
                return rating > 1 && rating <= 3.5;
            }
        );

        const veryLow = shops.filter(
            shop => Number(shop.shop_rating || 0) <= 1
        );

        const shuffle = (array) =>
            [...array].sort(() => Math.random() - 0.5);

        const selected = [
            ...shuffle(good).slice(0, 15),
            ...shuffle(medium).slice(0, 2),
            ...shuffle(veryLow).slice(0, 3)
        ];

        return shuffle(selected);

    }, [shops]);

    const topLikedShops = useMemo(() => {

        return [...shops]
            .sort(
                (a, b) =>
                    Number(b.shop_total_likes || 0) -
                    Number(a.shop_total_likes || 0)
            )
            .slice(0, 16);

    }, [shops]);
    const offerShops = useMemo(() => {

        const eligible = shops.filter(shop =>
            /up\s*to.*\d+%.*off/i.test(
                shop.shop_highlight_text || ""
            )
        );

        return [...eligible]
            .sort(() => Math.random() - 0.5)
            .slice(0, 5);

    }, [shops]);
    const offerScrollRef = useRef(null);

    useEffect(() => {

        if (offerShops.length <= 1) return;

        const timer = setInterval(() => {

            const container = offerScrollRef.current;

            if (!container) return;

            const nextPosition =
                container.scrollLeft + container.clientWidth;

            if (
                nextPosition >=
                container.scrollWidth - container.clientWidth
            ) {

                container.scrollTo({
                    left: 0,
                    behavior: "smooth"
                });

            } else {

                container.scrollTo({
                    left: nextPosition,
                    behavior: "smooth"
                });

            }

        }, 3000);

        return () => clearInterval(timer);

    }, [offerShops]);
    const randomShops = useMemo(() => {

        return [...shops]
            .sort(() => Math.random() - 0.5);

    }, [shops]);

    const isSearching = search.trim().length > 0;

    return (
        <>{
            showLoading && (
                <Loading
                    duration={500}
                    text="Loading Shop Items..."
                    onComplete={() => setShowLoading(false)}
                />
            )
        }

            {
                allShopsPage ? (

                    <AllShops
                        shops={finalShops}

                        onBack={() => {
                            setAllShopsPage(false);
                        }}

                        onOpenDetails={onOpenDetails}

                        onSave={handleSave}
                        onLike={handleLike}
                        onAddToCart={handleAddToCart}

                        onIncreaseQuantity={handleIncreaseQuantity}
                        onDecreaseQuantity={handleDecreaseQuantity}

                        savedProducts={savedProducts}
                        likedProducts={likedProducts}
                        cartProducts={cartProducts}
                    />

                ) : shopCategoryPage ? (

                    <ShopCategory

                        category={selectedShopCategory}

                        shops={finalShops}

                        onBack={() => {

                            setSelectedShopCategory(null);

                            setShopCategoryPage(false);

                        }}

                        onOpenDetails={onOpenDetails}

                        onSave={handleSave}
                        onLike={handleLike}
                        onAddToCart={handleAddToCart}

                        onIncreaseQuantity={handleIncreaseQuantity}
                        onDecreaseQuantity={handleDecreaseQuantity}

                        savedProducts={savedProducts}
                        likedProducts={likedProducts}
                        cartProducts={cartProducts}

                    />

                ) : isSearching ? (

                    <section className="shop-search-results">

                        <div className="cds-grid">

                            {
                                finalShops.map((shop) => (

                                    <ShopCard

                                        key={shop.shop_id}

                                        product={shop}

                                        isSaved={
                                            savedProducts.has(
                                                String(shop.shop_id)
                                            )
                                        }

                                        isLiked={
                                            likedProducts.has(
                                                String(shop.shop_id)
                                            )
                                        }

                                        isAddedToCart={
                                            cartProducts.some(
                                                item =>
                                                    String(item.product_id) ===
                                                    String(shop.shop_id)
                                            )
                                        }

                                        cartQuantity={
                                            cartProducts.find(
                                                item =>
                                                    String(item.product_id) ===
                                                    String(shop.shop_id)
                                            )?.quantity || 0
                                        }

                                        onSave={handleSave}

                                        onLike={handleLike}

                                        onAddToCart={handleAddToCart}

                                        onIncreaseQuantity={
                                            handleIncreaseQuantity
                                        }

                                        onDecreaseQuantity={
                                            handleDecreaseQuantity
                                        }

                                        onOpenDetails={() =>
                                            onOpenDetails(shop, "shop")
                                        }

                                    />

                                ))
                            }

                        </div>

                    </section>

                ) : (

                    <ShopHome

                        user={user}

                        categories={categories}

                        shops={shops}

                        onCategoryClick={(category) => {

                            setSelectedShopCategory(category);

                            setShopCategoryPage(true);

                        }}

                        onOpenDetails={onOpenDetails}

                        onSave={handleSave}
                        onLike={handleLike}
                        onAddToCart={handleAddToCart}

                        onIncreaseQuantity={handleIncreaseQuantity}
                        onDecreaseQuantity={handleDecreaseQuantity}

                        savedProducts={savedProducts}
                        likedProducts={likedProducts}
                        cartProducts={cartProducts}

                        onOpenAllShops={() => {

                            setShopCategoryPage(false);
                            setSelectedShopCategory(null);
                            setAllShopsPage(true);

                        }}

                    />

                )
            }

            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
            />

        </>
    );

}

export default Shop;