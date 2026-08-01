import "./CartTabs.css";

function CartTabs({

    activeTab,
    setActiveTab,
    setProfilePage

}) {

    return (

        <div className="cart-tabs">

            <button
                className="mycart-back"
                onClick={() => setProfilePage("profile")}
            >
                ← Back
            </button>

            <button
                className={activeTab === "products" ? "active" : ""}
                onClick={() => setActiveTab("products")}
            >
                Products
            </button>

            <button
                className={activeTab === "cards" ? "active" : ""}
                onClick={() => setActiveTab("cards")}
            >
                Cards
            </button>

        </div>

    );

}

export default CartTabs;