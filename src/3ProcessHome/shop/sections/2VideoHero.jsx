import { useEffect, useRef, useState, useCallback, memo } from "react";
import "./2VideoHero.css";
import { FiVolume2, FiVolumeX, FiPlay, FiPause } from "react-icons/fi";
import { API } from "../../../services/api";

const MUTE_KEY = "shopVideosMuted";
const CTRL = ".shop-video-controls";
const getMuted = () => {
    const s = localStorage.getItem(MUTE_KEY);
    return s === null ? true : s === "true";
};
const nextIdx = (c, t) => (c + 1) % t;
const prevIdx = (c, t) => (c === 0 ? t - 1 : c - 1);
const isInside = (t) => t.closest(CTRL);
const poster = (v) => v?.thumbnail_url || v?.poster_url || "";

function VideoHero() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [idx, setIdx] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(getMuted);
    const [ended, setEnded] = useState(false);
    const [showPoster, setShowPoster] = useState(true);
    const videoRef = useRef(null);
    const slideRef = useRef(null);
    const resumeRef = useRef(false);
    const mutedRef = useRef(muted);
    const endedRef = useRef(ended);
    const drag = useRef({ active: false, x: 0, t: 0, d: 0, raf: null });

    useEffect(() => {
        let cancel = false;
        (async () => {
            try {
                const r = await fetch(`${API}/api/videohero/active`);
                const j = await r.json();
                if (!cancel && j.success) setVideos(j.data || []);
            } catch (e) { console.error(e.message); }
            finally { if (!cancel) setLoading(false); }
        })();
        return () => { cancel = true; };
    }, []);

    useEffect(() => {
        mutedRef.current = muted;
        localStorage.setItem(MUTE_KEY, String(muted));
        if (videoRef.current) videoRef.current.muted = muted;
    }, [muted]);

    useEffect(() => { endedRef.current = ended; }, [ended]);

    useEffect(() => {
        const v = videoRef.current;
        if (!v || !videos.length) return;
        if (ended) { v.pause(); setShowPoster(true); return; }
        if (playing) {
            v.muted = mutedRef.current;
            v.play().then(() => setShowPoster(false)).catch(() => { });
        } else {
            v.pause();
        }
    }, [idx, playing, videos, ended]);

    useEffect(() => {
        const s = slideRef.current;
        if (!s) return;
        const io = new IntersectionObserver((es) => {
            es.forEach((e) => {
                const v = videoRef.current;
                if (!v) return;
                if (e.isIntersecting) {
                    if (resumeRef.current && !endedRef.current) {
                        v.muted = mutedRef.current;
                        v.play().then(() => { setPlaying(true); setShowPoster(false); resumeRef.current = false; }).catch(() => { });
                    }
                } else if (!v.paused) {
                    v.pause(); setPlaying(false); setShowPoster(true); resumeRef.current = true;
                }
            });
        }, { threshold: 0.5 });
        io.observe(s);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        const onScroll = () => {
            const v = videoRef.current;
            if (v && !v.paused) {
                v.pause();
                setPlaying(false);
                setShowPoster(true);
                resumeRef.current = false;
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const togglePlay = useCallback(() => {
        const v = videoRef.current;
        if (!v) return;
        if (playing && !v.paused) {
            v.pause(); setPlaying(false); setShowPoster(true);
        } else {
            if (ended) { v.currentTime = 0; setEnded(false); }
            v.muted = mutedRef.current;
            setShowPoster(false);
            v.play().then(() => setPlaying(true)).catch(() => { setShowPoster(true); });
        }
    }, [playing, ended]);

    const toggleMute = useCallback(() => setMuted((p) => !p), []);
    const onEnd = useCallback(() => { setPlaying(false); setEnded(true); setShowPoster(true); }, []);
    const goTo = useCallback((i) => {
        const v = videoRef.current;
        if (v) { v.pause(); v.currentTime = 0; }
        setIdx(i);
        setPlaying(false);
        setEnded(false);
        setShowPoster(true);
    }, []);

    const delta = (cx) => {
        const s = slideRef.current;
        if (!s) return 0;
        return ((cx - drag.current.x) / s.getBoundingClientRect().width) * drag.current.d;
    };
    const dragStart = (cx) => {
        const v = videoRef.current;
        if (!v || !v.duration) return;
        drag.current = { active: true, x: cx, t: v.currentTime, d: v.duration, raf: null };
    };
    const dragMove = (cx) => {
        if (!drag.current.active || drag.current.raf) return;
        drag.current.raf = requestAnimationFrame(() => {
            const v = videoRef.current;
            if (!v) { drag.current.raf = null; return; }
            const nt = drag.current.t + delta(cx);
            if (nt >= v.duration || nt <= 0) drag.current.active = false;
            else v.currentTime = nt;
            drag.current.raf = null;
        });
    };
    const dragEnd = () => {
        drag.current.active = false;
        if (drag.current.raf) { cancelAnimationFrame(drag.current.raf); drag.current.raf = null; }
    };
    const onTouchStart = (e) => {
        if (e.touches.length !== 1 || isInside(e.target)) return;
        dragStart(e.touches[0].clientX);
    };
    const onTouchMove = (e) => {
        if (e.touches.length !== 1 || !drag.current.active) return;
        dragMove(e.touches[0].clientX);
    };
    const onMouseDown = (e) => {
        if (isInside(e.target)) return;
        e.preventDefault();
        dragStart(e.clientX);
        const mv = (ev) => dragMove(ev.clientX);
        const up = () => { dragEnd(); document.removeEventListener("mousemove", mv); document.removeEventListener("mouseup", up); };
        document.addEventListener("mousemove", mv);
        document.addEventListener("mouseup", up);
    };

    useEffect(() => () => { if (drag.current.raf) cancelAnimationFrame(drag.current.raf); }, []);

    if (loading) return null;
    const cur = videos[idx];
    const p = poster(cur);

    return (
        <section className="shop-video-section">
            <div className="heepit-intro"><h2>Hey! Welcome to Heepit</h2></div>
            {videos.length === 0 ? (
                <div className="shop-video-empty">
                    <div className="shop-video-empty-icon">🎬</div>
                    <h3>No AD Available</h3>
                    <p>Please check back later</p>
                </div>
            ) : (
                <>
                    <div className="shop-video-info-row" key={idx}>
                        <span className="shop-video-info-name infodtat">{cur?.name}</span>
                        <span className="shop-video-info-date infodtat">
                            {new Date(cur?.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                        <span className="shop-video-info-frontview infodtat">{cur?.frontview}</span>
                    </div>
                    <div className="shop-video-scroll">
                        <div className="shop-video-slide" ref={slideRef}
                            onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={dragEnd}
                            onMouseDown={onMouseDown}>
                            <video key={cur?.id || idx} ref={videoRef}
                                src={cur?.video_url} muted playsInline preload="none"
                                poster={p}
                                onEnded={onEnd} onClick={togglePlay}
                                onCanPlay={() => { if (playing) setShowPoster(false); }} />
                            {showPoster && (
                                <div className="shop-video-thumb" onClick={togglePlay}>
                                    {p ? <img className="shop-video-thumb-img" src={p} alt={cur?.name || ""} loading="lazy" /> : null}
                                    <div className="shop-video-thumb-overlay">
                                        <span className="shop-video-thumb-play">▶</span>
                                        <span className="shop-video-thumb-text">Click to watch</span>
                                    </div>
                                </div>
                            )}
                            <div className="shop-video-controls">
                                <button type="button" className={`shop-video-btn shop-video-btn-tl ${playing ? "active" : ""}`}
                                    onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
                                    {playing ? <FiPause /> : <FiPlay />}
                                </button>
                                <button type="button" className={`shop-video-btn shop-video-btn-tr ${!muted ? "active" : ""}`}
                                    onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
                                    {muted ? <FiVolumeX /> : <FiVolume2 />}
                                </button>
                                {videos.length > 1 && (
                                    <button type="button" className="shop-video-btn shop-video-btn-bl"
                                        onClick={() => goTo(prevIdx(idx, videos.length))} aria-label="Previous">‹</button>
                                )}
                                {videos.length > 1 && (
                                    <button type="button" className="shop-video-btn shop-video-btn-br"
                                        onClick={() => goTo(nextIdx(idx, videos.length))} aria-label="Next">›</button>
                                )}
                            </div>
                        </div>
                    </div>
                    {videos.length > 1 && (
                        <div className="shop-video-dots">
                            {videos.map((v, i) => (
                                <span key={v.id} className={`shop-video-dot ${idx === i ? "active" : ""}`}
                                    onClick={() => goTo(i)} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

export default memo(VideoHero);