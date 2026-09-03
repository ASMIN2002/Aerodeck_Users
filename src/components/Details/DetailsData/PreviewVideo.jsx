import "../DetailsDataStyle/PreviewVideo.css";

function PreviewVideo({ video_link }) {

    const getYouTubeId = (url) => {

        if (!url) return null;

        try {

            const parsedUrl = new URL(url);

            // youtu.be/VIDEO_ID
            if (
                parsedUrl.hostname.includes("youtu.be")
            ) {
                return parsedUrl.pathname
                    .split("/")
                    .filter(Boolean)[0];
            }

            // youtube.com/watch?v=VIDEO_ID
            if (
                parsedUrl.pathname === "/watch"
            ) {
                return parsedUrl.searchParams.get("v");
            }

            // youtube.com/shorts/VIDEO_ID
            if (
                parsedUrl.pathname.includes("/shorts/")
            ) {
                return parsedUrl.pathname
                    .split("/shorts/")[1]
                    ?.split("/")[0];
            }

            // youtube.com/embed/VIDEO_ID
            if (
                parsedUrl.pathname.includes("/embed/")
            ) {
                return parsedUrl.pathname
                    .split("/embed/")[1]
                    ?.split("/")[0];
            }

            return null;

        } catch {

            return null;

        }

    };


    const videoId = getYouTubeId(video_link);
    const hasValidVideo =
        typeof video_link === "string" &&
        /^https?:\/\//i.test(video_link.trim()) &&
        videoId;


    return (

        <div className="dt-preview">

            <h3>Product Preview</h3>

            {
                !hasValidVideo ? (

                    <div className="dt-no-preview">
                        No Preview Available
                    </div>

                ) : videoId ? (

                    <div className="dt-video-container">

                        <iframe
                            className="dt-preview-video"
                            src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
                            title="Product Preview"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                            allowFullScreen
                        />

                    </div>

                ) : (

                    <div className="dt-no-preview">
                        Invalid YouTube Video Link
                    </div>

                )

            }

        </div>

    );

}

export default PreviewVideo;