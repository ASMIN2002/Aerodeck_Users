import { useEffect, useRef, useState, useCallback, memo } from "react";
import "./2VideoHero.css";
import { FiVolume2, FiVolumeX, FiPlay, FiPause } from "react-icons/fi";
import { API } from "../../../services/api";

const MUTE_STORAGE_KEY = "shopVideosMuted";
const CONTROLS_SELECTOR = ".shop-video-controls";

function getInitialMuted() {
    const saved = localStorage.getItem(MUTE_STORAGE_KEY);
    return saved === null ? true : saved === "true";
}

const getNextIndex = (current, total) => (current + 1) % total;
const getPrevIndex = (current, total) => (current === 0 ? total - 1 : current - 1);

function VideoHero() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(getInitialMuted);
    const [hasEnded, setHasEnded] = useState(false);

    const videoRef = useRef(null);
    const slideRef = useRef(null);
    const wasPlayingBeforeScrollRef = useRef(false);
    const isMutedRef = useRef(isMuted);
    const hasEndedRef = useRef(hasEnded);

    const dragRef = useRef({
        active: false,
        startX: 0,
        startTime: 0,
        duration: 0,
        raf: null,
    });

    useEffect(() => {
        let cancelled = false;
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API}/api/videohero/active`);
                const data = await res.json();
                if (!cancelled && data.success) setVideos(data.data || []);
            } catch (err) {
                console.error("Video fetch error:", err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchVideos();
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        isMutedRef.current = isMuted;
        localStorage.setItem(MUTE_STORAGE_KEY, String(isMuted));
        if (videoRef.current) videoRef.current.muted = isMuted;
    }, [isMuted]);

    useEffect(() => {
        hasEndedRef.current = hasEnded;
    }, [hasEnded]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || videos.length === 0) return;
        if (hasEnded) {
            video.pause();
            return;
        }
        if (isPlaying) {
            video.muted = isMutedRef.current;
            video.play().catch(() => { });
        } else {
            video.pause();
        }
    }, [currentIndex, isPlaying, videos, hasEnded]);

    useEffect(() => {
        const slide = slideRef.current;
        if (!slide) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = videoRef.current;
                    if (!video) return;
                    if (entry.isIntersecting) {
                        if (wasPlayingBeforeScrollRef.current && !hasEndedRef.current) {
                            video.muted = isMutedRef.current;
                            video.play()
                                .then(() => {
                                    setIsPlaying(true);
                                    wasPlayingBeforeScrollRef.current = false;
                                })
                                .catch(() => { });
                        }
                    } else if (!video.paused) {
                        video.pause();
                        setIsPlaying(false);
                        wasPlayingBeforeScrollRef.current = true;
                    }
                });
            },
            { threshold: 0.5 }
        );
        observer.observe(slide);
        return () => observer.disconnect();
    }, []);

    const handlePlayPause = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        if (isPlaying && !video.paused) {
            video.pause();
            setIsPlaying(false);
        } else {
            if (hasEnded) {
                video.currentTime = 0;
                setHasEnded(false);
            }
            video.muted = isMutedRef.current;
            video.play()
                .then(() => setIsPlaying(true))
                .catch(() => { });
        }
    }, [isPlaying, hasEnded]);

    const toggleMute = useCallback(() => setIsMuted((prev) => !prev), []);

    const handleVideoEnd = useCallback(() => {
        setIsPlaying(false);
        setHasEnded(true);
    }, []);

    const goToVideo = useCallback((index) => {
        setCurrentIndex(index);
        setIsPlaying(false);
        setHasEnded(false);
    }, []);

    const getDeltaTime = (clientX) => {
        const slide = slideRef.current;
        if (!slide) return 0;
        const rect = slide.getBoundingClientRect();
        const deltaX = clientX - dragRef.current.startX;
        return (deltaX / rect.width) * dragRef.current.duration;
    };

    const handleDragStart = (clientX) => {
        const video = videoRef.current;
        if (!video || !video.duration) return;
        dragRef.current = {
            active: true,
            startX: clientX,
            startTime: video.currentTime,
            duration: video.duration,
            raf: null,
        };
    };

    const handleDragMove = (clientX) => {
        if (!dragRef.current.active) return;
        if (dragRef.current.raf) return;
        dragRef.current.raf = requestAnimationFrame(() => {
            const video = videoRef.current;
            if (!video) { dragRef.current.raf = null; return; }
            const deltaTime = getDeltaTime(clientX);
            const newTime = dragRef.current.startTime + deltaTime;
            if (newTime >= video.duration || newTime <= 0) {
                dragRef.current.active = false;
            } else {
                video.currentTime = newTime;
            }
            dragRef.current.raf = null;
        });
    };

    const handleDragEnd = () => {
        dragRef.current.active = false;
        if (dragRef.current.raf) {
            cancelAnimationFrame(dragRef.current.raf);
            dragRef.current.raf = null;
        }
    };

    const isInsideControls = (target) => target.closest(CONTROLS_SELECTOR);

    const onTouchStart = (e) => {
        if (e.touches.length !== 1) return;
        if (isInsideControls(e.target)) return;
        handleDragStart(e.touches[0].clientX);
    };

    const onTouchMove = (e) => {
        if (e.touches.length !== 1) return;
        if (!dragRef.current.active) return;
        handleDragMove(e.touches[0].clientX);
    };

    const onMouseDown = (e) => {
        if (isInsideControls(e.target)) return;
        e.preventDefault();
        handleDragStart(e.clientX);
        const moveHandler = (ev) => handleDragMove(ev.clientX);
        const upHandler = () => {
            handleDragEnd();
            document.removeEventListener("mousemove", moveHandler);
            document.removeEventListener("mouseup", upHandler);
        };
        document.addEventListener("mousemove", moveHandler);
        document.addEventListener("mouseup", upHandler);
    };

    useEffect(() => {
        return () => {
            if (dragRef.current.raf) cancelAnimationFrame(dragRef.current.raf);
        };
    }, []);

    if (loading) return null;

    const currentVideo = videos[currentIndex];

    return (
        <section className="shop-video-section">
            <div className="heepit-intro">
                <h2>Hey! Welcome to Heepit</h2>
            </div>

            {videos.length === 0 ? (
                <div className="shop-video-empty">
                    <div className="shop-video-empty-icon">🎬</div>
                    <h3>No AD Available</h3>
                    <p>Please check back later</p>
                </div>
            ) : (
                <>
                    <div className="shop-video-info-row" key={currentIndex}>
                        <span className="shop-video-info-name infodtat">{currentVideo?.name}</span>
                        <span className="shop-video-info-date infodtat">
                            {new Date(currentVideo?.created_at).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                        </span>
                        <span className="shop-video-info-frontview infodtat">{currentVideo?.frontview}</span>
                    </div>
                    <div className="shop-video-scroll">
                        <div
                            className="shop-video-slide"
                            ref={slideRef}
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={handleDragEnd}
                            onMouseDown={onMouseDown}
                        >
                            <video
                                key={currentVideo?.id || currentIndex}
                                ref={videoRef}
                                src={currentVideo?.video_url}
                                muted
                                playsInline
                                preload="none"
                                poster={currentVideo?.thumbnail_url || currentVideo?.poster_url}
                                onEnded={handleVideoEnd}
                                onClick={handlePlayPause}
                            />

                            <div className="shop-video-controls">
                                <button
                                    type="button"
                                    className={`shop-video-btn shop-video-btn-tl ${isPlaying ? "active" : ""}`}
                                    onClick={handlePlayPause}
                                    aria-label={isPlaying ? "Pause" : "Play"}
                                >
                                    {isPlaying ? <FiPause /> : <FiPlay />}
                                </button>

                                <button
                                    type="button"
                                    className={`shop-video-btn shop-video-btn-tr ${!isMuted ? "active" : ""}`}
                                    onClick={toggleMute}
                                    aria-label={isMuted ? "Unmute" : "Mute"}
                                >
                                    {isMuted ? <FiVolumeX /> : <FiVolume2 />}
                                </button>

                                {videos.length > 1 && (
                                    <button
                                        type="button"
                                        className="shop-video-btn shop-video-btn-bl"
                                        onClick={() => goToVideo(getPrevIndex(currentIndex, videos.length))}
                                        aria-label="Previous"
                                    >
                                        ‹
                                    </button>
                                )}

                                {videos.length > 1 && (
                                    <button
                                        type="button"
                                        className="shop-video-btn shop-video-btn-br"
                                        onClick={() => goToVideo(getNextIndex(currentIndex, videos.length))}
                                        aria-label="Next"
                                    >
                                        ›
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {videos.length > 1 && (
                        <div className="shop-video-dots">
                            {videos.map((video, i) => (
                                <span
                                    key={video.id}
                                    className={`shop-video-dot ${currentIndex === i ? "active" : ""}`}
                                    onClick={() => goToVideo(i)}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

export default memo(VideoHero);