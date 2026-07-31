import { useRef, useState } from "react";
import "../DetailsDataStyle/PreviewVideo.css";

function PreviewVideo({ video_link }) {

    const videoRef = useRef(null);
    const [showPlay, setShowPlay] = useState(true);

    const playVideo = () => {

        if (!videoRef.current || !video_link) return;

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

            {
                !video_link ? (

                    <div className="dt-no-preview">
                        No Preview Available
                    </div>

                ) : (

                    <div className="dt-video-container">

                        <video
                            ref={videoRef}
                            className="dt-preview-video"
                            playsInline
                            preload="metadata"
                            controls={false}
                            onEnded={handleVideoEnd}
                        >

                            <source
                                src={video_link}
                                type="video/mp4"
                            />

                        </video>

                        {showPlay && (
                            <button
                                className="dt-play-btn"
                                onClick={playVideo}
                            >
                                ▶
                            </button>
                        )}

                        <button
                            className="dt-fullscreen-btn"
                            onClick={openFullscreen}
                        >
                            ⛶
                        </button>

                    </div>

                )
            }
        </div>

    );

}

export default PreviewVideo;