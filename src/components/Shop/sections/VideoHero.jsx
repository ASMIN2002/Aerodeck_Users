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
    const [isPlaying, setIsPlaying] = useState(true);

    const [isMuted, setIsMuted] = useState(() => {
        const saved = localStorage.getItem("shopVideosMuted");
        return saved === null ? true : saved === "true";
    });

    const videoRef = useRef(null);

    /* ===============================
       FETCH ACTIVE VIDEOS
    =============================== */
    useEffect(() => {

        const fetchVideos = async () => {

            try {

                setLoading(true);

                const res = await fetch(
                    `${API}/api/videohero/active`
                );

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
       MUTE STATE SAVE
    =============================== */
    useEffect(() => {

        localStorage.setItem(
            "shopVideosMuted",
            String(isMuted)
        );

        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }

    }, [isMuted, currentIndex]);

    /* ===============================
       PLAY VIDEO WHEN INDEX CHANGES
    =============================== */
    useEffect(() => {

        if (videos.length === 0) return;

        const video = videoRef.current;
        if (!video) return;

        video.muted = isMuted;

        if (isPlaying) {
            video.play().catch(() => {});
        }

    }, [currentIndex, videos, isPlaying]);

    /* ===============================
       HANDLERS
    =============================== */
    const toggleMute = () => setIsMuted((prev) => !prev);

    const togglePlay = () => {

        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play().catch(() => {});
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }

    };

    /* ✅ VIDEO END → NEXT VIDEO */
    const handleVideoEnd = () => {

        const nextIndex = (currentIndex + 1) % videos.length;

        setCurrentIndex(nextIndex);
        setIsPlaying(true);

    };

    /* ✅ DOT CLICK → JUMP TO VIDEO */
    const goToVideo = (index) => {
        setCurrentIndex(index);
        setIsPlaying(true);
    };

    /* ===============================
       LOADING
    =============================== */
    if (loading) return null;

    /* ===============================
       RENDER
    =============================== */
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
                        <div className="shop-video-slide">

                            <video
                                ref={videoRef}
                                src={videos[currentIndex]?.video_url}
                                autoPlay
                                muted
                                playsInline
                                preload="auto"
                                onEnded={handleVideoEnd}
                            />

                            <div className="shop-video-info-name">
                                {videos[currentIndex]?.name}
                            </div>

                            <div className="shop-video-info-date">
                                {new Date(
                                    videos[currentIndex]?.created_at
                                ).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                })}
                            </div>

                            <div className="shop-video-info-frontview">
                                {videos[currentIndex]?.frontview}
                            </div>

                            <div className="shop-video-controls">

                                <button
                                    type="button"
                                    className="shop-video-control-btn"
                                    onClick={togglePlay}
                                    aria-label={
                                        isPlaying ? "Pause" : "Play"
                                    }
                                >
                                    {isPlaying ? (
                                        <FiPause />
                                    ) : (
                                        <FiPlay />
                                    )}
                                </button>

                                <button
                                    type="button"
                                    className="shop-video-control-btn"
                                    onClick={toggleMute}
                                    aria-label={
                                        isMuted ? "Unmute" : "Mute"
                                    }
                                >
                                    {isMuted ? (
                                        <FiVolumeX />
                                    ) : (
                                        <FiVolume2 />
                                    )}
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