import { useEffect, useState, useRef } from "react";
import { API } from "../../services/api";

import "../../styles/Home.css";

import Header from "../../components/Header/Header";
import HeaderBack from "../../components/Header/HeaderBack";
import Search from "../../components/Search/Search";
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
import Terms from "../../components/MyProfileDetails/Terms/Terms";

function Home({
    user,
    setUser,
    setPage,
    navigateWithLoading,
    cartCount,
    setCartCount
}) {

    const [selectedMenu, setSelectedMenu] = useState("Shop");

    const [selectedBottomTab, setSelectedBottomTab] = useState(() => {
        const savedTab = localStorage.getItem("selectedBottomTab");

        if (
            savedTab === "Premium" ||
            savedTab === "Offers" ||
            savedTab === "Cart" ||
            savedTab === "Profile"
        ) {
            return savedTab;
        }

        return null;
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
    const [profilePage, setProfilePage] = useState("profile");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [giftCategoryPage, setGiftCategoryPage] = useState(false);
    const [selectedGiftCategory, setSelectedGiftCategory] = useState(null);
    const [detailsPage, setDetailsPage] = useState("details");
    const [shopCategoryPage, setShopCategoryPage] = useState(false);
    const [selectedShopCategory, setSelectedShopCategory] = useState(null);


    const [cardSuggestionsData, setCardSuggestionsData] = useState([]);
    const [giftSuggestionsData, setGiftSuggestionsData] = useState([]);
    const [shopSuggestionsData, setShopSuggestionsData] = useState([]);
    const [premiumSuggestionsData, setPremiumSuggestionsData] = useState([]);
    const [profileImageRefresh, setProfileImageRefresh] = useState(0);

    useEffect(() => {

        localStorage.setItem("selectedMenu", selectedMenu);

    }, [selectedMenu]);

    useEffect(() => {
        if (selectedBottomTab === null) {
            localStorage.removeItem("selectedBottomTab");
            return;
        }

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

        setDetailsBackPage({
            selectedBottomTab,
            profilePage,
            selectedMenu
        });

        setDetailsPage("details");

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

        if (detailsBackPage) {

            setSelectedBottomTab(
                detailsBackPage.selectedBottomTab
            );

            setProfilePage(
                detailsBackPage.profilePage
            );

            setSelectedMenu(
                detailsBackPage.selectedMenu
            );

        }

    };

    const [orderData, setOrderData] = useState({
        items: [],
        orderType: ""
    });
    const [buyNowFromDetails, setBuyNowFromDetails] = useState(false);
    const [detailsBackPage, setDetailsBackPage] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedTrackingOrder, setSelectedTrackingOrder] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [allShopCategoriesPage, setAllShopCategoriesPage] = useState(false);
    const [allGiftCategoriesPage, setAllGiftCategoriesPage] = useState(false);
    const [allShopsPage, setAllShopsPage] = useState(false);
    const [allGiftsPage, setAllGiftsPage] = useState(false);

    const isHandlingBackRef = useRef(false);
    useEffect(() => {

        const handleBrowserBack = (event) => {

            window.history.pushState(
                null,
                "",
                window.location.href
            );

            if (isHandlingBackRef.current) {
                return;
            }

            isHandlingBackRef.current = true;

            // 1. Details → previous page
            if (isDetailsOpen) {
                handleCloseDetails();
                isHandlingBackRef.current = false;
                return;
            }

            if (allShopCategoriesPage) {
                setAllShopCategoriesPage(false);
                isHandlingBackRef.current = false;
                return;
            }
            // Shop → All Shops → Shop main
            if (allShopsPage) {
                setAllShopsPage(false);
                isHandlingBackRef.current = false;
                return;
            }
            // 2. Shop Category → Shop main
            if (shopCategoryPage) {
                setShopCategoryPage(false);
                setSelectedShopCategory(null);
                isHandlingBackRef.current = false;
                return;
            }

            if (allGiftCategoriesPage) {
                setAllGiftCategoriesPage(false);
                isHandlingBackRef.current = false;
                return;
            }
            // Gifts → All Gifts → Gifts main
            if (allGiftsPage) {
                setAllGiftsPage(false);
                isHandlingBackRef.current = false;
                return;
            }

            // 3. Gift Category → Gifts main
            if (giftCategoryPage) {
                setGiftCategoryPage(false);
                setSelectedGiftCategory(null);
                isHandlingBackRef.current = false;
                return;
            }
            // 3. Cart → Profile
            if (selectedBottomTab === "Cart") {
                setSelectedBottomTab("Profile");
                setProfilePage("profile");
                isHandlingBackRef.current = false;
                return;
            }

            // 4. Profile sub-page → Profile main
            if (
                selectedBottomTab === "Profile" &&
                profilePage !== "profile"
            ) {
                setProfilePage("profile");
                isHandlingBackRef.current = false;
                return;
            }

            // 5. Main page → app ke bahar nahi jaane do
            isHandlingBackRef.current = false;
        };

        window.history.pushState(
            null,
            "",
            window.location.href
        );

        window.addEventListener(
            "popstate",
            handleBrowserBack
        );

        return () => {
            window.removeEventListener(
                "popstate",
                handleBrowserBack
            );
        };

    }, [
        isDetailsOpen,
        selectedBottomTab,
        profilePage,
        detailsBackPage
    ]);
    const handleAppBack = () => {

        // Details
        if (isDetailsOpen) {
            handleCloseDetails();
            return;
        }

        // Shop → All Categories → Shop
        if (allShopCategoriesPage) {
            setAllShopCategoriesPage(false);
            return;
        }

        // Shop → All Shops → Shop
        if (allShopsPage) {
            setAllShopsPage(false);
            return;
        }

        // Shop → Category → Shop
        if (shopCategoryPage) {
            setShopCategoryPage(false);
            setSelectedShopCategory(null);
            return;
        }

        // Gifts → All Categories → Gifts
        if (allGiftCategoriesPage) {
            setAllGiftCategoriesPage(false);
            return;
        }

        // Gifts → All Gifts → Gifts
        if (allGiftsPage) {
            setAllGiftsPage(false);
            return;
        }

        // Gifts → Category → Gifts
        if (giftCategoryPage) {
            setGiftCategoryPage(false);
            setSelectedGiftCategory(null);
            return;
        }

        // Cart → Profile
        if (selectedBottomTab === "Cart") {
            setSelectedBottomTab("Profile");
            setProfilePage("profile");
            return;
        }

        // Profile internal page → Profile
        if (
            selectedBottomTab === "Profile" &&
            profilePage !== "profile"
        ) {
            setProfilePage("profile");
            return;
        }
    };
    const showMainHeader =
        !isDetailsOpen &&
        selectedBottomTab === "Home" &&
        !allShopCategoriesPage &&
        !allShopsPage &&
        !allGiftCategoriesPage &&
        !allGiftsPage &&
        !shopCategoryPage &&
        !giftCategoryPage;
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
            {
                showMainHeader ? (
                    <Header
                        selectedMenu={selectedMenu}
                        setSelectedMenu={setSelectedMenu}
                        isMenuOpen={isMenuOpen}
                        setSelectedBottomTab={setSelectedBottomTab}
                        setIsMenuOpen={setIsMenuOpen}
                        selectedBottomTab={selectedBottomTab}
                        cartCount={cartCount}
                        isDetailsOpen={isDetailsOpen}
                        closeDetails={handleCloseDetails}
                        userId={user?.user_id}
                        onOpenCart={() => {
                            setIsDetailsOpen(false);
                            setSelectedProduct(null);
                            setDetailsPage("details");
                            setSelectedBottomTab("Profile");
                            setProfilePage("cart");
                        }}
                    />
                ) : (
                    (
                        isDetailsOpen ||
                        allShopCategoriesPage ||
                        allShopsPage ||
                        shopCategoryPage ||
                        allGiftCategoriesPage ||
                        allGiftsPage ||
                        giftCategoryPage
                    ) && (
                        <HeaderBack
                            title="Back"
                            onBack={handleAppBack}
                        />
                    )
                )
            }

            {
                !isDetailsOpen &&

                (selectedBottomTab === null ||

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

                    cards={cardSuggestionsData}
                    gifts={giftSuggestionsData}
                    shops={shopSuggestionsData}
                    premiums={premiumSuggestionsData}


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

                                onBuyNow={(buyNowItem, orderType) => {


                                    setBuyNowFromDetails(true);

                                    setOrderData({
                                        items: [buyNowItem],
                                        orderType: orderType
                                    });

                                    setIsDetailsOpen(false);

                                    setSelectedProduct(null);

                                    setSelectedBottomTab("Profile");

                                    setProfilePage(
                                        orderType === "products"
                                            ? "productorder"
                                            : "cardorder"
                                    );

                                }}
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
                                user={user}
                                setCartCount={setCartCount}
                                onOpenDetails={handleOpenDetails}
                                search={search}
                                filter={filter}
                                giftCategoryPage={giftCategoryPage}
                                setGiftCategoryPage={setGiftCategoryPage}
                                selectedGiftCategory={selectedGiftCategory}
                                setSelectedGiftCategory={setSelectedGiftCategory}
                                allGiftCategoriesPage={allGiftCategoriesPage}
                                setAllGiftCategoriesPage={setAllGiftCategoriesPage}
                                allGiftsPage={allGiftsPage}
                                setAllGiftsPage={setAllGiftsPage}
                                setSuggestionData={setGiftSuggestionsData}
                            />

                        }

                        {
                            selectedMenu === "Shop" &&
                            <Shop
                                user={user}
                                setCartCount={setCartCount}
                                onOpenDetails={handleOpenDetails}
                                search={search}
                                filter={filter}
                                shopCategoryPage={shopCategoryPage}
                                setShopCategoryPage={setShopCategoryPage}
                                selectedShopCategory={selectedShopCategory}
                                setSelectedShopCategory={setSelectedShopCategory}
                                allShopCategoriesPage={allShopCategoriesPage}
                                setAllShopCategoriesPage={setAllShopCategoriesPage}
                                allShopsPage={allShopsPage}
                                setAllShopsPage={setAllShopsPage}
                                setSuggestionData={setShopSuggestionsData}
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
                        user={user}
                        profile={profile}
                        setProfile={setProfile}
                        setPage={setPage}
                        onLogout={handleLogout}
                        setProfilePage={setProfilePage}
                        navigateWithLoading={navigateWithLoading}
                    />

                }
                {
                    !isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "viewprofile" &&

                    <ViewProfile
                        profile={profile}
                        setProfilePage={setProfilePage}
                        navigateWithLoading={navigateWithLoading}
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
                        navigateWithLoading={navigateWithLoading}
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
                    selectedBottomTab === "Cart" &&
                    profilePage === "cart" &&

                    <MyCart
                        setProfilePage={setProfilePage}
                        setOrderData={setOrderData}
                        setBuyNowFromDetails={setBuyNowFromDetails}
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

                        buyNowFromDetails={buyNowFromDetails}

                        onBackToDetails={() => {
                            setBuyNowFromDetails(false);
                            setIsDetailsOpen(true);
                            setDetailsPage("details");
                        }}
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

                        buyNowFromDetails={buyNowFromDetails}

                        onBackToDetails={() => {
                            setBuyNowFromDetails(false);

                            setIsDetailsOpen(true);

                            setDetailsPage("details");
                        }}
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
                        navigateWithLoading={navigateWithLoading}
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
                            navigateWithLoading={navigateWithLoading}
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
                    profilePage === "terms" &&

                    <Terms
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
                        navigateWithLoading={navigateWithLoading}
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
                user={user}
                profileImageRefresh={profileImageRefresh}
                selectedBottomTab={selectedBottomTab}
                setSelectedBottomTab={setSelectedBottomTab}
                setSelectedMenu={setSelectedMenu}
                isDetailsOpen={isDetailsOpen}
                closeDetails={handleCloseDetails}
                setProfilePage={setProfilePage}
                navigateWithLoading={navigateWithLoading}
            />

        </div>

    );

}

export default Home;