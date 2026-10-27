import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../../services/api";
import useHomeRouting from "./useHomeRouting";
export const TAB_KEY = "selectedBottomTab";
export const MENU_KEY = "selectedMenu";
export const PROFILE_CACHE_KEY = "profile_cache";
export const PROFILE_TTL = 300000;
export const REFRESH_THRESHOLD = 80;
export const REFRESH_DURATION = 600;
export const SCROLL_DELTA = 4;
export const VALID_TABS = ["Home", "Offers", "Cart", "Profile", "Premium"];
export const TYPE_MAP = { card: "cards", shop: "products", gift: "gifts" };
export const getInitialTab = () => {
    const s = localStorage.getItem(TAB_KEY);
    return VALID_TABS.includes(s) ? s : "Home";
};
export const getProductId = (p) =>
    p?.product_id || p?.gift_id || p?.shop_id || p?.premium_id || p?.medicine_id;
export const getSession = () =>
    sessionStorage.getItem("session_token") || localStorage.getItem("session_token");
const readProfileCache = () => {
    try {
        const raw = sessionStorage.getItem(PROFILE_CACHE_KEY);
        if (!raw) return null;
        const { user, ts } = JSON.parse(raw);
        return Date.now() - ts < PROFILE_TTL ? user : null;
    } catch { return null; }
};
const writeProfileCache = (user) =>
    sessionStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({ user, ts: Date.now() }));
