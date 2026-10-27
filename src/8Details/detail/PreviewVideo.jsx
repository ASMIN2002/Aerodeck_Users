import { useRef, useState, useEffect, useMemo, useCallback, memo } from "react";
import { FiPlay, FiPause } from "react-icons/fi";
import "../detailStyle/PreviewVideo.css";

const THUMBNAIL_QUALITY = 0.7;
const THUMBNAIL_TIME = 1;
const SCROLL_THRESHOLD = 0.5;

const getClientX = (e) => e.touches?.[0]?.clientX ?? e.changedTouches?.[0]?.clientX ?? e.clientX;

function PreviewVideo({ productDetail }) {
    const videos = useMemo(
        () => [productDetail?.vdo1 || "", productDetail?.vdo2 || "", productDetail?.vdo3 || ""].filter(Boolean),
        [productDetail?.vdo1, productDetail?.vdo2, productDetail?.vdo3]
    );

    const videoRefs = useRef([]);
    const cardRefs = useRef([]);
    const wasPlayingBeforeScrollRef = useRef({});
    const playingIndexRef = useRef(null);

    const [playingIndex, setPlayingIndex] = useState(null);
    const [thumbnails, setThumbnails] = useState({});
    const [progress, setProgress] = useState({});

    useEffect(() => {
        playingIndexRef.current = playingIndex;
    }, [playingIndex]);

    useEffect(() => {
        videos.forEach((video, index) => {
            const videoEl = document.createElement("video");
            videoEl.src = video;
            videoEl.crossOrigin = "anonymous";
            videoEl.muted = true;
            videoEl.playsInline = true;
            videoEl.preload = "metadata";

            videoEl.addEventListener("loadeddata", () => { videoEl.currentTime = THUMBNAIL_TIME; }, { once: true });

            videoEl.addEventListener("seeked", () => {
                try {
                    const canvas = document.createElement("canvas");
                    canvas.width = videoEl.videoWidth;
                    canvas.height = videoEl.videoHeight;
                    canvas.getContext("2d").drawImage(videoEl, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL("image/jpeg", THUMBNAIL_QUALITY);
                    setThumbnails((prev) => ({ ...prev, [index]: dataUrl }));
                } catch (err) {
                    console.error("Thumbnail error:", err.message);
                }
            }, { once: true });
        });
    }, [videos]);

    useEffect(() => {
        const observers = [];
        cardRefs.current.forEach((card, index) => {
            if (!card) return;
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        const videoEl = videoRefs.current[index];
                        if (!videoEl) return;

                        if (entry.isIntersecting) {
                            if (wasPlayingBeforeScrollRef.current[index]) {
                                videoEl.muted = false;
                                videoEl.play()
                                    .then(() => {
                                        setPlayingIndex(index);
                                        wasPlayingBeforeScrollRef.current[index] = false;
                                    })
                                    .catch(() => { });
                            }
                        } else if (playingIndexRef.current === index && !videoEl.paused) {
                            videoEl.pause();
                            wasPlayingBeforeScrollRef.current[index] = true;
                            setPlayingIndex(null);
                        }
                    });
                },
                { threshold: SCROLL_THRESHOLD }
            );
            observer.observe(card);
            observers.push(observer);
        });
        return () => observers.forEach((o) => o.disconnect());
    }, [videos.length]);

    useEffect(() => {
        return () => videoRefs.current.forEach((v) => { if (v) v.pause(); });
    }, []);

    const handlePlayPause = useCallback((index) => {
        const videoEl = videoRefs.current[index];
        if (!videoEl) return;

        if (playingIndexRef.current === index) {
            videoEl.pause();
            setPlayingIndex(null);
            return;
        }

        if (playingIndexRef.current !== null) {
            const prevVideo = videoRefs.current[playingIndexRef.current];
            if (prevVideo) {
                prevVideo.pause();
                prevVideo.currentTime = 0;
            }
        }

        videoEl.muted = false;
        videoEl.play()
            .then(() => setPlayingIndex(index))
            .catch((err) => console.error("Play error:", err.message));
    }, []);

    const handleEnded = useCallback((index) => {
        const videoEl = videoRefs.current[index];
        if (videoEl) videoEl.currentTime = 0;
        setPlayingIndex(null);
    }, []);

    const handlePause = useCallback((index) => {
        if (playingIndexRef.current === index) setPlayingIndex(null);
    }, []);

    const handleTimeUpdate = useCallback((index) => {
        const videoEl = videoRefs.current[index];
        if (!videoEl || !videoEl.duration) return;
        const percent = (videoEl.currentTime / videoEl.duration) * 100;
        setProgress((prev) => ({ ...prev, [index]: percent || 0 }));
    }, []);

    const handleSeek = useCallback((index, e) => {
        const videoEl = videoRefs.current[index];
        if (!videoEl) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = getClientX(e) - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));
        videoEl.currentTime = percent * videoEl.duration;
    }, []);

    return (
        <div className="dt-preview">
            <h3>Product Preview</h3>

            {videos.length === 0 ? (
                <div className="dt-no-preview">No Preview Available</div>
            ) : (
                <div className="dt-reels-container">
                    {videos.map((video, index) => {
                        const isPlaying = playingIndex === index;
                        const thumbnail = thumbnails[index];
                        const videoProgress = progress[index] || 0;

                        return (
                            <div
                                className="dt-reel-card"
                                key={index}
                                ref={(el) => (cardRefs.current[index] = el)}
                            >
                                <video
                                    ref={(el) => (videoRefs.current[index] = el)}
                                    className="dt-reel-video"
                                    src={video}
                                    playsInline
                                    preload="none"
                                    poster={thumbnail}
                                    onPlay={() => setPlayingIndex(index)}
                                    onPause={() => handlePause(index)}
                                    onEnded={() => handleEnded(index)}
                                    onTimeUpdate={() => handleTimeUpdate(index)}
                                    onClick={() => handlePlayPause(index)}
                                />

                                {!isPlaying && (
                                    <button
                                        className="dt-reel-play-btn"
                                        onClick={(e) => { e.stopPropagation(); handlePlayPause(index); }}
                                        aria-label="Play"
                                    >
                                        <FiPlay />
                                    </button>
                                )}

                                <div className="dt-reel-badge">Video {index + 1}</div>

                                <div
                                    className="dt-reel-progress"
                                    onClick={(e) => { e.stopPropagation(); handleSeek(index, e); }}
                                    onTouchStart={(e) => { e.stopPropagation(); handleSeek(index, e); }}
                                    onTouchMove={(e) => { e.stopPropagation(); handleSeek(index, e); }}
                                >
                                    <div className="dt-reel-progress-fill" style={{ width: `${videoProgress}%` }} />
                                    <div className="dt-reel-progress-thumb" style={{ left: `${videoProgress}%` }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default memo(PreviewVideo);