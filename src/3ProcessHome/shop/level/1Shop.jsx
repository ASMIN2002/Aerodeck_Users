import { useEffect, useState, useMemo } from "react";
import ShopCard from "./2ShopCard";
import Toast from "../../../1hook/hooks/Toast";
import { API } from "../../../services/api";
import ShopHome from "./5ShopHome";
import ShopCategory from "./3ShopCategory";
import ALLShopCategories from "./4AllShopCategories";
import "../levelstyle/1Shop.css";

const TOAST_DURATION = 2000;
const EMPTY_TOAST = { show: false, message: "", type: "success" };

const idOf = (item) => String(item.shop_id ?? item.product_id);
const getSession = () => localStorage.getItem("session_token");

const bumpField = (list, id, field, delta) =>
    list.map((p) => (idOf(p) === id ? { ...p, [field]: Math.max((p[field] || 0) + delta, 0) } : p));

const toggleSet = (set, id, add) => {
    const next = new Set(set);
    add ? next.add(id) : next.delete(id);
    return next;
};

const toggleUserItem = (endpoint, id, isActive, sessionToken) =>
    fetch(isActive ? `${API}/api/user/${endpoint}/${id}` : `${API}/api/user/${endpoint}`, {
        method: isActive ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isActive ? { session_token: sessionToken } : { session_token: sessionToken, product_id: id }),
    }).then((r) => r.json());

const fetchJSON = (url) => fetch(url).then((r) => r.json());
const cartQty = (cart, id) => cart.find((i) => String(i.product_id) === id)?.quantity || 0;
const inCart = (cart, id) => cart.some((i) => String(i.product_id) === id);

