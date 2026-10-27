import { useEffect, useState, useRef, useCallback, useMemo, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../../services/api";
import "../../styles/Home.css";
import useHomeRouting from "./useHomeRouting";
import {
    Header, Search, Cards, Gift, Shop, BottomNav, Details, Profile, MyWishlist,
    MyCart, MyOrders, AboutAerodeck, EditProfile, AddAddress, EditAddress,
    ProductOrder, OrderSuccess, OrderItemDetails, ViewProfile, Terms, Address,
    Rewards, DemoRedeemRewards, MyLikes, MyReviews, Settings, AllReview, AllMedia,
    TOPHEADER, ViewAddress, Offers, Medicure, BookNow, ViewTicket
} from "./lazyImports";

const TAB_KEY = "selectedBottomTab";
const MENU_KEY = "selectedMenu";
const REFRESH_THRESHOLD = 80;
const REFRESH_DURATION = 600;
const SCROLL_DELTA = 4;
const VALID_TABS = ["Home", "Offers", "Cart", "Profile", "Premium"];

const getInitialTab = () => {
    const saved = localStorage.getItem(TAB_KEY);
    return VALID_TABS.includes(saved) ? saved : "Home";
};

const getProductId = (p) =>
    p?.data?.product_id || p?.data?.gift_id || p?.data?.shop_id || p?.data?.premium_id || p?.data?.medicine_id;

const getSession = () => localStorage.getItem("session_token");

function Home({ user, setPage, goTo, cartCount, setCartCount }) {
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedMenu, setSelectedMenu] = useState("Shop");
    const [selectedBottomTab, setSelectedBottomTab] = useState(getInitialTab);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState({ category: "All", sort: "", rating: 0, availableOnly: false });
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
    const [hideCategories, setHideCategories] = useState(false);

    const touchStartYRef = useRef(0);
    const homeContentRef = useRef(null);
    const lastScrollTopRef = useRef(0);
    const rafRef = useRef(null);
    const isDetailsOpenRef = useRef(isDetailsOpen);

    useEffect(() => {
        isDetailsOpenRef.current = isDetailsOpen;
    }, [isDetailsOpen]);

    const handleTouchStart = useCallback((e) => {
        const container = homeContentRef.current;
        if (!container || isRefreshing) return;
        touchStartYRef.current = container.scrollTop <= 0 ? e.touches[0].clientY : null;
    }, [isRefreshing]);

    const handleTouchMove = useCallback((e) => {
        if (touchStartYRef.current === null || isRefreshing) return;
        const container = homeContentRef.current;
        if (!container || container.scrollTop > 0) {
            touchStartYRef.current = null;
            setPullDistance(0);
            return;
        }
        const diff = e.touches[0].clientY - touchStartYRef.current;
        if (diff > 0) setPullDistance(Math.min(diff * 0.5, 120));
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
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    if (container) container.scrollTop = savedScroll;
                }));
            }, REFRESH_DURATION);
        } else {
            setPullDistance(0);
        }
        touchStartYRef.current = null;
    }, [pullDistance, isRefreshing]);

    const handleContentScroll = useCallback((e) => {
        if (rafRef.current) return;
        const top = e.currentTarget.scrollTop;
        rafRef.current = requestAnimationFrame(() => {
            const dTop = top - lastScrollTopRef.current;
            if (dTop > SCROLL_DELTA && top > 20) {
                setHideCategories((prev) => (prev ? prev : true));
            } else if (dTop < -SCROLL_DELTA || top <= 0) {
                setHideCategories((prev) => (prev ? false : prev));
            }
            lastScrollTopRef.current = top;
            rafRef.current = null;
        });
    }, []);

    const handleRefresh = useCallback(() => setNavKey((prev) => prev + 1), []);

    useHomeRouting({
        setSelectedBottomTab, setSelectedMenu, setProfilePage, setSelectedProduct,
        setIsDetailsOpen, setDetailsPage, setSelectedShopCategory, setSelectedGiftCategory,
        setShopCategoryPage, setGiftCategoryPage, setAllShopCategoriesPage,
        setAllGiftCategoriesPage, setAllGiftsPage, setSelectedOrder,
    });

    useEffect(() => {
        localStorage.setItem(MENU_KEY, selectedMenu);
    }, [selectedMenu]);

    useEffect(() => {
        if (selectedBottomTab === null) return localStorage.removeItem(TAB_KEY);
        localStorage.setItem(TAB_KEY, selectedBottomTab);
    }, [selectedBottomTab]);

    const fetchProfile = useCallback(() => {
        fetch(`${API}/api/user/profile`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_token: getSession() }),
        })
            .then((r) => r.json())
            .then((data) => { if (data.success) setProfile(data.user); })
            .catch((err) => console.error("Profile load error:", err.message));
    }, []);

    useEffect(() => { fetchProfile(); }, [fetchProfile]);

    useEffect(() => {
        const handleBackNavigation = () => {
            const path = window.location.pathname;
            if (path === "/offers" || path === "/medicure" || path.includes("/medicure/ticket/") || path.includes("/medicure/book/")) {
                setSelectedBottomTab(path === "/offers" ? "Offers" : "Premium");
                setProfilePage("profile");
                setIsDetailsOpen(false);
                return;
            }
            if (path.includes("/profile/")) {
                const profilePath = path.replace("/profile/", "").split("/")[0];
                setSelectedBottomTab("Profile");
                setProfilePage(!profilePath || profilePath === "profile" ? "profile" : profilePath);
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
            if (path.includes("/product/")) {
                setDetailsPage("details");
                setIsDetailsOpen(true);
                return;
            }
            if (isDetailsOpenRef.current) {
                setIsDetailsOpen(false);
                setSelectedProduct(null);
                setDetailsPage("details");
            }
        };
        window.addEventListener("popstate", handleBackNavigation);
        return () => window.removeEventListener("popstate", handleBackNavigation);
    }, []);

    useEffect(() => {
        if (detailsPage !== "details") return;
        const savedScroll = sessionStorage.getItem("detailsScrollPosition");
        if (!savedScroll) return;
        const container = homeContentRef.current;
        if (!container) return;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            container.scrollTop = Number(savedScroll);
            sessionStorage.removeItem("detailsScrollPosition");
        }));
    }, [detailsPage]);

    const handleLogout = useCallback(async () => {
        try {
            await fetch(`${API}/api/auth/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: getSession() }),
            });
        } catch (err) {
            console.error("Logout error:", err.message);
        }
        localStorage.removeItem("session_token");
        setPage("login");
    }, [setPage]);

    const handleOpenDetails = useCallback((product, type) => {
        setDetailsBackPage({ selectedBottomTab, profilePage, selectedMenu, pathname: location.pathname });
        setDetailsPage("details");
        setSelectedProduct({ type, data: product });
        setIsDetailsOpen(true);
        const id = getProductId({ data: product });
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
    }, [selectedBottomTab, profilePage, selectedMenu, location.pathname, goTo]);

    const handleCloseDetails = useCallback(() => {
        const currentPath = location.pathname;
        if (currentPath.endsWith("/reviews") || currentPath.endsWith("/media")) {
            setDetailsPage("details");
            goTo(currentPath.replace(/\/reviews$/, "").replace(/\/media$/, ""));
            return;
        }
        if (currentPath.includes("/product/")) {
            if (detailsBackPage) {
                setSelectedBottomTab(detailsBackPage.selectedBottomTab);
                setProfilePage(detailsBackPage.profilePage);
                setSelectedMenu(detailsBackPage.selectedMenu);
            }
            setDetailsPage("details");
            setSelectedProduct(null);
            setIsDetailsOpen(false);
            goTo(currentPath.split("/product/")[0]);
            return;
        }
        setDetailsPage("details");
        setSelectedProduct(null);
        setIsDetailsOpen(false);
        if (detailsBackPage?.pathname) goTo(detailsBackPage.pathname);
    }, [location.pathname, detailsBackPage, goTo]);

    const showMainHeader = useMemo(() =>
        !isDetailsOpen &&
        ["Home", "Premium", "Offers"].includes(selectedBottomTab) &&
        !allShopCategoriesPage && !allShopsPage && !allGiftCategoriesPage &&
        !allGiftsPage && !shopCategoryPage && !giftCategoryPage,
        [isDetailsOpen, selectedBottomTab, allShopCategoriesPage, allShopsPage,
            allGiftCategoriesPage, allGiftsPage, shopCategoryPage, giftCategoryPage]
    );

    const isProfilePage = useCallback(
        (page) => !isDetailsOpen && selectedBottomTab === "Profile" && profilePage === page,
        [isDetailsOpen, selectedBottomTab, profilePage]
    );

    const showBottomNav = useMemo(() =>
        !isDetailsOpen &&
        (["Home", "Cart", "Offers", "Premium"].includes(selectedBottomTab) ||
            (selectedBottomTab === "Profile" && profilePage === "profile")),
        [isDetailsOpen, selectedBottomTab, profilePage]
    );

    const isBookPage = useMemo(() => location.pathname.includes("/book/"), [location.pathname]);
    const isTicketPage = useMemo(() => location.pathname.includes("/ticket/"), [location.pathname]);

    const onOpenCart = useCallback(() => {
        setIsDetailsOpen(false);
        setSelectedProduct(null);
        setDetailsPage("details");
        setSelectedBottomTab("Cart");
        setProfilePage("cart");
        navigate("/cart");
    }, [navigate]);

    const onBuyNow = useCallback((buyNowItem, orderType) => {
        setBuyNowFromDetails(true);
        setOrderData({ items: [buyNowItem], orderType });
        setIsDetailsOpen(false);
        setSelectedProduct(null);
        setSelectedBottomTab("Profile");
        setProfilePage(orderType === "products" ? "productorder" : "cardorder");
    }, []);

    const onViewAllReviews = useCallback(() => {
        setDetailsPage("allreview");
        navigate(`${location.pathname}/reviews`);
    }, [navigate, location.pathname]);

    const onViewAllMedia = useCallback(() => {
        setDetailsPage("allmedia");
        navigate(`${location.pathname}/media`);
    }, [navigate, location.pathname]);

    const renderAddressBar = () => (
        <div className="home-address">
            <Address setProfilePage={setProfilePage} setSelectedBottomTab={setSelectedBottomTab} />
        </div>
    );

    return (
        <div className="home-container">
            <Suspense fallback={null}>
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
                            onOpenCart={onOpenCart}
                        />
                        {renderAddressBar()}
                    </>
                )}

                {!isDetailsOpen && selectedBottomTab === "Home" && (
                    <>
                        {allShopCategoriesPage && (
                            <>
                                <TOPHEADER
                                    title="All Categories"
                                    onBack={() => { setAllShopCategoriesPage(false); goTo("/home/shop", { replace: true }); }}
                                />
                                {renderAddressBar()}
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
                                {renderAddressBar()}
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

                {!isDetailsOpen && selectedBottomTab === "Premium" && !isBookPage && !isTicketPage && (
                    <Search
                        selectedMenu="Shop"
                        search={search}
                        setSearch={setSearch}
                        categoryName={null}
                        filter={filter}
                        setFilter={setFilter}
                        categories={[]}
                        cards={[]}
                        gifts={[]}
                        shops={[]}
                        premiums={[]}
                    />
                )}

                <div
                    className={`home-content ${showBottomNav ? "has-bottom-nav" : ""}`}
                    ref={homeContentRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onScroll={handleContentScroll}
                >
                    <div
                        className="pull-refresh-indicator"
                        style={{ height: `${pullDistance}px`, opacity: pullDistance > 0 ? 1 : 0 }}
                    >
                        <div className={`pull-refresh-icon ${pullDistance >= REFRESH_THRESHOLD ? "ready" : ""} ${isRefreshing ? "spinning" : ""}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 2v6h-6" />
                                <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                                <path d="M3 22v-6h6" />
                                <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                            </svg>
                        </div>
                        <span className="pull-refresh-text">
                            {isRefreshing ? "Refreshing..." : pullDistance >= REFRESH_THRESHOLD ? "Release to refresh" : "Pull down to refresh"}
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
                                    onViewAll={onViewAllReviews}
                                    onViewAllMedia={onViewAllMedia}
                                    onBuyNow={onBuyNow}
                                />
                            </div>
                            {detailsPage === "allreview" && <AllReview product_id={getProductId(selectedProduct)} />}
                            {detailsPage === "allmedia" && (
                                <AllMedia
                                    onBack={() => { setDetailsPage("details"); goTo(location.pathname.replace(/\/media$/, "")); }}
                                    product_id={getProductId(selectedProduct)}
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
                                    hideCategories={hideCategories}
                                    onShowCategories={() => setHideCategories(false)}
                                />
                            )}
                        </>
                    )}

                    {!isDetailsOpen && selectedBottomTab === "Offers" && <Offers />}

                    {!isDetailsOpen && selectedBottomTab === "Premium" && !isBookPage && !isTicketPage && (
                        <Medicure
                            key={navKey}
                            search={search}
                            filter={filter}
                            setCartCount={setCartCount}
                            onOpenDetails={handleOpenDetails}
                            onBuyNow={onBuyNow}
                        />
                    )}

                    {!isDetailsOpen && selectedBottomTab === "Premium" && isBookPage && <BookNow />}
                    {!isDetailsOpen && selectedBottomTab === "Premium" && isTicketPage && <ViewTicket />}

                    {isProfilePage("profile") && (
                        <Profile
                            key={profilePage + "-" + (user?.user_id || "")}
                            user={user}
                            profile={profile}
                            setProfile={setProfile}
                            setPage={setPage}
                            onLogout={handleLogout}
                            setProfilePage={setProfilePage}
                        />
                    )}

                    {isProfilePage("viewprofile") && <ViewProfile profile={profile} setProfilePage={setProfilePage} />}
                    {isProfilePage("viewaddress") && <ViewAddress setProfilePage={setProfilePage} />}
                    {isProfilePage("wishlist") && <MyWishlist key={`wishlist-${navKey}`} setProfilePage={setProfilePage} onOpenDetails={handleOpenDetails} />}

                    {!isDetailsOpen && selectedBottomTab === "Cart" && profilePage === "cart" && (
                        <MyCart
                            key={`cart-${navKey}`}
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
                            key={`orders-${navKey}`}
                            setProfilePage={setProfilePage}
                            setSelectedOrder={setSelectedOrder}
                        />
                    )}

                    {isProfilePage("rewards") && <Rewards setProfilePage={setProfilePage} />}
                    {isProfilePage("demoredeem") && <DemoRedeemRewards setProfilePage={setProfilePage} />}
                    {isProfilePage("likes") && (
                        <MyLikes key={`likes-${navKey}`} setProfilePage={setProfilePage} onOpenDetails={handleOpenDetails} />
                    )}
                    {isProfilePage("reviews") && (
                        <MyReviews key={`reviews-${navKey}`} setProfilePage={setProfilePage} onOpenDetails={handleOpenDetails} />
                    )}
                    {isProfilePage("settings") && (
                        <Settings setProfilePage={setProfilePage} userId={user?.user_id} />
                    )}

                    {!isDetailsOpen && profilePage === "order-details" && (
                        <OrderItemDetails
                            key={`order-${navKey}`}
                            order={selectedOrder}
                            setProfilePage={setProfilePage}
                            onOpenDetails={handleOpenDetails}
                            setSelectedTrackingOrder={setSelectedTrackingOrder}
                            setSelectedInvoice={setSelectedInvoice}
                        />
                    )}

                    {profilePage === "ordersuccess" && <OrderSuccess setProfilePage={setProfilePage} />}
                    {isProfilePage("about") && <AboutAerodeck setProfilePage={setProfilePage} />}
                    {isProfilePage("terms") && <Terms setProfilePage={setProfilePage} />}

                    {isProfilePage("editprofile") && (
                        <EditProfile
                            profile={profile}
                            setProfile={setProfile}
                            setProfilePage={setProfilePage}
                        />
                    )}

                    {isProfilePage("addaddress") && <AddAddress setProfilePage={setProfilePage} />}
                    {isProfilePage("editaddress") && <EditAddress setProfilePage={setProfilePage} />}
                </div>

                {showBottomNav && (
                    <BottomNav
                        user={user}
                        selectedBottomTab={selectedBottomTab}
                        setSelectedBottomTab={setSelectedBottomTab}
                        setSelectedMenu={setSelectedMenu}
                        isDetailsOpen={isDetailsOpen}
                        closeDetails={handleCloseDetails}
                        setProfilePage={setProfilePage}
                        cartCount={cartCount}
                        setCartCount={setCartCount}
                    />
                )}
            </Suspense>
        </div>
    );
}

export default Home;