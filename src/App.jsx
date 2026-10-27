import "./App.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import Loading from "./10intro/Loading";
import Splash from "./10intro/Splash";
import Home from "./pages/Home/Home";
import Update from "./pages/Update/Update";
import AppUpdate from "./pages/Update/AppUpdate";
import Maintenance from "./pages/Home/Maintenance";
import { Toaster, toast } from "react-hot-toast";
import Login from "./10intro/login";
import { API } from "./services/api";

const NAV_HISTORY_KEY = "heepit_navigation_history";
const USER_KEY = "user";
const LOADING_DURATION = 400;

function getStoredUser() {
    try {
        const saved = localStorage.getItem(USER_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}

function readHistory() {
    try {
        const saved = localStorage.getItem(NAV_HISTORY_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

function writeHistory(history) {
    try {
        localStorage.setItem(NAV_HISTORY_KEY, JSON.stringify(history));
    } catch { }
}

function App() {
    const navigate = useNavigate();
    const navigateRef = useRef(navigate);
    const location = useLocation();

    useEffect(() => {
        navigateRef.current = navigate;
    }, [navigate]);

    const skipHistorySaveRef = useRef(false);
    const pushSetupRef = useRef(false);
    const fcmSavedRef = useRef(false);
    const historyRef = useRef(readHistory());

    const [page, setPage] = useState("splash");
    const [showLoading, setShowLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("Loading HEEPIT...");
    const [loadingDuration, setLoadingDuration] = useState(LOADING_DURATION);
    const [user, setUser] = useState(getStoredUser);
    const [checkingSession, setCheckingSession] = useState(true);
    const [cartCount, setCartCount] = useState(0);
    const [updateRequired, setUpdateRequired] = useState(false);
    const [isMaintenance, setIsMaintenance] = useState(false);

    const goTo = useCallback((url, options = {}) => {
        const history = historyRef.current;
        if (options.replace && history.length > 0) {
            history[history.length - 1] = { number: history.length, url };
        } else if (history.length === 0 || history[history.length - 1].url !== url) {
            history.push({ number: history.length + 1, url });
        }
        writeHistory(history);
        navigateRef.current(url, options);
    }, []);

    const changePage = useCallback((nextPage) => {
        const routes = {
            splash: "/",
            login: "/login",
            home: "/home/shop",
            appupdate: "/appupdate"
        };
        setPage(nextPage);
        const route = routes[nextPage];
        if (route && location.pathname !== route) {
            navigateRef.current(route);
        }
    }, [location.pathname]);

    const saveFcmTokenToBackend = useCallback(async (retries = 5) => {
        const sessionToken = localStorage.getItem("session_token");
        const fcmToken = localStorage.getItem("fcm_token");
        if (!sessionToken) return;
        if (!fcmToken) {
            if (retries > 0) setTimeout(() => saveFcmTokenToBackend(retries - 1), 1000);
            return;
        }
        if (fcmSavedRef.current) return;
        fcmSavedRef.current = true;
        try {
            await fetch(`${API}/api/user/save-fcm-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_token: sessionToken, fcm_token: fcmToken })
            });
        } catch (err) {
            console.error("FCM save error:", err.message);
            fcmSavedRef.current = false;
        }
    }, []);

    useEffect(() => {
        const themeKey = user?.user_id ? `theme_${user.user_id}` : "theme_guest";
        const theme = localStorage.getItem(themeKey) || "light";
        document.documentElement.setAttribute("data-theme", theme);
    }, [user?.user_id]);

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

    useEffect(() => {
        const path = location.pathname;
        if (path === "/" || path === "/login") return;
        if (skipHistorySaveRef.current) {
            skipHistorySaveRef.current = false;
            return;
        }
        const history = historyRef.current;
        if (history.length === 0 || history[history.length - 1].url !== path) {
            history.push({ number: history.length + 1, url: path });
            writeHistory(history);
        }
    }, [location.pathname]);

    useEffect(() => {
        const handleBackButton = async () => {
            let history = historyRef.current;
            if (history.length > 1) {
                history.pop();
                history = history.map((item, index) => ({ number: index + 1, url: item.url }));
                historyRef.current = history;
                writeHistory(history);
                skipHistorySaveRef.current = true;
                navigateRef.current(history[history.length - 1].url);
                return;
            }
            localStorage.removeItem(NAV_HISTORY_KEY);
            historyRef.current = [];
            await CapacitorApp.exitApp();
        };
        let listener;
        CapacitorApp.addListener("backButton", handleBackButton).then((result) => {
            listener = result;
        });
        return () => {
            if (listener) listener.remove();
        };
    }, []);

    useEffect(() => {
        async function setupPushNotifications() {
            if (pushSetupRef.current) return;
            pushSetupRef.current = true;
            if (!Capacitor.isNativePlatform()) return;
            try {
                let perm = await PushNotifications.checkPermissions();
                if (perm.receive === "prompt") {
                    perm = await PushNotifications.requestPermissions();
                }
                if (perm.receive !== "granted") return;
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
                } catch { }
                PushNotifications.addListener("registration", async (token) => {
                    localStorage.setItem("fcm_token", token.value);
                    fcmSavedRef.current = false;
                    await saveFcmTokenToBackend();
                });
                PushNotifications.addListener("registrationError", (err) => {
                    console.error("Push registration error:", err);
                });
                PushNotifications.addListener("pushNotificationReceived", (notification) => {
                    const title = notification.title || notification.data?.title || "HEEPIT";
                    const body = notification.body || notification.data?.body || "New notification";
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
                });
                PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
                    const data = action.notification?.data;
                    if (data?.order_id) navigateRef.current("/profile/orders");
                });
                await PushNotifications.register();
            } catch (err) {
                console.error("Push setup error:", err.message);
            }
        }
        setupPushNotifications();
    }, [saveFcmTokenToBackend]);

    useEffect(() => {
        if (page === "home") saveFcmTokenToBackend();
    }, [page, saveFcmTokenToBackend]);

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
                console.error("Maintenance check error:", err.message);
            }
        }
        checkMaintenance();
    }, []);

    useEffect(() => {
        async function checkForUpdate() {
            if (!user?.user_id || page !== "home") return;
            try {
                const response = await fetch(`${API}/user/check-update/${user.user_id}`);
                const data = await response.json();
                setUpdateRequired(data.success && data.update_available === true);
            } catch (err) {
                console.error("Update check error:", err.message);
            }
        }
        checkForUpdate();
    }, [user?.user_id, page]);

    useEffect(() => {
        async function restoreSession() {
            if (page !== "splash") return;
            setShowLoading(true);
            try {
                const sessionToken = localStorage.getItem("session_token");
                if (!sessionToken) {
                    changePage("login");
                    return;
                }
                const response = await fetch(`${API}/api/auth/check-session`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ session_token: sessionToken })
                });
                const data = await response.json();
                if (data.success && data.authenticated) {
                    setUser(data.user);
                    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
                    if (Capacitor.isNativePlatform()) {
                        Promise.all([
                            CapacitorApp.getInfo(),
                            fetch(`${API}/user/app-version/${data.user.user_id}`).then((r) => r.json())
                        ]).then(async ([appInfo, versionData]) => {
                            const installedVersion = String(appInfo.version);
                            const databaseVersion = versionData.version ? String(versionData.version) : "";
                            if (databaseVersion !== installedVersion) {
                                await fetch(`${API}/user/update-app-version/${data.user.user_id}`, {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ version: installedVersion })
                                });
                            }
                        }).catch((err) => {
                            console.error("Version sync error:", err.message);
                        });
                    }
                    changePage("home");
                } else {
                    localStorage.removeItem("session_token");
                    localStorage.removeItem(USER_KEY);
                    setUser(null);
                    changePage("login");
                }
            } catch (err) {
                console.error("Session restore error:", err.message);
            } finally {
                setCheckingSession(false);
                setShowLoading(false);
            }
        }
        restoreSession();
    }, [page, changePage]);

    if (isMaintenance) {
        return (
            <>
                <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
                <Maintenance />
            </>
        );
    }

    if (checkingSession && page !== "splash") {
        return null;
    }

    return (
        <>
            <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
            {showLoading && (
                <Loading
                    duration={loadingDuration}
                    text={loadingText}
                    onComplete={() => setShowLoading(false)}
                />
            )}
            {page === "splash" && <Splash setPage={changePage} />}
            {page === "login" && (
                <Login
                    setPage={changePage}
                    setAuthMode={() => { }}
                    onLoginSuccess={saveFcmTokenToBackend}
                />
            )}
            {page === "home" && (
                <Home
                    user={user}
                    setPage={changePage}
                    navigateWithLoading={(action, text, duration) => {
                        setLoadingText(text || "Loading HEEPIT...");
                        setLoadingDuration(duration || LOADING_DURATION);
                        setShowLoading(true);
                        setTimeout(() => {
                            if (typeof action === "function") action();
                        }, duration || LOADING_DURATION);
                    }}
                    cartCount={cartCount}
                    setCartCount={setCartCount}
                    goTo={goTo}
                />
            )}
            {page === "home" && updateRequired && (
                <Update
                    user={user}
                    onCancel={() => setUpdateRequired(false)}
                    onUpdate={() => {
                        setUpdateRequired(false);
                        changePage("appupdate");
                    }}
                />
            )}
            {page === "appupdate" && <AppUpdate user={user} />}
        </>
    );
}

export default App;