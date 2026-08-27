import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
    setCartCount,
    onAppBack
}) {
    const location = useLocation();
    const navigate = useNavigate();

    const internalHistoryRef = useRef([]);

    const saveCurrentState = () => ({
        selectedBottomTab,
        selectedMenu,
        profilePage,
        isDetailsOpen,
        detailsPage,
        selectedProduct,
        shopCategoryPage,
        selectedShopCategory,
        giftCategoryPage,
        selectedGiftCategory,
        allShopCategoriesPage,
        allShopsPage,
        allGiftCategoriesPage,
        allGiftsPage
    });

    const pushInternalPage = (update) => {
        internalHistoryRef.current.push(saveCurrentState());
        update();
    };

    const handleInternalBack = useCallback(() => {
        const previous =
            internalHistoryRef.current.pop();

        if (!previous) {
            return false;
        }

        setSelectedBottomTab(previous.selectedBottomTab);
        setSelectedMenu(previous.selectedMenu);
        setProfilePage(previous.profilePage);
        setIsDetailsOpen(previous.isDetailsOpen);
        setDetailsPage(previous.detailsPage);
        setSelectedProduct(previous.selectedProduct);
        setShopCategoryPage(previous.shopCategoryPage);
        setSelectedShopCategory(previous.selectedShopCategory);
        setGiftCategoryPage(previous.giftCategoryPage);
        setSelectedGiftCategory(previous.selectedGiftCategory);
        setAllShopCategoriesPage(previous.allShopCategoriesPage);
        setAllShopsPage(previous.allShopsPage);
        setAllGiftCategoriesPage(previous.allGiftCategoriesPage);
        setAllGiftsPage(previous.allGiftsPage);

        return true;
    }, []);

    useEffect(() => {
        window.__heepitInternalBack = handleInternalBack;

        return () => {
            delete window.__heepitInternalBack;
        };
    }, [handleInternalBack]);
    const handleAppBack = () => {
        navigate(-1);
    };
    useEffect(() => {
        if (location.pathname === "/home/shop") {
            setSelectedBottomTab("Home");
            setSelectedMenu("Shop");
            setProfilePage("profile");
        }
        if (location.pathname === "/home/gifts") {
            setSelectedBottomTab("Home");
            setSelectedMenu("Gifts");
            setProfilePage("profile");
        }
        if (location.pathname === "/home/cards") {
            setSelectedBottomTab("Home");
            setSelectedMenu("Cards");
            setProfilePage("profile");
        }
    }, [location.pathname]);

    useEffect(() => {
        const parts = location.pathname.split("/");
        if (
            parts.length !== 5 ||
            parts[3] !== "product"
        ) {
            return;
        }
        const id = parts[4];
        if (!id) {
            return;
        }
        let type = "";
        if (parts[1] === "home" && parts[2] === "shop") {
            type = "products";
            setSelectedMenu("Shop");
        }
        if (parts[1] === "home" && parts[2] === "gifts") {
            type = "gifts";
            setSelectedMenu("Gifts");
        }
        if (parts[1] === "home" && parts[2] === "cards") {
            type = "cards";
            setSelectedMenu("Cards");
        }
        if (parts[1] === "home" && parts[2] === "premium") {
            type = "premium";
            setSelectedBottomTab("Premium");
        }
        if (!type) {
            return;
        }
        setSelectedBottomTab(
            parts[2] === "premium" ? "Premium" : "Home"
        );
        setProfilePage("profile");
        setSelectedProduct({
            type,
            data: {
                product_id: type === "products" ? id : undefined,
                gift_id: type === "gifts" ? id : undefined,
                shop_id: type === "cards" ? id : undefined,
                premium_id: type === "premium" ? id : undefined
            }
        });
        setDetailsPage("details");
        setIsDetailsOpen(true);
    }, [location.pathname]);

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
            selectedMenu,
            pathname: location.pathname
        });

        setDetailsPage("details");

        setSelectedProduct({
            type,
            data: product
        });

        setIsDetailsOpen(true);

        const id =
            product.product_id ||
            product.gift_id ||
            product.shop_id ||
            product.premium_id;

        navigate(`${location.pathname}/product/${id}`);
    };

    const handleCloseDetails = () => {

        setDetailsPage("details");

        setSelectedProduct(null);

        setIsDetailsOpen(false);

        if (detailsBackPage?.pathname) {
            navigate(detailsBackPage.pathname);
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