import { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "../../services/api";
import useHomeRouting from "./useHomeRouting";

const TAB_KEY = "selectedBottomTab";
const MENU_KEY = "selectedMenu";
const VALID_TABS = ["Home", "Offers", "Cart", "Profile"];

function getInitialTab() {
    const saved = localStorage.getItem(TAB_KEY);
    return VALID_TABS.includes(saved) ? saved : "Home";
}

const getSession = () => localStorage.getItem("session_token");

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
        let cancelled = false;
        async function loadProfile() {
            try {
                const response = await fetch(`${API}/api/user/profile`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_token: getSession() }),
                });
                const data = await response.json();
                if (!cancelled && data.success) setProfile(data.user);
            } catch (err) {
                console.error("Profile load error:", err.message);
            }
        }
        loadProfile();
        return () => { cancelled = true; };
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

            if (path.includes("/product/") && !path.endsWith("/reviews") && !path.endsWith("/media")) {
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
        const homeContent = document.querySelector(".home-content");
        if (!homeContent) return;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                homeContent.scrollTop = Number(savedScroll);
                sessionStorage.removeItem("detailsScrollPosition");
            });
        });
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
        setDetailsBackPage({
            selectedBottomTab,
            profilePage,
            selectedMenu,
            pathname: location.pathname,
        });

        setDetailsPage("details");
        setSelectedProduct({ type, data: product });
        setIsDetailsOpen(true);

        const id =
            product?.product_id ||
            product?.gift_id ||
            product?.shop_id ||
            product?.premium_id ||
            product?.medicine_id;

        if (!id) return;

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
    }, [location.pathname, detailsBackPage, goTo]);

    const handleReloadHome = useCallback(() => setNavKey((p) => p + 1), []);

    const showMainHeader = useMemo(
        () =>
            !isDetailsOpen &&
            selectedBottomTab === "Home" &&
            !allShopCategoriesPage &&
            !allGiftCategoriesPage &&
            !allGiftsPage &&
            !shopCategoryPage &&
            !giftCategoryPage,
        [isDetailsOpen, selectedBottomTab, allShopCategoriesPage, allGiftCategoriesPage, allGiftsPage, shopCategoryPage, giftCategoryPage]
    );

    return {
        location,
        navigate,
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
        allGiftsPage, setAllGiftsPage,
        profile, setProfile,
        handleLogout,
        handleOpenDetails,
        handleCloseDetails,
        handleReloadHome,
        showMainHeader,
    };
}