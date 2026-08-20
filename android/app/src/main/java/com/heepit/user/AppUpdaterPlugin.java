package com.heepit.user;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import androidx.core.content.FileProvider;

import com.getcapacitor.Plugin;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginMethod;

import android.content.Context;
import android.app.DownloadManager;
import android.database.Cursor;
import android.os.Environment;

@CapacitorPlugin(name = "AppUpdater")
public class AppUpdaterPlugin extends Plugin {

    @PluginMethod
    public void update(PluginCall call) {

        String apkUrl = call.getString("url");

        if (apkUrl == null || apkUrl.isEmpty()) {
            call.reject("APK URL is missing");
            return;
        }

        try {

            DownloadManager.Request request =
                    new DownloadManager.Request(Uri.parse(apkUrl));

            request.setTitle("HEEPIT Update");
            request.setDescription("Downloading latest HEEPIT app...");
            request.setNotificationVisibility(
                    DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED
            );

            request.setDestinationInExternalFilesDir(
                    getContext(),
                    Environment.DIRECTORY_DOWNLOADS,
                    "heepit-update.apk"
            );

            DownloadManager manager =
                    (DownloadManager) getContext()
                            .getSystemService(Context.DOWNLOAD_SERVICE);

            long downloadId = manager.enqueue(request);

            new Thread(() -> {

                boolean downloading = true;

                while (downloading) {

                    DownloadManager.Query query =
                            new DownloadManager.Query();

                    query.setFilterById(downloadId);

                    try (Cursor cursor = manager.query(query)) {

                        if (cursor != null && cursor.moveToFirst()) {

                            int status = cursor.getInt(
                                    cursor.getColumnIndexOrThrow(
                                            DownloadManager.COLUMN_STATUS
                                    )
                            );

                            if (status == DownloadManager.STATUS_SUCCESSFUL) {

                                int uriIndex = cursor.getColumnIndexOrThrow(
                                        DownloadManager.COLUMN_LOCAL_URI
                                );

                                String localUri =
                                        cursor.getString(uriIndex);

                                Uri apkUri = Uri.parse(localUri);

                                Intent intent =
                                        new Intent(
                                                Intent.ACTION_VIEW,
                                                apkUri
                                        );

                                intent.addFlags(
                                        Intent.FLAG_ACTIVITY_NEW_TASK |
                                        Intent.FLAG_GRANT_READ_URI_PERMISSION
                                );

                                getContext().startActivity(intent);

                                downloading = false;

                            } else if (
                                    status == DownloadManager.STATUS_FAILED
                            ) {

                                downloading = false;
                                call.reject("APK download failed");
                            }
                        }

                    } catch (Exception e) {

                        downloading = false;
                        call.reject(e.getMessage());
                    }

                    try {
                        Thread.sleep(500);
                    } catch (InterruptedException ignored) {
                    }
                }

            }).start();

            JSObject result = new JSObject();
            result.put("success", true);
            call.resolve(result);

        } catch (Exception e) {

            call.reject(
                    "Updater error: " + e.getMessage()
            );
        }
    }
}