package com.heepit.user;

import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;

@CapacitorPlugin(name = "AppUpdater")
public class AppUpdaterPlugin extends Plugin {

    @PluginMethod
    public void update(PluginCall call) {

        String apkUrl = call.getString("url");

        if (apkUrl == null || apkUrl.trim().isEmpty()) {
            call.reject("APK URL is missing");
            return;
        }

        Context context = getContext();

        try {

            DownloadManager manager =
                    (DownloadManager) context.getSystemService(
                            Context.DOWNLOAD_SERVICE
                    );

            if (manager == null) {
                call.reject("DownloadManager unavailable");
                return;
            }

            /*
             * Remove previous downloaded update.
             */
            File oldApk = new File(
                    context.getExternalFilesDir(
                            Environment.DIRECTORY_DOWNLOADS
                    ),
                    "heepit-update.apk"
            );

            if (oldApk.exists()) {
                oldApk.delete();
            }

            /*
             * Download request.
             */
            DownloadManager.Request request =
                    new DownloadManager.Request(
                            Uri.parse(apkUrl)
                    );

            request.setTitle("HEEPIT Update");

            request.setDescription(
                    "Downloading latest HEEPIT update..."
            );

            request.setMimeType(
                    "application/vnd.android.package-archive"
            );

            request.setNotificationVisibility(
                    DownloadManager.Request
                            .VISIBILITY_VISIBLE_NOTIFY_COMPLETED
            );

            request.setDestinationInExternalFilesDir(
                    context,
                    Environment.DIRECTORY_DOWNLOADS,
                    "heepit-update.apk"
            );

            /*
             * Start download.
             */
            long downloadId =
                    manager.enqueue(request);

            JSObject result = new JSObject();

            result.put("success", true);
            result.put("download_id", downloadId);

            call.resolve(result);

            /*
             * Monitor download in background.
             */
            new Thread(() -> {

                boolean running = true;

                while (running) {

                    DownloadManager.Query query =
                            new DownloadManager.Query();

                    query.setFilterById(downloadId);

                    try (
                            Cursor cursor =
                                    manager.query(query)
                    ) {

                        if (
                                cursor == null ||
                                !cursor.moveToFirst()
                        ) {
                            Thread.sleep(500);
                            continue;
                        }

                        int status =
                                cursor.getInt(
                                        cursor.getColumnIndexOrThrow(
                                                DownloadManager
                                                        .COLUMN_STATUS
                                        )
                                );

                        long downloaded =
                                cursor.getLong(
                                        cursor.getColumnIndexOrThrow(
                                                DownloadManager
                                                        .COLUMN_BYTES_DOWNLOADED_SO_FAR
                                        )
                                );

                        long total =
                                cursor.getLong(
                                        cursor.getColumnIndexOrThrow(
                                                DownloadManager
                                                        .COLUMN_TOTAL_SIZE_BYTES
                                        )
                                );

                        int progress = 0;

                        if (total > 0) {

                            progress =
                                    (int) (
                                            downloaded * 100L
                                                    / total
                                    );

                        }

                        /*
                         * Send progress to React.
                         */
                        JSObject progressData =
                                new JSObject();

                        progressData.put(
                                "progress",
                                progress
                        );

                        progressData.put(
                                "downloaded",
                                downloaded
                        );

                        progressData.put(
                                "total",
                                total
                        );

                        notifyListeners(
                                "downloadProgress",
                                progressData
                        );

                        /*
                         * DOWNLOAD COMPLETE
                         */
                        if (
                                status ==
                                        DownloadManager
                                                .STATUS_SUCCESSFUL
                        ) {

                            JSObject complete =
                                    new JSObject();

                            complete.put(
                                    "success",
                                    true
                            );

                            complete.put(
                                    "progress",
                                    100
                            );

                            complete.put(
                                    "downloaded",
                                    downloaded
                            );

                            complete.put(
                                    "total",
                                    total
                            );

                            notifyListeners(
                                    "downloadComplete",
                                    complete
                            );

                            /*
                             * Get APK URI.
                             */
                            int uriIndex =
                                    cursor.getColumnIndexOrThrow(
                                            DownloadManager
                                                    .COLUMN_LOCAL_URI
                                    );

                            String localUri =
                                    cursor.getString(uriIndex);

                            if (
                                    localUri == null ||
                                    localUri.isEmpty()
                            ) {

                                notifyUpdateError(
                                        "Downloaded APK URI missing"
                                );

                                running = false;
                                continue;
                            }

                            Uri apkUri =
                                    Uri.parse(localUri);

                            /*
                             * Convert file:// into
                             * secure content:// URI.
                             */
                            if (
                                    "file".equalsIgnoreCase(
                                            apkUri.getScheme()
                                    )
                            ) {

                                String path =
                                        apkUri.getPath();

                                if (
                                        path == null ||
                                        path.isEmpty()
                                ) {

                                    notifyUpdateError(
                                            "APK file path missing"
                                    );

                                    running = false;
                                    continue;
                                }

                                File apkFile =
                                        new File(path);

                                apkUri =
                                        FileProvider.getUriForFile(
                                                context,
                                                context.getPackageName()
                                                        + ".fileprovider",
                                                apkFile
                                        );
                            }

                            /*
                             * Open Android installer.
                             */
                            Intent installIntent =
                                    new Intent(
                                            Intent.ACTION_VIEW
                                    );

                            installIntent.setDataAndType(
                                    apkUri,
                                    "application/vnd.android.package-archive"
                            );

                            installIntent.addFlags(
                                    Intent.FLAG_ACTIVITY_NEW_TASK
                            );

                            installIntent.addFlags(
                                    Intent.FLAG_GRANT_READ_URI_PERMISSION
                            );

                            installIntent.addFlags(
                                    Intent.FLAG_GRANT_WRITE_URI_PERMISSION
                            );

                            context.startActivity(
                                    installIntent
                            );

                            running = false;
                        }

                        /*
                         * DOWNLOAD FAILED
                         */
                        else if (
                                status ==
                                        DownloadManager
                                                .STATUS_FAILED
                        ) {

                            int reason =
                                    cursor.getInt(
                                            cursor.getColumnIndexOrThrow(
                                                    DownloadManager
                                                            .COLUMN_REASON
                                            )
                                    );

                            notifyUpdateError(
                                    "APK download failed. Reason: "
                                            + reason
                            );

                            running = false;
                        }

                    } catch (Exception e) {

                        notifyUpdateError(
                                e.getMessage() != null
                                        ? e.getMessage()
                                        : "Unknown updater error"
                        );

                        running = false;
                    }

                    if (running) {

                        try {

                            Thread.sleep(500);

                        } catch (
                                InterruptedException e
                        ) {

                            Thread.currentThread().interrupt();

                            running = false;
                        }
                    }
                }

            }).start();

        } catch (Exception e) {

            call.reject(
                    "Updater error: "
                            + (
                            e.getMessage() != null
                                    ? e.getMessage()
                                    : "Unknown error"
                    )
            );
        }
    }

    private void notifyUpdateError(String message) {

        JSObject error =
                new JSObject();

        error.put(
                "success",
                false
        );

        error.put(
                "message",
                message
        );

        notifyListeners(
                "downloadError",
                error
        );
    }
}