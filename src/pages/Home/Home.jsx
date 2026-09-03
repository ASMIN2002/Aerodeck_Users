import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../../services/api";

import "../../styles/Home.css";

import Header from "../../components/Header/Header";
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
    goTo,
    cartCount,
    setCartCount,
    onAppBack
}) {
    const location = useLocation();
    const navigate = useNavigate();

    // SAMAN
    useEffect(() => {
        if (location.pathname === "/home") {
            setSelectedBottomTab("Home");
            setSelectedMenu("Shop");
            setProfilePage("profile");

            setAllShopCategoriesPage(false);
            setAllShopsPage(false);
            setShopCategoryPage(false);
            setSelectedShopCategory(null);

            setAllGiftCategoriesPage(false);
            setAllGiftsPage(false);
            setGiftCategoryPage(false);
            setSelectedGiftCategory(null);

            setIsDetailsOpen(false);
            setSelectedProduct(null);
            setDetailsPage("details");

            return;
        }
        if (location.pathname === "/premium") {
            setSelectedBottomTab("Premium");
            setSelectedMenu("Premium");
            setProfilePage("profile");

            setIsDetailsOpen(false);
            setSelectedProduct(null);
            setDetailsPage("details");

            return;
        }
        if (location.pathname === "/home/shop") {
            setSelectedBottomTab("Home");
            setSelectedMenu("Shop");
            setProfilePage("profile");

            setAllShopCategoriesPage(false);
            setAllShopsPage(false);
            setShopCategoryPage(false);
            setSelectedShopCategory(null);

            setIsDetailsOpen(false);
            setSelectedProduct(null);
            setDetailsPage("details");

            return;
        }
        if (location.pathname === "/home/shop/allcategory") {
            setSelectedBottomTab("Home");
            setSelectedMenu("Shop");
            setProfilePage("profile");

            setAllShopCategoriesPage(true);
            setAllShopsPage(false);
            setShopCategoryPage(false);

            setIsDetailsOpen(false);
            setSelectedProduct(null);
            setDetailsPage("details");

            return;
        }
        if (
            location.pathname.startsWith("/home/shop/allcategory/") &&
            !location.pathname.includes("/product/")
        ) {

            const category = decodeURIComponent(
                location.pathname.split("/home/shop/allcategory/")[1]
            );

            setSelectedBottomTab("Home");
            setSelectedMenu("Shop");
            setProfilePage("profile");

            setSelectedShopCategory(category);

            setAllShopCategoriesPage(false);
            setAllShopsPage(false);
            setShopCategoryPage(true);

            setIsDetailsOpen(false);
            setSelectedProduct(null);
            setDetailsPage("details");

            return;
        }
        if (
            location.pathname.startsWith("/home/shop/category/") &&
            !location.pathname.includes("/product/")
        ) {

            const category = decodeURIComponent(
                location.pathname.split("/home/shop/category/")[1]
            );

            setSelectedBottomTab("Home");
            setSelectedMenu("Shop");
            setProfilePage("profile");

            setSelectedShopCategory(category);

            setAllShopCategoriesPage(false);
            setAllShopsPage(false);
            setShopCategoryPage(true);

            setIsDetailsOpen(false);
            setSelectedProduct(null);
            setDetailsPage("details");

            return;
        }

        if (location.pathname === "/home/shop/allshops") {
            setSelectedBottomTab("Home");
            setSelectedMenu("Shop");
            setProfilePage("profile");

            setAllShopsPage(true);
            setAllShopCategoriesPage(false);
            setShopCategoryPage(false);

            setIsDetailsOpen(false);
            setSelectedProduct(null);
            setDetailsPage("details");

            return;
        }

        if (location.pathname === "/home/gifts") {
            setSelectedBottomTab("Home");
            setSelectedMenu("Gifts");
            setProfilePage("profile");

            setAllGiftCategoriesPage(false);
            setAllGiftsPage(false);
            setGiftCategoryPage(false);

            setIsDetailsOpen(false);
            setSelectedProduct(null);
            setDetailsPage("details");

            return;
        }

        // ALL GIFT CATEGORIES
        if (location.pathname === "/home/gifts/allcategory") {
            setSelectedBottomTab("Home");
            setSelectedMenu("Gifts");
            setProfilePage("profile");

            setAllGiftCategoriesPage(true);
            setAllGiftsPage(false);
            setGiftCategoryPage(false);

            setIsDetailsOpen(false);
            setSelectedProduct(null);
            setDetailsPage("details");

            return;
        }

        if (location.pathname === "/home/gifts/allgifts") {
            setSelectedBottomTab("Home");
            setSelectedMenu("Gifts");
            setProfilePage("profile");

            setAllGiftsPage(true);
            setAllGiftCategoriesPage(false);
            setGiftCategoryPage(false);

            setIsDetailsOpen(false);
            setSelectedProduct(null);
            setDetailsPage("details");

            return;
        }
        if (
            location.pathname.startsWith("/home/gifts/allcategory/") &&
            !location.pathname.includes("/product/")
        ) {

            const category = decodeURIComponent(
                location.pathname.split("/home/gifts/allcategory/")[1]
            );

            setSelectedBottomTab("Home");
            setSelectedMenu("Gifts");
            setProfilePage("profile");

            setSelectedGiftCategory(category);
            setAllGiftCategoriesPage(false);
            setAllGiftsPage(false);
            setGiftCategoryPage(true);

            setIsDetailsOpen(false);
            setSelectedProduct(null);
            setDetailsPage("details");

            return;
        }

        // GIFT CATEGORY
        if (location.pathname.startsWith("/home/gifts/category/")) {

            const category = decodeURIComponent(
                location.pathname.split("/home/gifts/category/")[1]
            );

            setSelectedBottomTab("Home");
            setSelectedMenu("Gifts");
            setProfilePage("profile");

            setSelectedGiftCategory(category);
            setGiftCategoryPage(true);

            setAllGiftCategoriesPage(false);
            setAllGiftsPage(false);

            setIsDetailsOpen(false);
            setSelectedProduct(null);
            setDetailsPage("details");

            return;
        }

        if (location.pathname === "/home/cards") {
            setSelectedBottomTab("Home");
            setSelectedMenu("Cards");
            setProfilePage("profile");

            setAllGiftCategoriesPage(false);
            setGiftCategoryPage(false);
            setIsDetailsOpen(false);
            setSelectedProduct(null);
            setDetailsPage("details");

            return;
        }

    }, [location.pathname]);


    // PROFILE
    useEffect(() => {
        if (
            location.pathname.startsWith("/profile/wishlist/product/")
        ) {
            setSelectedBottomTab("Profile");
            setProfilePage("wishlist");
            return;
        }

        if (!location.pathname.startsWith("/profile")) {
            return;
        }

        setSelectedBottomTab("Profile");

        setIsDetailsOpen(false);
        setSelectedProduct(null);
        setDetailsPage("details");

        if (location.pathname === "/profile") {

            setProfilePage("profile");

            return;
        }

        if (location.pathname === "/profile/address") {

            setProfilePage("address");

            return;
        }

        if (location.pathname === "/profile/address/addaddress") {

            setProfilePage("addaddress");

            return;
        }

        if (location.pathname === "/profile/address/editaddress") {

            setProfilePage("editaddress");

            return;
        }

        if (location.pathname === "/profile/wishlist") {

            setProfilePage("wishlist");

            return;
        }

        if (location.pathname.startsWith("/profile/orders/order/")) {

            const orderId = location.pathname.split("/profile/orders/order/")[1];

            setProfilePage("order-details");

            setSelectedOrder({
                order_id: orderId
            });

            return;
        }
        if (location.pathname === "/profile/orders") {

            setProfilePage("orders");

            return;
        }

        if (location.pathname === "/profile/help") {

            setProfilePage("help");

            return;
        }

        if (location.pathname === "/profile/about") {

            setProfilePage("about");

            return;
        }

        if (location.pathname === "/profile/terms") {

            setProfilePage("terms");

            return;
        }

        if (location.pathname === "/profile/viewprofile/editprofile") {

            setProfilePage("editprofile");

            return;
        }

        if (location.pathname === "/profile/viewprofile") {

            setProfilePage("viewprofile");

            return;
        }

    }, [location.pathname]);


    useEffect(() => {
        const parts = location.pathname.split("/").filter(Boolean);
        let type = "";
        let id = "";

        if (
            parts.length === 6 &&
            parts[0] === "profile" &&
            parts[1] === "orders" &&
            parts[2] === "order" &&
            parts[4] === "product"
        ) {
            type = "shop";
            id = parts[5];

            setSelectedBottomTab("Profile");
            setProfilePage("order-details");
        }
        if (
            parts.length === 4 &&
            parts[0] === "profile" &&
            parts[1] === "wishlist" &&
            parts[2] === "product"
        ) {

            type = "shop";
            id = parts[3];

            setSelectedBottomTab("Profile");
            setProfilePage("wishlist");
        }

        if (
            (parts.length === 4 || parts.length === 5) &&
            parts[0] === "home" &&
            parts[3]
        ) {

            if (
                parts[1] === "shop" &&
                parts[2] === "product"
            ) {

                type = "products";
                id = parts[3];
            }

            if (
                parts[1] === "gifts" &&
                parts[2] === "product"
            ) {

                type = "gifts";
                id = parts[3];
            }

            if (
                parts[1] === "cards" &&
                parts[2] === "product"
            ) {

                type = "cards";
                id = parts[3];
            }

            if (
                parts[1] === "premium" &&
                parts[2] === "product"
            ) {

                type = "premium";
                id = parts[3];
            }
        }

        // ==========================================
        // ALL CATEGORY PRODUCT URL
        // /home/shop/allcategory/ELECTRONICS/product/P27
        // ==========================================

        if (
            parts.length === 6 &&
            parts[0] === "home" &&
            parts[1] === "shop" &&
            parts[2] === "allcategory" &&
            parts[4] === "product"
        ) {

            type = "products";
            id = parts[5];

            setSelectedMenu("Shop");

            setSelectedShopCategory(
                decodeURIComponent(parts[3])
            );

            setShopCategoryPage(true);
            setAllShopCategoriesPage(false);
            setAllShopsPage(false);
        }

        if (
            parts.length === 6 &&
            parts[0] === "home" &&
            parts[2] === "category" &&
            parts[4] === "product"
        ) {

            if (parts[1] === "gifts") {

                type = "gifts";
                id = parts[5];

                setSelectedMenu("Gifts");

                setSelectedGiftCategory(
                    decodeURIComponent(parts[3])
                );

                setGiftCategoryPage(true);
            }

            if (parts[1] === "shop") {

                type = "products";
                id = parts[5];

                setSelectedMenu("Shop");

                setSelectedShopCategory(
                    decodeURIComponent(parts[3])
                );

                setShopCategoryPage(true);
            }
        }

        // ==========================================
        // INVALID / NON-PRODUCT URL
        // ==========================================

        if (!type || !id) {
            return;
        }

        // ==========================================
        // BOTTOM TAB
        // ==========================================

        if (type === "premium") {

            setSelectedBottomTab("Premium");

        } else if (
            location.pathname.startsWith("/profile/wishlist/")
        ) {

            setSelectedBottomTab("Profile");

        } else {

            setSelectedBottomTab("Home");
        }

        setProfilePage(
            location.pathname.startsWith("/profile/wishlist/")
                ? "wishlist"
                : "profile"
        );

        // ==========================================
        // SELECTED PRODUCT
        // ==========================================

        setSelectedProduct({

            type,

            data: {

                product_id:
                    type === "products"
                        ? id
                        : undefined,

                gift_id:
                    type === "gifts"
                        ? id
                        : undefined,

                shop_id:
                    type === "shop" || type === "cards"
                        ? id
                        : undefined,

                premium_id:
                    type === "premium"
                        ? id
                        : undefined
            }
        });

        if (location.pathname.endsWith("/reviews")) {

            setDetailsPage("allreview");

        } else if (location.pathname.endsWith("/media")) {

            setDetailsPage("allmedia");

        } else {

            setDetailsPage("details");

        }

        setIsDetailsOpen(true);

    }, [location.pathname]);

    const [selectedMenu, setSelectedMenu] = useState("Shop");

    const [selectedBottomTab, setSelectedBottomTab] = useState(() => {
        const savedTab = localStorage.getItem("selectedBottomTab");

        if (
            savedTab === "Home" ||
            savedTab === "Premium" ||
            savedTab === "Offers" ||
            savedTab === "Cart" ||
            savedTab === "Profile"
        ) {
            return savedTab;
        }

        return "Home";
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
        if (!location.pathname.includes("/product/")) {

            setDetailsBackPage({

                selectedBottomTab,

                profilePage,

                selectedMenu,

                pathname: location.pathname

            });

        }
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

        let productUrl;

        if (location.pathname.includes("/product/")) {

            const basePath =
                location.pathname.split("/product/")[0];

            productUrl = `${basePath}/product/${id}`;

        } else if (

            (type === "gift" &&
                location.pathname.startsWith("/home/gifts/category/")) ||

            (type === "shop" &&
                location.pathname.startsWith("/home/shop/category/"))

        ) {

            productUrl = `${location.pathname}/product/${id}`;

        } else {

            productUrl = `${location.pathname}/product/${id}`;

        }


        // RELATED PRODUCT → replace history
        if (location.pathname.includes("/product/")) {

            window.history.replaceState(
                {},
                "",
                productUrl
            );

            window.dispatchEvent(
                new PopStateEvent("popstate")
            );

        } else {

            goTo(productUrl);

        }
    };

    const handleCloseDetails = () => {

        console.log("BACK DEBUG:", {
            currentPath: location.pathname,
            detailsBackPage
        });
        const currentPath = location.pathname;

        // Reviews / Media → Product Details
        if (
            currentPath.endsWith("/reviews") ||
            currentPath.endsWith("/media")
        ) {

            const productPath = currentPath
                .replace(/\/reviews$/, "")
                .replace(/\/media$/, "");

            setDetailsPage("details");

            goTo(productPath);

            return;
        }

        // Product Details → Parent Page
        if (currentPath.includes("/product/")) {

            const parentPath =
                currentPath.split("/product/")[0];

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

            setDetailsPage("details");
            setSelectedProduct(null);
            setIsDetailsOpen(false);

            goTo(parentPath);

            return;
        }

        // Normal fallback
        setDetailsPage("details");
        setSelectedProduct(null);
        setIsDetailsOpen(false);

        if (detailsBackPage?.pathname) {
            goTo(detailsBackPage.pathname);
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
    useEffect(() => {

        const handleBackNavigation = () => {

            if (window.location.pathname === "/cart") {

                setIsDetailsOpen(false);
                setSelectedProduct(null);
                setDetailsPage("details");
                setSelectedBottomTab("Cart");
                setProfilePage("cart");
            }

        };

        window.addEventListener("popstate", handleBackNavigation);

        return () => {
            window.removeEventListener(
                "popstate",
                handleBackNavigation
            );
        };

    }, []);

    return (

        <div className="home-container">

            {
                showMainHeader && (
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

                            setSelectedBottomTab("Cart");
                            setProfilePage("cart");

                            navigate("/cart");

                        }}
                    />
                )
            }
            {
                !isDetailsOpen &&

                (
                    selectedBottomTab === "Home" ||
                    selectedBottomTab === "Premium"
                ) &&

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

                                onViewAll={() => {
                                    setDetailsPage("allreview");

                                    navigate(`${location.pathname}/reviews`);
                                }}


                                onViewAllMedia={() => {
                                    setDetailsPage("allmedia");
                                    navigate(`${location.pathname}/media`);
                                }}
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
                                goTo={goTo}
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
                                goTo={goTo}
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
                        setCartCount={setCartCount}
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
                cartCount={cartCount}
                setCartCount={setCartCount}
            />

        </div>

    );

}

export default Home;