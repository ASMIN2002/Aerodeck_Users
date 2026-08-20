import { useEffect, useState } from "react";
import "./AppUpdate.css";

function AppUpdate({ user }) {

    const [progress, setProgress] = useState(0);
    const [downloadedMB, setDownloadedMB] = useState(0);
    const [totalMB, setTotalMB] = useState(0);
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const updater =
            window.Capacitor?.Plugins?.AppUpdater;

        if (!updater) {
            console.error("HEEPIT native updater not available.");
            return;
        }

        const progressListener =
            updater.addListener(
                "downloadProgress",
                (data) => {

                    const downloaded =
                        Number(data.downloaded || 0);

                    const total =
                        Number(data.total || 0);

                    const percentage =
                        Number(data.progress || 0);

                    setProgress(percentage);

                    setDownloadedMB(
                        downloaded / (1024 * 1024)
                    );

                    setTotalMB(
                        total / (1024 * 1024)
                    );

                }
            );

        const completeListener =
            updater.addListener(
                "downloadComplete",
                () => {

                    setProgress(100);
                    setDownloading(false);

                }
            );

        const errorListener =
            updater.addListener(
                "downloadError",
                (data) => {

                    console.error(
                        "HEEPIT UPDATE ERROR:",
                        data
                    );

                    setDownloading(false);

                    setError(
                        data?.message ||
                        "Update download failed."
                    );

                }
            );

        return () => {

            progressListener?.then(
                listener => listener.remove()
            );

            completeListener?.then(
                listener => listener.remove()
            );

            errorListener?.then(
                listener => listener.remove()
            );

        };

    }, []);

    const handleUpdate = async () => {

        if (!user?.user_id) {

            setError("User session not found.");

            return;
        }

        const updater =
            window.Capacitor?.Plugins?.AppUpdater;

        if (!updater) {

            setError(
                "HEEPIT updater is available only inside the app."
            );

            return;
        }

        const apkUrl =
            "https://heepit.netlify.app/app-debug.apk";

        try {

            setError("");
            setProgress(0);
            setDownloadedMB(0);
            setTotalMB(0);
            setDownloading(true);

            await updater.update({
                url: apkUrl
            });

        } catch (err) {

            console.error(
                "HEEPIT UPDATE ERROR:",
                err
            );

            setDownloading(false);

            setError(
                err?.message ||
                "Unable to start update."
            );

        }

    };

    return (
        <main className="app-update-page">

            <div className="app-update-content">

                <div className="app-update-icon">
                    H
                </div>

                <h1>HEEPIT</h1>

                <h2>
                    Update Available
                </h2>

                <p>
                    Update your app to continue.
                </p>

                {!downloading && progress === 0 && (
                    <button
                        className="app-update-button"
                        onClick={handleUpdate}
                    >
                        UPDATE THIS APP
                    </button>
                )}

                {downloading && (
                    <div className="app-update-progress">

                        <div className="app-update-percent">
                            {progress}%
                        </div>

                        <div className="app-update-progress-bar">

                            <div
                                className="app-update-progress-fill"
                                style={{
                                    width: `${progress}%`
                                }}
                            />

                        </div>

                        <div className="app-update-size">

                            {downloadedMB.toFixed(1)} MB
                            {" / "}
                            {totalMB > 0
                                ? `${totalMB.toFixed(1)} MB`
                                : "Calculating..."
                            }

                        </div>

                        <div className="app-update-status">
                            Downloading update...
                        </div>

                    </div>
                )}

                {error && (
                    <div className="app-update-error">
                        {error}
                    </div>
                )}

            </div>

        </main>
    );
}

export default AppUpdate;