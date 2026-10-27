import { Suspense, memo } from "react";
import "../../styles/Home.css";
import useHomeBackend from "./homeBackend";
import {
    Header, Search, Cards, Gift, Shop, BottomNav, Details, Profile, MyWishlist,
    MyCart, MyOrders, AboutAerodeck, EditProfile, AddAddress, EditAddress,
    ProductOrder, OrderSuccess, OrderItemDetails, ViewProfile, Terms, Address,
    Rewards, DemoRedeemRewards, MyLikes, MyReviews, Settings, AllReview, AllMedia,
    TOPHEADER, ViewAddress, Offers, Medicure, BookNow, ViewTicket
} from "./lazyImports";
const Loader = () => <div className="home-loader"><div className="spinner" /></div>;
const AddressBar = memo(({ setProfilePage, setSelectedBottomTab }) => (
    <div className="home-address">
        <Address setProfilePage={setProfilePage} setSelectedBottomTab={setSelectedBottomTab} />
    </div>
));
function Home({ user, setPage, goTo, cartCount, setCartCount }) {
    const b = useHomeBackend({ user, setPage, cartCount, setCartCount, goTo });
    return (
        <div className="home-container">
            <Suspense fallback={<Loader />}>
                {b.view.showMainHeader && (
                    <>
                        <Header
                            selectedMenu={b.selectedMenu}
                            setSelectedMenu={b.setSelectedMenu}
                            isMenuOpen={b.isMenuOpen}
                            setSelectedBottomTab={b.setSelectedBottomTab}
                            setIsMenuOpen={b.setIsMenuOpen}
                            selectedBottomTab={b.selectedBottomTab}
                            cartCount={cartCount}
                            isDetailsOpen={b.isDetailsOpen}
                            closeDetails={b.handleCloseDetails}
                            userId={user?.user_id}
                            onReloadHome={b.handleRefresh}
                            onOpenCart={b.onOpenCart}
                        />
                        <AddressBar setProfilePage={b.setProfilePage} setSelectedBottomTab={b.setSelectedBottomTab} />
                    </>
                )}
                {!b.isDetailsOpen && b.view.isHome && (
                    <>
                        {b.allShopCategoriesPage && (
                            <>
                                <TOPHEADER
                                    title="All Categories"
                                    onBack={() => { b.setAllShopCategoriesPage(false); b.navigate("/home/shop", { replace: true }); }}
                                />
                                <AddressBar setProfilePage={b.setProfilePage} setSelectedBottomTab={b.setSelectedBottomTab} />
                            </>
                        )}
                        {b.shopCategoryPage && (
                            <>
                                <TOPHEADER
                                    title={b.selectedShopCategory}
                                    onBack={() => {
                                        b.setSelectedShopCategory(null);
                                        b.setShopCategoryPage(false);
                                        b.navigate("/home/shop", { replace: true });
                                    }}
                                />
                                <AddressBar setProfilePage={b.setProfilePage} setSelectedBottomTab={b.setSelectedBottomTab} />
                            </>
                        )}
                        <Search
                            selectedMenu={b.selectedMenu}
                            search={b.search}
                            setSearch={b.setSearch}
                            categoryName={b.shopCategoryPage ? b.selectedShopCategory : null}
                            filter={b.filter}
                            setFilter={b.setFilter}
                            categories={b.categories}
                            cards={b.cardSuggestionsData}
                            gifts={b.giftSuggestionsData}
                            shops={b.shopSuggestionsData}
                            premiums={b.premiumSuggestionsData}
                        />
                    </>
                )}
                {!b.isDetailsOpen && b.selectedBottomTab === "Premium" && !b.isBookPage && !b.isTicketPage && (
                    <Search
                        selectedMenu="Shop"
                        search={b.search}
                        setSearch={b.setSearch}
                        categoryName={null}
                        filter={b.filter}
                        setFilter={b.setFilter}
                        categories={[]}
                        cards={[]}
                        gifts={[]}
                        shops={[]}
                        premiums={[]}
                    />
                )}
                <div
                    className={`home-content ${b.view.showBottomNav ? "has-bottom-nav" : ""}`}
                    ref={b.homeContentRef}
                    onTouchStart={b.handleTouchStart}
                    onTouchMove={b.handleTouchMove}
                    onTouchEnd={b.handleTouchEnd}
                    onScroll={b.handleContentScroll}
                >
                    <div
                        className="pull-refresh-indicator"
                        style={{ height: `${b.pullDistance}px`, opacity: b.pullDistance > 0 ? 1 : 0 }}
                    >
                        <div className={`pull-refresh-icon ${b.pullDistance >= 80 ? "ready" : ""} ${b.isRefreshing ? "spinning" : ""}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                                <path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                            </svg>
                        </div>
                        <span className="pull-refresh-text">
                            {b.isRefreshing ? "Refreshing..." : b.pullDistance >= 80 ? "Release to refresh" : "Pull down to refresh"}
                        </span>
                    </div>
                    {b.isDetailsOpen && (
                        <>
                            <div style={{ display: b.detailsPage === "details" ? "block" : "none" }}>
                                <Details
                                    product={b.selectedProduct}
                                    onBack={b.handleCloseDetails}
                                    setCartCount={setCartCount}
                                    onOpenDetails={b.handleOpenDetails}
                                    onViewAll={b.onViewAllReviews}
                                    onViewAllMedia={b.onViewAllMedia}
                                    onBuyNow={b.onBuyNow}
                                />
                            </div>
                            {b.detailsPage === "allreview" && <AllReview product_id={b.selectedProduct?.data?.product_id || b.selectedProduct?.data?.gift_id || b.selectedProduct?.data?.shop_id || b.selectedProduct?.data?.premium_id || b.selectedProduct?.data?.medicine_id} />}
                            {b.detailsPage === "allmedia" && (
                                <AllMedia
                                    onBack={() => { b.setDetailsPage("details"); b.navigate(b.location.pathname.replace(/\/media$/, "")); }}
                                    product_id={b.selectedProduct?.data?.product_id || b.selectedProduct?.data?.gift_id || b.selectedProduct?.data?.shop_id || b.selectedProduct?.data?.premium_id || b.selectedProduct?.data?.medicine_id}
                                />
                            )}
                        </>
                    )}
                    {!b.isDetailsOpen && b.view.isHome && (
                        <>
                            {b.selectedMenu === "Cards" && (
                                <Cards
                                    key={`cards-${b.navKey}`}
                                    setCartCount={setCartCount}
                                    onOpenDetails={b.handleOpenDetails}
                                    search={b.search}
                                    filter={b.filter}
                                    setFilter={b.setFilter}
                                    setCategories={b.setCategories}
                                    setSuggestionData={b.setCardSuggestionsData}
                                />
                            )}
                            {b.selectedMenu === "Gifts" && (
                                <Gift
                                    key={`gift-${b.navKey}`}
                                    user={user}
                                    setCartCount={setCartCount}
                                    onOpenDetails={b.handleOpenDetails}
                                    search={b.search}
                                    filter={b.filter}
                                    giftCategoryPage={b.giftCategoryPage}
                                    setGiftCategoryPage={b.setGiftCategoryPage}
                                    selectedGiftCategory={b.selectedGiftCategory}
                                    setSelectedGiftCategory={b.setSelectedGiftCategory}
                                    allGiftCategoriesPage={b.allGiftCategoriesPage}
                                    setAllGiftCategoriesPage={b.setAllGiftCategoriesPage}
                                    allGiftsPage={b.allGiftsPage}
                                    setAllGiftsPage={b.setAllGiftsPage}
                                    setSuggestionData={b.setGiftSuggestionsData}
                                    goTo={goTo}
                                />
                            )}
                            {b.selectedMenu === "Shop" && (
                                <Shop
                                    key={`shop-${b.navKey}`}
                                    user={user}
                                    setCartCount={setCartCount}
                                    onOpenDetails={b.handleOpenDetails}
                                    search={b.search}
                                    filter={b.filter}
                                    shopCategoryPage={b.shopCategoryPage}
                                    setShopCategoryPage={b.setShopCategoryPage}
                                    selectedShopCategory={b.selectedShopCategory}
                                    setSelectedShopCategory={b.setSelectedShopCategory}
                                    allShopCategoriesPage={b.allShopCategoriesPage}
                                    setAllShopCategoriesPage={b.setAllShopCategoriesPage}
                                    setSuggestionData={b.setShopSuggestionsData}
                                    goTo={goTo}
                                    hideCategories={b.hideCategories}
                                    onShowCategories={() => b.setHideCategories(false)}
                                />
                            )}
                        </>
                    )}
                    {!b.isDetailsOpen && b.selectedBottomTab === "Offers" && <Offers />}
                    {!b.isDetailsOpen && b.selectedBottomTab === "Premium" && !b.isBookPage && !b.isTicketPage && (
                        <Medicure
                            key={b.navKey}
                            search={b.search}
                            filter={b.filter}
                            setCartCount={setCartCount}
                            onOpenDetails={b.handleOpenDetails}
                            onBuyNow={b.onBuyNow}
                        />
                    )}
                    {!b.isDetailsOpen && b.selectedBottomTab === "Premium" && b.isBookPage && <BookNow />}
                    {!b.isDetailsOpen && b.selectedBottomTab === "Premium" && b.isTicketPage && <ViewTicket />}
                    {b.view.isProfile("profile") && (
                        <Profile
                            key={b.profilePage + "-" + (user?.user_id || "")}
                            user={user}
                            profile={b.profile}
                            setProfile={b.setProfile}
                            setPage={setPage}
                            onLogout={b.handleLogout}
                            setProfilePage={b.setProfilePage}
                        />
                    )}
                    {b.view.isProfile("viewprofile") && <ViewProfile profile={b.profile} setProfilePage={b.setProfilePage} />}
                    {b.view.isProfile("viewaddress") && <ViewAddress setProfilePage={b.setProfilePage} />}
                    {b.view.isProfile("wishlist") && <MyWishlist key={`wishlist-${b.navKey}`} setProfilePage={b.setProfilePage} onOpenDetails={b.handleOpenDetails} />}
                    {!b.isDetailsOpen && b.selectedBottomTab === "Cart" && b.profilePage === "cart" && (
                        <MyCart
                            key={`cart-${b.navKey}`}
                            setProfilePage={b.setProfilePage}
                            setOrderData={b.setOrderData}
                            setBuyNowFromDetails={b.setBuyNowFromDetails}
                            onOpenDetails={b.handleOpenDetails}
                            setSelectedBottomTab={b.setSelectedBottomTab}
                            setCartCount={setCartCount}
                        />
                    )}
                    {b.view.isProfile("productorder") && (
                        <ProductOrder
                            setProfilePage={b.setProfilePage}
                            orderData={b.orderData}
                            setOrderData={b.setOrderData}
                            selectedAddress={b.selectedAddress}
                            buyNowFromDetails={b.buyNowFromDetails}
                            onBackToDetails={() => {
                                b.setBuyNowFromDetails(false);
                                b.setIsDetailsOpen(true);
                                b.setDetailsPage("details");
                            }}
                        />
                    )}
                    {b.view.isProfile("orders") && (
                        <MyOrders key={`orders-${b.navKey}`} setProfilePage={b.setProfilePage} setSelectedOrder={b.setSelectedOrder} />
                    )}
                    {b.view.isProfile("rewards") && <Rewards setProfilePage={b.setProfilePage} />}
                    {b.view.isProfile("demoredeem") && <DemoRedeemRewards setProfilePage={b.setProfilePage} />}
                    {b.view.isProfile("likes") && <MyLikes key={`likes-${b.navKey}`} setProfilePage={b.setProfilePage} onOpenDetails={b.handleOpenDetails} />}
                    {b.view.isProfile("reviews") && <MyReviews key={`reviews-${b.navKey}`} setProfilePage={b.setProfilePage} onOpenDetails={b.handleOpenDetails} />}
                    {b.view.isProfile("settings") && <Settings setProfilePage={b.setProfilePage} userId={user?.user_id} />}
                    {!b.isDetailsOpen && b.profilePage === "order-details" && (
                        <OrderItemDetails
                            key={`order-${b.navKey}`}
                            order={b.selectedOrder}
                            setProfilePage={b.setProfilePage}
                            onOpenDetails={b.handleOpenDetails}
                            setSelectedTrackingOrder={b.setSelectedTrackingOrder}
                            setSelectedInvoice={b.setSelectedInvoice}
                        />
                    )}
                    {b.profilePage === "ordersuccess" && <OrderSuccess setProfilePage={b.setProfilePage} />}
                    {b.view.isProfile("about") && <AboutAerodeck setProfilePage={b.setProfilePage} />}
                    {b.view.isProfile("terms") && <Terms setProfilePage={b.setProfilePage} />}
                    {b.view.isProfile("editprofile") && (
                        <EditProfile profile={b.profile} setProfile={b.setProfile} setProfilePage={b.setProfilePage} />
                    )}
                    {b.view.isProfile("addaddress") && <AddAddress setProfilePage={b.setProfilePage} />}
                    {b.view.isProfile("editaddress") && <EditAddress setProfilePage={b.setProfilePage} />}
                </div>
                {b.view.showBottomNav && (
                    <BottomNav
                        user={user}
                        selectedBottomTab={b.selectedBottomTab}
                        setSelectedBottomTab={b.setSelectedBottomTab}
                        setSelectedMenu={b.setSelectedMenu}
                        isDetailsOpen={b.isDetailsOpen}
                        closeDetails={b.handleCloseDetails}
                        setProfilePage={b.setProfilePage}
                        cartCount={cartCount}
                        setCartCount={setCartCount}
                    />
                )}
            </Suspense>
        </div>
    );
}
export default memo(Home);