function Shop({
    user, setCartCount, onOpenDetails, search, filter,
    shopCategoryPage, setShopCategoryPage, selectedShopCategory,
    allShopCategoriesPage, setAllShopCategoriesPage, setSelectedShopCategory,
    setSuggestionData, goTo,
}) {
    const sessionToken = getSession();

    const [shops, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [savedProducts, setSavedProducts] = useState(new Set());
    const [likedProducts, setLikedProducts] = useState(new Set());
    const [cartProducts, setCartProducts] = useState([]);
    const [toast, setToast] = useState(EMPTY_TOAST);

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(EMPTY_TOAST), TOAST_DURATION);
    };

    const syncCart = (next) => {
        setCartProducts(next);
        setCartCount(next.length);
    };

    const handleSave = async (productId) => {
        const id = String(productId);
        const wasSaved = savedProducts.has(id);
        try {
            const data = await toggleUserItem("wishlist", id, wasSaved, sessionToken);
            if (!data.success) return;
            setSavedProducts((prev) => toggleSet(prev, id, !wasSaved));
            setProducts((prev) => bumpField(prev, id, "shop_total_saves", wasSaved ? -1 : 1));
            showToast(wasSaved ? "Removed from Wishlist" : "Saved to Wishlist", wasSaved ? "info" : "success");
        } catch (err) { console.error("Save error:", err.message); }
    };

    const handleLike = async (productId) => {
        const id = String(productId);
        const wasLiked = likedProducts.has(id);
        try {
            const data = await toggleUserItem("likes", id, wasLiked, sessionToken);
            if (!data.success) return;
            setLikedProducts((prev) => toggleSet(prev, id, !wasLiked));
            setProducts((prev) => bumpField(prev, id, "shop_total_likes", wasLiked ? -1 : 1));
            showToast(wasLiked ? "Like Removed" : "Product Liked", wasLiked ? "info" : "success");
        } catch (err) { console.error("Like error:", err.message); }
    };

    const handleAddToCart = async (productId) => {
        const id = String(productId);
        if (inCart(cartProducts, id)) return showToast("Already in Cart", "info");
        try {
            const data = await fetch(`${API}/api/user/cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: sessionToken, product_id: id, quantity: 1 }),
            }).then((r) => r.json());
            if (!data.success) return;
            syncCart([...cartProducts, { product_id: id, quantity: 1 }]);
            showToast("Added To Cart", "success");
        } catch (err) { console.error("Add to cart error:", err.message); }
    };

    const updateQty = async (productId, delta) => {
        const id = String(productId);
        const item = cartProducts.find((i) => String(i.product_id) === id);
        if (!item) return;

        const remove = delta < 0 && item.quantity <= 1;
        try {
            if (remove) {
                const data = await fetch(`${API}/api/user/cart/${id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_token: sessionToken }),
                }).then((r) => r.json());
                if (!data.success) return;
                return syncCart(cartProducts.filter((i) => String(i.product_id) !== id));
            }

            const quantity = item.quantity + delta;
            const data = await fetch(`${API}/api/user/cart`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: sessionToken, product_id: id, quantity }),
            }).then((r) => r.json());
            if (!data.success) return;
            setCartProducts((prev) => prev.map((i) => (String(i.product_id) === id ? { ...i, quantity } : i)));
        } catch (err) { console.error("Qty error:", err.message); }
    };

    const handleIncreaseQuantity = (id) => updateQty(id, 1);
    const handleDecreaseQuantity = (id) => updateQty(id, -1);

    useEffect(() => {
        fetchJSON(`${API}/api/category`)
            .then((data) => {
                if (data.success) {
                    setCategories(data.data.filter((item) => item?.catid && item?.category && String(item.catname).toUpperCase() === "SHOP"));
                }
            })
            .catch((err) => console.error("Categories error:", err.message));

        fetchJSON(`${API}/api/user/shop`)
            .then((data) => {
                if (data.success) { setProducts(data.data); setSuggestionData(data.data); }
            })
            .catch((err) => console.error("Products error:", err.message));

        fetchJSON(`${API}/api/user/wishlist?session_token=${sessionToken}`)
            .then((data) => {
                if (data.success) setSavedProducts(new Set(data.data.map((i) => String(i.product_id))));
            })
            .catch((err) => console.error("Wishlist error:", err.message));

        fetchJSON(`${API}/api/user/likes?session_token=${sessionToken}`)
            .then((data) => {
                if (data.success) setLikedProducts(new Set(data.data.map((i) => i.product_id)));
            })
            .catch((err) => console.error("Likes error:", err.message));

        fetchJSON(`${API}/api/user/cart?session_token=${sessionToken}`)
            .then((data) => {
                if (data.success) syncCart(data.data);
            })
            .catch((err) => console.error("Cart error:", err.message));
    }, [sessionToken, setCartCount, setSuggestionData]);

    const filteredShops = useMemo(() => {
        const kw = search.toLowerCase();
        if (!search) return shops;
        return shops.filter((s) =>
            s.shop_name?.toLowerCase().includes(kw) ||
            s.shop_description?.toLowerCase().includes(kw) ||
            s.shop_category?.toLowerCase().includes(kw)
        );
    }, [shops, search]);

    const finalShops = useMemo(() => {
        let list = [...filteredShops];
        if (filter.sort === "low") list.sort((a, b) => Number(a.shop_price) - Number(b.shop_price));
        if (filter.sort === "high") list.sort((a, b) => Number(b.shop_price) - Number(a.shop_price));
        if (filter.rating > 0) list = list.filter((s) => Number(s.shop_rating) >= filter.rating);
        if (filter.availableOnly) list = list.filter((s) => Number(s.shop_status) === 1);
        return list;
    }, [filteredShops, filter]);

    const isSearching = search.trim().length > 0;
    const isFilterActive = Boolean(filter.sort) || Number(filter.rating) > 0 || filter.availableOnly === true;

    const goAllCategories = () => {
        setAllShopCategoriesPage(true);
        goTo("/home/shop/allcategory");
    };

    const goCategory = (category, fromAll = false) => {
        setSelectedShopCategory(category);
        if (fromAll) setAllShopCategoriesPage(false);
        setShopCategoryPage(true);
        goTo(`/home/shop/${fromAll ? "allcategory" : "category"}/${encodeURIComponent(category)}`);
    };

    const backFromCategory = () => {
        setSelectedShopCategory(null);
        setShopCategoryPage(false);
    };

    if (allShopCategoriesPage) {
        return (
            <>
                <ALLShopCategories categories={categories} onBack={() => setAllShopCategoriesPage(false)} onCategoryClick={(c) => goCategory(c, true)} />
                <Toast {...toast} />
            </>
        );
    }

    if (shopCategoryPage) {
        return (
            <>
                <ShopCategory
                    category={selectedShopCategory}
                    shops={finalShops}
                    onBack={backFromCategory}
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
                <Toast {...toast} />
            </>
        );
    }

    if (isSearching || isFilterActive) {
        return (
            <>
                <section className="heepit-shop-search-results">
                    {finalShops.length > 0 ? (
                        <div className="heepit-shop-grid">
                            {finalShops.map((shop) => {
                                const id = String(shop.shop_id);
                                return (
                                    <ShopCard
                                        key={shop.shop_id}
                                        product={shop}
                                        isSaved={savedProducts.has(id)}
                                        isLiked={likedProducts.has(id)}
                                        isAddedToCart={inCart(cartProducts, id)}
                                        cartQuantity={cartQty(cartProducts, id)}
                                        onSave={handleSave}
                                        onLike={handleLike}
                                        onAddToCart={handleAddToCart}
                                        onIncreaseQuantity={handleIncreaseQuantity}
                                        onDecreaseQuantity={handleDecreaseQuantity}
                                        onOpenDetails={() => onOpenDetails(shop, "shop")}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="shop-empty">
                            <span className="shop-empty-icon">📭</span>
                            <h3 className="shop-empty-title">No Products Available</h3>
                            <p className="shop-empty-text">Try changing your filter or search.</p>
                        </div>
                    )}
                </section>
                <Toast {...toast} />
            </>
        );
    }

    return (
        <>
            <ShopHome
                user={user}
                categories={categories}
                shops={shops}
                onCategoryClick={(c) => goCategory(c)}
                onOpenAllShopCategories={goAllCategories}
                onOpenDetails={onOpenDetails}
            />
            <Toast {...toast} />
        </>
    );
}

export default Shop;