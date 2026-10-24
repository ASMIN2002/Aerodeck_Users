import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../levelstyle/1Cards.css";
import ProductCard from "./2ProductCard";
import Toast from "../../../1hook/hooks/Toast";
import CardsTab from "./CardsTab";
import { API } from "../../../services/api";

const TOAST_DURATION = 2000;
const MIN_CARD_QUANTITY = 50;

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

function Cards({
    setCartCount,
    onOpenDetails,
    search,
    filter,
    setFilter,
    setCategories,
    setSuggestionData,
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const sessionToken = localStorage.getItem("session_token");

    const activeTab = location.pathname.includes("/premium") ? "premium" : "regular";

    const [products, setProducts] = useState([]);
    const [savedProducts, setSavedProducts] = useState(new Set());
    const [likedProducts, setLikedProducts] = useState(new Set());
    const [cartProducts, setCartProducts] = useState([]);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    useEffect(() => {
        window.history.pushState(null, "", window.location.href);
        const handlePopState = () => navigate(-1);
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [navigate]);

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
                updateProductField(prev, id, "product_total_saves", isSaved ? -1 : 1)
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
                updateProductField(prev, id, "product_total_likes", isLiked ? -1 : 1)
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
                    quantity: MIN_CARD_QUANTITY,
                }),
            });
            const data = await res.json();
            if (!data.success) return;

            const nextCart = [
                ...cartProducts,
                { product_id: id, quantity: MIN_CARD_QUANTITY },
            ];
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
            if (item.quantity <= MIN_CARD_QUANTITY) {
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
        async function loadProducts() {
            try {
                const res = await fetch(`${API}/api/user/products`);
                const data = await res.json();
                if (data.success) {
                    setProducts(data.data);
                    setCategories([
                        "All",
                        ...new Set(data.data.map((item) => item.product_category)),
                    ]);
                    setSuggestionData?.(data.data);
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

        loadProducts();
        loadWishlist();
        loadLikes();
        loadCart();
    }, [sessionToken, setCartCount, setCategories, setSuggestionData]);

    const visibleProducts =
        activeTab === "premium"
            ? products.filter(isPremiumProduct)
            : products.filter((item) => !isPremiumProduct(item));

    const finalProducts = (() => {
        const keyword = search.toLowerCase();

        let list = visibleProducts.filter((product) => {
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
            list.sort((a, b) => Number(a.product_price) - Number(b.product_price));
        }
        if (filter.sort === "high") {
            list.sort((a, b) => Number(b.product_price) - Number(a.product_price));
        }

        return list;
    })();

    return (
        <section
            className={`cds-section ${activeTab === "premium" ? "cards-premium" : "cards-regular"}`}
        >
            <div className="cds-top-row">
                <CardsTab
                    onCategoryChange={(cat) =>
                        setFilter((prev) => ({ ...prev, category: cat }))
                    }
                />
            </div>

            {finalProducts.length > 0 ? (
                <div className="cds-grid">
                    {finalProducts.map((product) => (
                        <ProductCard
                            key={product.product_id}
                            product={product}
                            isSaved={savedProducts.has(String(product.product_id))}
                            isLiked={likedProducts.has(String(product.product_id))}
                            isAddedToCart={cartProducts.some(
                                (item) =>
                                    String(item.product_id) === String(product.product_id)
                            )}
                            cartQuantity={
                                cartProducts.find(
                                    (item) =>
                                        String(item.product_id) ===
                                        String(product.product_id)
                                )?.quantity || 0
                            }
                            onSave={handleSave}
                            onLike={handleLike}
                            onAddToCart={handleAddToCart}
                            onIncreaseQuantity={handleIncreaseQuantity}
                            onDecreaseQuantity={handleDecreaseQuantity}
                            onOpenDetails={() => onOpenDetails(product, "card")}
                        />
                    ))}
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

export default Cards;