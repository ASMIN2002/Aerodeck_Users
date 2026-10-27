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

        if (path === "/offers") {
            setSelectedBottomTab("Offers");
            setProfilePage("profile");
            closeDetails();
            return;
        }

        if (path === "/medicure" || path.startsWith("/medicure/ticket/") || path.startsWith("/medicure/book/")) {
            setSelectedBottomTab("Premium");
            setProfilePage("profile");
            closeDetails();
            return;
        }

        if (path === "/home" || path === "/home/shop") {
            goHome("Shop");
            resetShopPages();
            if (path === "/home") resetGiftPages();
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
            (path.startsWith("/home/shop/allcategory/") || path.startsWith("/home/shop/category/")) &&
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
            (path.startsWith("/home/gifts/allcategory/") || path.startsWith("/home/gifts/category/")) &&
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

        if (path === "/profile" || path === "/profile/") {
            setSelectedBottomTab("Profile");
            setProfilePage("profile");
            closeDetails();
            return;
        }

        if (path === "/profile/address") {
            setSelectedBottomTab("Profile");
            setProfilePage("address");
            closeDetails();
            return;
        }

        if (path === "/profile/address/addaddress") {
            setSelectedBottomTab("Profile");
            setProfilePage("addaddress");
            closeDetails();
            return;
        }

        if (path === "/profile/address/editaddress") {
            setSelectedBottomTab("Profile");
            setProfilePage("editaddress");
            closeDetails();
            return;
        }

        if (path === "/profile/wishlist") {
            setSelectedBottomTab("Profile");
            setProfilePage("wishlist");
            closeDetails();
            return;
        }

        if (path === "/profile/orders") {
            setSelectedBottomTab("Profile");
            setProfilePage("orders");
            closeDetails();
            return;
        }

        if (path === "/profile/rewards") {
            setSelectedBottomTab("Profile");
            setProfilePage("rewards");
            closeDetails();
            return;
        }

        if (path === "/profile/likes") {
            setSelectedBottomTab("Profile");
            setProfilePage("likes");
            closeDetails();
            return;
        }

        if (path === "/profile/reviews") {
            setSelectedBottomTab("Profile");
            setProfilePage("reviews");
            closeDetails();
            return;
        }

        if (path === "/profile/settings") {
            setSelectedBottomTab("Profile");
            setProfilePage("settings");
            closeDetails();
            return;
        }

        if (path === "/profile/help") {
            setSelectedBottomTab("Profile");
            setProfilePage("help");
            closeDetails();
            return;
        }

        if (path === "/profile/about") {
            setSelectedBottomTab("Profile");
            setProfilePage("about");
            closeDetails();
            return;
        }

        if (path === "/profile/terms") {
            setSelectedBottomTab("Profile");
            setProfilePage("terms");
            closeDetails();
            return;
        }

        if (path === "/profile/viewprofile") {
            setSelectedBottomTab("Profile");
            setProfilePage("viewprofile");
            closeDetails();
            return;
        }

        if (path === "/profile/viewprofile/editprofile") {
            setSelectedBottomTab("Profile");
            setProfilePage("editprofile");
            closeDetails();
            return;
        }

        if (path.startsWith("/profile/orders/order/")) {
            const orderId = path.split("/profile/orders/order/")[1].split("/")[0];
            setSelectedBottomTab("Profile");
            setProfilePage("order-details");
            setSelectedOrder((prev) => {
                if (prev && String(prev.order_id) === String(orderId)) return prev;
                return { order_id: orderId };
            });
            closeDetails();
            return;
        }

        const parts = path.split("/").filter(Boolean);
        let type = "";
        let id = "";
        let bottomTab = null;
        let page = null;

        if (
            parts.length === 6 &&
            parts[0] === "profile" &&
            parts[1] === "orders" &&
            parts[2] === "order" &&
            parts[4] === "product"
        ) {
            type = "shop";
            id = parts[5];
            bottomTab = "Profile";
            page = "order-details";
        } else if (
            parts.length === 4 &&
            parts[0] === "profile" &&
            parts[2] === "product"
        ) {
            type = "shop";
            id = parts[3];
            bottomTab = "Profile";
            page = parts[1];
        } else if (parts[0] === "home" && (parts.length === 4 || parts.length === 5)) {
            if (parts[1] === "shop" && parts[2] === "product") {
                type = "products";
                id = parts[3];
            } else if (parts[1] === "gifts" && parts[2] === "product") {
                type = "gifts";
                id = parts[3];
            } else if (parts[1] === "cards" && parts[2] === "product") {
                type = "cards";
                id = parts[3];
            } else if (parts[1] === "premium" && parts[2] === "product") {
                type = "premium";
                id = parts[3];
            }
        } else if (
            parts.length === 5 &&
            parts[0] === "home" &&
            parts[1] === "cards" &&
            parts[2] === "premium" &&
            parts[3] === "product"
        ) {
            type = "cards";
            id = parts[4];
        } else if (
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
        } else if (
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
            } else if (parts[1] === "shop") {
                type = "products";
                id = parts[5];
                setSelectedMenu("Shop");
                setSelectedShopCategory(decodeURIComponent(parts[3]));
                setShopCategoryPage(true);
            }
        } else if (
            parts.length === 4 &&
            parts[0] === "medicure" &&
            parts[2] === "product"
        ) {
            type = "medicine";
            id = parts[3];
        }

        if (!type || !id) return;

        if (type === "premium" || type === "medicine") {
            setSelectedBottomTab("Premium");
        } else if (path.startsWith("/profile/")) {
            setSelectedBottomTab("Profile");
        } else {
            setSelectedBottomTab("Home");
        }

        if (path.startsWith("/profile/wishlist/")) setProfilePage("wishlist");
        else if (path.startsWith("/profile/reviews/")) setProfilePage("reviews");
        else if (path.startsWith("/profile/likes/")) setProfilePage("likes");
        else if (page) setProfilePage(page);

        setSelectedProduct((prev) => {
            if (prev && prev.type === type) {
                const prevId =
                    prev.data?.product_id ||
                    prev.data?.gift_id ||
                    prev.data?.shop_id ||
                    prev.data?.premium_id ||
                    prev.data?.medicine_id;
                if (String(prevId) === String(id)) return prev;
            }
            return {
                type,
                data: {
                    product_id: type === "products" ? id : undefined,
                    gift_id: type === "gifts" ? id : undefined,
                    shop_id: type === "shop" || type === "cards" ? id : undefined,
                    premium_id: type === "premium" ? id : undefined,
                    medicine_id: type === "medicine" ? id : undefined,
                },
            };
        });

        if (path.endsWith("/reviews")) setDetailsPage("allreview");
        else if (path.endsWith("/media")) setDetailsPage("allmedia");
        else setDetailsPage("details");

        setIsDetailsOpen(true);
    }, [location.pathname]);
}