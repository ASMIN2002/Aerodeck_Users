import { lazy } from "react";
const lazyImport = (loader, retries = 2) =>
    lazy(() =>
        loader()
            .catch((err) => {
                if (retries <= 0) {
                    if (import.meta.env.DEV) console.error("Lazy load failed:", err);
                    throw err;
                }
                return lazyImport(loader, retries - 1);
            })
            .then((m) => ({ default: m.default ?? Object.values(m)[0] }))
    );
export const Header = lazyImport(() => import("../../2Process/process/Header"));
export const Search = lazyImport(() => import("../../2Process/process/Search"));
export const BottomNav = lazyImport(() => import("../../2Process/process/BottomNav"));
export const Address = lazyImport(() => import("../../2Process/process/Address"));
export const TOPHEADER = lazyImport(() => import("../../2Process/process/TopHeader"));
export const Cards = lazyImport(() => import("../../3ProcessHome/cards/level/1Cards"));
export const Gift = lazyImport(() => import("../../components/Gift/Gift"));
export const Shop = lazyImport(() => import("../../3ProcessHome/shop/level/1Shop"));
export const Medicure = lazyImport(() => import("../../3ProcessHome/medicure/1Medicure"));
export const BookNow = lazyImport(() => import("../../3ProcessHome/medicure/4BookNow"));
export const ViewTicket = lazyImport(() => import("../../3ProcessHome/medicure/5ViewTicket"));
export const Profile = lazyImport(() => import("../../4Profile/profile/Profile"));
export const MyWishlist = lazyImport(() => import("../../4Profile/profile/Wishlist"));
export const MyOrders = lazyImport(() => import("../../4Profile/profile/Orders"));
export const AboutAerodeck = lazyImport(() => import("../../4Profile/profile/AboutHeepit"));
export const Rewards = lazyImport(() => import("../../4Profile/profile/Rewards"));
export const MyLikes = lazyImport(() => import("../../4Profile/profile/Likes"));
export const MyReviews = lazyImport(() => import("../../4Profile/profile/MyReviews"));
export const Settings = lazyImport(() => import("../../4Profile/profile/Settings"));
export const Terms = lazyImport(() => import("../../4Profile/profile/TandC"));
export const DemoRedeemRewards = lazyImport(() => import("../../4Profile/profileDetails/DemoRedeemRewards"));
export const ViewProfile = lazyImport(() => import("../../4Profile/profileDetails/editprofile/ViewProfile"));
export const EditProfile = lazyImport(() => import("../../4Profile/profileDetails/editprofile/EditProfile"));
export const AddAddress = lazyImport(() => import("../../4Profile/profileDetails/editaddress/AddAddress"));
export const EditAddress = lazyImport(() => import("../../4Profile/profileDetails/editaddress/EditAddress"));
export const ViewAddress = lazyImport(() => import("../../4Profile/profileDetails/editaddress/ViewAddress"));
export const MyCart = lazyImport(() => import("../../5Cart/cart/MyCart"));
export const ProductOrder = lazyImport(() => import("../../6PlaceOrder/placeorder/ProductOrder"));
export const OrderSuccess = lazyImport(() => import("../../6PlaceOrder/placeorder/OrderSuccess"));
export const OrderItemDetails = lazyImport(() => import("../../6PlaceOrder/placeorder/OrderItemDetails"));
export const Details = lazyImport(() => import("../../8Details/detail/Details"));
export const AllReview = lazyImport(() => import("../../8Details/detail/AllReview"));
export const AllMedia = lazyImport(() => import("../../8Details/detail/AllMedia"));
export const Offers = lazyImport(() => import("../../9Offer/Offers"));