import { useEffect, useState } from "react";
import "./2MedicureData.css";
import { API } from "../../services/api";
import { FiMinus, FiPlus } from "react-icons/fi";

function MedicureData({
    search = "",
    filter = {},
    setCartCount,
    onOpenDetails,
    onBuyNow,
}) {
    const sessionToken = localStorage.getItem("session_token");

    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartProducts, setCartProducts] = useState([]);

    const fetchMedicines = async () => {
        try {
            const res = await fetch(`${API}/api/user/medicine`);
            const data = await res.json();
            if (data.success) setMedicines(data.data || []);
        } catch (err) {
            console.error("Medicine fetch error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCart = async () => {
        if (!sessionToken) return;
        try {
            const res = await fetch(
                `${API}/api/user/cart?session_token=${sessionToken}`
            );
            const data = await res.json();
            if (data.success) {
                setCartProducts(data.data || []);
                if (setCartCount) setCartCount(data.data.length);
            }
        } catch (err) {
            console.error("Cart error:", err.message);
        }
    };

    useEffect(() => {
        fetchMedicines();
        fetchCart();
    }, [sessionToken]);

    // Cart Operations
    const handleAddToCart = async (productId) => {
        if (!sessionToken) return;
        const id = String(productId);
        const exists = cartProducts.some((i) => String(i.product_id) === id);
        if (exists) return;

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
            if (setCartCount) setCartCount(nextCart.length);
        } catch (err) {
            console.error("Add to cart error:", err.message);
        }
    };

    const handleIncreaseQty = async (productId) => {
        const id = String(productId);
        const item = cartProducts.find((i) => String(i.product_id) === id);
        if (!item) return;

        const newQty = item.quantity + 1;
        try {
            await fetch(`${API}/api/user/cart`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_token: sessionToken,
                    product_id: id,
                    quantity: newQty,
                }),
            });
            setCartProducts((prev) =>
                prev.map((i) =>
                    String(i.product_id) === id ? { ...i, quantity: newQty } : i
                )
            );
        } catch (err) {
            console.error("Increase qty error:", err.message);
        }
    };

    const handleDecreaseQty = async (productId) => {
        const id = String(productId);
        const item = cartProducts.find((i) => String(i.product_id) === id);
        if (!item) return;

        if (item.quantity <= 1) {
            try {
                await fetch(`${API}/api/user/cart/${id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_token: sessionToken }),
                });
                const nextCart = cartProducts.filter(
                    (i) => String(i.product_id) !== id
                );
                setCartProducts(nextCart);
                if (setCartCount) setCartCount(nextCart.length);
            } catch (err) {
                console.error("Remove cart error:", err.message);
            }
            return;
        }

        const newQty = item.quantity - 1;
        try {
            await fetch(`${API}/api/user/cart`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_token: sessionToken,
                    product_id: id,
                    quantity: newQty,
                }),
            });
            setCartProducts((prev) =>
                prev.map((i) =>
                    String(i.product_id) === id ? { ...i, quantity: newQty } : i
                )
            );
        } catch (err) {
            console.error("Decrease qty error:", err.message);
        }
    };

    const handleBuyNow = (medicine) => {
        if (!onBuyNow) return;
        onBuyNow(
            { ...medicine, product_id: medicine.medicine_id, quantity: 1 },
            "products"
        );
    };

    const filtered = medicines.filter((med) => {
        const keyword = search.toLowerCase();
        const matchesSearch =
            !search ||
            med.medicine_name?.toLowerCase().includes(keyword) ||
            med.medicine_description?.toLowerCase().includes(keyword) ||
            med.medicine_category?.toLowerCase().includes(keyword);

        const matchesRating =
            !filter.rating || Number(med.medicine_rating) >= filter.rating;

        const matchesAvailable =
            !filter.availableOnly || Number(med.medicine_status) === 1;

        return matchesSearch && matchesRating && matchesAvailable;
    });

    if (loading) {
        return (
            <section className="med-data">
                <p className="med-data-loading">Loading medicines...</p>
            </section>
        );
    }

    return (
        <section className="med-data">
            <h2 className="med-data-title">Medicines</h2>

            {filtered.length === 0 ? (
                <p className="med-data-empty">No medicines found.</p>
            ) : (
                <div className="med-data-grid">
                    {filtered.map((med) => {
                        const isAvailable = Number(med.medicine_status) === 1;
                        const cartItem = cartProducts.find(
                            (i) => String(i.product_id) === String(med.medicine_id)
                        );
                        const inCart = !!cartItem;
                        const discount = Number(med.medicine_discount_percentage || 0);
                        const mrp = Number(med.medicine_demo_price || 0);
                        const price = Number(med.medicine_price || 0);

                        return (
                            <div
                                key={med.medicine_id}
                                className={`med-card ${!isAvailable ? "out-of-stock" : ""}`}
                            >
                                {/* IMAGE BOX */}
                                <div className="med-card-image-box">
                                    <div
                                        className="med-image-wrapper"
                                        onClick={() =>
                                            onOpenDetails &&
                                            onOpenDetails(
                                                { medicine_id: med.medicine_id, ...med },
                                                "medicine"
                                            )
                                        }
                                    >
                                        {med.medicine_image1 ? (
                                            <img
                                                src={med.medicine_image1}
                                                alt={med.medicine_name}
                                            />
                                        ) : (
                                            <span className="med-image-fallback">💊</span>
                                        )}

                                        {!isAvailable && (
                                            <div className="med-oos-overlay">OUT OF STOCK</div>
                                        )}

                                        <div className="med-rating-badge">
                                            ⭐ {med.medicine_rating || "4.0"}
                                        </div>
                                    </div>

                                    {isAvailable && (
                                        <div className="med-cart-action">
                                            {inCart ? (
                                                <div className="med-qty-box">
                                                    <button onClick={() => handleDecreaseQty(med.medicine_id)}>
                                                        <FiMinus />
                                                    </button>
                                                    <span>{cartItem.quantity}</span>
                                                    <button onClick={() => handleIncreaseQty(med.medicine_id)}>
                                                        <FiPlus />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    className="med-add-btn"
                                                    onClick={() => handleAddToCart(med.medicine_id)}
                                                >
                                                    Add
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* BODY */}
                                <div className="med-card-body">
                                    <div className="med-tags-row">
                                        <span className="med-tag">{med.medicine_category || "Medicine"}</span>
                                        <span className="med-tag">Bottle</span>
                                    </div>

                                    <h3 className="med-card-name">{med.medicine_name}</h3>
                                    <p className="med-card-desc">{med.medicine_description}</p>

                                    <div className="med-offer-text">
                                        Extra {discount}% Off
                                    </div>

                                    <div className="med-price-row">
                                        {mrp > price && (
                                            <div className="med-mrp-row">
                                                <span>MRP ₹{mrp}</span>
                                                <span className="med-discount-text">{discount}% off</span>
                                            </div>
                                        )}

                                        <div className="med-final-price">
                                            ₹{price}
                                            <span className="med-unit-price">
                                                (₹{(price / 10).toFixed(2)}/unit)
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        className="med-buy-now-btn"
                                        onClick={() => handleBuyNow(med)}
                                        disabled={!isAvailable}
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default MedicureData;