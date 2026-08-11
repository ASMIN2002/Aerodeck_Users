import { useEffect, useState } from "react";
import { RiDiscountPercentLine } from "react-icons/ri";
import { API } from "../../../services/api";
function CardOrder({
    setProfilePage,
    orderData,
    setOrderData,
    buyNowFromDetails,
    onBackToDetails
}) {
    const products = orderData.items || [];

    const getPrice = (item) => {

        return Number(
            item.product_price ??
            item.shop_price ??
            item.gift_price ??
            0
        );

    };
    const getName = (item) => {

        return (
            item.product_name ||
            item.shop_name ||
            item.gift_name ||
            "Unknown Product"
        );

    };

    const [paymentMethod, setPaymentMethod] = useState("UPI");

    const subtotal = products.reduce((sum, item) => {

        return sum + (getPrice(item) * item.quantity);

    }, 0);

    const gst = +(subtotal * 0.18).toFixed(2);

    const platformFee = 2;

    const codCharge = paymentMethod === "COD" ? 5 : 0;

    const grandTotal =
        subtotal +
        gst +
        platformFee +
        codCharge;
    const upiTotal = subtotal + gst + platformFee;
    const [primaryAddress, setPrimaryAddress] = useState(null);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [addressError, setAddressError] = useState("");

    useEffect(() => {

        const fetchPrimaryAddress = async () => {

            try {

                const sessionToken = localStorage.getItem("session_token");

                const response = await fetch(
                    `${API}/api/user/address?session_token=${sessionToken}`
                );
                const data = await response.json();

                if (data.success) {

                    const primary = data.data.find(
                        item => item.is_primary === 1
                    );

                    setPrimaryAddress(primary || null);

                }

            } catch (err) {

                console.error(err);

            }

        };

        fetchPrimaryAddress();

    }, []);
    const totalSavings = products.reduce((total, product) => {

        const demoPrice = Number(
            product.product_demo_price ??
            product.shop_demo_price ??
            product.gift_demo_price ??
            product.premium_demo_price ??
            0
        );

        const price = getPrice(product);

        const saving = (demoPrice - price) * product.quantity;

        return total + saving;

    }, 0);
    return (

        <div className="product-order-page">
            <div className="product-order-header">

                <button
                    className="product-order-back"
                    onClick={() => {
                        if (buyNowFromDetails) {
                            onBackToDetails();
                        } else {
                            setProfilePage("cart");
                        }
                    }}
                >
                    ←
                </button>

                <h2>Cards Order</h2>

            </div>
            <div className="order-section">

                <h3>Deliver To:</h3>

                <div className="address-card-card">

                    {primaryAddress ? (

                        <>
                            <div className="addplacepro">
                                <div>
                                    <div className="nameadtype">
                                        <h4>{primaryAddress.full_name}</h4>
                                        <span>{primaryAddress.address_type}</span>
                                    </div>
                                    <p>
                                        {primaryAddress.house_flat},
                                        {" "}
                                        {primaryAddress.area_street},
                                        {" "}
                                        {primaryAddress.city},
                                        {" "}
                                        {primaryAddress.pincode}
                                    </p>
                                    <p>{primaryAddress.mobile_number}</p>
                                </div>
                                <button
                                    className="change-address-btn"
                                    onClick={() => setProfilePage("address")}
                                >
                                    Change
                                </button>
                            </div>
                        </>

                    ) : (

                        <button
                            className="add-address-btn"
                            onClick={() => setProfilePage("address")}
                        >
                            + Add Address
                        </button>

                    )}
                </div>

            </div>

            {/* Ordered Products */}

            <div className="order-section">

                <div className="product-list">

                    {

                        products.length > 0 ? (

                            products.map((product) => (

                                <div
                                    className="product-row"
                                    key={product.product_id}
                                >

                                    <img
                                        src={
                                            product.product_image1 ||
                                            product.gift_image1 ||
                                            product.shop_image1 ||
                                            product.premium_image1
                                        }
                                        alt={getName(product)}
                                        className="order-product-image"
                                    />

                                    <div className="product-info">

                                        <h4>
                                            {getName(product)}
                                        </h4>

                                        <small>
                                            Qty : {product.quantity}
                                        </small>

                                    </div>

                                    <div className="product-price">

                                        ₹{(
                                            getPrice(product) *
                                            product.quantity
                                        ).toFixed(2)}

                                        <small>
                                            ₹{(
                                                (Number(
                                                    product.product_demo_price ??
                                                    product.shop_demo_price ??
                                                    product.gift_demo_price ??
                                                    product.premium_demo_price ??
                                                    0
                                                ) - getPrice(product)) *
                                                product.quantity
                                            ).toFixed(2)} Save
                                        </small>

                                    </div>

                                </div>

                            ))

                        ) : (

                            <p>No Products Found.</p>

                        )

                    }

                </div>

            </div>
            {/* Price Details */}

            <div className="order-section">

                <h3>💰 Price Details</h3>

                <div className="price-box">

                    <div className="row">
                        <span>Total MRP</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="row">
                        <span>GST (18%)</span>
                        <span>₹{gst.toFixed(2)}</span>
                    </div>

                    <div className="row">
                        <span>Platform Fee</span>
                        <span>₹{platformFee.toFixed(2)}</span>
                    </div>

                    <hr />

                    <div className="row grand-total">

                        <strong>Grand Total</strong>

                        <strong>₹{grandTotal.toFixed(2)}</strong>

                    </div>
                    <div className="total-savings">
                        <RiDiscountPercentLine />
                        You will save ₹{totalSavings.toFixed(2)} on this order!
                    </div>

                </div>

            </div>
            <button
                className="continue-payment-btn"
                onClick={() => {
                    setProfilePage("userchat");
                }}
            >
                Place Order
            </button>

        </div>

    );

}

export default CardOrder;