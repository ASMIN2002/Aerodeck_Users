import { useEffect, useState } from "react";
import { API } from "../../services/api";

import "../../styles/Home.css";

import Header from "../../components/Header/Header";
import Address from "../../components/Address/Address";
import Search from "../../components/Search/Search";
import Trending from "../../components/Trending/Trending";
import Cards from "../../components/Cards/Cards";
import Gift from "../../components/Gift/Gift";
import Shop from "../../components/Shop/Shop";
import Premium from "../../components/Premium/Premium";
import Offer from "../../components/Offer/Offer";
import BottomNav from "../../components/BottomNav/BottomNav";
import Details from "../../components/Details/Details";
import Profile from "../../components/Profile/Profile";
import MyWishlist from "../../components/MyProfileDetails/MyWishlist/MyWishlist";
import MyCart from "../../components/MyProfileDetails/MyCart/MyCart";
import MyOrders from "../../components/MyProfileDetails/MyOrders/MyOrders";
import HelpAndSupport from "../../components/MyProfileDetails/HelpAndSupport/HelpAndSupport";
import AboutAerodeck from "../../components/MyProfileDetails/AboutAerodeck/AboutAerodeck";
import EditProfile from "../../components/MyProfileDetails/EditProfile/EditProfile";
import MyAddresses from "../../components/MyProfileDetails/MyAddress/MyAddresses";
import AddAddress from "../../components/MyProfileDetails/AddAddress/AddAddress";
import EditAddress from "../../components/MyProfileDetails/EditAddress/EditAddress";
import ProductOrder from "../../components/MyProfileDetails/PlaceOrder/ProductOrder";
import CardOrder from "../../components/MyProfileDetails/PlaceOrder/CardOrder";
import Payment from "../../components/MyProfileDetails/PlaceOrder/Payment";
import OrderSuccess from "../../components/MyProfileDetails/PlaceOrder/OrderSuccess";
import OrderItemDetails from "../../components/MyProfileDetails/PlaceOrder/OrderItemDetails";
import TrackOrder from "../../components/MyProfileDetails/PlaceOrder/OrderItem/TrackOrder";
import ItemInvoice from "../../components/MyProfileDetails/PlaceOrder/OrderItem/ItemInvoice";
import ViewProfile from "../../components/MyProfileDetails/EditProfile/ViewProfile";
import AllReview from "../../components/Details/DetailsData/AllReview";
import AllMedia from "../../components/Details/DetailsData/AllMedia";


