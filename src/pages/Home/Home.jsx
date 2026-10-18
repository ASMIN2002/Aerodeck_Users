import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../../services/api";

import "../../styles/Home.css";

import Header from "../../2Process/process/Header";
import Search from "../../2Process/process/Search";
import Cards from "../../components/Cards/Cards";
import Gift from "../../components/Gift/Gift";
import Shop from "../../components/Shop/Shop";
import Offer from "../../components/Offer/Offer";
import BottomNav from "../../2Process/process/BottomNav";
import Details from "../../8Details/detail/Details";
import Profile from "../../4Profile/profile/Profile";
import MyWishlist from "../../4Profile/profile/Wishlist";
import MyCart from "../../5Cart/cart/MyCart";
import MyOrders from "../../4Profile/profile/Orders";
import AboutAerodeck from "../../4Profile/profile/AboutHeepit";
import EditProfile from "../../4Profile/profileDetails/editprofile/EditProfile";
import AddAddress from "../../4Profile/profileDetails/editaddress/AddAddress";
import EditAddress from "../../4Profile/profileDetails/editaddress/EditAddress";
import ProductOrder from "../../6PlaceOrder/placeorder/ProductOrder";
import OrderSuccess from "../../6PlaceOrder/placeorder/OrderSuccess";
import OrderItemDetails from "../../6PlaceOrder/placeorder/OrderItemDetails";
import ViewProfile from "../../4Profile/profileDetails/editprofile/ViewProfile";
import Terms from "../../4Profile/profile/TandC";
import Address from "../../2Process/process/Address";
import Rewards from "../../4Profile/profile/Rewards";
import DemoRedeemRewards from "../../4Profile/profileDetails/DemoRedeemRewards";
import MyLikes from "../../4Profile/profile/Likes";
import MyReviews from "../../4Profile/profile/MyReviews";
import Settings from "../../4Profile/profile/Settings";
import AllReview from "../../8Details/detail/AllReview";
import AllMedia from "../../8Details/detail/AllMedia";
import TOPHEADER from "../../2Process/process/TopHeader";
import useHomeRouting from "./useHomeRouting";
import ViewAddress from "../../4Profile/profileDetails/editaddress/ViewAddress";

const TAB_KEY = "selectedBottomTab";
const MENU_KEY = "selectedMenu";
const REFRESH_THRESHOLD = 80;
const REFRESH_DURATION = 600;

function getInitialTab() {
    const saved = localStorage.getItem(TAB_KEY);
    return ["Home", "Offers", "Cart", "Profile"].includes(saved) ? saved : "Home";
}

