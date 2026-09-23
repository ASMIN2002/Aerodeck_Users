import "../DetailsDataStyle/PreviewVideo.css";

function PreviewVideo({ productDetail }) {

    const vdo1 = productDetail?.vdo1 || "";
    const vdo2 = productDetail?.vdo2 || "";
    const vdo3 = productDetail?.vdo3 || "";

    const videos = [vdo1, vdo2, vdo3].filter(Boolean);

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

                        {videos.map((video, index) => (

                            <div
                                className="dt-reel-card"
                                key={index}
                            >

                                <video
                                    className="dt-reel-video"
                                    src={video}
                                    controls
                                    playsInline
                                    preload="metadata"
                                />

                                <div className="dt-reel-badge">
                                    Video {index + 1}
                                </div>

                            </div>

                        ))}

                    </div>

                )
            }

        </div>
    );
}

export default PreviewVideo;