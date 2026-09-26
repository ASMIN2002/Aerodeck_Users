import { useEffect, useRef, useState } from "react";
import "./VideoHero.css";
import {
    FiVolume2,
    FiVolumeX,
    FiPlay,
    FiPause
} from "react-icons/fi";
import { API } from "../../../services/api";

function VideoHero() {

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    /* Independent sticky states */
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(() => {
        const saved = localStorage.getItem("shopVideosMuted");
        return saved === null ? true : saved === "true";
    });

    const videoRef = useRef(null);
    const slideRef = useRef(null);

    const dragRef = useRef({
        active: false,
        startX: 0,
        startTime: 0,
        duration: 0
    });

    /* ===============================
       FETCH ACTIVE VIDEOS
    =============================== */
    useEffect(() => {

        const fetchVideos = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API}/api/videohero/active`);
                const data = await res.json();
                if (data.success) {
                    setVideos(data.data || []);
                }
            } catch (err) {
                console.error("Video fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();

    }, []);

    /* ===============================
       MUTE — apply to video only
    =============================== */
    useEffect(() => {
        localStorage.setItem("shopVideosMuted", String(isMuted));
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted, currentIndex]);

    /* ===============================
       PLAY/PAUSE — apply to video only
    =============================== */
    useEffect(() => {
        if (videos.length === 0) return;
        const video = videoRef.current;
        if (!video) return;

        video.muted = isMuted;

        if (isPlaying) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    }, [currentIndex, videos, isPlaying]);

    /* ===============================
       BUTTONS — independent
    =============================== */
    const togglePlay = () => {
        setIsPlaying((prev) => !prev);
    };

    const toggleMute = () => {
        setIsMuted((prev) => !prev);
    };

    const handleVideoEnd = () => {
        const nextIndex = (currentIndex + 1) % videos.length;
        setCurrentIndex(nextIndex);
        setIsPlaying(true);
    };

    const goToVideo = (index) => {
        setCurrentIndex(index);
        setIsPlaying(true);
    };

    /* ============================================
       DRAG — only seek, no play/pause
    ============================================ */
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
            duration: video.duration
        };
    };

    const handleDragMove = (clientX) => {
        const video = videoRef.current;
        if (!video || !dragRef.current.active) return;

        const deltaTime = getDeltaTime(clientX);
        const newTime = dragRef.current.startTime + deltaTime;

        if (newTime >= video.duration) {
            dragRef.current.active = false;
            const nextIndex = (currentIndex + 1) % videos.length;
            setCurrentIndex(nextIndex);
            return;
        }

        if (newTime <= 0) {
            dragRef.current.active = false;
            const prevIndex =
                currentIndex === 0 ? videos.length - 1 : currentIndex - 1;
            setCurrentIndex(prevIndex);
            return;
        }

        video.currentTime = newTime;
    };

    const handleDragEnd = () => {
        dragRef.current.active = false;
    };

    /* ============================================
       TOUCH — only drag
    ============================================ */
    const onTouchStart = (e) => {
        if (e.touches.length !== 1) return;
        if (e.target.closest(".shop-video-controls")) return;
        handleDragStart(e.touches[0].clientX);
    };

    const onTouchMove = (e) => {
        if (e.touches.length !== 1) return;
        if (!dragRef.current.active) return;
        handleDragMove(e.touches[0].clientX);
    };

    const onTouchEnd = () => {
        handleDragEnd();
    };

    /* ============================================
       MOUSE — only drag
    ============================================ */
    const onMouseDown = (e) => {
        if (e.target.closest(".shop-video-controls")) return;
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

    if (loading) return null;

    return (
        <section className="shop-video-section">

            {videos.length === 0 ? (

                <div className="shop-video-empty">
                    <div className="shop-video-empty-icon">🎬</div>
                    <h3>No AD Available</h3>
                    <p>Please check back later</p>
                </div>

            ) : (

                <>

                    <div className="shop-video-scroll">
                        <div
                            className="shop-video-slide"
                            ref={slideRef}
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                            onMouseDown={onMouseDown}
                        >

                            <video
                                ref={videoRef}
                                src={videos[currentIndex]?.video_url}
                                autoPlay
                                muted
                                playsInline
                                preload="auto"
                                onEnded={handleVideoEnd}
                            />

                            {/* TOP LEFT — Name */}
                            <div className="shop-video-info-name">
                                {videos[currentIndex]?.name}
                            </div>

                            {/* TOP RIGHT — Date */}
                            <div className="shop-video-info-date">
                                {new Date(
                                    videos[currentIndex]?.created_at
                                ).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                })}
                            </div>

                            {/* BOTTOM LEFT — Frontview */}
                            <div className="shop-video-info-frontview">
                                {videos[currentIndex]?.frontview}
                            </div>

                            {/* BOTTOM RIGHT — Controls */}
                            <div className="shop-video-controls">

                                {/* Play/Pause — purple when playing */}
                                <button
                                    type="button"
                                    className={`shop-video-control-btn ${isPlaying ? "purple" : ""}`}
                                    onClick={togglePlay}
                                    aria-label={isPlaying ? "Pause" : "Play"}
                                >
                                    {isPlaying ? <FiPause /> : <FiPlay />}
                                </button>

                                {/* Mute — purple when unmuted */}
                                <button
                                    type="button"
                                    className={`shop-video-control-btn ${!isMuted ? "purple" : ""}`}
                                    onClick={toggleMute}
                                    aria-label={isMuted ? "Unmute" : "Mute"}
                                >
                                    {isMuted ? <FiVolumeX /> : <FiVolume2 />}
                                </button>

                            </div>

                        </div>
                    </div>

                    {videos.length > 1 && (
                        <div className="shop-video-dots">
                            {videos.map((video, i) => (
                                <span
                                    key={video.id}
                                    className={`shop-video-dot ${
                                        currentIndex === i ? "active" : ""
                                    }`}
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

export default VideoHero;