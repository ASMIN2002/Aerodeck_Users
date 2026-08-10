import "./Details.css";
import { API } from "../../services/api";
import CertifiedCard from "../../assets/Certifiedcard.png";
import DetailsData from "./DetailsData/DetailsData";
import { FaShareAlt } from "react-icons/fa";

import {
    FaHeart,
    FaRegHeart,
    FaBookmark,
    FaRegBookmark
} from "react-icons/fa";
import { useEffect, useState } from "react";

function Details({
    product,
    onBack,
    setCartCount,
    onOpenDetails,
    onViewAll,
    onViewAllMedia,
    onBuyNow
}) {

    const sessionToken = localStorage.getItem("session_token");

    const [details, setDetails] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [cartQuantity, setCartQuantity] = useState(0);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const images = [

        details?.product_image1 ||
        details?.gift_image1 ||
        details?.shop_image1 ||
        details?.premium_image1,

        details?.product_image2 ||
        details?.gift_image2 ||
        details?.shop_image2 ||
        details?.premium_image2,

        details?.product_image3 ||
        details?.gift_image3 ||
        details?.shop_image3 ||
        details?.premium_image3,

        details?.product_image4 ||
        details?.gift_image4 ||
        details?.shop_image4 ||
        details?.premium_image4,

        CertifiedCard

    ].filter(Boolean);

    const [selectedImage, setSelectedImage] = useState(
        images[0] || CertifiedCard
    );
    useEffect(() => {

        if (!details) return;

        setSelectedImage(
            details.product_image1 ||
            details.gift_image1 ||
            details.shop_image1 ||
            details.premium_image1 ||
            CertifiedCard
        );

        setCurrentIndex(0);

    }, [details]);

    useEffect(() => {

        if (!product?.data) return;
        document.querySelector(".home-content")?.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        const fetchDetails = async () => {

            try {

                let id = null;

                switch (product.type) {

                    case "card":
                        id = product.data.product_id;
                        break;

                    case "gift":
                        id = product.data.gift_id;
                        break;

                    case "shop":
                        id = product.data.shop_id;
                        break;

                    case "premium":
                        id = product.data.premium_id;
                        break;

                    default:
                        return;

                }

                const response = await fetch(
                    `${API}/api/user/details/${product.type}/${id}`
                );

                const result = await response.json();

                if (result.success) {

                    setDetails(result.data);

                }

            } catch (error) {

                console.error("Details fetch error:", error);

            }

        };

        fetchDetails();

    }, [product]);

    useEffect(() => {

        if (!details || !sessionToken) return;

        const loadLikeStatus = async () => {

            try {

                const productId =
                    details.product_id ||
                    details.gift_id ||
                    details.shop_id ||
                    details.premium_id;

                const response = await fetch(
                    `${API}/api/user/likes?session_token=${sessionToken}`
                );

                const data = await response.json();



                if (data.success) {

                    setIsLiked(

                        data.data.some(
                            item => String(item.product_id) === String(productId)
                        )

                    );



                }

            }

            catch (err) {

                console.log(err);

            }

        };

        loadLikeStatus();

    }, [details, sessionToken]);

    const handleLike = async () => {

        if (!details) return;

        const productId =
            details.product_id ||
            details.gift_id ||
            details.shop_id ||
            details.premium_id;

        try {

            if (isLiked) {

                const response = await fetch(

                    `${API}/api/user/likes/${productId}`,

                    {
                        method: "DELETE",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            session_token: sessionToken
                        })
                    }

                );

                const data = await response.json();

                if (!data.success) return;

                setIsLiked(false);

                setDetails(prev => ({

                    ...prev,

                    product_total_likes: data.totalLikes,

                    gift_total_likes: data.totalLikes,

                    shop_total_likes: data.totalLikes,

                    premium_total_likes: data.totalLikes

                }));

            }

            else {

                const response = await fetch(

                    `${API}/api/user/likes`,

                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            session_token: sessionToken,
                            product_id: productId
                        })
                    }

                );

                const data = await response.json();

                if (!data.success) return;

                setIsLiked(true);

                setDetails(prev => ({

                    ...prev,

                    product_total_likes: data.totalLikes,

                    gift_total_likes: data.totalLikes,

                    shop_total_likes: data.totalLikes,

                    premium_total_likes: data.totalLikes

                }));
            }

        }

        catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        if (!details || !sessionToken) return;

        const loadSaveStatus = async () => {

            try {

                const productId =
                    details.product_id ||
                    details.gift_id ||
                    details.shop_id ||
                    details.premium_id;

                const response = await fetch(
                    `${API}/api/user/wishlist?session_token=${sessionToken}`
                );

                const data = await response.json();

                if (data.success) {

                    setIsSaved(

                        data.data.some(
                            item => String(item.product_id) === String(productId)
                        )

                    );

                }

            }

            catch (err) {

                console.log(err);

            }

        };

        loadSaveStatus();

    }, [details, sessionToken]);


    const loadCartStatus = async () => {

        try {

            const productId =
                details.product_id ||
                details.gift_id ||
                details.shop_id ||
                details.premium_id;

            const response = await fetch(
                `${API}/api/user/cart?session_token=${sessionToken}`
            );

            const data = await response.json();

            if (data.success) {

                const item = data.data.find(
                    x => String(x.product_id) === String(productId)
                );

                if (item) {

                    setCartQuantity(item.quantity);

                } else {

                    setCartQuantity(0);

                }

            }

        }

        catch (err) {

            console.log(err);

        }

    };
    useEffect(() => {

        if (!details || !sessionToken) return;

        loadCartStatus();

    }, [details, sessionToken]);

    const handleSave = async () => {

        if (!details) return;

        const productId =
            details.product_id ||
            details.gift_id ||
            details.shop_id ||
            details.premium_id;

        try {

            if (isSaved) {

                const response = await fetch(

                    `${API}/api/user/wishlist/${productId}`,

                    {

                        method: "DELETE",

                        headers: {

                            "Content-Type": "application/json"

                        },

                        body: JSON.stringify({

                            session_token: sessionToken

                        })

                    }

                );

                const data = await response.json();

                if (!data.success) return;

                setIsSaved(false);

                setDetails(prev => ({

                    ...prev,

                    product_total_saves: Math.max(

                        (prev.product_total_saves || 0) - 1,

                        0

                    )

                }));

            }

            else {

                const response = await fetch(

                    `${API}/api/user/wishlist`,

                    {

                        method: "POST",

                        headers: {

                            "Content-Type": "application/json"

                        },

                        body: JSON.stringify({

                            session_token: sessionToken,

                            product_id: productId

                        })

                    }

                );

                const data = await response.json();

                if (!data.success) return;

                setIsSaved(true);

                setDetails(prev => ({

                    ...prev,

                    product_total_saves:
                        (prev.product_total_saves || 0) + 1

                }));

            }

        }

        catch (err) {

            console.log(err);

        }

    };

    const handleIncreaseCart = async () => {

        const productId =
            details.product_id ||
            details.gift_id ||
            details.shop_id ||
            details.premium_id;

        let quantity = cartQuantity;

        if (quantity === 0) {

            quantity = String(productId).startsWith("G") ||
                String(productId).startsWith("S")
                ? 1
                : 50;

            const response = await fetch(`${API}/api/user/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    session_token: sessionToken,
                    product_id: productId,
                    quantity
                })
            });

            const data = await response.json();

            if (!data.success) return;

        } else {

            quantity++;

            await fetch(`${API}/api/user/cart`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    session_token: sessionToken,
                    product_id: productId,
                    quantity
                })
            });

        }

        setCartQuantity(quantity);
        const response = await fetch(
            `${API}/api/user/cart?session_token=${sessionToken}`
        );

        const data = await response.json();

        if (data.success && setCartCount) {
            setCartCount(data.data.length);
        }

    };
    const handleDecreaseCart = async () => {

        if (cartQuantity === 0) return;

        const productId =
            details.product_id ||
            details.gift_id ||
            details.shop_id ||
            details.premium_id;

        let quantity = cartQuantity - 1;

        const minQty =
            String(productId).startsWith("G") ||
                String(productId).startsWith("S")
                ? 1
                : 50;

        if (quantity < minQty) {
            await fetch(`${API}/api/user/cart/${productId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    session_token: sessionToken
                })
            });
            const response = await fetch(
                `${API}/api/user/cart?session_token=${sessionToken}`
            );

            const data = await response.json();

            if (data.success && setCartCount) {
                setCartCount(data.data.length);
            }

            setCartQuantity(0);

        } else {

            await fetch(`${API}/api/user/cart`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    session_token: sessionToken,
                    product_id: productId,
                    quantity
                })
            });

            setCartQuantity(quantity);
            const response = await fetch(
                `${API}/api/user/cart?session_token=${sessionToken}`
            );

            const data = await response.json();

            if (data.success && setCartCount) {
                setCartCount(data.data.length);
            }

        }

    };
    const handleBuyNow = () => {

        if (!details) return;

        const productId =
            details.product_id ||
            details.gift_id ||
            details.shop_id ||
            details.premium_id;

        const id = String(productId);
        const isProduct =
            id.startsWith("G") ||
            id.startsWith("S");
        const quantity =
            cartQuantity > 0
                ? cartQuantity
                : isProduct
                    ? 1
                    : 50;

        const buyNowItem = {
            ...details,
            product_id: productId,
            quantity: quantity
        };

        onBuyNow(
            buyNowItem,
            isProduct ? "products" : "cards"
        );
    };
    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: details?.product_name || "AERODECK",
                    text: details?.product_name || "Check this out on AERODECK",
                    url: window.location.href
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert("Link copied!");
            }
        } catch (error) {
            console.log("Share cancelled");
        }
    };
    return (

        <div className="dt-page">
            <div className="dt-image-wrapper">

                <div
                    className="dt-image-box"

                    onTouchStart={(e) => {
                        setTouchStart(e.targetTouches[0].clientX);
                    }}

                    onTouchMove={(e) => {
                        setTouchEnd(e.targetTouches[0].clientX);
                    }}

                    onTouchEnd={() => {

                        const distance = touchStart - touchEnd;

                        if (Math.abs(distance) < 50) return;

                        if (distance > 0) {

                            if (currentIndex < images.length - 1) {
                                const next = currentIndex + 1;
                                setCurrentIndex(next);
                                setSelectedImage(images[next]);
                            }

                        } else {

                            if (currentIndex > 0) {
                                const prev = currentIndex - 1;
                                setCurrentIndex(prev);
                                setSelectedImage(images[prev]);
                            }

                        }

                    }}
                >

                    <img
                        src={selectedImage}
                        alt={product?.product_name}
                    />

                </div>
                <div className="dt-overlay">
                    <button
                        className="dt-back"
                        onClick={onBack}
                    >
                        ←
                    </button>
                    <button
                        className="dt-action-btn"
                        onClick={handleLike}
                    >

                        {isLiked ? (
                            <FaHeart style={{ color: "#ff2d55" }} />
                        ) : (
                            <FaRegHeart />
                        )}

                        <span>
                            {
                                details?.product_total_likes ??
                                details?.gift_total_likes ??
                                details?.shop_total_likes ??
                                details?.premium_total_likes ??
                                0
                            }
                        </span>

                    </button>

                    <button
                        className="dt-action-btn"
                        onClick={handleSave}
                    >

                        {isSaved ? <FaBookmark /> : <FaRegBookmark />}

                        <span>
                            {
                                details?.product_total_saves ??
                                details?.gift_total_saves ??
                                details?.shop_total_saves ??
                                details?.premium_total_saves ??
                                0
                            }
                        </span>

                    </button>
                    <button
                        className="dt-action-btn"
                    onClick={handleShare}
                    >
                        <FaShareAlt />
                    </button>
                </div>
                <div className="dt-image-count">

                    {images.indexOf(selectedImage) + 1} / {images.length}

                </div>

            </div>
            {/* Thumbnails */}

            <div className="dt-images">

                {images.map((image, index) => (

                    <img

                        key={index}

                        src={image}

                        alt={`Image ${index + 1}`}

                        onClick={() => {
                            setSelectedImage(image);
                            setCurrentIndex(index);
                        }}
                        className={
                            selectedImage === image
                                ? "dt-thumb active"
                                : "dt-thumb"
                        }

                    />

                ))}

            </div>
            <DetailsData
                product={details}
                productDetail={details?.productDetail}
                isLiked={isLiked}
                isSaved={isSaved}
                cartQuantity={cartQuantity}
                onLike={handleLike}
                onSave={handleSave}
                onIncreaseCart={handleIncreaseCart}
                onDecreaseCart={handleDecreaseCart}
                onBuyNow={handleBuyNow}
                onOpenDetails={onOpenDetails}
                onViewAll={onViewAll}
                onViewAllMedia={onViewAllMedia}
            />

        </div>

    );

}

export default Details;