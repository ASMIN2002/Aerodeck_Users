import { useEffect, useState } from "react";

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
import MyRewards from "../../components/MyProfileDetails/MyRewards/MyRewards";
import HelpAndSupport from "../../components/MyProfileDetails/HelpAndSupport/HelpAndSupport";
import AboutAerodeck from "../../components/MyProfileDetails/AboutAerodeck/AboutAerodeck";
import EditProfile from "../../components/MyProfileDetails/EditProfile/EditProfile";
import MyAddresses from "../../components/MyProfileDetails/MyAddress/MyAddresses";
import AddAddress from "../../components/MyProfileDetails/AddAddress/AddAddress";
import EditAddress from "../../components/MyProfileDetails/EditAddress/EditAddress";
import ProductOrder from "../../components/MyProfileDetails/PlaceOrder/ProductOrder";
import CardOrder from "../../components/MyProfileDetails/PlaceOrder/CardOrder";
import ReviewInvoice from "../../components/MyProfileDetails/PlaceOrder/ReviewInvoice";
import Payment from "../../components/MyProfileDetails/PlaceOrder/Payment";
import OrderSuccess from "../../components/MyProfileDetails/PlaceOrder/OrderSuccess";
import OrderItemDetails from "../../components/MyProfileDetails/PlaceOrder/OrderItemDetails";
import TrackOrder from "../../components/MyProfileDetails/PlaceOrder/OrderItem/TrackOrder";


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

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [selectedBottomTab, setSelectedBottomTab] = useState(() => {

        return localStorage.getItem("selectedBottomTab") || "Home";

    });

    const [profilePage, setProfilePage] = useState("profile");

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [isDetailsOpen, setIsDetailsOpen] = useState(false);



    useEffect(() => {

        localStorage.setItem("selectedMenu", selectedMenu);

    }, [selectedMenu]);

    useEffect(() => {

        localStorage.setItem("selectedBottomTab", selectedBottomTab);

    }, [selectedBottomTab]);

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("mobile_number");

        setUser(null);

        setPage("login");

    };

    const handleOpenDetails = (product, type) => {
        console.log(type);

        setSelectedProduct({

            type,

            data: product

        });

        setIsDetailsOpen(true);

    };

    const handleCloseDetails = () => {

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
                />
            }

            <div className="home-content">
                {
                    isDetailsOpen &&

                    <Details
                        product={selectedProduct}
                        onBack={handleCloseDetails}
                        setCartCount={setCartCount}
                    />
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
                                />

                            </>

                        }

                        {

                            selectedMenu === "Gifts" &&

                            <Gift
                                setCartCount={setCartCount}
                                onOpenDetails={handleOpenDetails}
                            />

                        }

                        {
                            selectedMenu === "Shop" &&
                            <Shop
                                setCartCount={setCartCount}
                                onOpenDetails={handleOpenDetails}
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
                        user={user}
                        setUser={setUser}
                        setPage={setPage}
                        onLogout={handleLogout}
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

                {
                    profilePage === "order-details" && (
                        <OrderItemDetails
                            order={selectedOrder}
                            setProfilePage={setProfilePage}
                            onOpenDetails={handleOpenDetails}
                            setSelectedTrackingOrder={setSelectedTrackingOrder}
                        />
                    )
                }

                {profilePage === "invoice-product" && (
                    <ReviewInvoice
                        setProfilePage={setProfilePage}
                        backPage="productorder"
                    />
                )}
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
                    profilePage === "rewards" &&

                    <MyRewards
                        setProfilePage={setProfilePage}
                    />
                }
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

            />

        </div>

    );

}

export default Home;