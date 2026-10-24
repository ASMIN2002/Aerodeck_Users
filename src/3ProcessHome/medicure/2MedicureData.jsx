import { useEffect, useState } from "react";
import { FiMinus, FiPlus, FiStar } from "react-icons/fi";
import { FaPills } from "react-icons/fa";
import "./2MedicureData.css";
import { API } from "../../services/api";

const getSession = () => localStorage.getItem("session_token");
const idEq = (a, b) => String(a) === String(b);

function MedicureData({ search = "", filter = {}, setCartCount, onOpenDetails }) {
    const sessionToken = getSession();

    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartProducts, setCartProducts] = useState([]);

    useEffect(() => {
        fetch(`${API}/api/user/medicine`)
            .then((r) => r.json())
            .then((data) => { if (data.success) setMedicines(data.data || []); })
            .catch((err) => console.error("Medicine fetch error:", err.message))
            .finally(() => setLoading(false));

        if (!sessionToken) return;
        fetch(`${API}/api/user/cart?session_token=${sessionToken}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.success) {
                    setCartProducts(data.data || []);
                    setCartCount?.(data.data.length);
                }
            })
            .catch((err) => console.error("Cart error:", err.message));
    }, [sessionToken, setCartCount]);

    const syncCart = (next) => {
        setCartProducts(next);
        setCartCount?.(next.length);
    };

    const handleAddToCart = async (productId) => {
        if (!sessionToken) return;
        const id = String(productId);
        if (cartProducts.some((i) => idEq(i.product_id, id))) return;

        try {
            const data = await fetch(`${API}/api/user/cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: sessionToken, product_id: id, quantity: 1 }),
            }).then((r) => r.json());
            if (!data.success) return;
            syncCart([...cartProducts, { product_id: id, quantity: 1 }]);
        } catch (err) { console.error("Add to cart error:", err.message); }
    };

    const updateQty = async (productId, delta) => {
        const id = String(productId);
        const item = cartProducts.find((i) => idEq(i.product_id, id));
        if (!item) return;

        if (delta < 0 && item.quantity <= 1) {
            try {
                await fetch(`${API}/api/user/cart/${id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_token: sessionToken }),
                });
                syncCart(cartProducts.filter((i) => !idEq(i.product_id, id)));
            } catch (err) { console.error("Remove cart error:", err.message); }
            return;
        }

        const quantity = item.quantity + delta;
        try {
            await fetch(`${API}/api/user/cart`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: sessionToken, product_id: id, quantity }),
            });
            setCartProducts((prev) => prev.map((i) => (idEq(i.product_id, id) ? { ...i, quantity } : i)));
        } catch (err) { console.error("Qty error:", err.message); }
    };

    const handleOpenDetails = (medicine) => {
        onOpenDetails?.({ medicine_id: medicine.medicine_id, ...medicine }, "medicine");
    };

    const filtered = medicines.filter((med) => {
        const kw = search.toLowerCase();
        const matchesSearch =
            !search ||
            med.medicine_name?.toLowerCase().includes(kw) ||
            med.medicine_description?.toLowerCase().includes(kw) ||
            med.medicine_category?.toLowerCase().includes(kw);
        const matchesRating = !filter.rating || Number(med.medicine_rating) >= filter.rating;
        const matchesAvailable = !filter.availableOnly || Number(med.medicine_status) === 1;
        return matchesSearch && matchesRating && matchesAvailable;
    });

    if (loading) {
        return <section className="med-data"><p className="med-data-loading">Loading medicines...</p></section>;
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
                        const cartItem = cartProducts.find((i) => idEq(i.product_id, med.medicine_id));
                        const inCart = !!cartItem;
                        const qty = cartItem?.quantity || 0;
                        const discount = Number(med.medicine_discount_percentage || 0);
                        const mrp = Number(med.medicine_demo_price || 0);
                        const price = Number(med.medicine_price || 0);
                        const hasMrpCut = mrp > price;

                        return (
                            <div key={med.medicine_id} className={`med-card ${isAvailable ? "" : "out-of-stock"}`}>
                                <div className="med-card-image-box" onClick={() => handleOpenDetails(med)}>
                                    {med.medicine_image1 ? (
                                        <img src={med.medicine_image1} alt={med.medicine_name} loading="lazy" />
                                    ) : (
                                        <FaPills className="med-image-fallback" />
                                    )}

                                    {!isAvailable && <div className="med-oos-overlay">OUT OF STOCK</div>}

                                    <div className="med-rating-badge">
                                        <FiStar /> {med.medicine_rating || "4.0"}
                                    </div>

                                    {discount > 0 && hasMrpCut && (
                                        <span className="med-discount-badge">{discount}% OFF</span>
                                    )}
                                </div>

                                <div className="med-card-body">
                                    <span className="med-tag">{med.medicine_category || "Medicine"}</span>
                                    <h3 className="med-card-name">{med.medicine_name}</h3>

                                    <div className="med-price-row">
                                        <span className="med-final-price">₹{price}</span>
                                        {hasMrpCut && <span className="med-mrp-price">₹{mrp}</span>}
                                    </div>

                                    {isAvailable && (
                                        <div className="med-card-actions">
                                            {inCart ? (
                                                <div className="med-qty-box">
                                                    <button type="button" onClick={() => updateQty(med.medicine_id, -1)} aria-label="Decrease">
                                                        <FiMinus />
                                                    </button>
                                                    <span>{qty}</span>
                                                    <button type="button" onClick={() => updateQty(med.medicine_id, 1)} aria-label="Increase">
                                                        <FiPlus />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button type="button" className="med-add-btn" onClick={() => handleAddToCart(med.medicine_id)}>
                                                    Add
                                                </button>
                                            )}
                                        </div>
                                    )}
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