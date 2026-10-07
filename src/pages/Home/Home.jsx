import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../../services/api";

import "../../styles/Home.css";

import Header from "../../components/Header/Header";
import Search from "../../components/Search/Search";
import Cards from "../../components/Cards/Cards";
import Gift from "../../components/Gift/Gift";
import Shop from "../../components/Shop/Shop";
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
import Address from "../../components/Address/Address";
import Rewards from "../../components/MyProfileDetails/Rewards/Rewards";
import TOPHEADER from "../../components/Header/TOPHEADER";

import useHomeRouting from "./useHomeRouting";

function Home({
    user,
    setPage,
    navigateWithLoading,
    goTo,
    cartCount,
    setCartCount,
}) {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedMenu, setSelectedMenu] = useState("Shop");

    const [selectedBottomTab, setSelectedBottomTab] = useState(() => {
        const savedTab = localStorage.getItem("selectedBottomTab");
        if (
            savedTab === "Home" ||
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
        availableOnly: false,
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

    const [navKey, setNavKey] = useState(0);

    const [orderData, setOrderData] = useState({
        items: [],
        orderType: "",
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

    const [profile, setProfile] = useState(null);
    useHomeRouting({
        setSelectedBottomTab,
        setSelectedMenu,
        setProfilePage,
        setSelectedProduct,
        setIsDetailsOpen,
        setDetailsPage,
        setSelectedShopCategory,
        setSelectedGiftCategory,
        setShopCategoryPage,
        setGiftCategoryPage,
        setAllShopCategoriesPage,
        setAllShopsPage,
        setAllGiftCategoriesPage,
        setAllGiftsPage,
        setSelectedOrder,
    });


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


    useEffect(() => {
        async function loadProfile() {
            const response = await fetch(`${API}/api/user/profile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    session_token: localStorage.getItem("session_token"),
                }),
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
            const path = window.location.pathname;

            if (path === "/cart") {
                setIsDetailsOpen(false);
                setSelectedProduct(null);
                setDetailsPage("details");
                setSelectedBottomTab("Cart");
                setProfilePage("cart");
                return;
            }

            if (path.endsWith("/reviews")) {
                setDetailsPage("allreview");
                setIsDetailsOpen(true);
                return;
            }

            if (path.endsWith("/media")) {
                setDetailsPage("allmedia");
                setIsDetailsOpen(true);
                return;
            }

            if (
                path.includes("/product/") &&
                !path.endsWith("/reviews") &&
                !path.endsWith("/media")
            ) {
                setDetailsPage("details");
                setIsDetailsOpen(true);
                return;
            }

            if (isDetailsOpen) {
                setIsDetailsOpen(false);
                setSelectedProduct(null);
                setDetailsPage("details");
                return;
            }
        };

        window.addEventListener("popstate", handleBackNavigation);

        return () => {
            window.removeEventListener("popstate", handleBackNavigation);
        };
    }, [isDetailsOpen]);

    useEffect(() => {
        if (detailsPage !== "details") return;

        const savedScroll = sessionStorage.getItem("detailsScrollPosition");
        if (!savedScroll) return;

        const homeContent = document.querySelector(".home-content");
        if (!homeContent) return;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                homeContent.scrollTop = Number(savedScroll);
                sessionStorage.removeItem("detailsScrollPosition");
            });
        });
    }, [detailsPage]);

    const handleLogout = async () => {
        try {
            await fetch(`${API}/api/auth/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    session_token: localStorage.getItem("session_token"),
                }),
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
            pathname: location.pathname,
        });

        if (!location.pathname.includes("/product/")) {
            setDetailsBackPage({
                selectedBottomTab,
                profilePage,
                selectedMenu,
                pathname: location.pathname,
            });
        }

        setDetailsPage("details");

        setSelectedProduct({
            type,
            data: product,
        });

        setIsDetailsOpen(true);

        const id =
            product.product_id ||
            product.gift_id ||
            product.shop_id ||
            product.premium_id;

        let productUrl;

        if (location.pathname.includes("/product/")) {
            const basePath = location.pathname.split("/product/")[0];
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

        if (location.pathname.includes("/product/")) {
            window.history.replaceState({}, "", productUrl);
            window.dispatchEvent(new PopStateEvent("popstate"));
        } else {
            goTo(productUrl);
        }
    };

    const handleCloseDetails = () => {
        const currentPath = location.pathname;

        if (currentPath.endsWith("/reviews") || currentPath.endsWith("/media")) {
            const productPath = currentPath
                .replace(/\/reviews$/, "")
                .replace(/\/media$/, "");

            setDetailsPage("details");
            goTo(productPath);

            return;
        }

        if (currentPath.includes("/product/")) {
            const parentPath = currentPath.split("/product/")[0];

            if (detailsBackPage) {
                setSelectedBottomTab(detailsBackPage.selectedBottomTab);
                setProfilePage(detailsBackPage.profilePage);
                setSelectedMenu(detailsBackPage.selectedMenu);
            }

            setDetailsPage("details");
            setSelectedProduct(null);
            setIsDetailsOpen(false);

            goTo(parentPath);

            return;
        }

        setDetailsPage("details");
        setSelectedProduct(null);
        setIsDetailsOpen(false);

        if (detailsBackPage?.pathname) {
            goTo(detailsBackPage.pathname);
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

    return (
        <div className="home-container">
            {showMainHeader && (
                <>
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
                        onReloadHome={() => setNavKey((prev) => prev + 1)}
                        onOpenCart={() => {
                            setIsDetailsOpen(false);
                            setSelectedProduct(null);
                            setDetailsPage("details");
                            setSelectedBottomTab("Cart");
                            setProfilePage("cart");
                            navigate("/cart");
                        }}
                    />

                    <div className="home-address">
                        <Address
                            setProfilePage={setProfilePage}
                            setSelectedBottomTab={setSelectedBottomTab}
                        />
                    </div>
                </>
            )}

            {!isDetailsOpen && selectedBottomTab === "Home" && (
                <>
                    {allShopCategoriesPage && (
                        <>
                            <TOPHEADER
                                title="All Categories"
                                onBack={() => {
                                    setAllShopCategoriesPage(false);
                                    goTo("/home/shop", { replace: true });
                                }}
                            />

                            <div className="home-address">
                                <Address
                                    setProfilePage={setProfilePage}
                                    setSelectedBottomTab={setSelectedBottomTab}
                                />
                            </div>
                        </>
                    )}

                    {shopCategoryPage && (
                        <>
                            <TOPHEADER
                                title={selectedShopCategory}
                                onBack={() => {
                                    setSelectedShopCategory(null);
                                    setShopCategoryPage(false);
                                    goTo("/home/shop", { replace: true });
                                }}
                            />

                            <div className="home-address">
                                <Address
                                    setProfilePage={setProfilePage}
                                    setSelectedBottomTab={setSelectedBottomTab}
                                />
                            </div>
                        </>
                    )}

                    {allShopsPage && (
                        <>
                            <TOPHEADER
                                title="All Shops"
                                onBack={() => {
                                    setAllShopsPage(false);
                                    goTo("/home/shop", { replace: true });
                                }}
                            />

                            <div className="home-address">
                                <Address
                                    setProfilePage={setProfilePage}
                                    setSelectedBottomTab={setSelectedBottomTab}
                                />
                            </div>
                        </>
                    )}

                    <Search
                        selectedMenu={selectedMenu}
                        search={search}
                        setSearch={setSearch}
                        categoryName={
                            shopCategoryPage ? selectedShopCategory : null
                        }
                        filter={filter}
                        setFilter={setFilter}
                        categories={categories}
                        cards={cardSuggestionsData}
                        gifts={giftSuggestionsData}
                        shops={shopSuggestionsData}
                        premiums={premiumSuggestionsData}
                    />
                </>
            )}

            <div className="home-content">
                {isDetailsOpen && (
                    <>
                        <div
                            style={{
                                display:
                                    detailsPage === "details"
                                        ? "block"
                                        : "none",
                            }}
                        >
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
                                        orderType: orderType,
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
                        </div>

                        {detailsPage === "allreview" && (
                            <AllReview
                                setDetailsPage={setDetailsPage}
                                product_id={
                                    selectedProduct?.data?.product_id ||
                                    selectedProduct?.data?.gift_id ||
                                    selectedProduct?.data?.shop_id ||
                                    selectedProduct?.data?.premium_id
                                }
                            />
                        )}

                        {detailsPage === "allmedia" && (
                            <AllMedia
                                onBack={() => setDetailsPage("details")}
                                product_id={
                                    selectedProduct?.data?.product_id ||
                                    selectedProduct?.data?.gift_id ||
                                    selectedProduct?.data?.shop_id ||
                                    selectedProduct?.data?.premium_id
                                }
                            />
                        )}
                    </>
                )}

                {!isDetailsOpen && selectedBottomTab === "Home" && (
                    <>
                        {selectedMenu === "Cards" && (
                            <Cards
                                key={`cards-${navKey}`}
                                setCartCount={setCartCount}
                                onOpenDetails={handleOpenDetails}
                                search={search}
                                filter={filter}
                                setFilter={setFilter}
                                setCategories={setCategories}
                                setSuggestionData={setCardSuggestionsData}
                            />
                        )}

                        {selectedMenu === "Gifts" && (
                            <Gift
                                key={`gift-${navKey}`}
                                user={user}
                                setCartCount={setCartCount}
                                onOpenDetails={handleOpenDetails}
                                search={search}
                                filter={filter}
                                giftCategoryPage={giftCategoryPage}
                                setGiftCategoryPage={setGiftCategoryPage}
                                selectedGiftCategory={selectedGiftCategory}
                                setSelectedGiftCategory={
                                    setSelectedGiftCategory
                                }
                                allGiftCategoriesPage={allGiftCategoriesPage}
                                setAllGiftCategoriesPage={
                                    setAllGiftCategoriesPage
                                }
                                allGiftsPage={allGiftsPage}
                                setAllGiftsPage={setAllGiftsPage}
                                setSuggestionData={setGiftSuggestionsData}
                                goTo={goTo}
                            />
                        )}

                        {selectedMenu === "Shop" && (
                            <Shop
                                key={`shop-${navKey}`}
                                user={user}
                                setCartCount={setCartCount}
                                onOpenDetails={handleOpenDetails}
                                search={search}
                                filter={filter}
                                shopCategoryPage={shopCategoryPage}
                                setShopCategoryPage={setShopCategoryPage}
                                selectedShopCategory={selectedShopCategory}
                                setSelectedShopCategory={
                                    setSelectedShopCategory
                                }
                                allShopCategoriesPage={allShopCategoriesPage}
                                setAllShopCategoriesPage={
                                    setAllShopCategoriesPage
                                }
                                allShopsPage={allShopsPage}
                                setAllShopsPage={setAllShopsPage}
                                setSuggestionData={setShopSuggestionsData}
                                goTo={goTo}
                            />
                        )}
                    </>
                )}

                {!isDetailsOpen && selectedBottomTab === "Offers" && <Offer />}

                {!isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "profile" && (
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
                    )}

                {!isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "viewprofile" && (
                        <ViewProfile
                            profile={profile}
                            setProfilePage={setProfilePage}
                            navigateWithLoading={navigateWithLoading}
                        />
                    )}

                {!isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "address" && (
                        <MyAddresses
                            setProfilePage={setProfilePage}
                            selectedAddress={selectedAddress}
                            setSelectedAddress={setSelectedAddress}
                            navigateWithLoading={navigateWithLoading}
                        />
                    )}

                {!isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "wishlist" && (
                        <MyWishlist
                            setProfilePage={setProfilePage}
                            onOpenDetails={handleOpenDetails}
                        />
                    )}

                {!isDetailsOpen &&
                    selectedBottomTab === "Cart" &&
                    profilePage === "cart" && (
                        <MyCart
                            setProfilePage={setProfilePage}
                            setOrderData={setOrderData}
                            setBuyNowFromDetails={setBuyNowFromDetails}
                            onOpenDetails={handleOpenDetails}
                            setSelectedBottomTab={setSelectedBottomTab}
                            setCartCount={setCartCount}
                        />
                    )}

                {!isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "productorder" && (
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
                    )}

                {!isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "cardorder" && (
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
                    )}

                {!isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "orders" && (
                        <MyOrders
                            setProfilePage={setProfilePage}
                            selectedOrder={selectedOrder}
                            setSelectedOrder={setSelectedOrder}
                            navigateWithLoading={navigateWithLoading}
                        />
                    )}

                {!isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "rewards" && (
                        <Rewards setProfilePage={setProfilePage} />
                    )}

                {!isDetailsOpen && profilePage === "order-details" && (
                    <OrderItemDetails
                        order={selectedOrder}
                        setProfilePage={setProfilePage}
                        onOpenDetails={handleOpenDetails}
                        setSelectedTrackingOrder={setSelectedTrackingOrder}
                        setSelectedInvoice={setSelectedInvoice}
                        navigateWithLoading={navigateWithLoading}
                    />
                )}

                {profilePage === "invoice" && (
                    <ItemInvoice
                        setProfilePage={setProfilePage}
                        order_id={selectedInvoice?.order_id}
                        product_id={selectedInvoice?.product_id}
                    />
                )}

                {profilePage === "payment" && (
                    <Payment
                        setProfilePage={setProfilePage}
                        orderData={orderData}
                    />
                )}

                {profilePage === "ordersuccess" && (
                    <OrderSuccess setProfilePage={setProfilePage} />
                )}

                {!isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "help" && (
                        <HelpAndSupport setProfilePage={setProfilePage} />
                    )}

                {!isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "about" && (
                        <AboutAerodeck setProfilePage={setProfilePage} />
                    )}

                {!isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "terms" && (
                        <Terms setProfilePage={setProfilePage} />
                    )}

                {!isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "editprofile" && (
                        <EditProfile
                            profile={profile}
                            setProfile={setProfile}
                            setProfilePage={setProfilePage}
                            navigateWithLoading={navigateWithLoading}
                        />
                    )}

                {!isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "addaddress" && (
                        <AddAddress setProfilePage={setProfilePage} />
                    )}

                {!isDetailsOpen &&
                    selectedBottomTab === "Profile" &&
                    profilePage === "editaddress" && (
                        <EditAddress setProfilePage={setProfilePage} />
                    )}
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