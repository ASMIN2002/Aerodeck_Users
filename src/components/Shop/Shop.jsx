import { useEffect, useState, useMemo } from "react";
import Loading from "../../components/Loading/Loading";
import ShopCard from "../Shop/ShopCard";
import Toast from "../Toast/Toast";
import { API } from "../../services/api";
import ShopHome from "./ShopHome";
import ShopCategory from "./ShopCategory";
import ALLShopCategories from "./ALLShopCategories";
import "./Shop.css";

const TOAST_DURATION = 2000;

function shopIdOf(product) {
    return String(product.shop_id);
}

function updateShopField(products, shopId, field, delta) {
    return products.map((p) =>
        shopIdOf(p) === shopId
            ? { ...p, [field]: Math.max((p[field] || 0) + delta, 0) }
            : p
    );
}

function toggleSetItem(set, id, isAdd) {
    const next = new Set(set);
    if (isAdd) next.add(id);
    else next.delete(id);
    return next;
}

async function toggleUserItem(endpoint, id, isActive, sessionToken) {
    const res = await fetch(
        isActive
            ? `${API}/api/user/${endpoint}/${id}`
            : `${API}/api/user/${endpoint}`,
        {
            method: isActive ? "DELETE" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                isActive
                    ? { session_token: sessionToken }
                    : { session_token: sessionToken, product_id: id }
            ),
        }
    );
    return res.json();
}