function Home({ user, setPage, navigateWithLoading, goTo, cartCount, setCartCount }) {
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedMenu, setSelectedMenu] = useState("Shop");
    const [selectedBottomTab, setSelectedBottomTab] = useState(getInitialTab);
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
    const [profileImageRefresh] = useState(0);

    const [navKey, setNavKey] = useState(0);
    const [orderData, setOrderData] = useState({ items: [], orderType: "" });
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

    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const touchStartYRef = useRef(0);
    const homeContentRef = useRef(null);

    const handleTouchStart = useCallback((e) => {
        const container = homeContentRef.current;
        if (!container || isRefreshing) return;

        if (container.scrollTop <= 0) {
            touchStartYRef.current = e.touches[0].clientY;
        } else {
            touchStartYRef.current = 0;
        }
    }, [isRefreshing]);

    const handleTouchMove = useCallback((e) => {
        if (!touchStartYRef.current || isRefreshing) return;

        const container = homeContentRef.current;
        if (!container || container.scrollTop > 0) {
            touchStartYRef.current = 0;
            setPullDistance(0);
            return;
        }

        const diff = e.touches[0].clientY - touchStartYRef.current;
        if (diff > 0) {
            setPullDistance(Math.min(diff * 0.5, 120));
        }
    }, [isRefreshing]);

    const handleTouchEnd = useCallback(() => {
        const container = homeContentRef.current;
        if (!container) return;

        if (pullDistance >= REFRESH_THRESHOLD && !isRefreshing) {
            setIsRefreshing(true);
            const savedScroll = container.scrollTop;

            setTimeout(() => {
                setNavKey((prev) => prev + 1);
                setIsRefreshing(false);
                setPullDistance(0);

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        if (container) container.scrollTop = savedScroll;
                    });
                });
            }, REFRESH_DURATION);
        } else {
            setPullDistance(0);
        }

        touchStartYRef.current = 0;
    }, [pullDistance, isRefreshing]);

    const handleRefresh = useCallback(() => {
        setNavKey((prev) => prev + 1);
    }, []);

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
        setAllGiftCategoriesPage,
        setAllGiftsPage,
        setSelectedOrder,
    });

    useEffect(() => {
        localStorage.setItem(MENU_KEY, selectedMenu);
    }, [selectedMenu]);

    useEffect(() => {
        if (selectedBottomTab === null) {
            localStorage.removeItem(TAB_KEY);
            return;
        }
        localStorage.setItem(TAB_KEY, selectedBottomTab);
    }, [selectedBottomTab]);

    useEffect(() => {
        async function loadProfile() {
            try {
                const response = await fetch(`${API}/api/user/profile`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        session_token: localStorage.getItem("session_token"),
                    }),
                });
                const data = await response.json();
                if (data.success) setProfile(data.user);
            } catch (err) {
                console.error("Profile load error:", err.message);
            }
        }
        loadProfile();
    }, [navKey]);

    useEffect(() => {
        const handleBackNavigation = () => {
            const path = window.location.pathname;

            if (path.includes("/profile/")) {
                const profilePath = path.replace("/profile/", "").split("/")[0];

                if (!profilePath || profilePath === "profile") {
                    setSelectedBottomTab("Profile");
                    setProfilePage("profile");
                    return;
                }

                setSelectedBottomTab("Profile");
                setProfilePage(profilePath);
                return;
            }

            if (path === "/profile") {
                setSelectedBottomTab("Profile");
                setProfilePage("profile");
                return;
            }

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
            }
        };

        window.addEventListener("popstate", handleBackNavigation);
        return () => window.removeEventListener("popstate", handleBackNavigation);
    }, [isDetailsOpen]);

    useEffect(() => {
        if (detailsPage !== "details") return;
        const savedScroll = sessionStorage.getItem("detailsScrollPosition");
        if (!savedScroll) return;
        const homeContent = homeContentRef.current;
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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_token: localStorage.getItem("session_token"),
                }),
            });
        } catch (err) {
            console.error("Logout error:", err.message);
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

        setDetailsPage("details");
        setSelectedProduct({ type, data: product });
        setIsDetailsOpen(true);

        const id = product.product_id || product.gift_id || product.shop_id || product.premium_id;
        const inProduct = location.pathname.includes("/product/");
        const productUrl = inProduct
            ? `${location.pathname.split("/product/")[0]}/product/${id}`
            : `${location.pathname}/product/${id}`;

        if (inProduct) {
            window.history.replaceState({}, "", productUrl);
            window.dispatchEvent(new PopStateEvent("popstate"));
        } else {
            goTo(productUrl);
        }
    };

    const handleCloseDetails = () => {
        const currentPath = location.pathname;

        if (currentPath.endsWith("/reviews") || currentPath.endsWith("/media")) {
            const productPath = currentPath.replace(/\/reviews$/, "").replace(/\/media$/, "");
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
        if (detailsBackPage?.pathname) goTo(detailsBackPage.pathname);
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

    const isProfilePage = (page) =>
        !isDetailsOpen && selectedBottomTab === "Profile" && profilePage === page;

    const getProductId = () =>
        selectedProduct?.data?.product_id ||
        selectedProduct?.data?.gift_id ||
        selectedProduct?.data?.shop_id ||
        selectedProduct?.data?.premium_id;

    const showBottomNav =
        !isDetailsOpen &&
        (
            selectedBottomTab === "Home" ||
            selectedBottomTab === "Cart" ||
            selectedBottomTab === "Offers" ||
            (selectedBottomTab === "Profile" && profilePage === "profile")
        );

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
                        onReloadHome={handleRefresh}
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

                    <Search
                        selectedMenu={selectedMenu}
                        search={search}
                        setSearch={setSearch}
                        categoryName={shopCategoryPage ? selectedShopCategory : null}
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

            <div
                className={`home-content ${showBottomNav ? "has-bottom-nav" : ""}`}
                ref={homeContentRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className="pull-refresh-indicator"
                    style={{
                        height: `${pullDistance}px`,
                        opacity: pullDistance > 0 ? 1 : 0,
                    }}
                >
                    <div
                        className={`pull-refresh-icon ${pullDistance >= REFRESH_THRESHOLD ? "ready" : ""} ${isRefreshing ? "spinning" : ""}`}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 2v6h-6" />
                            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                            <path d="M3 22v-6h6" />
                            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                        </svg>
                    </div>
                    <span className="pull-refresh-text">
                        {isRefreshing
                            ? "Refreshing..."
                            : pullDistance >= REFRESH_THRESHOLD
                                ? "Release to refresh"
                                : "Pull down to refresh"}
                    </span>
                </div>

                {isDetailsOpen && (
                    <>
                        <div style={{ display: detailsPage === "details" ? "block" : "none" }}>
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
                                    setOrderData({ items: [buyNowItem], orderType });
                                    setIsDetailsOpen(false);
                                    setSelectedProduct(null);
                                    setSelectedBottomTab("Profile");
                                    setProfilePage(orderType === "products" ? "productorder" : "cardorder");
                                }}
                            />
                        </div>

                        {detailsPage === "allreview" && (
                            <AllReview product_id={getProductId()} />
                        )}

                        {detailsPage === "allmedia" && (
                            <AllMedia
                                onBack={() => {
                                    const parentPath = location.pathname.replace(/\/media$/, "");
                                    setDetailsPage("details");
                                    goTo(parentPath);
                                }}
                                product_id={getProductId()}
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
                                setSelectedGiftCategory={setSelectedGiftCategory}
                                allGiftCategoriesPage={allGiftCategoriesPage}
                                setAllGiftCategoriesPage={setAllGiftCategoriesPage}
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
                                setSelectedShopCategory={setSelectedShopCategory}
                                allShopCategoriesPage={allShopCategoriesPage}
                                setAllShopCategoriesPage={setAllShopCategoriesPage}
                                setSuggestionData={setShopSuggestionsData}
                                goTo={goTo}
                            />
                        )}
                    </>
                )}

                {!isDetailsOpen && selectedBottomTab === "Offers" && <Offer />}

                {isProfilePage("profile") && (
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

                {isProfilePage("viewprofile") && (
                    <ViewProfile
                        profile={profile}
                        setProfilePage={setProfilePage}
                        navigateWithLoading={navigateWithLoading}
                    />
                )}

                {isProfilePage("viewaddress") && (
                    <ViewAddress
                        setProfilePage={setProfilePage}
                        navigateWithLoading={navigateWithLoading}
                    />
                )}

                {isProfilePage("wishlist") && (
                    <MyWishlist setProfilePage={setProfilePage} onOpenDetails={handleOpenDetails} />
                )}

                {!isDetailsOpen && selectedBottomTab === "Cart" && profilePage === "cart" && (
                    <MyCart
                        setProfilePage={setProfilePage}
                        setOrderData={setOrderData}
                        setBuyNowFromDetails={setBuyNowFromDetails}
                        onOpenDetails={handleOpenDetails}
                        setSelectedBottomTab={setSelectedBottomTab}
                        setCartCount={setCartCount}
                    />
                )}

                {isProfilePage("productorder") && (
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

                {isProfilePage("orders") && (
                    <MyOrders
                        setProfilePage={setProfilePage}
                        selectedOrder={selectedOrder}
                        setSelectedOrder={setSelectedOrder}
                        navigateWithLoading={navigateWithLoading}
                    />
                )}

                {isProfilePage("rewards") && <Rewards setProfilePage={setProfilePage} />}

                {isProfilePage("demoredeem") && (
                    <DemoRedeemRewards setProfilePage={setProfilePage} />
                )}

                {isProfilePage("likes") && (
                    <MyLikes
                        key={`likes-${navKey}`}
                        setProfilePage={setProfilePage}
                        onOpenDetails={handleOpenDetails}
                    />
                )}

                {isProfilePage("reviews") && (
                    <MyReviews
                        key={`reviews-${navKey}`}
                        setProfilePage={setProfilePage}
                        onOpenDetails={handleOpenDetails}
                    />
                )}

                {isProfilePage("settings") && (
                    <Settings
                        setProfilePage={setProfilePage}
                        userId={user?.user_id}
                        navigateWithLoading={navigateWithLoading}
                    />
                )}

                {!isDetailsOpen && profilePage === "order-details" && (
                    <OrderItemDetails
                        key={`order-${navKey}`}
                        order={selectedOrder}
                        setProfilePage={setProfilePage}
                        onOpenDetails={handleOpenDetails}
                        setSelectedTrackingOrder={setSelectedTrackingOrder}
                        setSelectedInvoice={setSelectedInvoice}
                        navigateWithLoading={navigateWithLoading}
                    />
                )}

                {profilePage === "ordersuccess" && (
                    <OrderSuccess setProfilePage={setProfilePage} />
                )}

                {isProfilePage("help") && <HelpAndSupport setProfilePage={setProfilePage} />}

                {isProfilePage("about") && <AboutAerodeck setProfilePage={setProfilePage} />}

                {isProfilePage("terms") && <Terms setProfilePage={setProfilePage} />}

                {isProfilePage("editprofile") && (
                    <EditProfile
                        profile={profile}
                        setProfile={setProfile}
                        setProfilePage={setProfilePage}
                        navigateWithLoading={navigateWithLoading}
                    />
                )}

                {isProfilePage("addaddress") && <AddAddress setProfilePage={setProfilePage} />}

                {isProfilePage("editaddress") && <EditAddress setProfilePage={setProfilePage} />}
            </div>

            {showBottomNav && (
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
            )}
        </div>
    );
}

export default Home;