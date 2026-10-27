import { API } from "../../services/api";
import DetailsData from "./DetailsData";
import toast from "react-hot-toast";
import { useEffect, useRef, useState, useMemo, useCallback, memo } from "react";
import { FaShareAlt, FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { FiArrowLeft, FiX, FiEye } from "react-icons/fi";
import "../detailStyle/Details.css";
const TOAST_DURATION = 2500;
const SWIPE_THRESHOLD = 80;
const FULLSCREEN_SWIPE_THRESHOLD = 50;
const THUMBNAIL_TIMEOUT = 3000;
const MAX_ZOOM = 4;
const MIN_QTY = 1;
const getProductId = (details, product) => {
    const s = details || product?.data;
    if (!s) return null;
    return s.product_id || s.gift_id || s.shop_id || s.medicine_id || s.card_id || s.id || null;
};
const getApiType = (type) =>
    ({ products: "shop", cards: "card", gifts: "gift", medicine: "medicine", shop: "shop", card: "card", gift: "gift" }[type] || type);
const getImageSource = (source, index) => {
    for (const key of ["product", "gift", "shop", "medicine"]) {
        const val = source[`${key}_image${index}`];
        if (val) return val;
    }
    return null;
};
const isModel3D = (url) =>
    typeof url === "string" && /\.(glb|gltf)(\?|$)/i.test(url);
function Details({ product, onBack, setCartCount, onOpenDetails, onViewAll, onViewAllMedia, onBuyNow }) {
    const sessionToken = localStorage.getItem("session_token");
    const productType = product?.type || "shop";
    const isCard = productType === "cards" || productType === "card";
    const isMedicine = productType === "medicine";
    const showLike = !isMedicine;
    const showSave = true;
    const showCart = !isCard;
    const [details, setDetails] = useState(() => product?.data || null);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [cartQuantity, setCartQuantity] = useState(0);
    const [selectedColor, setSelectedColor] = useState(null);
    const [appliedColor, setAppliedColor] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [fullscreenImage, setFullscreenImage] = useState(null);
    const [imageZoom, setImageZoom] = useState(1);
    const [pinchDistance, setPinchDistance] = useState(null);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [panStart, setPanStart] = useState(null);
    const topVideoRef = useRef(null);
    const topVideoCardRef = useRef(null);
    const [topVideoPlaying, setTopVideoPlaying] = useState(false);
    const [topVideoWasPlaying, setTopVideoWasPlaying] = useState(false);
    const [topVideoThumbnail, setTopVideoThumbnail] = useState(null);
    const isVideo = useCallback((img) => img === details?.productDetail?.vdo1, [details?.productDetail?.vdo1]);
    const images = useMemo(() => {
        return [
            getImageSource(details || {}, 1),
            getImageSource(details || {}, 2),
            getImageSource(details || {}, 3),
            getImageSource(details || {}, 4),
            details?.productDetail?.vdo1,
        ].filter(Boolean);
    }, [details]);
    const openFullscreenImage = useCallback((image) => {
        if (isModel3D(image)) return;
        setFullscreenImage(image);
        setImageZoom(1);
        setPanOffset({ x: 0, y: 0 });
    }, []);
    const closeFullscreenImage = useCallback(() => {
        setFullscreenImage(null);
        setImageZoom(1);
        setPanOffset({ x: 0, y: 0 });
        setPinchDistance(null);
        setPanStart(null);
    }, []);
    useEffect(() => {
        if (!product?.data) return;
        const id = getProductId(null, product);
        if (!id) return;
        fetch(`${API}/api/user/details/${getApiType(product.type)}/${id}`)
            .then((r) => r.json())
            .then((result) => { if (result.success) setDetails(result.data); })
            .catch((err) => console.error("Details fetch error:", err.message));
    }, [product?.data, product?.type]);
    useEffect(() => {
        const source = details || product?.data;
        if (!source) return;
        const firstImage = getImageSource(source, 1) || source.productDetail?.vdo1 || null;
        setSelectedImage(firstImage);
        setCurrentIndex(0);
    }, [details?.product_image1, details?.gift_image1, details?.shop_image1, details?.medicine_image1, details?.productDetail?.vdo1]);
    useEffect(() => {
        const videoSrc = details?.productDetail?.vdo1;
        if (!videoSrc) return;
        const videoEl = document.createElement("video");
        videoEl.src = videoSrc;
        videoEl.crossOrigin = "anonymous";
        videoEl.muted = true;
        videoEl.playsInline = true;
        videoEl.preload = "auto";
        let thumbnailSet = false;
        const tryCapture = (time) => { videoEl.currentTime = time; };
        const onLoadedData = () => tryCapture(1);
        const onSeeked = () => {
            if (thumbnailSet) return;
            try {
                const canvas = document.createElement("canvas");
                canvas.width = videoEl.videoWidth || 320;
                canvas.height = videoEl.videoHeight || 240;
                canvas.getContext("2d").drawImage(videoEl, 0, 0, canvas.width, canvas.height);
                setTopVideoThumbnail(canvas.toDataURL("image/jpeg", 0.7));
                thumbnailSet = true;
            } catch (err) {
                console.error("Thumbnail error:", err.message);
                setTopVideoThumbnail(null);
            }
        };
        videoEl.addEventListener("loadeddata", onLoadedData, { once: true });
        videoEl.addEventListener("seeked", onSeeked);
        const timeout = setTimeout(() => { if (!thumbnailSet) tryCapture(0.5); }, THUMBNAIL_TIMEOUT);
        return () => {
            clearTimeout(timeout);
            videoEl.removeEventListener("seeked", onSeeked);
            videoEl.src = "";
        };
    }, [details?.productDetail?.vdo1]);
    const handleTopVideoPlayPause = useCallback(() => {
        const videoEl = topVideoRef.current;
        if (!videoEl) return;
        if (topVideoPlaying) {
            videoEl.pause();
            setTopVideoPlaying(false);
        } else {
            videoEl.muted = false;
            videoEl.play().then(() => setTopVideoPlaying(true)).catch((err) => console.error("Play error:", err.message));
        }
    }, [topVideoPlaying]);
    const handleTopVideoEnded = useCallback(() => {
        const videoEl = topVideoRef.current;
        if (videoEl) videoEl.currentTime = 0;
        setTopVideoPlaying(false);
    }, []);
    useEffect(() => {
        if (!topVideoCardRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const videoEl = topVideoRef.current;
                    if (!videoEl) return;
                    if (entry.isIntersecting) {
                        if (topVideoWasPlaying) {
                            videoEl.muted = false;
                            videoEl.play()
                                .then(() => { setTopVideoPlaying(true); setTopVideoWasPlaying(false); })
                                .catch(() => { });
                        }
                    } else if (topVideoPlaying && !videoEl.paused) {
                        videoEl.pause();
                        setTopVideoWasPlaying(true);
                        setTopVideoPlaying(false);
                    }
                });
            },
            { threshold: 0.5 }
        );
        observer.observe(topVideoCardRef.current);
        return () => observer.disconnect();
    }, [topVideoPlaying, topVideoWasPlaying]);
    useEffect(() => {
        const videoEl = topVideoRef.current;
        if (!videoEl) return;
        if (!isVideo(selectedImage) && topVideoPlaying) {
            videoEl.pause();
            setTopVideoPlaying(false);
        }
    }, [selectedImage, isVideo, topVideoPlaying]);
    useEffect(() => {
        if (!details || !sessionToken) return;
        const productId = getProductId(details);
        const fetches = [];
        if (showLike) {
            fetches.push(
                fetch(`${API}/api/user/likes?session_token=${sessionToken}`)
                    .then((r) => r.json())
                    .then((data) => {
                        if (data.success) setIsLiked(data.data.some((item) => String(item.product_id) === String(productId)));
                    })
                    .catch((err) => console.error("Like status error:", err.message))
            );
        }
        if (showSave) {
            fetches.push(
                fetch(`${API}/api/user/wishlist?session_token=${encodeURIComponent(sessionToken)}`)
                    .then((r) => r.json())
                    .then((data) => {
                        if (!data.success) return;
                        setIsSaved(data.data.some((item) => {
                            const savedId = item.product_id || item.gift_id || item.shop_id || item.medicine_id;
                            return String(savedId) === String(productId);
                        }));
                    })
                    .catch((err) => console.error("Save status error:", err.message))
            );
        }
        if (showCart) {
            fetches.push(
                fetch(`${API}/api/user/cart?session_token=${sessionToken}`)
                    .then((r) => r.json())
                    .then((data) => {
                        if (data.success) {
                            const item = data.data.find((x) => String(x.product_id) === String(productId));
                            setCartQuantity(item ? item.quantity : 0);
                        }
                    })
                    .catch((err) => console.error("Cart status error:", err.message))
            );
        }
        Promise.all(fetches);
    }, [details, sessionToken, showLike, showSave, showCart]);
    const updateLikeCount = useCallback((totalLikes) => {
        setDetails((prev) => ({
            ...prev,
            product_total_likes: totalLikes,
            gift_total_likes: totalLikes,
            shop_total_likes: totalLikes,
        }));
    }, []);
    const handleLike = useCallback(async () => {
        if (!details || !showLike) return;
        const productId = getProductId(details);
        try {
            const url = isLiked ? `${API}/api/user/likes/${productId}` : `${API}/api/user/likes`;
            const method = isLiked ? "DELETE" : "POST";
            const body = isLiked
                ? { session_token: sessionToken }
                : { session_token: sessionToken, product_id: productId };
            const data = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }).then((r) => r.json());
            if (!data.success) return;
            setIsLiked(!isLiked);
            updateLikeCount(data.totalLikes);
        } catch (err) { console.error("Like error:", err.message); }
    }, [details, showLike, isLiked, sessionToken, updateLikeCount]);
    const updateSaveCount = useCallback((productId, delta) => {
        setDetails((prev) => {
            const next = { ...prev };
            if (productId === prev.product_id) next.product_total_saves = Math.max(Number(prev.product_total_saves || 0) + delta, 0);
            if (productId === prev.gift_id) next.gift_total_saves = Math.max(Number(prev.gift_total_saves || 0) + delta, 0);
            if (productId === prev.shop_id) next.shop_total_saves = Math.max(Number(prev.shop_total_saves || 0) + delta, 0);
            if (productId === prev.medicine_id) next.medicine_total_saves = Math.max(Number(prev.medicine_total_saves || 0) + delta, 0);
            return next;
        });
    }, []);
    const handleSave = useCallback(async () => {
        if (!details || !sessionToken || !showSave) return;
        const productId = getProductId(details);
        if (!productId) return;
        try {
            const url = isSaved
                ? `${API}/api/user/wishlist/${encodeURIComponent(productId)}`
                : `${API}/api/user/wishlist`;
            const method = isSaved ? "DELETE" : "POST";
            const body = isSaved
                ? { session_token: sessionToken }
                : { session_token: sessionToken, product_id: productId };
            const data = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }).then((r) => r.json());
            if (!data.success) return;
            setIsSaved(!isSaved);
            updateSaveCount(productId, isSaved ? -1 : 1);
        } catch (err) { console.error("Save error:", err.message); }
    }, [details, sessionToken, showSave, isSaved, updateSaveCount]);
    const fetchCartAndUpdateCount = useCallback(async () => {
        const data = await fetch(`${API}/api/user/cart?session_token=${sessionToken}`).then((r) => r.json());
        if (data.success && setCartCount) setCartCount(data.data.length);
    }, [sessionToken, setCartCount]);
    const handleIncreaseCart = useCallback(async () => {
        if (!showCart) return;
        const productId = getProductId(details);
        const quantity = cartQuantity === 0 ? MIN_QTY : cartQuantity + 1;
        try {
            await fetch(`${API}/api/user/cart`, {
                method: cartQuantity === 0 ? "POST" : "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: sessionToken, product_id: productId, quantity }),
            });
            setCartQuantity(quantity);
            await fetchCartAndUpdateCount();
        } catch (err) { console.error("Cart update error:", err.message); }
    }, [showCart, details, cartQuantity, sessionToken, fetchCartAndUpdateCount]);
    const handleDecreaseCart = useCallback(async () => {
        if (!showCart || cartQuantity === 0) return;
        const productId = getProductId(details);
        const quantity = cartQuantity - 1;
        try {
            if (quantity < MIN_QTY) {
                await fetch(`${API}/api/user/cart/${productId}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_token: sessionToken }),
                });
                setCartQuantity(0);
            } else {
                await fetch(`${API}/api/user/cart`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_token: sessionToken, product_id: productId, quantity }),
                });
                setCartQuantity(quantity);
            }
            await fetchCartAndUpdateCount();
        } catch (err) { console.error("Cart update error:", err.message); }
    }, [showCart, details, cartQuantity, sessionToken, fetchCartAndUpdateCount]);
    const handleBuyNow = useCallback(() => {
        if (!details || !showCart) return;
        const productId = getProductId(details);
        const quantity = cartQuantity > 0 ? cartQuantity : MIN_QTY;
        onBuyNow({ ...details, product_id: productId, quantity }, "products");
    }, [details, showCart, cartQuantity, onBuyNow]);
    const handleShare = useCallback(() => {
        toast("Feature Coming Soon 🚀", {
            duration: TOAST_DURATION,
            style: {
                background: "#1a1a2e",
                color: "#fff",
                borderRadius: "10px",
                padding: "12px 18px",
                fontSize: "14px",
                fontWeight: 600,
                border: "1.5px solid rgba(162, 155, 254, 0.4)",
                boxShadow: "0 8px 24px rgba(162, 155, 254, 0.3)",
            },
        });
    }, []);
    const saveScroll = useCallback(() => {
        const homeContent = document.querySelector(".home-content");
        if (homeContent) sessionStorage.setItem("detailsScrollPosition", homeContent.scrollTop);
    }, []);
    const handleViewAll = useCallback(() => { saveScroll(); onViewAll(); }, [saveScroll, onViewAll]);
    const handleViewAllMedia = useCallback(() => { saveScroll(); onViewAllMedia(); }, [saveScroll, onViewAllMedia]);
    const activeImage = selectedImage || images[0] || null;
    const activeIndex = images.indexOf(activeImage);
    const isClothProduct = details?.shop_highlight_text?.trim().toLowerCase().endsWith("~clothes");
    const handleColorSelect = useCallback((hex) => setSelectedColor(hex), []);
    const handleApplyToSkeleton = useCallback(() => {
        if (selectedColor) setAppliedColor(selectedColor);
    }, [selectedColor]);
    const getColoredImageStyle = useCallback((img) => {
        if (!selectedColor || isVideo(img)) return {};
        return { "--cloth-color": selectedColor };
    }, [selectedColor, isVideo]);
    return (
        <div className="dt-page">
            <div className="dt-image-wrapper" ref={topVideoCardRef}>
                <div
                    className="dt-image-box"
                    onTouchStart={(e) => {
                        if (isVideo(activeImage) || isModel3D(activeImage)) return;
                        setTouchStart(e.touches[0].clientX);
                    }}
                    onTouchEnd={(e) => {
                        if (isVideo(activeImage) || isModel3D(activeImage)) return;
                        const distance = e.changedTouches[0].clientX - touchStart;
                        if (Math.abs(distance) < SWIPE_THRESHOLD) return;
                        if (distance < 0 && currentIndex < images.length - 1) {
                            const next = currentIndex + 1;
                            setCurrentIndex(next);
                            setSelectedImage(images[next]);
                        } else if (distance > 0 && currentIndex > 0) {
                            const prev = currentIndex - 1;
                            setCurrentIndex(prev);
                            setSelectedImage(images[prev]);
                        }
                    }}
                >
                    {isModel3D(activeImage) ? (
                        <model-viewer
                            src={activeImage}
                            camera-controls
                            auto-rotate
                            style={{ width: "100%", height: "100%", background: "#0f0f1a" }}
                        ></model-viewer>
                    ) : isVideo(activeImage) ? (
                        <div className="dt-top-video-container">
                            <video
                                ref={topVideoRef}
                                src={activeImage}
                                className="dt-top-video"
                                playsInline
                                preload="metadata"
                                poster={topVideoThumbnail || undefined}
                                onEnded={handleTopVideoEnded}
                                onClick={handleTopVideoPlayPause}
                            />
                            {!topVideoPlaying && (
                                <button className="dt-top-video-play" onClick={(e) => { e.stopPropagation(); handleTopVideoPlayPause(); }} aria-label="Play">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                                </button>
                            )}
                            {topVideoPlaying && (
                                <button className="dt-top-video-pause" onClick={(e) => { e.stopPropagation(); handleTopVideoPlayPause(); }} aria-label="Pause">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="dt-colored-image-wrap" style={getColoredImageStyle(activeImage)}>
                            <img
                                src={activeImage}
                                alt={product?.product_name}
                                className={selectedColor ? "dt-cloth-masked" : ""}
                                onClick={() => openFullscreenImage(activeImage)}
                                style={{ cursor: "zoom-in" }}
                            />
                            {selectedColor && (
                                <div
                                    className="dt-cloth-color-layer"
                                    style={{
                                        WebkitMaskImage: `url(${activeImage})`,
                                        maskImage: `url(${activeImage})`,
                                        backgroundColor: selectedColor,
                                    }}
                                />
                            )}
                        </div>
                    )}
                    {isClothProduct && !isVideo(activeImage) && !isModel3D(activeImage) && (
                        <button
                            className="dt-image-eye-btn"
                            onClick={handleApplyToSkeleton}
                            aria-label="Apply to 3D"
                            title="Apply to 3D"
                        >
                            <FiEye />
                        </button>
                    )}
                </div>
                <div className="dt-overlay">
                    <button className="dt-back" onClick={onBack} aria-label="Back">
                        <FiArrowLeft />
                    </button>
                    {showLike && (
                        <button className="dt-action-btn" onClick={handleLike}>
                            {isLiked ? <FaHeart style={{ color: "#ff2d55" }} /> : <FaRegHeart />}
                            <span>
                                {details?.product_total_likes ?? details?.gift_total_likes ?? details?.shop_total_likes ?? 0}
                            </span>
                        </button>
                    )}
                    {showSave && (
                        <button className="dt-action-btn" onClick={handleSave}>
                            {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                            <span>
                                {details?.product_total_saves ?? details?.gift_total_saves ?? details?.shop_total_saves ?? details?.medicine_total_saves ?? 0}
                            </span>
                        </button>
                    )}
                    <button className="dt-action-btn" onClick={handleShare}>
                        <FaShareAlt />
                    </button>
                </div>
                <div className="dt-image-count">{(activeIndex === -1 ? 0 : activeIndex) + 1} / {images.length}</div>
            </div>
            <div className="dt-images">
                {images.map((image, index) => {
                    const isVid = isVideo(image);
                    const isModel = isModel3D(image);
                    const isActive = activeImage === image;
                    if (isModel) {
                        return (
                            <div
                                key={index}
                                onClick={() => { setSelectedImage(image); setCurrentIndex(index); }}
                                className={`dt-thumb dt-thumb-model3d ${isActive ? "active" : ""}`}
                            >
                                <span>3D</span>
                            </div>
                        );
                    }
                    if (isVid) {
                        return (
                            <div
                                key={index}
                                onClick={() => { setSelectedImage(image); setCurrentIndex(index); }}
                                className={`dt-thumb dt-thumb-video ${isActive ? "active" : ""}`}
                            >
                                {topVideoThumbnail ? <img src={topVideoThumbnail} alt="" /> : <video src={image} muted playsInline preload="metadata" className="dt-thumb-video-preview" />}
                                <span className="dt-thumb-play">▶</span>
                            </div>
                        );
                    }
                    return (
                        <div key={index} className={`dt-thumb-wrap ${isActive ? "active" : ""}`}>
                            <img
                                src={image}
                                alt={`Image ${index + 1}`}
                                className={`dt-thumb ${isActive ? "active" : ""} ${selectedColor ? "dt-cloth-masked" : ""}`}
                                onClick={() => { setSelectedImage(image); setCurrentIndex(index); }}
                            />
                            {selectedColor && (
                                <div
                                    className="dt-cloth-color-layer dt-thumb-color-layer"
                                    style={{
                                        WebkitMaskImage: `url(${image})`,
                                        maskImage: `url(${image})`,
                                        backgroundColor: selectedColor,
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
            <DetailsData
                product={details}
                productType={productType}
                productDetail={details?.productDetail}
                isLiked={isLiked}
                isSaved={isSaved}
                cartQuantity={cartQuantity}
                showLike={showLike}
                showSave={showSave}
                showCart={showCart}
                onLike={handleLike}
                onSave={handleSave}
                onIncreaseCart={handleIncreaseCart}
                onDecreaseCart={handleDecreaseCart}
                onBuyNow={handleBuyNow}
                onOpenDetails={onOpenDetails}
                onViewAll={handleViewAll}
                onViewAllMedia={handleViewAllMedia}
                selectedColor={selectedColor}
                onSelectColor={handleColorSelect}
                appliedColor={appliedColor}
                isClothProduct={isClothProduct}
            />
            {fullscreenImage && (
                <div className="dt-fullscreen-overlay" onClick={closeFullscreenImage}>
                    <button className="dt-fullscreen-close" onClick={(e) => { e.stopPropagation(); closeFullscreenImage(); }} aria-label="Close">
                        <FiX />
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
                                    setPanStart({ x: e.touches[0].clientX, y: e.touches[0].clientY, offsetX: panOffset.x, offsetY: panOffset.y });
                                }
                            }
                        }}
                        onTouchMove={(e) => {
                            if (e.touches.length === 2 && pinchDistance) {
                                const dx = e.touches[0].clientX - e.touches[1].clientX;
                                const dy = e.touches[0].clientY - e.touches[1].clientY;
                                const currentDistance = Math.sqrt(dx * dx + dy * dy);
                                const scale = currentDistance / pinchDistance;
                                setImageZoom((prev) => Math.min(Math.max(prev * scale, 1), MAX_ZOOM));
                                setPinchDistance(currentDistance);
                            }
                            if (e.touches.length === 1 && panStart && imageZoom > 1) {
                                const dx = e.touches[0].clientX - panStart.x;
                                const dy = e.touches[0].clientY - panStart.y;
                                setPanOffset({ x: panStart.offsetX + dx, y: panStart.offsetY + dy });
                            }
                        }}
                        onTouchEnd={(e) => {
                            setPinchDistance(null);
                            setPanStart(null);
                            if (imageZoom > 1.05) return;
                            const distance = touchStart - e.changedTouches[0].clientX;
                            if (Math.abs(distance) < FULLSCREEN_SWIPE_THRESHOLD) return;
                            const nextIndex = distance > 0
                                ? (currentIndex === images.length - 1 ? 0 : currentIndex + 1)
                                : (currentIndex === 0 ? images.length - 1 : currentIndex - 1);
                            setCurrentIndex(nextIndex);
                            setSelectedImage(images[nextIndex]);
                            setFullscreenImage(images[nextIndex]);
                            setImageZoom(1);
                            setPanOffset({ x: 0, y: 0 });
                        }}
                    >
                        {isVideo(fullscreenImage) ? (
                            <video src={fullscreenImage} controls autoPlay playsInline className="dt-fullscreen-video" />
                        ) : (
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
                                    WebkitUserDrag: "none",
                                }}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
export default memo(Details);