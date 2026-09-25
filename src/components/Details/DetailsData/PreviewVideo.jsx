import { useRef, useState, useEffect } from "react";
import "../DetailsDataStyle/PreviewVideo.css";

function PreviewVideo({ productDetail }) {

    const vdo1 = productDetail?.vdo1 || "";
    const vdo2 = productDetail?.vdo2 || "";
    const vdo3 = productDetail?.vdo3 || "";

    const videos = [vdo1, vdo2, vdo3].filter(Boolean);

    const videoRefs = useRef([]);
    const cardRefs = useRef([]);
    const [playingIndex, setPlayingIndex] = useState(null);
    const [pausedIndexes, setPausedIndexes] = useState(new Set());
    const [thumbnails, setThumbnails] = useState({});
    const [progress, setProgress] = useState({});
    const [wasPlayingBeforeScroll, setWasPlayingBeforeScroll] = useState({});

    /* ============================================
       THUMBNAIL GENERATE
       ============================================ */
    useEffect(() => {

        videos.forEach((video, index) => {

            const videoEl = document.createElement("video");
            videoEl.src = video;
            videoEl.crossOrigin = "anonymous";
            videoEl.muted = true;              /* thumbnail ke liye muted */
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

                    setThumbnails((prev) => ({
                        ...prev,
                        [index]: dataUrl
                    }));

                } catch (err) {
                    console.error("Thumbnail error:", err);
                }

            }, { once: true });

        });

    }, [videos.join(",")]);

    /* ============================================
       PLAY / PAUSE
       ============================================ */
    const handlePlayPause = (index) => {

        const videoEl = videoRefs.current[index];
        if (!videoEl) return;

        if (playingIndex === index) {

            videoEl.pause();
            setPlayingIndex(null);
            setPausedIndexes((prev) => new Set(prev).add(index));

        } else {

            if (playingIndex !== null) {
                const prevVideo = videoRefs.current[playingIndex];
                if (prevVideo) {
                    prevVideo.pause();
                    prevVideo.currentTime = 0;
                }
            }

            videoEl.muted = false;             /* 👈 ALWAYS UNMUTED */

            videoEl.play()
                .then(() => {
                    setPlayingIndex(index);
                    setPausedIndexes((prev) => {
                        const next = new Set(prev);
                        next.delete(index);
                        return next;
                    });
                })
                .catch((err) => console.error("Play error:", err));

        }

    };

    /* ============================================
       VIDEO EVENTS
       ============================================ */
    const handleEnded = (index) => {

        const videoEl = videoRefs.current[index];
        if (videoEl) videoEl.currentTime = 0;

        setPlayingIndex(null);
        setPausedIndexes((prev) => new Set(prev).add(index));

    };

    const handlePause = (index) => {
        if (playingIndex === index) {
            setPlayingIndex(null);
            setPausedIndexes((prev) => new Set(prev).add(index));
        }
    };

    const handlePlay = (index) => {
        setPlayingIndex(index);
    };

    /* ============================================
       PROGRESS UPDATE
       ============================================ */
    const handleTimeUpdate = (index) => {

        const videoEl = videoRefs.current[index];
        if (!videoEl) return;

        const percent = (videoEl.currentTime / videoEl.duration) * 100;

        setProgress((prev) => ({
            ...prev,
            [index]: percent || 0
        }));

    };

    /* ============================================
       SEEK — progress bar touch
       ============================================ */
    const handleSeek = (index, e) => {

        const videoEl = videoRefs.current[index];
        if (!videoEl) return;

        const bar = e.currentTarget;
        const rect = bar.getBoundingClientRect();

        let clientX;

        if (e.touches && e.touches[0]) {
            clientX = e.touches[0].clientX;
        } else if (e.changedTouches && e.changedTouches[0]) {
            clientX = e.changedTouches[0].clientX;
        } else {
            clientX = e.clientX;
        }

        const x = clientX - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));

        videoEl.currentTime = percent * videoEl.duration;

    };

    /* ============================================
       INTERSECTION OBSERVER — scroll in/out
       ============================================ */
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

                            /* SCROLL IN — agar pehle play tha toh resume */
                            if (wasPlayingBeforeScroll[index]) {

                                videoEl.muted = false;    /* 👈 UNMUTED */

                                videoEl.play()
                                    .then(() => {
                                        setPlayingIndex(index);
                                        setWasPlayingBeforeScroll((prev) => ({
                                            ...prev,
                                            [index]: false
                                        }));
                                    })
                                    .catch(() => {});

                            }

                        } else {

                            /* SCROLL OUT — agar play ho raha tha toh pause */
                            if (playingIndex === index && !videoEl.paused) {

                                videoEl.pause();

                                setWasPlayingBeforeScroll((prev) => ({
                                    ...prev,
                                    [index]: true
                                }));

                                setPlayingIndex(null);
                                setPausedIndexes((prev) => new Set(prev).add(index));

                            }

                        }

                    });

                },
                {
                    threshold: 0.5
                }
            );

            observer.observe(card);
            observers.push(observer);

        });

        return () => {
            observers.forEach((o) => o.disconnect());
        };

    }, [playingIndex, wasPlayingBeforeScroll, videos.length]);

    /* ============================================
       UNMOUNT — SAB PAUSE
       ============================================ */
    useEffect(() => {

        return () => {
            videoRefs.current.forEach((v) => {
                if (v) v.pause();
            });
        };

    }, []);

    return (

        <div className="dt-preview">

            <h3>Product Preview</h3>

            {
                videos.length === 0 ? (

                    <div className="dt-no-preview">
                        No Preview Available
                    </div>

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
                                        onPlay={() => handlePlay(index)}
                                        onPause={() => handlePause(index)}
                                        onEnded={() => handleEnded(index)}
                                        onTimeUpdate={() => handleTimeUpdate(index)}
                                        onClick={() => handlePlayPause(index)}
                                    />

                                    {/* PLAY BUTTON — center, jab paused */}
                                    {
                                        !isPlaying && (
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
                                        )
                                    }

                                    {/* PAUSE BUTTON — top-right, jab playing */}
                                    {
                                        isPlaying && (
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
                                        )
                                    }

                                    {/* VIDEO BADGE — bottom-left */}
                                    <div className="dt-reel-badge">
                                        Video {index + 1}
                                    </div>

                                    {/* PROGRESS BAR — bottom */}
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

                )
            }

        </div>
    );
}

export default PreviewVideo;