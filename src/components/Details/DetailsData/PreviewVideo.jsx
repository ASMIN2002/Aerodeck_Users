import { useRef, useState } from "react";
import "../DetailsDataStyle/PreviewVideo.css";

function PreviewVideo() {

    const videoRef = useRef(null);
    const [showPlay, setShowPlay] = useState(true);

    const playVideo = () => {

        if (!videoRef.current) return;

        videoRef.current.currentTime = 0;
        videoRef.current.play();
        setShowPlay(false);

    };

    const openFullscreen = () => {

        if (!videoRef.current) return;

        if (videoRef.current.requestFullscreen) {
            videoRef.current.requestFullscreen();
        }

    };

    const handleVideoEnd = () => {

        setShowPlay(true);

    };

    return (

        <div className="dt-preview">

            <h3>Product Preview</h3>

            <div className="dt-video-container">

                <video
                    ref={videoRef}
                    className="dt-preview-video"
                    playsInline
                    preload="metadata"
                    onEnded={handleVideoEnd}
                >

                    <source
                        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                        type="video/mp4"
                    />

                </video>

                {
                    showPlay &&
                    <button
                        className="dt-play-btn"
                        onClick={playVideo}
                    >
                        ▶
                    </button>
                }

                <button
                    className="dt-fullscreen-btn"
                    onClick={openFullscreen}
                >
                    ⛶
                </button>

            </div>

        </div>

    );

}

export default PreviewVideo;