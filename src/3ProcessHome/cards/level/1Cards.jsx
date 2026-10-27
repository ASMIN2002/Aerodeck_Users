import { useEffect, useState, useCallback, useMemo, useRef, memo } from "react";
import { useLocation } from "react-router-dom";
import "../levelstyle/1Cards.css";
import ProductCard from "./2ProductCard";
import Toast from "../../../1hook/hooks/Toast";
import CardsTab from "./CardsTab";
import { API } from "../../../services/api";

const TOAST_DURATION = 2000;
const CARD_QUANTITY = 50;

function productIdOf(product) {
    return String(product.product_id);
}

function toggleSetItem(set, id, isAdd) {
    const next = new Set(set);
    if (isAdd) next.add(id);
    else next.delete(id);
    return next;
}

function updateProductField(products, productId, field, delta) {
    return products.map((p) =>
        productIdOf(p) === productId
            ? { ...p, [field]: Math.max((p[field] || 0) + delta, 0) }
            : p
    );
}

async function toggleUserItem(endpoint, id, isActive, sessionToken) {
    const url = isActive
        ? `${API}/api/user/${endpoint}/${id}`
        : `${API}/api/user/${endpoint}`;
    const body = isActive
        ? { session_token: sessionToken }
        : { session_token: sessionToken, product_id: id };

    const res = await fetch(url, {
        method: isActive ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    return res.json();
}

function isPremiumProduct(item) {
    return String(item.product_category || "").trim().toUpperCase() === "PREMIUM";
}

const fetchJSON = (url) => fetch(url).then((r) => r.json());

function Cards({
    setCartCount,
    onOpenDetails,
    search,
    filter,
    setFilter,
    setCategories,
    setSuggestionData,
}) {
    const location = useLocation();
    const sessionToken = localStorage.getItem("session_token");

    const activeTab = location.pathname.includes("/premium") ? "premium" : "regular";

    const [products, setProducts] = useState([]);
    const [savedProducts, setSavedProducts] = useState(() => new Set());
    const [likedProducts, setLikedProducts] = useState(() => new Set());
    const [cartProducts, setCartProducts] = useState([]);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const toastTimerRef = useRef(null);

    const showToast = useCallback((message, type = "success") => {
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        setToast({ show: true, message, type });
        toastTimerRef.current = setTimeout(
            () => setToast({ show: false, message: "", type: "success" }),
            TOAST_DURATION
        );
    }, []);

    useEffect(() => {
        return () => {
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        };
    }, []);

    const syncCart = useCallback((next) => {
        setCartProducts(next);
        setCartCount(next.length);
    }, [setCartCount]);

    const handleSave = useCallback(async (productId) => {
        const id = String(productId);
        const isSaved = savedProducts.has(id);

        try {
            const data = await toggleUserItem("wishlist", id, isSaved, sessionToken);
            if (!data.success) return;

            setSavedProducts((prev) => toggleSetItem(prev, id, !isSaved));
            setProducts((prev) =>
                updateProductField(prev, id, "product_total_saves", isSaved ? -1 : 1)
            );

            showToast(
                isSaved ? "Removed from Wishlist" : "Saved to Wishlist",
                isSaved ? "info" : "success"
            );
        } catch (err) {
            console.error("Save error:", err.message);
        }
    }, [savedProducts, sessionToken, showToast]);

    const handleLike = useCallback(async (productId) => {
        const id = String(productId);
        const isLiked = likedProducts.has(id);

        try {
            const data = await toggleUserItem("likes", id, isLiked, sessionToken);
            if (!data.success) return;

            setLikedProducts((prev) => toggleSetItem(prev, id, !isLiked));
            setProducts((prev) =>
                updateProductField(prev, id, "product_total_likes", isLiked ? -1 : 1)
            );

            showToast(
                isLiked ? "Like Removed" : "Product Liked",
                isLiked ? "info" : "success"
            );
        } catch (err) {
            console.error("Like error:", err.message);
        }
    }, [likedProducts, sessionToken, showToast]);

    const handleAddToCart = useCallback(async (productId) => {
        const id = String(productId);
        const exists = cartProducts.some((i) => String(i.product_id) === id);

        if (exists) {
            showToast("Already in Cart", "info");
            return;
        }

        try {
            const data = await fetch(`${API}/api/user/cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_token: sessionToken,
                    product_id: id,
                    quantity: CARD_QUANTITY,
                }),
            }).then((r) => r.json());

            if (!data.success) return;

            syncCart([
                ...cartProducts,
                { product_id: id, quantity: CARD_QUANTITY },
            ]);
            showToast("Added To Cart", "success");
        } catch (err) {
            console.error("Add to cart error:", err.message);
        }
    }, [cartProducts, sessionToken, syncCart, showToast]);

    const handleRemoveFromCart = useCallback(async (productId) => {
        const id = String(productId);

        try {
            const data = await fetch(`${API}/api/user/cart/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: sessionToken }),
            }).then((r) => r.json());

            if (!data.success) return;

            syncCart(cartProducts.filter((i) => String(i.product_id) !== id));
            showToast("Removed from Cart", "info");
        } catch (err) {
            console.error("Remove from cart error:", err.message);
        }
    }, [cartProducts, sessionToken, syncCart, showToast]);

    useEffect(() => {
        let cancelled = false;

        Promise.all([
            fetchJSON(`${API}/api/user/products`).catch((e) => { console.error("Products:", e.message); return null; }),
            fetchJSON(`${API}/api/user/wishlist?session_token=${sessionToken}`).catch((e) => { console.error("Wishlist:", e.message); return null; }),
            fetchJSON(`${API}/api/user/likes?session_token=${sessionToken}`).catch((e) => { console.error("Likes:", e.message); return null; }),
            fetchJSON(`${API}/api/user/cart?session_token=${sessionToken}`).catch((e) => { console.error("Cart:", e.message); return null; }),
        ]).then(([productsData, wishlistData, likesData, cartData]) => {
            if (cancelled) return;

            if (productsData?.success) {
                setProducts(productsData.data);
                setCategories?.([
                    "All",
                    ...new Set(productsData.data.map((item) => item.product_category)),
                ]);
                setSuggestionData?.(productsData.data);
            }

            if (wishlistData?.success)
                setSavedProducts(new Set(wishlistData.data.map((i) => String(i.product_id))));

            if (likesData?.success)
                setLikedProducts(new Set(likesData.data.map((i) => i.product_id)));

            if (cartData?.success) {
                setCartProducts(cartData.data);
                setCartCount(cartData.data.length);
            }
        });

        return () => { cancelled = true; };
    }, [sessionToken, setCartCount, setCategories, setSuggestionData]);

    const cartIdSet = useMemo(() => {
        const set = new Set();
        for (const item of cartProducts) {
            set.add(String(item.product_id));
        }
        return set;
    }, [cartProducts]);

    const finalProducts = useMemo(() => {
        const keyword = search.toLowerCase();

        const visible = activeTab === "premium"
            ? products.filter(isPremiumProduct)
            : products.filter((item) => !isPremiumProduct(item));

        let list = visible.filter((product) => {
            const matchesSearch =
                !search ||
                product.product_name?.toLowerCase().includes(keyword) ||
                product.product_category?.toLowerCase().includes(keyword) ||
                product.product_description?.toLowerCase().includes(keyword);

            const matchesCategory =
                filter.category === "All" ||
                product.product_category === filter.category;

            return matchesSearch && matchesCategory;
        });

        if (filter.rating > 0) {
            list = list.filter((p) => Number(p.product_rating) >= filter.rating);
        }
        if (filter.availableOnly) {
            list = list.filter((p) => Number(p.product_status) === 1);
        }
        if (filter.sort === "low") {
            list = [...list].sort((a, b) => Number(a.product_price) - Number(b.product_price));
        }
        if (filter.sort === "high") {
            list = [...list].sort((a, b) => Number(b.product_price) - Number(a.product_price));
        }

        return list;
    }, [products, activeTab, search, filter]);

    const handleOpenDetails = useCallback(
        (product) => onOpenDetails(product, "card"),
        [onOpenDetails]
    );

    const handleCategoryChange = useCallback(
        (cat) => setFilter((prev) => ({ ...prev, category: cat })),
        [setFilter]
    );

    return (
        <section
            className={`cds-section ${activeTab === "premium" ? "cards-premium" : "cards-regular"}`}
        >
            <div className="cds-top-row">
                <CardsTab onCategoryChange={handleCategoryChange} />
            </div>

            {finalProducts.length > 0 ? (
                <div className="cds-grid">
                    {finalProducts.map((product) => {
                        const id = String(product.product_id);
                        const inCart = cartIdSet.has(id);
                        return (
                            <ProductCard
                                key={product.product_id}
                                product={product}
                                isSaved={savedProducts.has(id)}
                                isLiked={likedProducts.has(id)}
                                isAddedToCart={inCart}
                                onSave={handleSave}
                                onLike={handleLike}
                                onAddToCart={handleAddToCart}
                                onRemoveFromCart={handleRemoveFromCart}
                                onOpenDetails={handleOpenDetails}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="cds-empty">
                    <span className="cds-empty-icon">📭</span>
                    <h3 className="cds-empty-title">No Cards Available</h3>
                    <p className="cds-empty-text">No cards found in this category.</p>
                </div>
            )}

            <Toast show={toast.show} message={toast.message} type={toast.type} />
        </section>
    );
}

export default memo(Cards);