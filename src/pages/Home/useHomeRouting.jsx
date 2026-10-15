import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function decodeCategory(path, prefix) {
    return decodeURIComponent(path.split(prefix)[1]);
}

export default function useHomeRouting({
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
}) {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;

        const closeDetails = () => {
            setIsDetailsOpen(false);
            setSelectedProduct(null);
            setDetailsPage("details");
        };

        const goHome = (menu) => {
            setSelectedBottomTab("Home");
            setSelectedMenu(menu);
            setProfilePage("profile");
        };

        const resetShopPages = () => {
            setAllShopCategoriesPage(false);
            setShopCategoryPage(false);
            setSelectedShopCategory(null);
        };

        const resetGiftPages = () => {
            setAllGiftCategoriesPage(false);
            setAllGiftsPage(false);
            setGiftCategoryPage(false);
            setSelectedGiftCategory(null);
        };

        if (path === "/home") {
            goHome("Shop");
            resetShopPages();
            resetGiftPages();
            closeDetails();
            return;
        }

        if (path === "/home/shop") {
            goHome("Shop");
            resetShopPages();
            closeDetails();
            return;
        }

        if (path === "/home/shop/allcategory") {
            goHome("Shop");
            setAllShopCategoriesPage(true);
            setShopCategoryPage(false);
            closeDetails();
            return;
        }

        if (
            (path.startsWith("/home/shop/allcategory/") ||
                path.startsWith("/home/shop/category/")) &&
            !path.includes("/product/")
        ) {
            const prefix = path.startsWith("/home/shop/allcategory/")
                ? "/home/shop/allcategory/"
                : "/home/shop/category/";

            goHome("Shop");
            setSelectedShopCategory(decodeCategory(path, prefix));
            setAllShopCategoriesPage(false);
            setShopCategoryPage(true);
            closeDetails();
            return;
        }

        if (path === "/home/gifts") {
            goHome("Gifts");
            resetGiftPages();
            closeDetails();
            return;
        }

        if (path === "/home/gifts/allcategory") {
            goHome("Gifts");
            setAllGiftCategoriesPage(true);
            setAllGiftsPage(false);
            setGiftCategoryPage(false);
            closeDetails();
            return;
        }

        if (path === "/home/gifts/allgifts") {
            goHome("Gifts");
            setAllGiftsPage(true);
            setAllGiftCategoriesPage(false);
            setGiftCategoryPage(false);
            closeDetails();
            return;
        }

        if (
            (path.startsWith("/home/gifts/allcategory/") ||
                path.startsWith("/home/gifts/category/")) &&
            !path.includes("/product/")
        ) {
            const prefix = path.startsWith("/home/gifts/allcategory/")
                ? "/home/gifts/allcategory/"
                : "/home/gifts/category/";

            goHome("Gifts");
            setSelectedGiftCategory(decodeCategory(path, prefix));
            setAllGiftCategoriesPage(false);
            setAllGiftsPage(false);
            setGiftCategoryPage(true);
            closeDetails();
            return;
        }

        if (
            path === "/home/cards" ||
            path.startsWith("/home/cards/product/") ||
            path === "/home/cards/premium" ||
            path.startsWith("/home/cards/premium/product/")
        ) {
            goHome("Cards");
            setAllGiftCategoriesPage(false);
            setGiftCategoryPage(false);
            closeDetails();
            return;
        }
    }, [location.pathname]);

    useEffect(() => {
        const path = location.pathname;

        if (path.startsWith("/profile/wishlist/product/")) {
            setSelectedBottomTab("Profile");
            setProfilePage("wishlist");
            return;
        }

        if (path.startsWith("/profile/reviews/product/")) {
            setSelectedBottomTab("Profile");
            setProfilePage("reviews");
            return;
        }

        if (path.startsWith("/profile/likes/product/")) {
            setSelectedBottomTab("Profile");
            setProfilePage("likes");
            return;
        }

        if (
            path.startsWith("/profile/orders/order/") &&
            path.includes("/product/")
        ) {
            setSelectedBottomTab("Profile");
            return;
        }

        if (!path.startsWith("/profile")) return;

        setSelectedBottomTab("Profile");
        setIsDetailsOpen(false);
        setSelectedProduct(null);
        setDetailsPage("details");

        if (path === "/profile") {
            setProfilePage("profile");
            return;
        }

        if (path === "/profile/address") {
            setProfilePage("address");
            return;
        }

        if (path === "/profile/address/addaddress") {
            setProfilePage("addaddress");
            return;
        }

        if (path === "/profile/address/editaddress") {
            setProfilePage("editaddress");
            return;
        }

        if (path === "/profile/wishlist") {
            setProfilePage("wishlist");
            return;
        }

        if (path.startsWith("/profile/orders/order/")) {
            const orderId = path.split("/profile/orders/order/")[1].split("/")[0];

            setProfilePage("order-details");
            setSelectedOrder((prev) => {
                if (prev && String(prev.order_id) === String(orderId)) {
                    return prev;
                }
                return { order_id: orderId };
            });
            return;
        }

        if (path === "/profile/orders") {
            setProfilePage("orders");
            return;
        }

        if (path === "/profile/rewards") {
            setProfilePage("rewards");
            return;
        }

        if (path === "/profile/likes") {
            setProfilePage("likes");
            return;
        }

        if (path === "/profile/reviews") {
            setProfilePage("reviews");
            return;
        }

        if (path === "/profile/settings") {
            setProfilePage("settings");
            return;
        }

        if (path === "/profile/help") {
            setProfilePage("help");
            return;
        }

        if (path === "/profile/about") {
            setProfilePage("about");
            return;
        }

        if (path === "/profile/terms") {
            setProfilePage("terms");
            return;
        }

        if (path === "/profile/viewprofile/editprofile") {
            setProfilePage("editprofile");
            return;
        }

        if (path === "/profile/viewprofile") {
            setProfilePage("viewprofile");
            return;
        }
    }, [location.pathname]);

    useEffect(() => {
        const path = location.pathname;
        const parts = path.split("/").filter(Boolean);

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
            parts.length === 4 &&
            parts[0] === "profile" &&
            parts[1] === "reviews" &&
            parts[2] === "product"
        ) {
            type = "shop";
            id = parts[3];
            setSelectedBottomTab("Profile");
            setProfilePage("reviews");
        }
        if (
            parts.length === 4 &&
            parts[0] === "profile" &&
            parts[1] === "likes" &&
            parts[2] === "product"
        ) {
            type = "shop";
            id = parts[3];
            setSelectedBottomTab("Profile");
            setProfilePage("likes");
        }

        if (parts[0] === "home" && (parts.length === 4 || parts.length === 5)) {
            if (parts[1] === "shop" && parts[2] === "product") {
                type = "products";
                id = parts[3];
            }
            if (parts[1] === "gifts" && parts[2] === "product") {
                type = "gifts";
                id = parts[3];
            }
            if (parts[1] === "cards" && parts[2] === "product") {
                type = "cards";
                id = parts[3];
            }
            if (parts[1] === "premium" && parts[2] === "product") {
                type = "premium";
                id = parts[3];
            }
        }

        if (
            parts.length === 5 &&
            parts[0] === "home" &&
            parts[1] === "cards" &&
            parts[2] === "premium" &&
            parts[3] === "product"
        ) {
            type = "cards";
            id = parts[4];
        }

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
            setSelectedShopCategory(decodeURIComponent(parts[3]));
            setShopCategoryPage(true);
            setAllShopCategoriesPage(false);
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
                setSelectedGiftCategory(decodeURIComponent(parts[3]));
                setGiftCategoryPage(true);
            }
            if (parts[1] === "shop") {
                type = "products";
                id = parts[5];
                setSelectedMenu("Shop");
                setSelectedShopCategory(decodeURIComponent(parts[3]));
                setShopCategoryPage(true);
            }
        }

        if (!type || !id) return;

        if (type === "premium") {
            setSelectedBottomTab("Premium");
        } else if (path.startsWith("/profile/wishlist/")) {
            setSelectedBottomTab("Profile");
        } else if (path.startsWith("/profile/reviews/")) {
            setSelectedBottomTab("Profile");
        } else if (path.startsWith("/profile/likes/")) {
            setSelectedBottomTab("Profile");
        } else {
            setSelectedBottomTab("Home");
        }
        if (path.startsWith("/profile/wishlist/")) {
            setProfilePage("wishlist");
        } else if (path.startsWith("/profile/reviews/")) {
            setProfilePage("reviews");
        } else {
            setProfilePage("profile");
        }

        setSelectedProduct((prev) => {
            if (prev && prev.type === type) {
                const prevId =
                    prev.data?.product_id ||
                    prev.data?.gift_id ||
                    prev.data?.shop_id ||
                    prev.data?.premium_id;

                if (String(prevId) === String(id)) return prev;
            }

            return {
                type,
                data: {
                    product_id: type === "products" ? id : undefined,
                    gift_id: type === "gifts" ? id : undefined,
                    shop_id:
                        type === "shop" || type === "cards" ? id : undefined,
                    premium_id: type === "premium" ? id : undefined,
                },
            };
        });

        if (path.endsWith("/reviews")) {
            setDetailsPage("allreview");
        } else if (path.endsWith("/media")) {
            setDetailsPage("allmedia");
        } else {
            setDetailsPage("details");
        }

        setIsDetailsOpen(true);
    }, [location.pathname]);
}