function Home({

    user,

    setUser,

    setPage,

    cartCount,

    setCartCount

}) {
    const [selectedMenu, setSelectedMenu] = useState(() => {

        return localStorage.getItem("selectedMenu") || "Cards";

    });
    const [search, setSearch] = useState("");

    const [filter, setFilter] = useState({

        category: "All",

        sort: "",

        rating: 0,

        availableOnly: false

    });
    const [categories, setCategories] = useState([]);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedBottomTab, setSelectedBottomTab] = useState("Home");
    const [profilePage, setProfilePage] = useState("profile");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [detailsPage, setDetailsPage] = useState("details");



    useEffect(() => {

        localStorage.setItem("selectedMenu", selectedMenu);

    }, [selectedMenu]);

    useEffect(() => {

        localStorage.setItem("selectedBottomTab", selectedBottomTab);

    }, [selectedBottomTab]);

    const handleLogout = async () => {

        try {

            await fetch(`${API}/api/auth/logout`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    session_token: localStorage.getItem("session_token")

                })

            });

        } catch (err) {

            console.error(err);

        }

        localStorage.removeItem("session_token");

        setPage("login");

    };
    const handleOpenDetails = (product, type) => {

        const handleOpenDetails = (product, type) => {

            setDetailsPage("details");

            setSelectedProduct({
                type,
                data: product
            });

            setIsDetailsOpen(true);

        };


        setSelectedProduct({

            type,

            data: product

        });

        setIsDetailsOpen(true);

    };

    const handleCloseDetails = () => {

        setDetailsPage("details");

        setSelectedProduct(null);

        setIsDetailsOpen(false);

    };

    const [orderData, setOrderData] = useState({
        items: [],
        orderType: ""
    });


    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedTrackingOrder, setSelectedTrackingOrder] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const [profile, setProfile] = useState(null);
    useEffect(() => {
        async function loadProfile() {
            const response = await fetch(`${API}/api/user/profile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    session_token: localStorage.getItem("session_token")
                })
            });
            const data = await response.json();
            if (data.success) {
                setProfile(data.user);
            }
        }
        loadProfile();
    }, []);

    return (

        <div className="home-container">
            <Header
                selectedMenu={selectedMenu}
                setSelectedMenu={setSelectedMenu}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                selectedBottomTab={selectedBottomTab}
                cartCount={cartCount}
                isDetailsOpen={isDetailsOpen}
                closeDetails={handleCloseDetails}
                onOpenCart={() => {
                    setSelectedBottomTab("Profile");
                    setProfilePage("cart");
                }}
            />
            {
                !isDetailsOpen &&
                (selectedBottomTab === "Home" ||
                    selectedBottomTab === "Premium") &&
                <Address
                    setProfilePage={setProfilePage}
                    setSelectedBottomTab={setSelectedBottomTab}
                />
            }

            {
                !isDetailsOpen &&

                (selectedBottomTab === "Home" ||

                    selectedBottomTab === "Premium") &&

                <Search

                    selectedMenu={
                        selectedBottomTab === "Home"
                            ? selectedMenu
                            : "Premium"
                    }

                    search={search}

                    setSearch={setSearch}

                    filter={filter}

                    setFilter={setFilter}

                    categories={categories}

                />
            }

            <div className="home-content">

                {

                    isDetailsOpen && (

                        detailsPage === "details" ? (

                            <Details
                                product={selectedProduct}
                                onBack={handleCloseDetails}
                                setCartCount={setCartCount}
                                onOpenDetails={handleOpenDetails}
                                onViewAll={() => setDetailsPage("allreview")}
                                onViewAllMedia={() => setDetailsPage("allmedia")}
                            />

                        ) : detailsPage === "allreview" ? (

                            <AllReview
                                setDetailsPage={setDetailsPage}
                                product_id={
                                    selectedProduct?.data?.product_id ||
                                    selectedProduct?.data?.gift_id ||
                                    selectedProduct?.data?.shop_id ||
                                    selectedProduct?.data?.premium_id
                                }
                            />

                        ) : (

                            <AllMedia
                                onBack={() => setDetailsPage("details")}
                                product_id={
                                    selectedProduct?.data?.product_id ||
                                    selectedProduct?.data?.gift_id ||
                                    selectedProduct?.data?.shop_id ||
                                    selectedProduct?.data?.premium_id
                                }
                            />

                        )

                    )

                }



                {
                    !isDetailsOpen &&
                    selectedBottomTab === "Home" &&



                    <>

                        {

                            selectedMenu === "Cards" &&

                            <>

                                <Trending />

                                <Cards
                                    setCartCount={setCartCount}
                                    onOpenDetails={handleOpenDetails}
                                    search={search}
                                    filter={filter}
                                    setCategories={setCategories}
                                />

                            </>

                        }

                        {

                            selectedMenu === "Gifts" &&

                            <Gift
                                setCartCount={setCartCount}
                                onOpenDetails={handleOpenDetails}
                                search={search}
                                filter={filter}
                            />

                        }

                        {
                            selectedMenu === "Shop" &&
                            <Shop
                                setCartCount={setCartCount}
                                onOpenDetails={handleOpenDetails}
                                search={search}
                                filter={filter}
                            />
                        }

                    </>

                }

                {

                    !isDetailsOpen &&
                    selectedBottomTab === "Premium" &&
                    <Premium
                        setCartCount={setCartCount}
                        onOpenDetails={handleOpenDetails}
                        search={search}
                        filter={filter}
                    />

                }
                {
                    !isDetailsOpen &&
                    selectedBottomTab === "Offers" &&

                    <Offer />
                }
                {
                    !isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "profile" &&

                    <Profile
                        key={profilePage + "-" + (user?.user_id || "")}
                        profile={profile}
                        setProfile={setProfile}
                        setPage={setPage}
                        onLogout={handleLogout}
                        setProfilePage={setProfilePage}
                    />

                }
                {
                    !isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "viewprofile" &&

                    <ViewProfile
                        profile={profile}
                        setProfilePage={setProfilePage}
                    />
                }
                {
                    !isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "address" &&

                    <MyAddresses
                        setProfilePage={setProfilePage}
                        selectedAddress={selectedAddress}
                        setSelectedAddress={setSelectedAddress}
                    />
                }
                {
                    !isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "wishlist" &&

                    <MyWishlist
                        setProfilePage={setProfilePage}
                        onOpenDetails={handleOpenDetails}
                    />
                }
                {
                    !isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "cart" &&

                    <MyCart
                        setProfilePage={setProfilePage}
                        setOrderData={setOrderData}
                        onOpenDetails={handleOpenDetails}
                        setSelectedBottomTab={setSelectedBottomTab}
                    />
                }
                {
                    !isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "productorder" &&

                    <ProductOrder
                        setProfilePage={setProfilePage}
                        orderData={orderData}
                        setOrderData={setOrderData}
                        selectedAddress={selectedAddress}
                    />
                }
                {
                    !isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "cardorder" &&
                    <CardOrder
                        setProfilePage={setProfilePage}
                        orderData={orderData}
                        setOrderData={setOrderData}
                    />
                }
                {
                    !isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "orders" &&

                    <MyOrders
                        setProfilePage={setProfilePage}
                        selectedOrder={selectedOrder}
                        setSelectedOrder={setSelectedOrder}
                    />
                }
                {!isDetailsOpen &&
                    profilePage === "order-details" && (
                        <OrderItemDetails
                            order={selectedOrder}
                            setProfilePage={setProfilePage}
                            onOpenDetails={handleOpenDetails}
                            setSelectedTrackingOrder={setSelectedTrackingOrder}
                            setSelectedInvoice={setSelectedInvoice}
                        />
                    )}
                {
                    profilePage === "invoice" && (
                        <ItemInvoice
                            setProfilePage={setProfilePage}
                            order_id={selectedInvoice?.order_id}
                            product_id={selectedInvoice?.product_id}
                        />
                    )
                }
                {profilePage === "payment" && (
                    <Payment
                        setProfilePage={setProfilePage}
                        orderData={orderData}
                    />
                )}
                {profilePage === "ordersuccess" && (
                    <OrderSuccess
                        setProfilePage={setProfilePage}
                    />
                )}
                {
                    !isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "help" &&

                    <HelpAndSupport
                        setProfilePage={setProfilePage}
                    />
                }
                {
                    !isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "about" &&

                    <AboutAerodeck
                        setProfilePage={setProfilePage}
                    />
                }
                {
                    !isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "editprofile" &&

                    <EditProfile
                        profile={profile}
                        setProfile={setProfile}
                        setProfilePage={setProfilePage}
                    />
                }
                {
                    !isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "addaddress" &&

                    <AddAddress
                        setProfilePage={setProfilePage}
                    />
                }
                {
                    !isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "editaddress" &&

                    <EditAddress
                        setProfilePage={setProfilePage}
                    />
                }

            </div>

            <BottomNav
                selectedBottomTab={selectedBottomTab}
                setSelectedBottomTab={setSelectedBottomTab}
                isDetailsOpen={isDetailsOpen}
                closeDetails={handleCloseDetails}
                setProfilePage={setProfilePage}
            />

        </div>

    );

}

export default Home;