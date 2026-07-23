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
import MyPayments from "../../components/MyProfileDetails/MyPayments/MyPayments";
import HelpAndSupport from "../../components/MyProfileDetails/HelpAndSupport/HelpAndSupport";
import AboutAerodeck from "../../components/MyProfileDetails/AboutAerodeck/AboutAerodeck";
import EditProfile from "../../components/MyProfileDetails/EditProfile/EditProfile";
import MyAddresses from "../../components/MyProfileDetails/MyAddress/MyAddresses";
import AddAddress from "../../components/MyProfileDetails/AddAddress/AddAddress";
import EditAddress from "../../components/MyProfileDetails/EditAddress/EditAddress";


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
                        onOpenDetails={handleOpenDetails}
                    />
                }
                {
                    !isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "orders" &&

                    <MyOrders
                        setProfilePage={setProfilePage}
                        onOpenDetails={handleOpenDetails}
                    />
                }
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
                    profilePage === "payments" &&

                    <MyPayments
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