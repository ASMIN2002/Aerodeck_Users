import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Cards.css";
import ProductCard from "../ProductCard/ProductCard";
import Toast from "../Toast/Toast";
import Loading from "../../components/Loading/Loading";
import CardsTab from "./CardsTab";
import { API } from "../../services/api";

function Cards({
    setCartCount,
    onOpenDetails,
    search,
    filter,
    setFilter,
    setCategories,
    setSuggestionData
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
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        window.history.pushState(null, "", window.location.href);
        const handlePopState = () => navigate(-1);
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [navigate]);

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type }), 2000);
    };

    const handleSave = async (productId) => {
        productId = String(productId);
        try {
            if (savedProducts.has(productId)) {
                const response = await fetch(`${API}/api/user/wishlist/${productId}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_token: sessionToken })
                });
                const data = await response.json();
                if (!data.success) return;
                const updatedSaved = new Set(savedProducts);
                updatedSaved.delete(productId);
                setSavedProducts(updatedSaved);
                setProducts(prev => prev.map(product =>
                    String(product.product_id) === String(productId)
                        ? { ...product, product_total_saves: Math.max((product.product_total_saves || 0) - 1, 0) }
                        : product
                ));
                showToast("Removed from Wishlist", "info");
            } else {
                const response = await fetch(`${API}/api/user/wishlist`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_token: sessionToken, product_id: productId })
                });
                const data = await response.json();
                if (!data.success) return;
                const updatedSaved = new Set(savedProducts);
                updatedSaved.add(productId);
                setSavedProducts(updatedSaved);
                setProducts(prev => prev.map(product =>
                    String(product.product_id) === String(productId)
                        ? { ...product, product_total_saves: (product.product_total_saves || 0) + 1 }
                        : product
                ));
                showToast("Saved to Wishlist", "success");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleLike = async (productId) => {
        productId = String(productId);
        try {
            if (likedProducts.has(productId)) {
                const response = await fetch(`${API}/api/user/likes/${productId}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_token: sessionToken })
                });
                const data = await response.json();
                if (!data.success) return;
                const updatedLiked = new Set(likedProducts);
                updatedLiked.delete(productId);
                setLikedProducts(updatedLiked);
                setProducts(prev => prev.map(product =>
                    String(product.product_id) === String(productId)
                        ? { ...product, product_total_likes: Math.max((product.product_total_likes || 0) - 1, 0) }
                        : product
                ));
                showToast("Like Removed", "info");
            } else {
                const response = await fetch(`${API}/api/user/likes`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_token: sessionToken, product_id: productId })
                });
                const data = await response.json();
                if (!data.success) return;
                const updatedLiked = new Set(likedProducts);
                updatedLiked.add(productId);
                setLikedProducts(updatedLiked);
                setProducts(prev => prev.map(product =>
                    String(product.product_id) === String(productId)
                        ? { ...product, product_total_likes: (product.product_total_likes || 0) + 1 }
                        : product
                ));
                showToast("Product Liked", "success");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            productId = String(productId);
            const exists = cartProducts.some(item => String(item.product_id) === productId);
            if (exists) {
                showToast("Already in Cart", "info");
                return;
            }
            const response = await fetch(`${API}/api/user/cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: sessionToken, product_id: productId, quantity: 50 })
            });
            const data = await response.json();
            if (!data.success) return;
            const updatedCart = [...cartProducts, { product_id: productId, quantity: 50 }];
            setCartProducts(updatedCart);
            setCartCount(updatedCart.length);
            showToast("Added To Cart", "success");
        } catch (err) {
            console.log(err);
        }
    };

    const handleIncreaseQuantity = async (productId) => {
        productId = String(productId);
        try {
            const cartItem = cartProducts.find(item => String(item.product_id) === String(productId));
            if (!cartItem) return;
            const newQuantity = cartItem.quantity + 1;
            const response = await fetch(`${API}/api/user/cart`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: sessionToken, product_id: productId, quantity: newQuantity })
            });
            const data = await response.json();
            if (!data.success) return;
            setCartProducts(prev => prev.map(item =>
                String(item.product_id) === String(productId)
                    ? { ...item, quantity: newQuantity }
                    : item
            ));
        } catch (err) {
            console.log(err);
        }
    };

    const handleDecreaseQuantity = async (productId) => {
        productId = String(productId);
        try {
            const cartItem = cartProducts.find(item => String(item.product_id) === String(productId));
            if (!cartItem) return;
            if (cartItem.quantity <= 50) {
                const response = await fetch(`${API}/api/user/cart/${productId}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_token: sessionToken })
                });
                const data = await response.json();
                if (!data.success) return;
                const updatedCart = cartProducts.filter(item => String(item.product_id) !== String(productId));
                setCartProducts(updatedCart);
                setCartCount(updatedCart.length);
                return;
            }
            const newQuantity = cartItem.quantity - 1;
            const response = await fetch(`${API}/api/user/cart`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: sessionToken, product_id: productId, quantity: newQuantity })
            });
            const data = await response.json();
            if (!data.success) return;
            setCartProducts(prev => prev.map(item =>
                String(item.product_id) === String(productId)
                    ? { ...item, quantity: newQuantity }
                    : item
            ));
        } catch (err) {
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
                    setCategories(["All", ...new Set(data.data.map(item => item.product_category))]);
                    if (setSuggestionData) {
                        setSuggestionData(data.data);
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }

        async function loadWishlist() {
            try {
                const response = await fetch(`${API}/api/user/wishlist?session_token=${sessionToken}`);
                const data = await response.json();
                if (data.success) {
                    setSavedProducts(new Set(data.data.map(item => String(item.product_id))));
                }
            } catch (err) {
                console.log(err);
            }
        }

        async function loadLikes() {
            try {
                const response = await fetch(`${API}/api/user/likes?session_token=${sessionToken}`);
                const data = await response.json();
                if (data.success) {
                    setLikedProducts(new Set(data.data.map(item => item.product_id)));
                }
            } catch (err) {
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
            } catch (err) {
                console.log(err);
            }
        }

        loadProducts();
        loadWishlist();
        loadLikes();
        loadCart();

    }, [sessionToken]);

    const isPremium = (item) =>
        String(item.product_category || "").trim().toUpperCase() === "PREMIUM";

    const visibleProducts = activeTab === "premium"
        ? products.filter(isPremium)
        : products.filter((item) => !isPremium(item));

    const filteredProducts = visibleProducts.filter((product) => {
        const keyword = search.toLowerCase();
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

    let finalProducts = [...filteredProducts];

    if (filter.rating > 0) {
        finalProducts = finalProducts.filter(product => Number(product.product_rating) >= filter.rating);
    }

    if (filter.availableOnly) {
        finalProducts = finalProducts.filter(product => Number(product.product_status) === 1);
    }

    if (filter.sort === "low") {
        finalProducts.sort((a, b) => Number(a.product_price) - Number(b.product_price));
    }

    if (filter.sort === "high") {
        finalProducts.sort((a, b) => Number(b.product_price) - Number(a.product_price));
    }

    return (
        <section className={`cds-section ${activeTab === "premium" ? "cards-premium" : "cards-regular"}`}>

            <div className="cds-top-row">
                <CardsTab
                    onCategoryChange={(cat) =>
                        setFilter(prev => ({ ...prev, category: cat }))
                    }
                />
            </div>
            {showLoading && (
                <Loading
                    duration={500}
                    text={activeTab === "premium" ? "Loading Premium Cards..." : "Loading Cards..."}
                    onComplete={() => setShowLoading(false)}
                />
            )}

            {finalProducts.length > 0 ? (
                <div className="cds-grid">
                    {finalProducts.map((product) => (
                        <ProductCard
                            key={product.product_id}
                            product={product}
                            isSaved={savedProducts.has(String(product.product_id))}
                            isLiked={likedProducts.has(String(product.product_id))}
                            isAddedToCart={cartProducts.some(item => String(item.product_id) === String(product.product_id))}
                            cartQuantity={cartProducts.find(item => String(item.product_id) === String(product.product_id))?.quantity || 0}
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
                    <p className="cds-empty-text">
                        No cards found in this category.
                    </p>
                </div>
            )}

            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
            />

        </section>
    );

}

export default Cards;