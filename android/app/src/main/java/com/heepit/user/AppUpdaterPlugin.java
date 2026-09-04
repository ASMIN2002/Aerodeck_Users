package com.heepit.user;

import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import androidx.core.content.FileProvider;
import java.io.File;

@CapacitorPlugin(name = "AppUpdater")
public class AppUpdaterPlugin extends Plugin {

    private long downloadId = -1;

    private BroadcastReceiver downloadReceiver;

    private Handler progressHandler;

    private Runnable progressRunnable;

    private boolean downloadFinished = false;

    @PluginMethod
    public void update(PluginCall call) {

        String apkUrl = call.getString("url");

        if (apkUrl == null || apkUrl.trim().isEmpty()) {
            call.reject("APK URL is missing");
            return;
        }

        if (!apkUrl.startsWith("http://")
                && !apkUrl.startsWith("https://")) {

            call.reject(
                    "APK can only be downloaded from HTTP/HTTPS URLs: "
                            + apkUrl
            );
            return;
        }

        Context context = getContext();

        try {

            cleanupReceiver();

            downloadFinished = false;

            DownloadManager downloadManager =
                    (DownloadManager)
                            context.getSystemService(
                                    Context.DOWNLOAD_SERVICE
                            );

            Uri apkUri = Uri.parse(apkUrl);

            DownloadManager.Request request =
                    new DownloadManager.Request(apkUri);

            request.setTitle("HEEPIT Update");

            request.setDescription(
                    "Downloading latest HEEPIT update..."
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

            downloadId =
                    downloadManager.enqueue(request);

            registerDownloadReceiver();

            startProgressMonitoring();

            JSObject result = new JSObject();

            result.put(
                    "downloadId",
                    downloadId
            );

            call.resolve(result);

        } catch (Exception e) {

            cleanupReceiver();

            call.reject(
                    "Unable to download update: "
                            + e.getMessage()
            );
        }
    }


    private void registerDownloadReceiver() {

        downloadReceiver =
                new BroadcastReceiver() {

                    @Override
                    public void onReceive(
                            Context context,
                            Intent intent
                    ) {

                        long id =
                                intent.getLongExtra(
                                        DownloadManager
                                                .EXTRA_DOWNLOAD_ID,
                                        -1
                                );

                        if (id != downloadId) {
                            return;
                        }

                        checkDownloadStatus(context);
                    }
                };

        IntentFilter filter =
                new IntentFilter(
                        DownloadManager
                                .ACTION_DOWNLOAD_COMPLETE
                );

        if (Build.VERSION.SDK_INT >= 33) {

            getContext().registerReceiver(
                    downloadReceiver,
                    filter,
                    Context.RECEIVER_NOT_EXPORTED
            );

        } else {

            getContext().registerReceiver(
                    downloadReceiver,
                    filter
            );
        }
    }

    private void startProgressMonitoring() {

        progressHandler =
                new Handler(
                        Looper.getMainLooper()
                );

        progressRunnable =
                new Runnable() {

                    @Override
                    public void run() {

                        if (downloadFinished) {
                            return;
                        }

                        checkDownloadStatus(
                                getContext()
                        );

                        if (!downloadFinished) {

                            progressHandler.postDelayed(
                                    this,
                                    300
                            );
                        }
                    }
                };

        progressHandler.post(
                progressRunnable
        );
    }

    private void checkDownloadStatus(
            Context context
    ) {

        if (downloadId == -1
                || downloadFinished) {
            return;
        }

        DownloadManager manager =
                (DownloadManager)
                        context.getSystemService(
                                Context.DOWNLOAD_SERVICE
                        );

        Cursor cursor = null;

        try {

            cursor =
                    manager.query(
                            new DownloadManager
                                    .Query()
                                    .setFilterById(downloadId)
                    );

            if (cursor == null
                    || !cursor.moveToFirst()) {
                return;
            }

            int status =
                    cursor.getInt(
                            cursor.getColumnIndexOrThrow(
                                    DownloadManager
                                            .COLUMN_STATUS
                            )
                    );

            if (status ==
                    DownloadManager
                            .STATUS_RUNNING) {

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
                            (int)
                                    ((downloaded * 100L)
                                            / total);
                }

                sendProgress(
                        progress,
                        downloaded,
                        total
                );

            } else if (status ==
                    DownloadManager
                            .STATUS_SUCCESSFUL) {

                if (downloadFinished) {
                    return;
                }

                downloadFinished = true;

                stopProgressMonitoring();

                String localUri =
                        cursor.getString(
                                cursor.getColumnIndexOrThrow(
                                        DownloadManager
                                                .COLUMN_LOCAL_URI
                                )
                        );

                sendProgress(
                        100,
                        cursor.getLong(
                                cursor.getColumnIndexOrThrow(
                                        DownloadManager
                                                .COLUMN_BYTES_DOWNLOADED_SO_FAR
                                )
                        ),
                        cursor.getLong(
                                cursor.getColumnIndexOrThrow(
                                        DownloadManager
                                                .COLUMN_TOTAL_SIZE_BYTES
                                )
                        )
                );
                installApk(context, Uri.parse(localUri));
                notifyListeners(
                        "downloadComplete",
                        new JSObject()
                );

                cleanupReceiver();

            } else if (status ==
                    DownloadManager
                            .STATUS_FAILED) {

                if (downloadFinished) {
                    return;
                }

                downloadFinished = true;

                stopProgressMonitoring();

                int reason =
                        cursor.getInt(
                                cursor.getColumnIndexOrThrow(
                                        DownloadManager
                                                .COLUMN_REASON
                                )
                        );

                cleanupReceiver();

                JSObject error =
                        new JSObject();

                error.put(
                        "message",
                        "APK download failed. Reason: "
                                + reason
                );

                notifyListeners(
                        "downloadError",
                        error
                );
            }

        } catch (Exception e) {

            JSObject error =
                    new JSObject();

            error.put(
                    "message",
                    "Download status error: "
                            + e.getMessage()
            );

            notifyListeners(
                    "downloadError",
                    error
            );

        } finally {

            if (cursor != null) {
                cursor.close();
            }
        }
    }

private void installApk(
        Context context,
        Uri apkUri
) {

    try {

        android.util.Log.d(
                "HEEPIT_UPDATE",
                "INSTALL_STARTED"
        );

        File apkFile = new File(
                apkUri.getPath()
        );

        Uri contentUri =
                FileProvider.getUriForFile(
                        context,
                        context.getPackageName()
                                + ".fileprovider",
                        apkFile
                );

        Intent installIntent =
                new Intent(
                        Intent.ACTION_VIEW
                );

        installIntent.setDataAndType(
                contentUri,
                "application/vnd.android.package-archive"
        );

        installIntent.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK
        );

        installIntent.addFlags(
                Intent.FLAG_GRANT_READ_URI_PERMISSION
        );

        context.startActivity(
                installIntent
        );

        android.util.Log.d(
                "HEEPIT_UPDATE",
                "INSTALLER_OPENED"
        );

    } catch (Exception e) {

        e.printStackTrace();

        android.util.Log.e(
                "HEEPIT_UPDATE",
                "INSTALL_ERROR: "
                        + e.getMessage()
        );

        JSObject error =
                new JSObject();

        error.put(
                "message",
                "Unable to start APK installer: "
                        + e.getMessage()
        );

        notifyListeners(
                "downloadError",
                error
        );
    }
}
    private void sendProgress(
            int progress,
            long downloaded,
            long total
    ) {

        JSObject data =
                new JSObject();

        data.put(
                "progress",
                progress
        );

        data.put(
                "downloaded",
                downloaded
        );

        data.put(
                "total",
                total
        );

        notifyListeners(
                "downloadProgress",
                data
        );
    }

    private void stopProgressMonitoring() {

        if (progressHandler != null
                && progressRunnable != null) {

            progressHandler.removeCallbacks(
                    progressRunnable
            );
        }

        progressHandler = null;
        progressRunnable = null;
    }

    private void cleanupReceiver() {

        stopProgressMonitoring();

        if (downloadReceiver != null) {

            try {

                getContext().unregisterReceiver(
                        downloadReceiver
                );

            } catch (Exception ignored) {
            }

            downloadReceiver = null;
        }
    }

    @Override
    protected void handleOnDestroy() {

        cleanupReceiver();

        super.handleOnDestroy();
    }
}