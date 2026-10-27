import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
const decodeCategory = (path, prefix) => {
    const raw = path.split(prefix)[1];
    return raw ? decodeURIComponent(raw) : "";
};
const getProductId = (p) =>
    p?.product_id || p?.gift_id || p?.shop_id || p?.premium_id || p?.medicine_id;
const PROFILE_ROUTES = {
    "/profile": "profile",
    "/profile/address": "address",
    "/profile/address/addaddress": "addaddress",
    "/profile/address/editaddress": "editaddress",
    "/profile/wishlist": "wishlist",
    "/profile/orders": "orders",
    "/profile/rewards": "rewards",
    "/profile/likes": "likes",
    "/profile/reviews": "reviews",
    "/profile/settings": "settings",
    "/profile/help": "help",
    "/profile/about": "about",
    "/profile/terms": "terms",
    "/profile/viewprofile": "viewprofile",
    "/profile/viewprofile/editprofile": "editprofile",
};
const PRODUCT_PARSERS = [
    (p) => {
        const m = p.match(/^\/profile\/orders\/order\/([^/]+)\/product\/([^/]+)$/);
        return m && { type: "shop", id: m[2], page: "order-details", tab: "Profile" };
    },
    (p) => {
        const m = p.match(/^\/profile\/([^/]+)\/product\/([^/]+)$/);
        return m && { type: "shop", id: m[2], page: m[1], tab: "Profile" };
    },
    (p) => {
        const m = p.match(/^\/home\/cards\/premium\/product\/([^/]+)$/);
        return m && { type: "cards", id: m[1], tab: "Home" };
    },
    (p) => {
        const m = p.match(/^\/home\/(shop|gifts|cards|premium)\/product\/([^/]+)$/);
        if (!m) return null;
        const map = { shop: "products", gifts: "gifts", cards: "cards", premium: "premium" };
        return { type: map[m[1]], id: m[2], tab: "Home" };
    },
    (p) => {
        const m = p.match(/^\/home\/shop\/allcategory\/([^/]+)\/product\/([^/]+)$/);
        return m && { type: "products", id: m[2], category: m[1], categoryKind: "shop-all", tab: "Home" };
    },
    (p) => {
        const m = p.match(/^\/home\/(shop|gifts)\/category\/([^/]+)\/product\/([^/]+)$/);
        if (!m) return null;
        const map = { shop: "products", gifts: "gifts" };
        return { type: map[m[1]], id: m[3], category: m[2], categoryKind: m[1], tab: "Home" };
    },
    (p) => {
        const m = p.match(/^\/medicure\/product\/([^/]+)$/);
        return m && { type: "medicine", id: m[1], tab: "Premium" };
    },
];
export default function useHomeRouting(setters) {
    const location = useLocation();
    const settersRef = useRef(setters);
    useEffect(() => { settersRef.current = setters; });
    useEffect(() => {
        const s = settersRef.current;
        const path = location.pathname;
        const closeDetails = () => {
            s.setIsDetailsOpen(false);
            s.setSelectedProduct(null);
            s.setDetailsPage("details");
        };
        const goHome = (menu) => {
            s.setSelectedBottomTab("Home");
            s.setSelectedMenu(menu);
            s.setProfilePage("profile");
        };
        const resetShop = () => {
            s.setAllShopCategoriesPage(false);
            s.setShopCategoryPage(false);
            s.setSelectedShopCategory(null);
        };
        const resetGift = () => {
            s.setAllGiftCategoriesPage(false);
            s.setAllGiftsPage(false);
            s.setGiftCategoryPage(false);
            s.setSelectedGiftCategory(null);
        };
        const showProfile = (page) => {
            s.setSelectedBottomTab("Profile");
            s.setProfilePage(page);
            closeDetails();
        };
        if (path === "/offers") {
            s.setSelectedBottomTab("Offers");
            s.setProfilePage("profile");
            closeDetails();
            return;
        }
        if (path === "/medicure" || path.startsWith("/medicure/ticket/") || path.startsWith("/medicure/book/")) {
            s.setSelectedBottomTab("Premium");
            s.setProfilePage("profile");
            closeDetails();
            return;
        }
        if (path === "/home" || path === "/home/shop") {
            goHome("Shop");
            resetShop();
            if (path === "/home") resetGift();
            closeDetails();
            return;
        }
        if (path === "/home/shop/allcategory") {
            goHome("Shop");
            s.setAllShopCategoriesPage(true);
            s.setShopCategoryPage(false);
            closeDetails();
            return;
        }
        if (
            (path.startsWith("/home/shop/allcategory/") || path.startsWith("/home/shop/category/")) &&
            !path.includes("/product/")
        ) {
            const prefix = path.startsWith("/home/shop/allcategory/")
                ? "/home/shop/allcategory/"
                : "/home/shop/category/";
            goHome("Shop");
            s.setSelectedShopCategory(decodeCategory(path, prefix));
            s.setAllShopCategoriesPage(false);
            s.setShopCategoryPage(true);
            closeDetails();
            return;
        }
        if (path === "/home/gifts") {
            goHome("Gifts");
            resetGift();
            closeDetails();
            return;
        }
        if (path === "/home/gifts/allcategory") {
            goHome("Gifts");
            s.setAllGiftCategoriesPage(true);
            s.setAllGiftsPage(false);
            s.setGiftCategoryPage(false);
            closeDetails();
            return;
        }
        if (path === "/home/gifts/allgifts") {
            goHome("Gifts");
            s.setAllGiftsPage(true);
            s.setAllGiftCategoriesPage(false);
            s.setGiftCategoryPage(false);
            closeDetails();
            return;
        }
        if (
            (path.startsWith("/home/gifts/allcategory/") || path.startsWith("/home/gifts/category/")) &&
            !path.includes("/product/")
        ) {
            const prefix = path.startsWith("/home/gifts/allcategory/")
                ? "/home/gifts/allcategory/"
                : "/home/gifts/category/";
            goHome("Gifts");
            s.setSelectedGiftCategory(decodeCategory(path, prefix));
            s.setAllGiftCategoriesPage(false);
            s.setAllGiftsPage(false);
            s.setGiftCategoryPage(true);
            closeDetails();
            return;
        }
        if (path === "/home/cards" || path === "/home/cards/premium") {
            goHome("Cards");
            s.setAllGiftCategoriesPage(false);
            s.setGiftCategoryPage(false);
            closeDetails();
            return;
        }
        const profilePage = PROFILE_ROUTES[path];
        if (profilePage) { showProfile(profilePage); return; }
        if (path.startsWith("/profile/orders/order/")) {
            const orderId = path.split("/profile/orders/order/")[1].split("/")[0];
            s.setSelectedBottomTab("Profile");
            s.setProfilePage("order-details");
            s.setSelectedOrder((prev) =>
                prev && String(prev.order_id) === String(orderId) ? prev : { order_id: orderId }
            );
            closeDetails();
            return;
        }
        let match = null;
        for (const parse of PRODUCT_PARSERS) {
            match = parse(path);
            if (match) break;
        }
        if (!match) return;
        const { type, id, page, tab, category, categoryKind } = match;
        if (type === "premium" || type === "medicine") s.setSelectedBottomTab("Premium");
        else if (path.startsWith("/profile/")) s.setSelectedBottomTab("Profile");
        else s.setSelectedBottomTab(tab || "Home");
        if (path.startsWith("/profile/wishlist/")) s.setProfilePage("wishlist");
        else if (path.startsWith("/profile/reviews/")) s.setProfilePage("reviews");
        else if (path.startsWith("/profile/likes/")) s.setProfilePage("likes");
        else if (page) s.setProfilePage(page);
        if (categoryKind === "shop-all") {
            s.setSelectedMenu("Shop");
            s.setSelectedShopCategory(decodeURIComponent(category));
            s.setShopCategoryPage(true);
            s.setAllShopCategoriesPage(false);
        } else if (categoryKind === "shop") {
            s.setSelectedMenu("Shop");
            s.setSelectedShopCategory(decodeURIComponent(category));
            s.setShopCategoryPage(true);
        } else if (categoryKind === "gifts") {
            s.setSelectedMenu("Gifts");
            s.setSelectedGiftCategory(decodeURIComponent(category));
            s.setGiftCategoryPage(true);
        }
        s.setSelectedProduct((prev) => {
            if (prev?.type === type && String(getProductId(prev.data)) === String(id)) return prev;
            return {
                type,
                data: {
                    ...(type === "products" && { product_id: id }),
                    ...(type === "gifts" && { gift_id: id }),
                    ...(type === "shop" || type === "cards") && { shop_id: id },
                    ...(type === "premium" && { premium_id: id }),
                    ...(type === "medicine" && { medicine_id: id }),
                },
            };
        });
        if (path.endsWith("/reviews")) s.setDetailsPage("allreview");
        else if (path.endsWith("/media")) s.setDetailsPage("allmedia");
        else s.setDetailsPage("details");
        s.setIsDetailsOpen(true);
    }, [location.pathname]);
}