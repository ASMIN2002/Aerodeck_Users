import { useRef, useState, useEffect } from "react";
import "../detailStyle/PreviewVideo.css";

const THUMBNAIL_QUALITY = 0.7;
const THUMBNAIL_TIME = 1;
const SCROLL_THRESHOLD = 0.5;

function addToSet(set, value) {
    const next = new Set(set);
    next.add(value);
    return next;
}

function removeFromSet(set, value) {
    const next = new Set(set);
    next.delete(value);
    return next;
}

function getClientX(e) {
    if (e.touches?.[0]) return e.touches[0].clientX;
    if (e.changedTouches?.[0]) return e.changedTouches[0].clientX;
    return e.clientX;
}

function PreviewVideo({ productDetail }) {
    const videos = [
        productDetail?.vdo1 || "",
        productDetail?.vdo2 || "",
        productDetail?.vdo3 || "",
    ].filter(Boolean);

    const videoRefs = useRef([]);
    const cardRefs = useRef([]);

    const [playingIndex, setPlayingIndex] = useState(null);
    const [pausedIndexes, setPausedIndexes] = useState(new Set());
    const [thumbnails, setThumbnails] = useState({});
    const [progress, setProgress] = useState({});
    const [wasPlayingBeforeScroll, setWasPlayingBeforeScroll] = useState({});

    useEffect(() => {
        videos.forEach((video, index) => {
            const videoEl = document.createElement("video");
            videoEl.src = video;
            videoEl.crossOrigin = "anonymous";
            videoEl.muted = true;
            videoEl.playsInline = true;
            videoEl.preload = "metadata";

            videoEl.addEventListener(
                "loadeddata",
                () => {
                    videoEl.currentTime = THUMBNAIL_TIME;
                },
                { once: true }
            );

            videoEl.addEventListener(
                "seeked",
                () => {
                    try {
                        const canvas = document.createElement("canvas");
                        canvas.width = videoEl.videoWidth;
                        canvas.height = videoEl.videoHeight;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
                        const dataUrl = canvas.toDataURL("image/jpeg", THUMBNAIL_QUALITY);
                        setThumbnails((prev) => ({ ...prev, [index]: dataUrl }));
                    } catch (err) {
                        console.error("Thumbnail error:", err.message);
                    }
                },
                { once: true }
            );
        });
    }, [videos.join(",")]);

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
                            if (wasPlayingBeforeScroll[index]) {
                                videoEl.muted = false;
                                videoEl
                                    .play()
                                    .then(() => {
                                        setPlayingIndex(index);
                                        setWasPlayingBeforeScroll((prev) => ({
                                            ...prev,
                                            [index]: false,
                                        }));
                                    })
                                    .catch(() => { });
                            }
                        } else {
                            if (playingIndex === index && !videoEl.paused) {
                                videoEl.pause();
                                setWasPlayingBeforeScroll((prev) => ({
                                    ...prev,
                                    [index]: true,
                                }));
                                setPlayingIndex(null);
                                setPausedIndexes((prev) => addToSet(prev, index));
                            }
                        }
                    });
                },
                { threshold: SCROLL_THRESHOLD }
            );

            observer.observe(card);
            observers.push(observer);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, [playingIndex, wasPlayingBeforeScroll, videos.length]);

    useEffect(() => {
        return () => {
            videoRefs.current.forEach((v) => {
                if (v) v.pause();
            });
        };
    }, []);

    const handlePlayPause = (index) => {
        const videoEl = videoRefs.current[index];
        if (!videoEl) return;

        if (playingIndex === index) {
            videoEl.pause();
            setPlayingIndex(null);
            setPausedIndexes((prev) => addToSet(prev, index));
            return;
        }

        if (playingIndex !== null) {
            const prevVideo = videoRefs.current[playingIndex];
            if (prevVideo) {
                prevVideo.pause();
                prevVideo.currentTime = 0;
            }
        }

        videoEl.muted = false;
        videoEl
            .play()
            .then(() => {
                setPlayingIndex(index);
                setPausedIndexes((prev) => removeFromSet(prev, index));
            })
            .catch((err) => console.error("Play error:", err.message));
    };

    const handleEnded = (index) => {
        const videoEl = videoRefs.current[index];
        if (videoEl) videoEl.currentTime = 0;
        setPlayingIndex(null);
        setPausedIndexes((prev) => addToSet(prev, index));
    };

    const handlePause = (index) => {
        if (playingIndex === index) {
            setPlayingIndex(null);
            setPausedIndexes((prev) => addToSet(prev, index));
        }
    };

    const handleTimeUpdate = (index) => {
        const videoEl = videoRefs.current[index];
        if (!videoEl || !videoEl.duration) return;

        const percent = (videoEl.currentTime / videoEl.duration) * 100;
        setProgress((prev) => ({ ...prev, [index]: percent || 0 }));
    };

    const handleSeek = (index, e) => {
        const videoEl = videoRefs.current[index];
        if (!videoEl) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = getClientX(e) - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));
        videoEl.currentTime = percent * videoEl.duration;
    };

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
                                    preload="metadata"
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePlayPause(index);
                                        }}
                                        aria-label="Play"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </button>
                                )}

                                {isPlaying && (
                                    <button
                                        className="dt-reel-pause-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePlayPause(index);
                                        }}
                                        aria-label="Pause"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                            <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                                        </svg>
                                    </button>
                                )}

                                <div className="dt-reel-badge">Video {index + 1}</div>

                                <div
                                    className="dt-reel-progress"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSeek(index, e);
                                    }}
                                    onTouchStart={(e) => {
                                        e.stopPropagation();
                                        handleSeek(index, e);
                                    }}
                                    onTouchMove={(e) => {
                                        e.stopPropagation();
                                        handleSeek(index, e);
                                    }}
                                >
                                    <div
                                        className="dt-reel-progress-fill"
                                        style={{ width: `${videoProgress}%` }}
                                    />
                                    <div
                                        className="dt-reel-progress-thumb"
                                        style={{ left: `${videoProgress}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default PreviewVideo;