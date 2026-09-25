import "./Details.css";
import { API } from "../../services/api";
import DetailsData from "./DetailsData/DetailsData";
import toast from "react-hot-toast";
import { FaShareAlt } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

import {
    FaHeart,
    FaRegHeart,
    FaBookmark,
    FaRegBookmark
} from "react-icons/fa";

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

    const [fullscreenImage, setFullscreenImage] = useState(null);
    const [imageZoom, setImageZoom] = useState(1);
    const [pinchDistance, setPinchDistance] = useState(null);

    /* Pan state — fullscreen image drag */
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [panStart, setPanStart] = useState(null);

    /* Video controls */
    const topVideoRef = useRef(null);
    const topVideoCardRef = useRef(null);
    const [topVideoPlaying, setTopVideoPlaying] = useState(false);
    const [topVideoWasPlaying, setTopVideoWasPlaying] = useState(false);
    const [topVideoProgress, setTopVideoProgress] = useState(0);
    const [topVideoThumbnail, setTopVideoThumbnail] = useState(null);

    const isVideo = (img) => img === details?.productDetail?.vdo1;

    const openFullscreenImage = (image) => {
        setFullscreenImage(image);
        setImageZoom(1);
        setPanOffset({ x: 0, y: 0 });
    };

    const closeFullscreenImage = () => {
        setFullscreenImage(null);
        setImageZoom(1);
        setPanOffset({ x: 0, y: 0 });
        setPinchDistance(null);
        setPanStart(null);
    };

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

        details?.productDetail?.vdo1,

    ].filter(Boolean);

    const [selectedImage, setSelectedImage] = useState(
        images[0] || null
    );

    useEffect(() => {

        if (!details) return;

        setSelectedImage(
            details.product_image1 ||
            details.gift_image1 ||
            details.shop_image1 ||
            details.premium_image1
        );

        setCurrentIndex(0);

    }, [details]);

    /* ============================================
       TOP VIDEO THUMBNAIL GENERATE
       ============================================ */
    useEffect(() => {

        const videoSrc = details?.productDetail?.vdo1;
        if (!videoSrc) return;

        const videoEl = document.createElement("video");
        videoEl.src = videoSrc;
        videoEl.crossOrigin = "anonymous";
        videoEl.muted = true;
        videoEl.playsInline = true;
        videoEl.preload = "metadata";

        videoEl.addEventListener("loadeddata", () => {
            videoEl.currentTime = 1;
        }, { once: true });

        videoEl.addEventListener("seeked", () => {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = videoEl.videoWidth;
                canvas.height = videoEl.videoHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
                setTopVideoThumbnail(dataUrl);
            } catch (err) {
                console.error("Thumbnail error:", err);
            }
        }, { once: true });

    }, [details?.productDetail?.vdo1]);

    /* ============================================
       TOP VIDEO — PLAY/PAUSE
       ============================================ */
    const handleTopVideoPlayPause = () => {

        const videoEl = topVideoRef.current;
        if (!videoEl) return;

        if (topVideoPlaying) {

            videoEl.pause();
            setTopVideoPlaying(false);

        } else {

            videoEl.muted = false;
            videoEl.play()
                .then(() => setTopVideoPlaying(true))
                .catch((err) => console.error("Play error:", err));

        }

    };

    const handleTopVideoTimeUpdate = () => {
        const videoEl = topVideoRef.current;
        if (!videoEl) return;
        const percent = (videoEl.currentTime / videoEl.duration) * 100;
        setTopVideoProgress(percent || 0);
    };

    const handleTopVideoSeek = (e) => {
        const videoEl = topVideoRef.current;
        if (!videoEl) return;

        const bar = e.currentTarget;
        const rect = bar.getBoundingClientRect();

        let clientX;
        if (e.touches && e.touches[0]) clientX = e.touches[0].clientX;
        else if (e.changedTouches && e.changedTouches[0]) clientX = e.changedTouches[0].clientX;
        else clientX = e.clientX;

        const x = clientX - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));
        videoEl.currentTime = percent * videoEl.duration;
    };

    const handleTopVideoEnded = () => {
        const videoEl = topVideoRef.current;
        if (videoEl) videoEl.currentTime = 0;
        setTopVideoPlaying(false);
    };

    /* ============================================
       TOP VIDEO — SCROLL PAUSE / RESUME
       ============================================ */
    useEffect(() => {

        if (!topVideoCardRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const videoEl = topVideoRef.current;
                    if (!videoEl) return;

                    if (entry.isIntersecting) {
                        /* scroll in */
                        if (topVideoWasPlaying) {
                            videoEl.muted = false;
                            videoEl.play()
                                .then(() => {
                                    setTopVideoPlaying(true);
                                    setTopVideoWasPlaying(false);
                                })
                                .catch(() => { });
                        }
                    } else {
                        /* scroll out */
                        if (topVideoPlaying && !videoEl.paused) {
                            videoEl.pause();
                            setTopVideoWasPlaying(true);
                            setTopVideoPlaying(false);
                        }
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(topVideoCardRef.current);
        return () => observer.disconnect();

    }, [topVideoPlaying, topVideoWasPlaying]);

    /* ============================================
       TOP VIDEO — pause when switching away
       ============================================ */
    useEffect(() => {
        const videoEl = topVideoRef.current;
        if (!videoEl) return;

        if (!isVideo(selectedImage) && topVideoPlaying) {
            videoEl.pause();
            setTopVideoPlaying(false);
        }
    }, [selectedImage]);

    /* ============================================
       FETCH DETAILS
       ============================================ */
    useEffect(() => {
        if (!product?.data) return;
        const savedScroll = sessionStorage.getItem("detailsScrollPosition");

        if (!savedScroll) {
            document.querySelector(".home-content")?.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }

        const fetchDetails = async () => {
            try {
                let id = null;
                switch (product.type) {
                    case "cards":
                    case "card":
                        id = product.data.product_id;
                        break;
                    case "gifts":
                    case "gift":
                        id = product.data.gift_id;
                        break;
                    case "products":
                    case "shop":
                        id = product.data.product_id || product.data.shop_id;
                        break;
                    case "premium":
                        id = product.data.premium_id;
                        break;
                    default:
                        return;
                }

                let apiType = product.type;
                if (apiType === "products") apiType = "shop";
                if (apiType === "cards") apiType = "card";
                if (apiType === "gifts") apiType = "gift";

                const response = await fetch(
                    `${API}/api/user/details/${apiType}/${id}`
                );
                const result = await response.json();
                if (result.success) setDetails(result.data);
            } catch (error) {
                console.error("Details fetch error:", error);
            }
        };

        fetchDetails();
    }, [product]);

    /* ============================================
       LIKE STATUS
       ============================================ */
    useEffect(() => {
        if (!details || !sessionToken) return;

        const loadLikeStatus = async () => {
            try {
                const productId =
                    details.product_id || details.gift_id ||
                    details.shop_id || details.premium_id;

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
            } catch (err) {
                console.log(err);
            }
        };

        loadLikeStatus();
    }, [details, sessionToken]);

    const handleLike = async () => {
        if (!details) return;
        const productId =
            details.product_id || details.gift_id ||
            details.shop_id || details.premium_id;

        try {
            if (isLiked) {
                const response = await fetch(
                    `${API}/api/user/likes/${productId}`,
                    {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ session_token: sessionToken })
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
            } else {
                const response = await fetch(
                    `${API}/api/user/likes`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
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
        } catch (err) {
            console.log(err);
        }
    };

    /* ============================================
       SAVE STATUS
       ============================================ */
    useEffect(() => {
        if (!details || !sessionToken) return;

        const loadSaveStatus = async () => {
            try {
                const productId =
                    details.product_id || details.gift_id ||
                    details.shop_id || details.premium_id;

                const response = await fetch(
                    `${API}/api/user/wishlist?session_token=${encodeURIComponent(sessionToken)}`
                );
                const data = await response.json();
                if (!response.ok || !data.success) return;

                const alreadySaved = data.data.some(item => {
                    const savedId = item.product_id || item.gift_id ||
                        item.shop_id || item.premium_id;
                    return String(savedId) === String(productId);
                });
                setIsSaved(alreadySaved);
            } catch (err) {
                console.error("Load save status error:", err);
            }
        };

        loadSaveStatus();
    }, [details, sessionToken]);

    const loadCartStatus = async () => {
        try {
            const productId =
                details.product_id || details.gift_id ||
                details.shop_id || details.premium_id;

            const response = await fetch(
                `${API}/api/user/cart?session_token=${sessionToken}`
            );
            const data = await response.json();
            if (data.success) {
                const item = data.data.find(
                    x => String(x.product_id) === String(productId)
                );
                setCartQuantity(item ? item.quantity : 0);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (!details || !sessionToken) return;
        loadCartStatus();
    }, [details, sessionToken]);

    const handleSave = async () => {
        if (!details || !sessionToken) return;

        const productId =
            details.product_id || details.gift_id ||
            details.shop_id || details.premium_id;
        if (!productId) return;

        try {
            if (isSaved) {
                const response = await fetch(
                    `${API}/api/user/wishlist/${encodeURIComponent(productId)}`,
                    {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ session_token: sessionToken })
                    }
                );
                const data = await response.json();
                if (!response.ok || !data.success) return;

                setIsSaved(false);
                setDetails(prev => {
                    const next = { ...prev };
                    if (productId === prev.product_id) {
                        next.product_total_saves = Math.max(Number(prev.product_total_saves || 0) - 1, 0);
                    }
                    if (productId === prev.gift_id) {
                        next.gift_total_saves = Math.max(Number(prev.gift_total_saves || 0) - 1, 0);
                    }
                    if (productId === prev.shop_id) {
                        next.shop_total_saves = Math.max(Number(prev.shop_total_saves || 0) - 1, 0);
                    }
                    if (productId === prev.premium_id) {
                        next.premium_total_saves = Math.max(Number(prev.premium_total_saves || 0) - 1, 0);
                    }
                    return next;
                });
                return;
            }

            const response = await fetch(
                `${API}/api/user/wishlist`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        session_token: sessionToken,
                        product_id: productId
                    })
                }
            );
            const data = await response.json();
            if (!response.ok || !data.success) return;

            setIsSaved(true);
            setDetails(prev => {
                const next = { ...prev };
                if (productId === prev.product_id) next.product_total_saves = Number(prev.product_total_saves || 0) + 1;
                if (productId === prev.gift_id) next.gift_total_saves = Number(prev.gift_total_saves || 0) + 1;
                if (productId === prev.shop_id) next.shop_total_saves = Number(prev.shop_total_saves || 0) + 1;
                if (productId === prev.premium_id) next.premium_total_saves = Number(prev.premium_total_saves || 0) + 1;
                return next;
            });
        } catch (err) {
            console.error("Save/Unsave error:", err);
        }
    };

    const handleIncreaseCart = async () => {
        const productId =
            details.product_id || details.gift_id ||
            details.shop_id || details.premium_id;

        let quantity = cartQuantity;

        if (quantity === 0) {
            quantity = String(productId).startsWith("G") ||
                String(productId).startsWith("S") ? 1 : 50;

            const response = await fetch(`${API}/api/user/cart`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
                headers: { "Content-Type": "application/json" },
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
            details.product_id || details.gift_id ||
            details.shop_id || details.premium_id;

        let quantity = cartQuantity - 1;
        const minQty = String(productId).startsWith("G") ||
            String(productId).startsWith("S") ? 1 : 50;

        if (quantity < minQty) {
            await fetch(`${API}/api/user/cart/${productId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: sessionToken })
            });
            const response = await fetch(
                `${API}/api/user/cart?session_token=${sessionToken}`
            );
            const data = await response.json();
            if (data.success && setCartCount) setCartCount(data.data.length);
            setCartQuantity(0);
        } else {
            await fetch(`${API}/api/user/cart`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
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
            if (data.success && setCartCount) setCartCount(data.data.length);
        }
    };

    const handleBuyNow = () => {
        if (!details) return;
        const productId =
            details.product_id || details.gift_id ||
            details.shop_id || details.premium_id;

        const id = String(productId);
        const isProduct = id.startsWith("G") || id.startsWith("S");
        const quantity = cartQuantity > 0 ? cartQuantity : (isProduct ? 1 : 50);

        const buyNowItem = { ...details, product_id: productId, quantity };
        onBuyNow(buyNowItem, isProduct ? "products" : "cards");
    };

    const handleShare = () => {
        toast("Feature Coming Soon 🚀", {
            duration: 2500,
            style: {
                background: "#1a1a2e",
                color: "#fff",
                borderRadius: "10px",
                padding: "12px 18px",
                fontSize: "14px",
                fontWeight: 600,
                border: "1.5px solid rgba(162, 155, 254, 0.4)",
                boxShadow: "0 8px 24px rgba(162, 155, 254, 0.3)"
            }
        });
    };

    const handleViewAll = () => {
        const homeContent = document.querySelector(".home-content");
        if (homeContent) {
            sessionStorage.setItem("detailsScrollPosition", homeContent.scrollTop);
        }
        onViewAll();
    };

    const handleViewAllMedia = () => {
        const homeContent = document.querySelector(".home-content");
        if (homeContent) {
            sessionStorage.setItem("detailsScrollPosition", homeContent.scrollTop);
        }
        onViewAllMedia();
    };

    /* ============================================
       BACK BUTTON — fullscreen close first
       ============================================ */
    useEffect(() => {

        const handlePopState = () => {
            if (fullscreenImage) {
                closeFullscreenImage();
                /* history wapas push karo taaki app exit na ho */
                window.history.pushState(null, "", window.location.href);
                return;
            }
        };

        if (fullscreenImage) {
            window.history.pushState(null, "", window.location.href);
            window.addEventListener("popstate", handlePopState);
        }

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };

    }, [fullscreenImage]);

    return (

        <div className="dt-page">
            <div className="dt-image-wrapper" ref={topVideoCardRef}>

                <div
                    className="dt-image-box"
                    onTouchStart={(e) => {
                        if (isVideo(selectedImage)) return;
                        setTouchStart(e.touches[0].clientX);
                    }}
                    onTouchEnd={(e) => {
                        if (isVideo(selectedImage)) return;

                        const touchEndX = e.changedTouches[0].clientX;
                        const distance = touchEndX - touchStart;
                        if (Math.abs(distance) < 80) return;

                        if (distance < 0) {
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

                    {isVideo(selectedImage) ? (

                        <div className="dt-top-video-container">

                            <video
                                ref={topVideoRef}
                                src={selectedImage}
                                className="dt-top-video"
                                playsInline
                                preload="metadata"
                                poster={topVideoThumbnail}
                                onTimeUpdate={handleTopVideoTimeUpdate}
                                onEnded={handleTopVideoEnded}
                                onClick={handleTopVideoPlayPause}
                            />

                            {/* PLAY BUTTON */}
                            {!topVideoPlaying && (
                                <button
                                    className="dt-top-video-play"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTopVideoPlayPause();
                                    }}
                                    aria-label="Play"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </button>
                            )}

                            {/* PAUSE BUTTON */}
                            {topVideoPlaying && (
                                <button
                                    className="dt-top-video-pause"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTopVideoPlayPause();
                                    }}
                                    aria-label="Pause"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                        <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                                    </svg>
                                </button>
                            )}

                            {/* PROGRESS BAR */}
                            <div
                                className="dt-top-video-progress"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleTopVideoSeek(e);
                                }}
                                onTouchStart={(e) => {
                                    e.stopPropagation();
                                    handleTopVideoSeek(e);
                                }}
                                onTouchMove={(e) => {
                                    e.stopPropagation();
                                    handleTopVideoSeek(e);
                                }}
                            >
                                <div
                                    className="dt-top-video-progress-fill"
                                    style={{ width: `${topVideoProgress}%` }}
                                />
                            </div>

                        </div>

                    ) : (
                        <img
                            src={selectedImage}
                            alt={product?.product_name}
                            onClick={() => openFullscreenImage(selectedImage)}
                            style={{ cursor: "zoom-in" }}
                        />
                    )}
                </div>

                <div className="dt-overlay">
                    <button className="dt-back" onClick={onBack}>←</button>

                    <button className="dt-action-btn" onClick={handleLike}>
                        {isLiked ? (
                            <FaHeart style={{ color: "#ff2d55" }} />
                        ) : (
                            <FaRegHeart />
                        )}
                        <span>
                            {details?.product_total_likes ??
                                details?.gift_total_likes ??
                                details?.shop_total_likes ??
                                details?.premium_total_likes ?? 0}
                        </span>
                    </button>

                    <button className="dt-action-btn" onClick={handleSave}>
                        {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                        <span>
                            {details?.product_total_saves ??
                                details?.gift_total_saves ??
                                details?.shop_total_saves ??
                                details?.premium_total_saves ?? 0}
                        </span>
                    </button>

                    <button className="dt-action-btn" onClick={handleShare}>
                        <FaShareAlt />
                    </button>
                </div>

                <div className="dt-image-count">
                    {images.indexOf(selectedImage) + 1} / {images.length}
                </div>

            </div>

            {/* Thumbnails */}
            <div className="dt-images">
                {images.map((image, index) => {
                    const isVid = isVideo(image);
                    return isVid ? (
                        <div
                            key={index}
                            onClick={() => {
                                setSelectedImage(image);
                                setCurrentIndex(index);
                            }}
                            className={
                                selectedImage === image
                                    ? "dt-thumb dt-thumb-video active"
                                    : "dt-thumb dt-thumb-video"
                            }
                        >
                            {topVideoThumbnail ? (
                                <img src={topVideoThumbnail} alt="" />
                            ) : (
                                <div className="dt-thumb-placeholder" />
                            )}
                            <span className="dt-thumb-play">▶</span>
                        </div>
                    ) : (
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
                    );
                })}
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
                onViewAll={handleViewAll}
                onViewAllMedia={handleViewAllMedia}
            />

            {fullscreenImage && (
                <div
                    className="dt-fullscreen-overlay"
                    onClick={closeFullscreenImage}
                >

                    {/* CLOSE BUTTON */}
                    <button
                        className="dt-fullscreen-close"
                        onClick={(e) => {
                            e.stopPropagation();
                            closeFullscreenImage();
                        }}
                    >
                        ✕
                    </button>

                    <div
                        className="dt-fullscreen-image-box"
                        onClick={(e) => e.stopPropagation()}

                        onTouchStart={(e) => {

                            if (e.touches.length === 2) {
                                const dx = e.touches[0].clientX - e.touches[1].clientX;
                                const dy = e.touches[0].clientY - e.touches[1].clientY;
                                setPinchDistance(Math.sqrt(dx * dx + dy * dy));
                            }

                            if (e.touches.length === 1) {
                                setTouchStart(e.touches[0].clientX);

                                if (imageZoom > 1) {
                                    setPanStart({
                                        x: e.touches[0].clientX,
                                        y: e.touches[0].clientY,
                                        offsetX: panOffset.x,
                                        offsetY: panOffset.y
                                    });
                                }
                            }
                        }}

                        onTouchMove={(e) => {

                            if (e.touches.length === 2 && pinchDistance) {
                                const dx = e.touches[0].clientX - e.touches[1].clientX;
                                const dy = e.touches[0].clientY - e.touches[1].clientY;
                                const currentDistance = Math.sqrt(dx * dx + dy * dy);
                                const scale = currentDistance / pinchDistance;

                                setImageZoom((prev) => {
                                    const newZoom = prev * scale;
                                    return Math.min(Math.max(newZoom, 1), 4);
                                });

                                setPinchDistance(currentDistance);
                            }

                            if (e.touches.length === 1 && panStart && imageZoom > 1) {
                                const dx = e.touches[0].clientX - panStart.x;
                                const dy = e.touches[0].clientY - panStart.y;

                                setPanOffset({
                                    x: panStart.offsetX + dx,
                                    y: panStart.offsetY + dy
                                });
                            }
                        }}

                        onTouchEnd={(e) => {

                            setPinchDistance(null);
                            setPanStart(null);

                            if (imageZoom > 1.05) return;

                            const touchEndX = e.changedTouches[0].clientX;
                            const distance = touchStart - touchEndX;
                            if (Math.abs(distance) < 50) return;

                            if (distance > 0) {
                                const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
                                setCurrentIndex(nextIndex);
                                setSelectedImage(images[nextIndex]);
                                setFullscreenImage(images[nextIndex]);
                                setImageZoom(1);
                                setPanOffset({ x: 0, y: 0 });
                            } else {
                                const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
                                setCurrentIndex(prevIndex);
                                setSelectedImage(images[prevIndex]);
                                setFullscreenImage(images[prevIndex]);
                                setImageZoom(1);
                                setPanOffset({ x: 0, y: 0 });
                            }
                        }}

                    >
                        <img
                            src={fullscreenImage}
                            alt="Fullscreen Preview"
                            style={{
                                transform: `scale(${imageZoom}) translate(${panOffset.x / imageZoom}px, ${panOffset.y / imageZoom}px)`,
                                transformOrigin: "center center",
                                transition: pinchDistance || panStart ? "none" : "transform 0.2s ease-out",
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                                userSelect: "none",
                                WebkitUserDrag: "none"
                            }}
                        />
                    </div>

                </div>
            )}
        </div>
    );
}

export default Details;