function Shop({
    user,
    setCartCount,
    onOpenDetails,
    search,
    filter,
    shopCategoryPage,
    setShopCategoryPage,
    selectedShopCategory,
    allShopCategoriesPage,
    setAllShopCategoriesPage,
    setSelectedShopCategory,
    setSuggestionData,
    goTo,
}) {
    const sessionToken = localStorage.getItem("session_token");

    const [shops, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [savedProducts, setSavedProducts] = useState(new Set());
    const [likedProducts, setLikedProducts] = useState(new Set());
    const [cartProducts, setCartProducts] = useState([]);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [showLoading, setShowLoading] = useState(true);

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type }), TOAST_DURATION);
    };

    const handleSave = async (productId) => {
        const id = String(productId);
        const isSaved = savedProducts.has(id);

        try {
            const data = await toggleUserItem("wishlist", id, isSaved, sessionToken);
            if (!data.success) return;

            setSavedProducts((prev) => toggleSetItem(prev, id, !isSaved));
            setProducts((prev) =>
                updateShopField(prev, id, "shop_total_saves", isSaved ? -1 : 1)
            );

            showToast(
                isSaved ? "Removed from Wishlist" : "Saved to Wishlist",
                isSaved ? "info" : "success"
            );
        } catch (err) {
            console.error("Save error:", err.message);
        }
    };

    const handleLike = async (productId) => {
        const id = String(productId);
        const isLiked = likedProducts.has(id);

        try {
            const data = await toggleUserItem("likes", id, isLiked, sessionToken);
            if (!data.success) return;

            setLikedProducts((prev) => toggleSetItem(prev, id, !isLiked));
            setProducts((prev) =>
                updateShopField(prev, id, "shop_total_likes", isLiked ? -1 : 1)
            );

            showToast(
                isLiked ? "Like Removed" : "Product Liked",
                isLiked ? "info" : "success"
            );
        } catch (err) {
            console.error("Like error:", err.message);
        }
    };

    const handleAddToCart = async (productId) => {
        const id = String(productId);
        const exists = cartProducts.some((i) => String(i.product_id) === id);

        if (exists) {
            showToast("Already in Cart", "info");
            return;
        }

        try {
            const res = await fetch(`${API}/api/user/cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_token: sessionToken,
                    product_id: id,
                    quantity: 1,
                }),
            });
            const data = await res.json();
            if (!data.success) return;

            const nextCart = [...cartProducts, { product_id: id, quantity: 1 }];
            setCartProducts(nextCart);
            setCartCount(nextCart.length);
            showToast("Added To Cart", "success");
        } catch (err) {
            console.error("Add to cart error:", err.message);
        }
    };

    const handleIncreaseQuantity = async (productId) => {
        const id = String(productId);
        const item = cartProducts.find((i) => String(i.product_id) === id);
        if (!item) return;

        const newQty = item.quantity + 1;

        try {
            const res = await fetch(`${API}/api/user/cart`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_token: sessionToken,
                    product_id: id,
                    quantity: newQty,
                }),
            });
            const data = await res.json();
            if (!data.success) return;

            setCartProducts((prev) =>
                prev.map((i) =>
                    String(i.product_id) === id ? { ...i, quantity: newQty } : i
                )
            );
        } catch (err) {
            console.error("Increase qty error:", err.message);
        }
    };

    const handleDecreaseQuantity = async (productId) => {
        const id = String(productId);
        const item = cartProducts.find((i) => String(i.product_id) === id);
        if (!item) return;

        try {
            if (item.quantity <= 1) {
                const res = await fetch(`${API}/api/user/cart/${id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_token: sessionToken }),
                });
                const data = await res.json();
                if (!data.success) return;

                const nextCart = cartProducts.filter(
                    (i) => String(i.product_id) !== id
                );
                setCartProducts(nextCart);
                setCartCount(nextCart.length);
                return;
            }

            const newQty = item.quantity - 1;
            const res = await fetch(`${API}/api/user/cart`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_token: sessionToken,
                    product_id: id,
                    quantity: newQty,
                }),
            });
            const data = await res.json();
            if (!data.success) return;

            setCartProducts((prev) =>
                prev.map((i) =>
                    String(i.product_id) === id ? { ...i, quantity: newQty } : i
                )
            );
        } catch (err) {
            console.error("Decrease qty error:", err.message);
        }
    };

    useEffect(() => {
        async function loadCategories() {
            try {
                const res = await fetch(`${API}/api/category`);
                const data = await res.json();
                if (data.success) {
                    setCategories(
                        data.data.filter(
                            (item) =>
                                item?.catid &&
                                item?.category &&
                                String(item.catname).toUpperCase() === "SHOP"
                        )
                    );
                }
            } catch (err) {
                console.error("Categories error:", err.message);
            }
        }

        async function loadProducts() {
            try {
                const res = await fetch(`${API}/api/user/shop`);
                const data = await res.json();
                if (data.success) {
                    setProducts(data.data);
                    setSuggestionData(data.data);
                }
            } catch (err) {
                console.error("Products error:", err.message);
            }
        }

        async function loadWishlist() {
            try {
                const res = await fetch(
                    `${API}/api/user/wishlist?session_token=${sessionToken}`
                );
                const data = await res.json();
                if (data.success) {
                    setSavedProducts(
                        new Set(data.data.map((i) => String(i.product_id)))
                    );
                }
            } catch (err) {
                console.error("Wishlist error:", err.message);
            }
        }

        async function loadLikes() {
            try {
                const res = await fetch(
                    `${API}/api/user/likes?session_token=${sessionToken}`
                );
                const data = await res.json();
                if (data.success) {
                    setLikedProducts(new Set(data.data.map((i) => i.product_id)));
                }
            } catch (err) {
                console.error("Likes error:", err.message);
            }
        }

        async function loadCart() {
            try {
                const res = await fetch(
                    `${API}/api/user/cart?session_token=${sessionToken}`
                );
                const data = await res.json();
                if (data.success) {
                    setCartProducts(data.data);
                    setCartCount(data.data.length);
                }
            } catch (err) {
                console.error("Cart error:", err.message);
            }
        }

        loadCategories();
        loadProducts();
        loadWishlist();
        loadLikes();
        loadCart();
    }, [sessionToken, setCartCount, setSuggestionData]);

    const filteredShops = useMemo(() => {
        const keyword = search.toLowerCase();
        if (!search) return shops;
        return shops.filter(
            (s) =>
                s.shop_name?.toLowerCase().includes(keyword) ||
                s.shop_description?.toLowerCase().includes(keyword) ||
                s.shop_category?.toLowerCase().includes(keyword)
        );
    }, [shops, search]);

    const finalShops = useMemo(() => {
        let list = [...filteredShops];

        if (filter.sort === "low")
            list.sort((a, b) => Number(a.shop_price) - Number(b.shop_price));
        if (filter.sort === "high")
            list.sort((a, b) => Number(b.shop_price) - Number(a.shop_price));

        if (filter.rating > 0)
            list = list.filter((s) => Number(s.shop_rating) >= filter.rating);
        if (filter.availableOnly)
            list = list.filter((s) => Number(s.shop_status) === 1);

        return list;
    }, [filteredShops, filter]);

    const isSearching = search.trim().length > 0;
    const isFilterActive =
        (filter.sort && filter.sort !== "") ||
        (filter.rating && Number(filter.rating) > 0) ||
        filter.availableOnly === true;

    return (
        <>
            {showLoading && (
                <Loading
                    duration={500}
                    text="Loading Shop Items..."
                    onComplete={() => setShowLoading(false)}
                />
            )}

            {allShopCategoriesPage ? (
                <ALLShopCategories
                    categories={categories}
                    onBack={() => setAllShopCategoriesPage(false)}
                    onCategoryClick={(category) => {
                        setSelectedShopCategory(category);
                        setAllShopCategoriesPage(false);
                        setShopCategoryPage(true);
                        goTo(`/home/shop/allcategory/${encodeURIComponent(category)}`);
                    }}
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
            ) : isSearching || isFilterActive ? (
                <section className="heepit-shop-search-results">
                    {finalShops.length > 0 ? (
                        <div className="heepit-shop-grid">
                            {finalShops.map((shop) => (
                                <ShopCard
                                    key={shop.shop_id}
                                    product={shop}
                                    isSaved={savedProducts.has(String(shop.shop_id))}
                                    isLiked={likedProducts.has(String(shop.shop_id))}
                                    isAddedToCart={cartProducts.some(
                                        (i) =>
                                            String(i.product_id) === String(shop.shop_id)
                                    )}
                                    cartQuantity={
                                        cartProducts.find(
                                            (i) =>
                                                String(i.product_id) ===
                                                String(shop.shop_id)
                                        )?.quantity || 0
                                    }
                                    onSave={handleSave}
                                    onLike={handleLike}
                                    onAddToCart={handleAddToCart}
                                    onIncreaseQuantity={handleIncreaseQuantity}
                                    onDecreaseQuantity={handleDecreaseQuantity}
                                    onOpenDetails={() => onOpenDetails(shop, "shop")}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="shop-empty">
                            <span className="shop-empty-icon">📭</span>
                            <h3 className="shop-empty-title">No Products Available</h3>
                            <p className="shop-empty-text">
                                Try changing your filter or search.
                            </p>
                        </div>
                    )}
                </section>
            ) : (
                <ShopHome
                    user={user}
                    categories={categories}
                    shops={shops}
                    onCategoryClick={(category) => {
                        setSelectedShopCategory(category);
                        setShopCategoryPage(true);
                        goTo(`/home/shop/category/${encodeURIComponent(category)}`);
                    }}
                    onOpenAllShopCategories={() => {
                        setAllShopCategoriesPage(true);
                        goTo("/home/shop/allcategory");
                    }}
                    onOpenDetails={onOpenDetails}
                />
            )}

            <Toast show={toast.show} message={toast.message} type={toast.type} />
        </>
    );
}

export default Shop;