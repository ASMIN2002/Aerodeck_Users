// src/App.jsx
import "./App.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import TermsAndCondition from "./pages/Login/TermsAndCondition";
import Loading from "./components/Loading/Loading";
import Splash from "./pages/Splash/Splash";
import Home from "./pages/Home/Home";
import Update from "./pages/Update/Update";
import AppUpdate from "./pages/Update/AppUpdate";
import Maintenance from "./pages/Home/Maintenance";
import { Toaster, toast } from "react-hot-toast";
import Login from "./pages/Login/Login";
import { API } from "./services/api";

const NAV_HISTORY_KEY = "heepit_navigation_history";

function App() {
    const navigate = useNavigate();

    const goTo = (url, options = {}) => {
        let history = [];

        try {
            const saved = localStorage.getItem(NAV_HISTORY_KEY);
            history = saved ? JSON.parse(saved) : [];
        } catch {
            history = [];
        }

        if (options.replace && history.length > 0) {
            history[history.length - 1] = {
                number: history.length,
                url: url
            };
        } else if (
            history.length === 0 ||
            history[history.length - 1].url !== url
        ) {
            history.push({
                number: history.length + 1,
                url: url
            });
        }

        localStorage.setItem(
            NAV_HISTORY_KEY,
            JSON.stringify(history)
        );

        navigate(url, options);
    };

    const location = useLocation();

    const skipHistorySaveRef = useRef(false);
    const pushSetupRef = useRef(false);

    useEffect(() => {
        const path = location.pathname;

        if (path === "/" || path === "/login") {
            return;
        }

        let history = [];

        try {
            const saved = localStorage.getItem(NAV_HISTORY_KEY);
            history = saved ? JSON.parse(saved) : [];
        } catch {
            history = [];
        }

        if (skipHistorySaveRef.current) {
            skipHistorySaveRef.current = false;
            return;
        }

        if (history.length === 0 || history[history.length - 1].url !== path) {
            history.push({
                number: history.length + 1,
                url: path
            });
        }

        localStorage.setItem(
            NAV_HISTORY_KEY,
            JSON.stringify(history)
        );
    }, [location.pathname]);

    useEffect(() => {
        const handleBackButton = async () => {
            let history = [];

            try {
                const saved = localStorage.getItem(NAV_HISTORY_KEY);
                history = saved ? JSON.parse(saved) : [];
            } catch {
                history = [];
            }

            if (history.length > 1) {
                history.pop();

                history = history.map((item, index) => ({
                    number: index + 1,
                    url: item.url
                }));

                localStorage.setItem(
                    NAV_HISTORY_KEY,
                    JSON.stringify(history)
                );

                skipHistorySaveRef.current = true;

                navigate(history[history.length - 1].url);
                return;
            }

            localStorage.removeItem(NAV_HISTORY_KEY);

            await CapacitorApp.exitApp();
        };

        let listener;

        CapacitorApp.addListener(
            "backButton",
            handleBackButton
        ).then((result) => {
            listener = result;
        });

        return () => {
            if (listener) {
                listener.remove();
            }
        };
    }, [navigate]);

    const changePage = (nextPage) => {
        const routes = {
            splash: "/",
            login: "/login",
            home: "/home/shop",
            appupdate: "/appupdate"
        };
        setPage(nextPage);
        const route = routes[nextPage];
        if (route && location.pathname !== route) {
            navigate(route);
        }
    };

    useEffect(() => {
        const path = location.pathname;

        if (path === "/") {
            setPage("splash");
        } else if (path === "/login") {
            setPage("login");
        } else if (
            path === "/home/shop" ||
            path === "/home/gifts" ||
            path === "/home/cards" ||
            path.startsWith("/home/shop/product/") ||
            path.startsWith("/home/gifts/product/") ||
            path.startsWith("/home/cards/product/") ||
            path === "/profile" ||
            path.startsWith("/profile/")
        ) {
            setPage("home");
        } else if (path === "/appupdate") {
            setPage("appupdate");
        }
    }, [location.pathname]);

    const [page, setPage] = useState("splash");
    const [showLoading, setShowLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("Loading HEEPIT...");
    const [loadingDuration, setLoadingDuration] = useState(3000);
    const [user, setUser] = useState(null);
    const [checkingSession, setCheckingSession] = useState(true);
    const [authMode, setAuthMode] = useState("");
    const [cartCount, setCartCount] = useState(0);
    const [updateRequired, setUpdateRequired] = useState(false);
    const [isMaintenance, setIsMaintenance] = useState(false);

    const navigateWithLoading = (
        action,
        text = "Loading HEEPIT...",
        duration = 3000
    ) => {
        setLoadingText(text);
        setLoadingDuration(duration);
        setShowLoading(true);

        setTimeout(() => {
            if (typeof action === "function") {
                action();
            }
        }, duration);
    };

    /* ============================================
       FCM TOKEN SAVE HELPER
       (retry logic — token ready na ho toh wait kare)
       ============================================ */
    const saveFcmTokenToBackend = async (retries = 5) => {
        const sessionToken = localStorage.getItem("session_token");
        const fcmToken = localStorage.getItem("fcm_token");

        if (!sessionToken) {
            console.log("No session token — skip FCM save");
            return;
        }

        if (!fcmToken) {
            if (retries > 0) {
                console.log(`FCM token not ready — retry (${retries} left)`);
                setTimeout(() => saveFcmTokenToBackend(retries - 1), 1000);
            } else {
                console.log("FCM token never arrived — giving up");
            }
            return;
        }

        try {
            const res = await fetch(`${API}/api/user/save-fcm-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_token: sessionToken,
                    fcm_token: fcmToken
                })
            });
            const data = await res.json();
            console.log("Token save response:", data);
        } catch (err) {
            console.error("Token save error:", err);
        }
    };

    /* ============================================
       FCM PUSH NOTIFICATION REGISTRATION
       ============================================ */
    useEffect(() => {
        async function setupPushNotifications() {
            /* Prevent double setup (StrictMode) */
            if (pushSetupRef.current) {
                console.log("Push already setup — skip");
                return;
            }
            pushSetupRef.current = true;

            if (!Capacitor.isNativePlatform()) {
                console.log("Push notifications skipped on web");
                return;
            }

            try {
                let perm = await PushNotifications.checkPermissions();

                if (perm.receive === "prompt") {
                    perm = await PushNotifications.requestPermissions();
                }

                if (perm.receive !== "granted") {
                    console.log("Push permission denied");
                    return;
                }

                /* Create default channel */
                try {
                    await PushNotifications.createChannel({
                        id: "default",
                        name: "Default",
                        description: "Default notifications",
                        importance: 5,
                        visibility: 1,
                        sound: "default",
                        vibration: true
                    });
                } catch (chErr) {
                    console.log("Channel create error:", chErr);
                }

                /* ============================================
                   REGISTRATION — token mile to save karo
                   ============================================ */
                PushNotifications.addListener(
                    "registration",
                    async (token) => {
                        console.log("FCM TOKEN:", token.value);

                        /* localStorage me save karo — hamesha */
                        localStorage.setItem("fcm_token", token.value);

                        /* Agar logged in hai — turant backend save karo */
                        await saveFcmTokenToBackend();
                    }
                );

                PushNotifications.addListener(
                    "registrationError",
                    (err) => {
                        console.error("Push registration error:", err);
                    }
                );

                /* Foreground notification — toast */
                PushNotifications.addListener(
                    "pushNotificationReceived",
                    (notification) => {
                        console.log("Push received (foreground):", notification);

                        const title =
                            notification.title ||
                            notification.data?.title ||
                            "HEEPIT";

                        const body =
                            notification.body ||
                            notification.data?.body ||
                            "New notification";

                        toast(`${title}\n${body}`, {
                            icon: "🔔",
                            duration: 4000,
                            style: {
                                background: "#161b22",
                                color: "#fff",
                                border: "1px solid rgba(0,255,224,0.4)",
                                fontSize: "13px",
                                fontWeight: 600,
                                maxWidth: "90vw"
                            }
                        });
                    }
                );

                PushNotifications.addListener(
                    "pushNotificationActionPerformed",
                    (action) => {
                        console.log("Push action (tapped):", action);

                        const data = action.notification?.data;

                        if (data?.order_id) {
                            navigate("/profile/orders");
                        }
                    }
                );

                /* Register */
                await PushNotifications.register();

            } catch (err) {
                console.error("Push setup error:", err);
            }
        }

        setupPushNotifications();
    }, [navigate]);

    /* ============================================
       LOGIN DETECT — jab session_token aaye, token save karo
       ============================================ */
    useEffect(() => {
        /* Page change pe check karo — login ke baad turant save */
        if (page === "home") {
            saveFcmTokenToBackend();
        }
    }, [page]);

    /* ============================================
       MAINTENANCE CHECK
       ============================================ */
    useEffect(() => {
        async function checkMaintenance() {
            try {
                const res = await fetch(`${API}/api/founders/all-founders`);
                const data = await res.json();

                if (data.success) {
                    const hasUser = data.data.some((f) =>
                        (f.updatepage || "")
                            .split(",")
                            .map((p) => p.trim().toUpperCase())
                            .includes("USER")
                    );

                    setIsMaintenance(hasUser);
                }
            } catch (err) {
                console.error("Maintenance check error:", err);
            }
        }

        checkMaintenance();
    }, []);

    useEffect(() => {
        async function checkForUpdate() {
            if (!user?.user_id || page !== "home") {
                return;
            }

            try {
                const url = `${API}/user/check-update/${user.user_id}`;

                const response = await fetch(url);
                const data = await response.json();

                if (
                    data.success &&
                    data.update_available === true
                ) {
                    setUpdateRequired(true);
                } else {
                    setUpdateRequired(false);
                }
            } catch (err) {
                console.error("UPDATE CHECK ERROR:", err);
            }
        }

        checkForUpdate();
    }, [user, page]);

    useEffect(() => {
        async function restoreSession() {
            if (page !== "splash") {
                return;
            }

            setShowLoading(true);

            try {
                const sessionToken = localStorage.getItem("session_token");

                if (!sessionToken) {
                    changePage("login");
                    return;
                }

                const response = await fetch(
                    `${API}/api/auth/check-session`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            session_token: sessionToken
                        })
                    }
                );

                const data = await response.json();

                if (data.success && data.authenticated) {
                    setUser(data.user);

                    try {
                        if (!Capacitor.isNativePlatform()) {
                            console.log("Web platform - skipping version sync");
                        } else {
                            const appInfo = await CapacitorApp.getInfo();
                            const installedVersion = String(appInfo.version);

                            const currentVersionResponse = await fetch(
                                `${API}/user/app-version/${data.user.user_id}`
                            );

                            const currentVersionData =
                                await currentVersionResponse.json();

                            const databaseVersion = currentVersionData.version
                                ? String(currentVersionData.version)
                                : "";

                            if (databaseVersion !== installedVersion) {
                                await fetch(
                                    `${API}/user/update-app-version/${data.user.user_id}`,
                                    {
                                        method: "PUT",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            version: installedVersion
                                        })
                                    }
                                );
                            }
                        }
                    } catch (versionError) {
                        console.error("APP VERSION SYNC ERROR:", versionError);
                    }

                    changePage("home");
                } else {
                    localStorage.removeItem("session_token");
                    localStorage.removeItem("user");
                    changePage("login");
                }
            } catch (err) {
                console.error(err);

                if (!navigator.onLine) {
                    console.log("Offline — session preserved in localStorage");
                }
            } finally {
                setCheckingSession(false);
                setShowLoading(false);
            }
        }

        restoreSession();
    }, [page]);

    useEffect(() => {
        async function syncVersionAfterUpdate() {
            if (!user?.user_id) return;

            if (!Capacitor.isNativePlatform()) {
                return;
            }

            try {
                const appInfo = await CapacitorApp.getInfo();
                const installedVersion = String(appInfo.version);

                const currentVersionResponse = await fetch(
                    `${API}/user/app-version/${user.user_id}`
                );
                const currentVersionData = await currentVersionResponse.json();
                const databaseVersion = currentVersionData.version
                    ? String(currentVersionData.version)
                    : "";

                if (databaseVersion !== installedVersion) {
                    await fetch(
                        `${API}/user/update-app-version/${user.user_id}`,
                        {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ version: installedVersion })
                        }
                    );

                    const updateRes = await fetch(
                        `${API}/user/check-update/${user.user_id}`
                    );
                    const updateData = await updateRes.json();
                    if (updateData.update_available === false) {
                        setUpdateRequired(false);
                    }
                }
            } catch (err) {
                console.error("VERSION SYNC ERROR:", err);
            }
        }

        syncVersionAfterUpdate();
    }, [user]);

    if (isMaintenance) {
        return (
            <>
                <Toaster
                    position="top-center"
                    toastOptions={{ duration: 2500 }}
                />
                <Maintenance />
            </>
        );
    }

    if (checkingSession && page !== "splash") {
        return null;
    }

    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 2500
                }}
            />

            {showLoading && (
                <Loading
                    duration={loadingDuration}
                    text={loadingText}
                    onComplete={() => setShowLoading(false)}
                />
            )}

            {page === "splash" && (
                <Splash
                    setPage={changePage}
                />
            )}

            {page === "login" && (
                <Login
                    setPage={changePage}
                    setAuthMode={setAuthMode}
                    onLoginSuccess={saveFcmTokenToBackend}
                />
            )}

            {page === "terms" && (
                <TermsAndCondition
                    setPage={setPage}
                />
            )}

            {page === "home" && (
                <Home
                    user={user}
                    setPage={changePage}
                    navigateWithLoading={navigateWithLoading}
                    cartCount={cartCount}
                    setCartCount={setCartCount}
                    goTo={goTo}
                />
            )}

            {page === "home" && updateRequired && (
                <Update
                    user={user}
                    onCancel={() => {
                        setUpdateRequired(false);
                    }}
                    onUpdate={() => {
                        setUpdateRequired(false);
                        changePage("appupdate");
                    }}
                />
            )}

            {page === "appupdate" && (
                <AppUpdate user={user} />
            )}
        </>
    );
}

export default App;