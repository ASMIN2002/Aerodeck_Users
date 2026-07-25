import "./CartTabs.css";

function CartTabs({

    activeTab,
    setActiveTab

}) {

    return (

        <div className="cart-tabs">

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