const fetchWithTimeout = (url, opts = {}, ms = 10000) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(timer));
};
export default function useHomeBackend({ user, setPage, cartCount, setCartCount, goTo }) {
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
    const rafScrollRef = useRef(null);
    const rafPullRef = useRef(null);
    useHomeRouting({
        setSelectedBottomTab, setSelectedMenu, setProfilePage, setSelectedProduct,
        setIsDetailsOpen, setDetailsPage, setSelectedShopCategory, setSelectedGiftCategory,
        setShopCategoryPage, setGiftCategoryPage, setAllShopCategoriesPage,
        setAllGiftCategoriesPage, setAllGiftsPage, setSelectedOrder,
    });
    useEffect(() => { localStorage.setItem(MENU_KEY, selectedMenu); }, [selectedMenu]);
    useEffect(() => {
        if (selectedBottomTab === null) localStorage.removeItem(TAB_KEY);
        else localStorage.setItem(TAB_KEY, selectedBottomTab);
    }, [selectedBottomTab]);
    const fetchProfile = useCallback(async (signal) => {
        const cached = readProfileCache();
        if (cached) { setProfile(cached); return; }
        try {
            const res = await fetchWithTimeout(`${API}/api/user/profile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: getSession() }),
                signal,
            });
            const data = await res.json();
            if (data.success) {
                setProfile(data.user);
                writeProfileCache({ user_id: data.user?.user_id, name: data.user?.name, avatar: data.user?.avatar });
            }
        } catch (err) {
            if (err.name !== "AbortError" && import.meta.env.DEV) console.error("Profile load:", err.message);
        }
    }, []);
    useEffect(() => {
        const ctrl = new AbortController();
        fetchProfile(ctrl.signal);
        return () => ctrl.abort();
    }, [fetchProfile]);
    useEffect(() => {
        if (detailsPage !== "details") return;
        const saved = sessionStorage.getItem("detailsScrollPosition");
        if (!saved) return;
        const c = homeContentRef.current;
        if (!c) return;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            c.scrollTop = Number(saved);
            sessionStorage.removeItem("detailsScrollPosition");
        }));
    }, [detailsPage]);
    const handleLogout = useCallback(async () => {
        try {
            await fetchWithTimeout(`${API}/api/auth/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: getSession() }),
            });
        } catch (err) {
            if (import.meta.env.DEV) console.error("Logout:", err.message);
        }
        sessionStorage.removeItem("session_token");
        localStorage.removeItem("session_token");
        sessionStorage.removeItem(PROFILE_CACHE_KEY);
        setPage("login");
    }, [setPage]);
    const handleOpenDetails = useCallback((product, type) => {
        const normalizedType = TYPE_MAP[type] || type;
        setDetailsBackPage({ selectedBottomTab, profilePage, selectedMenu, pathname: location.pathname });
        setDetailsPage("details");
        setSelectedProduct({ type: normalizedType, data: product });
        setIsDetailsOpen(true);
        const id = getProductId(product);
        if (!id) return;
        const inProduct = location.pathname.includes("/product/");
        const base = inProduct ? location.pathname.split("/product/")[0] : location.pathname;
        const url = `${base}/product/${id}`;
        if (inProduct) navigate(url, { replace: true });
        else goTo(url);
    }, [selectedBottomTab, profilePage, selectedMenu, location.pathname, navigate, goTo]);
    const handleCloseDetails = useCallback(() => {
        const path = location.pathname;
        if (path.endsWith("/reviews") || path.endsWith("/media")) {
            setDetailsPage("details");
            goTo(path.replace(/\/(reviews|media)$/, ""));
            return;
        }
        if (path.includes("/product/")) {
            if (detailsBackPage) {
                setSelectedBottomTab(detailsBackPage.selectedBottomTab);
                setProfilePage(detailsBackPage.profilePage);
                setSelectedMenu(detailsBackPage.selectedMenu);
            }
            setDetailsPage("details");
            setSelectedProduct(null);
            setIsDetailsOpen(false);
            goTo(path.split("/product/")[0]);
            return;
        }
        setDetailsPage("details");
        setSelectedProduct(null);
        setIsDetailsOpen(false);
        if (detailsBackPage?.pathname) goTo(detailsBackPage.pathname);
    }, [location.pathname, detailsBackPage, goTo]);
    const handleRefresh = useCallback(() => setNavKey((n) => n + 1), []);
    const handleTouchStart = useCallback((e) => {
        const c = homeContentRef.current;
        if (!c || isRefreshing) return;
        touchStartYRef.current = c.scrollTop <= 0 ? e.touches[0].clientY : null;
    }, [isRefreshing]);
    const handleTouchMove = useCallback((e) => {
        if (touchStartYRef.current === null || isRefreshing) return;
        const c = homeContentRef.current;
        if (!c || c.scrollTop > 0) {
            touchStartYRef.current = null;
            setPullDistance(0);
            return;
        }
        const diff = e.touches[0].clientY - touchStartYRef.current;
        if (diff > 0 && !rafPullRef.current) {
            rafPullRef.current = requestAnimationFrame(() => {
                setPullDistance(Math.min(diff * 0.5, 120));
                rafPullRef.current = null;
            });
        }
    }, [isRefreshing]);
    const handleTouchEnd = useCallback(() => {
        const c = homeContentRef.current;
        if (!c) return;
        if (pullDistance >= REFRESH_THRESHOLD && !isRefreshing) {
            setIsRefreshing(true);
            const savedScroll = c.scrollTop;
            setTimeout(() => {
                setNavKey((n) => n + 1);
                setIsRefreshing(false);
                setPullDistance(0);
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    if (c) c.scrollTop = savedScroll;
                }));
            }, REFRESH_DURATION);
        } else {
            setPullDistance(0);
        }
        touchStartYRef.current = null;
    }, [pullDistance, isRefreshing]);
    const handleContentScroll = useCallback((e) => {
        if (rafScrollRef.current) return;
        const top = e.currentTarget.scrollTop;
        rafScrollRef.current = requestAnimationFrame(() => {
            const d = top - lastScrollTopRef.current;
            if (d > SCROLL_DELTA && top > 20) setHideCategories((p) => p || true);
            else if (d < -SCROLL_DELTA || top <= 0) setHideCategories((p) => (p ? false : p));
            lastScrollTopRef.current = top;
            rafScrollRef.current = null;
        });
    }, []);
    useEffect(() => {
        const onPop = () => {
            const path = window.location.pathname;
            if (path === "/cart") {
                setIsDetailsOpen(false);
                setSelectedProduct(null);
                setDetailsPage("details");
                setSelectedBottomTab("Cart");
                setProfilePage("cart");
                return;
            }
            if (path.endsWith("/reviews")) { setDetailsPage("allreview"); setIsDetailsOpen(true); return; }
            if (path.endsWith("/media")) { setDetailsPage("allmedia"); setIsDetailsOpen(true); return; }
            if (path.includes("/product/")) { setDetailsPage("details"); setIsDetailsOpen(true); return; }
            if (isDetailsOpen) {
                setIsDetailsOpen(false);
                setSelectedProduct(null);
                setDetailsPage("details");
            }
        };
        window.addEventListener("popstate", onPop);
        return () => window.removeEventListener("popstate", onPop);
    }, [isDetailsOpen]);
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
    const view = useMemo(() => {
        const isHome = selectedBottomTab === "Home";
        return {
            showMainHeader:
                !isDetailsOpen &&
                ["Home", "Premium", "Offers"].includes(selectedBottomTab) &&
                !allShopCategoriesPage && !allShopsPage && !allGiftCategoriesPage &&
                !allGiftsPage && !shopCategoryPage && !giftCategoryPage,
            showBottomNav:
                !isDetailsOpen &&
                (["Home", "Cart", "Offers", "Premium"].includes(selectedBottomTab) ||
                    (selectedBottomTab === "Profile" && profilePage === "profile")),
            isProfile: (page) =>
                !isDetailsOpen && selectedBottomTab === "Profile" && profilePage === page,
            isHome,
        };
    }, [isDetailsOpen, selectedBottomTab, profilePage, allShopCategoriesPage,
        allShopsPage, allGiftCategoriesPage, allGiftsPage, shopCategoryPage, giftCategoryPage]);
    const isBookPage = useMemo(() => location.pathname.includes("/book/"), [location.pathname]);
    const isTicketPage = useMemo(() => location.pathname.includes("/ticket/"), [location.pathname]);
    return {
        location, navigate,
        selectedMenu, setSelectedMenu,
        selectedBottomTab, setSelectedBottomTab,
        search, setSearch,
        filter, setFilter,
        categories, setCategories,
        isMenuOpen, setIsMenuOpen,
        profilePage, setProfilePage,
        selectedProduct, setSelectedProduct,
        isDetailsOpen, setIsDetailsOpen,
        giftCategoryPage, setGiftCategoryPage,
        selectedGiftCategory, setSelectedGiftCategory,
        detailsPage, setDetailsPage,
        shopCategoryPage, setShopCategoryPage,
        selectedShopCategory, setSelectedShopCategory,
        cardSuggestionsData, setCardSuggestionsData,
        giftSuggestionsData, setGiftSuggestionsData,
        shopSuggestionsData, setShopSuggestionsData,
        premiumSuggestionsData, setPremiumSuggestionsData,
        navKey, setNavKey,
        orderData, setOrderData,
        buyNowFromDetails, setBuyNowFromDetails,
        detailsBackPage, setDetailsBackPage,
        selectedAddress, setSelectedAddress,
        selectedOrder, setSelectedOrder,
        selectedTrackingOrder, setSelectedTrackingOrder,
        selectedInvoice, setSelectedInvoice,
        allShopCategoriesPage, setAllShopCategoriesPage,
        allGiftCategoriesPage, setAllGiftCategoriesPage,
        allShopsPage, setAllShopsPage,
        allGiftsPage, setAllGiftsPage,
        profile, setProfile,
        pullDistance, isRefreshing,
        hideCategories, setHideCategories,
        homeContentRef,
        handleLogout, handleOpenDetails, handleCloseDetails, handleRefresh,
        handleTouchStart, handleTouchMove, handleTouchEnd, handleContentScroll,
        onOpenCart, onBuyNow, onViewAllReviews, onViewAllMedia,
        view, isBookPage, isTicketPage,
    };
}